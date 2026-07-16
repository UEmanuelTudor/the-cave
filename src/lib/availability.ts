import {
    type AvailabilityByOptionId,
    type BookingOptionId,
    emptyAvailability,
} from "@/lib/booking-options";
import { getDatabasePool, isDatabaseConfigured } from "@/lib/database";

const mockBlockedPeriods: Array<{
    optionId: Exclude<BookingOptionId, "villa">;
    checkIn: string;
    checkOut: string;
}> = [
    { optionId: "ibiza", checkIn: "2026-07-18", checkOut: "2026-07-21" },
    { optionId: "rooftop", checkIn: "2026-07-24", checkOut: "2026-07-26" },
];

function isRangeOverlapping(
    checkIn: string,
    checkOut: string,
    blockedCheckIn: string,
    blockedCheckOut: string,
) {
    return checkIn < blockedCheckOut && checkOut > blockedCheckIn;
}

function getMockAvailability(checkIn: string, checkOut: string): AvailabilityByOptionId {
    const apartmentAvailability = {
        ibiza: !mockBlockedPeriods.some(
            (period) =>
                period.optionId === "ibiza" &&
                isRangeOverlapping(checkIn, checkOut, period.checkIn, period.checkOut),
        ),
        rooftop: !mockBlockedPeriods.some(
            (period) =>
                period.optionId === "rooftop" &&
                isRangeOverlapping(checkIn, checkOut, period.checkIn, period.checkOut),
        ),
    };

    return {
        ...apartmentAvailability,
        villa: apartmentAvailability.ibiza && apartmentAvailability.rooftop,
    };
}

export async function getAvailability(checkIn: string, checkOut: string) {
    if (!isDatabaseConfigured()) {
        return {
            availability: getMockAvailability(checkIn, checkOut),
            source: "mock" as const,
        };
    }

    const pool = getDatabasePool();
    const result = await pool.query<{ code: BookingOptionId; is_available: boolean }>(
        `
            SELECT
                rental_options.code,
                NOT EXISTS (
                    SELECT 1
                    FROM rental_option_apartments
                    JOIN blocked_periods
                        ON blocked_periods.apartment_id = rental_option_apartments.apartment_id
                    WHERE rental_option_apartments.rental_option_id = rental_options.id
                        AND $1::date < blocked_periods.ends_on
                        AND $2::date > blocked_periods.starts_on
                )
                AND NOT EXISTS (
                    SELECT 1
                    FROM rental_option_apartments
                    JOIN reservation_apartments
                        ON reservation_apartments.apartment_id = rental_option_apartments.apartment_id
                    JOIN reservations
                        ON reservations.id = reservation_apartments.reservation_id
                    WHERE rental_option_apartments.rental_option_id = rental_options.id
                        AND reservations.status IN ('pending', 'confirmed', 'paid')
                        AND $1::date < reservations.check_out
                        AND $2::date > reservations.check_in
                ) AS is_available
            FROM rental_options
            WHERE rental_options.is_active = true
        `,
        [checkIn, checkOut],
    );

    const availability = { ...emptyAvailability };

    for (const row of result.rows) {
        availability[row.code] = row.is_available;
    }

    return {
        availability,
        source: "database" as const,
    };
}
