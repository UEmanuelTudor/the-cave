import type { PoolClient } from "pg";

import { type BookingOptionId } from "@/lib/booking-options";
import { getDatabasePool, isDatabaseConfigured } from "@/lib/database";

type CreateReservationInput = {
    rentalOptionId: BookingOptionId;
    checkIn: string;
    checkOut: string;
    guests: number;
    guestFirstName: string;
    guestLastName: string;
    guestEmail: string;
    guestPhone: string;
    termsAccepted: boolean;
};

type RentalOptionRow = {
    rental_option_id: number;
    code: BookingOptionId;
    max_guests: number;
    nightly_price_lei: string;
    cleaning_fee_lei: string;
    apartment_id: number;
};

type InsertedReservationRow = {
    id: number;
};

export class ReservationError extends Error {
    constructor(
        message: string,
        public readonly status: number,
    ) {
        super(message);
    }
}

const activeReservationStatuses = ["pending", "confirmed", "paid"];

function getNights(checkIn: string, checkOut: string) {
    const [startYear, startMonth, startDay] = checkIn.split("-").map(Number);
    const [endYear, endMonth, endDay] = checkOut.split("-").map(Number);

    const start = Date.UTC(startYear, startMonth - 1, startDay);
    const end = Date.UTC(endYear, endMonth - 1, endDay);

    return Math.max(0, Math.round((end - start) / (24 * 60 * 60 * 1000)));
}

async function rollbackQuietly(client: PoolClient) {
    try {
        await client.query("ROLLBACK");
    } catch {
        // The original error is more useful than a rollback failure.
    }
}

export async function createReservation(input: CreateReservationInput) {
    if (!isDatabaseConfigured()) {
        throw new ReservationError("Baza de date nu este configurata.", 503);
    }

    const pool = getDatabasePool();
    const client = await pool.connect();
    const nights = getNights(input.checkIn, input.checkOut);

    try {
        await client.query("BEGIN");

        const rentalOptionResult = await client.query<RentalOptionRow>(
            `
                SELECT
                    rental_options.id AS rental_option_id,
                    rental_options.code,
                    rental_options.max_guests,
                    rental_options.nightly_price_lei,
                    rental_options.cleaning_fee_lei,
                    apartments.id AS apartment_id
                FROM rental_options
                JOIN rental_option_apartments
                    ON rental_option_apartments.rental_option_id = rental_options.id
                JOIN apartments
                    ON apartments.id = rental_option_apartments.apartment_id
                WHERE rental_options.code = $1
                    AND rental_options.is_active = true
                    AND apartments.is_active = true
                ORDER BY apartments.id
            `,
            [input.rentalOptionId],
        );

        if (rentalOptionResult.rows.length === 0) {
            throw new ReservationError("Optiunea selectata nu exista.", 404);
        }

        const rentalOption = rentalOptionResult.rows[0];
        const apartmentIds = rentalOptionResult.rows.map((row) => row.apartment_id);

        if (input.guests > rentalOption.max_guests) {
            throw new ReservationError(
                "Numarul de oaspeti depaseste limita optiunii selectate.",
                400,
            );
        }

        await client.query(
            `
                SELECT id
                FROM apartments
                WHERE id = ANY($1::int[])
                ORDER BY id
                FOR UPDATE
            `,
            [apartmentIds],
        );

        const blockedConflict = await client.query(
            `
                SELECT 1
                FROM blocked_periods
                WHERE apartment_id = ANY($3::int[])
                    AND $1::date < ends_on
                    AND $2::date > starts_on
                LIMIT 1
            `,
            [input.checkIn, input.checkOut, apartmentIds],
        );

        if (blockedConflict.rows.length > 0) {
            throw new ReservationError(
                "Perioada selectata nu mai este disponibila.",
                409,
            );
        }

        const reservationConflict = await client.query(
            `
                SELECT 1
                FROM reservations
                JOIN reservation_apartments
                    ON reservation_apartments.reservation_id = reservations.id
                WHERE reservation_apartments.apartment_id = ANY($3::int[])
                    AND reservations.status = ANY($4::varchar[])
                    AND $1::date < reservations.check_out
                    AND $2::date > reservations.check_in
                LIMIT 1
            `,
            [input.checkIn, input.checkOut, apartmentIds, activeReservationStatuses],
        );

        if (reservationConflict.rows.length > 0) {
            throw new ReservationError(
                "Perioada selectata nu mai este disponibila.",
                409,
            );
        }

        const nightlyPrice = Number(rentalOption.nightly_price_lei);
        const cleaningFee = Number(rentalOption.cleaning_fee_lei);
        const accommodationTotal = nights * nightlyPrice;
        const total = accommodationTotal + cleaningFee;

        const insertedReservation = await client.query<InsertedReservationRow>(
            `
                INSERT INTO reservations (
                    rental_option_id,
                    check_in,
                    check_out,
                    guests,
                    guest_first_name,
                    guest_last_name,
                    guest_email,
                    guest_phone,
                    status,
                    source,
                    payment_status,
                    total_lei,
                    deposit_lei,
                    notes
                )
                VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7,
                    $8,
                    'pending',
                    'direct',
                    'unpaid',
                    $9,
                    0,
                    'Created from public booking form. Payment integration pending.'
                )
                RETURNING id
            `,
            [
                rentalOption.rental_option_id,
                input.checkIn,
                input.checkOut,
                input.guests,
                input.guestFirstName,
                input.guestLastName,
                input.guestEmail,
                input.guestPhone,
                total,
            ],
        );

        const reservationId = insertedReservation.rows[0].id;

        for (const apartmentId of apartmentIds) {
            await client.query(
                `
                    INSERT INTO reservation_apartments (reservation_id, apartment_id)
                    VALUES ($1, $2)
                `,
                [reservationId, apartmentId],
            );
        }

        await client.query("COMMIT");

        return {
            accommodationTotal,
            cleaningFee,
            nights,
            reservationId,
            status: "pending" as const,
            total,
        };
    } catch (error) {
        await rollbackQuietly(client);
        throw error;
    } finally {
        client.release();
    }
}
