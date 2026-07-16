import { NextResponse, type NextRequest } from "next/server";

import { bookingOptions, type BookingOptionId } from "@/lib/booking-options";
import { createReservation, ReservationError } from "@/lib/reservations";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ReservationPayload = {
    rentalOptionId?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: number;
    guestFirstName?: string;
    guestLastName?: string;
    guestEmail?: string;
    guestPhone?: string;
    termsAccepted?: boolean;
};

function getNights(checkIn: string, checkOut: string) {
    const [startYear, startMonth, startDay] = checkIn.split("-").map(Number);
    const [endYear, endMonth, endDay] = checkOut.split("-").map(Number);

    const start = Date.UTC(startYear, startMonth - 1, startDay);
    const end = Date.UTC(endYear, endMonth - 1, endDay);

    return Math.max(0, Math.round((end - start) / (24 * 60 * 60 * 1000)));
}

function isBookingOptionId(value: string): value is BookingOptionId {
    return bookingOptions.some((option) => option.id === value);
}

function cleanText(value: unknown) {
    return typeof value === "string" ? value.trim() : "";
}

function cleanPhone(value: string) {
    return value.replace(/[^\d+]/g, "");
}

export async function POST(request: NextRequest) {
    let payload: ReservationPayload;

    try {
        payload = (await request.json()) as ReservationPayload;
    } catch {
        return NextResponse.json({ error: "Cerere invalida." }, { status: 400 });
    }

    const rentalOptionId = cleanText(payload.rentalOptionId);
    const checkIn = cleanText(payload.checkIn);
    const checkOut = cleanText(payload.checkOut);
    const guestFirstName = cleanText(payload.guestFirstName);
    const guestLastName = cleanText(payload.guestLastName);
    const guestEmail = cleanText(payload.guestEmail).toLowerCase();
    const guestPhone = cleanPhone(cleanText(payload.guestPhone));
    const guests = Number(payload.guests);
    const selectedOption = bookingOptions.find((option) => option.id === rentalOptionId);

    if (!isBookingOptionId(rentalOptionId) || !selectedOption) {
        return NextResponse.json(
            { error: "Optiunea selectata este invalida." },
            { status: 400 },
        );
    }

    if (
        !datePattern.test(checkIn) ||
        !datePattern.test(checkOut) ||
        getNights(checkIn, checkOut) === 0
    ) {
        return NextResponse.json(
            { error: "Perioada selectata este invalida." },
            { status: 400 },
        );
    }

    if (
        !Number.isInteger(guests) ||
        guests < 1 ||
        guests > selectedOption.guests
    ) {
        return NextResponse.json(
            { error: "Numarul de oaspeti este invalid." },
            { status: 400 },
        );
    }

    if (
        guestFirstName.length < 2 ||
        guestLastName.length < 2 ||
        !emailPattern.test(guestEmail) ||
        guestPhone.length < 8
    ) {
        return NextResponse.json(
            { error: "Datele clientului sunt incomplete." },
            { status: 400 },
        );
    }

    if (payload.termsAccepted !== true) {
        return NextResponse.json(
            { error: "Termenii si conditiile trebuie acceptate." },
            { status: 400 },
        );
    }

    try {
        const reservation = await createReservation({
            checkIn,
            checkOut,
            guestEmail,
            guestFirstName,
            guestLastName,
            guestPhone,
            guests,
            rentalOptionId,
            termsAccepted: true,
        });

        return NextResponse.json({ reservation }, { status: 201 });
    } catch (error) {
        if (error instanceof ReservationError) {
            return NextResponse.json(
                { error: error.message },
                { status: error.status },
            );
        }

        console.error("Reservation creation failed", error);

        return NextResponse.json(
            { error: "Rezervarea nu a putut fi salvata." },
            { status: 500 },
        );
    }
}
