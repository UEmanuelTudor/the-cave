import { NextResponse, type NextRequest } from "next/server";

import { getAvailability } from "@/lib/availability";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function getNights(checkIn: string, checkOut: string) {
    const [startYear, startMonth, startDay] = checkIn.split("-").map(Number);
    const [endYear, endMonth, endDay] = checkOut.split("-").map(Number);

    const start = Date.UTC(startYear, startMonth - 1, startDay);
    const end = Date.UTC(endYear, endMonth - 1, endDay);

    return Math.max(0, Math.round((end - start) / (24 * 60 * 60 * 1000)));
}

export async function GET(request: NextRequest) {
    const checkIn = request.nextUrl.searchParams.get("checkIn") ?? "";
    const checkOut = request.nextUrl.searchParams.get("checkOut") ?? "";

    if (
        !datePattern.test(checkIn) ||
        !datePattern.test(checkOut) ||
        getNights(checkIn, checkOut) === 0
    ) {
        return NextResponse.json(
            { error: "Invalid check-in or check-out date." },
            { status: 400 },
        );
    }

    try {
        const availability = await getAvailability(checkIn, checkOut);

        return NextResponse.json(availability);
    } catch (error) {
        console.error("Availability check failed", error);

        return NextResponse.json(
            { error: "Availability could not be checked." },
            { status: 500 },
        );
    }
}
