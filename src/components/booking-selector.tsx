"use client";

import { useEffect, useState } from "react";

import {
    bookingOptions,
    emptyAvailability,
    type AvailabilityByOptionId,
    type BookingOptionId,
} from "@/lib/booking-options";

type AvailabilityStatus = "idle" | "loading" | "ready" | "error";

type AvailabilityResponse = {
    availability: AvailabilityByOptionId;
};

type AvailabilityResult = {
    checkIn: string;
    checkOut: string;
    availability: AvailabilityByOptionId;
};

type AvailabilityError = {
    checkIn: string;
    checkOut: string;
};

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function getNights(checkIn: string, checkOut: string) {
    if (!checkIn || !checkOut) {
        return 0;
    }

    const [startYear, startMonth, startDay] = checkIn.split("-").map(Number);
    const [endYear, endMonth, endDay] = checkOut.split("-").map(Number);

    const start = Date.UTC(startYear, startMonth - 1, startDay);
    const end = Date.UTC(endYear, endMonth - 1, endDay);

    return Math.max(0, Math.round((end - start) / DAY_IN_MS));
}

function getDateInputValue(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function addDaysToDateInputValue(value: string, days: number) {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day + days);

    return getDateInputValue(date);
}

function getAvailabilityText(
    availabilityStatus: AvailabilityStatus,
    isAvailable: boolean,
) {
    if (availabilityStatus === "loading") {
        return "Se verifica disponibilitatea";
    }

    if (availabilityStatus === "error") {
        return "Disponibilitatea nu poate fi verificata";
    }

    return isAvailable
        ? "Disponibil pentru perioada aleasa"
        : "Ocupat in perioada aleasa";
}

function getAvailabilityClass(
    availabilityStatus: AvailabilityStatus,
    isAvailable: boolean,
) {
    if (availabilityStatus === "loading") {
        return "text-black/55";
    }

    if (availabilityStatus === "error" || !isAvailable) {
        return "text-[#a33b20]";
    }

    return "text-[#174f3a]";
}

export function BookingSelector() {
    const [selectedId, setSelectedId] = useState<BookingOptionId>("ibiza");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guestCount, setGuestCount] = useState(1);
    const [showGuestDetails, setShowGuestDetails] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [availabilityResult, setAvailabilityResult] =
        useState<AvailabilityResult | null>(null);
    const [availabilityError, setAvailabilityError] =
        useState<AvailabilityError | null>(null);

    const selectedOption = bookingOptions.find(
        (option) => option.id === selectedId,
    )!;
    const nights = getNights(checkIn, checkOut);
    const cleaningFee = selectedOption.id === "villa" && nights > 0 ? 100 : 0;
    const accommodationTotal = nights * selectedOption.price;
    const total = accommodationTotal + cleaningFee;
    const hasInvalidDates = checkIn !== "" && checkOut !== "" && nights === 0;
    const hasSelectedDates = nights > 0;
    const today = getDateInputValue();
    const minCheckOut = checkIn ? addDaysToDateInputValue(checkIn, 1) : today;
    const hasAvailabilityForSelectedDates =
        availabilityResult?.checkIn === checkIn &&
        availabilityResult?.checkOut === checkOut;
    const hasErrorForSelectedDates =
        availabilityError?.checkIn === checkIn && availabilityError?.checkOut === checkOut;
    const availabilityStatus: AvailabilityStatus = !hasSelectedDates
        ? "idle"
        : hasAvailabilityForSelectedDates
          ? "ready"
          : hasErrorForSelectedDates
            ? "error"
            : "loading";
    const availabilityByOptionId = hasAvailabilityForSelectedDates
        ? availabilityResult.availability
        : emptyAvailability;
    const selectedOptionIsAvailable =
        hasSelectedDates &&
        availabilityStatus === "ready" &&
        availabilityByOptionId[selectedOption.id];

    const canContinue =
        checkIn !== "" &&
        checkOut !== "" &&
        nights > 0 &&
        selectedOptionIsAvailable &&
        guestCount >= 1 &&
        guestCount <= selectedOption.guests;

    useEffect(() => {
        if (!hasSelectedDates) {
            return;
        }

        const controller = new AbortController();

        fetch(`/api/availability?checkIn=${checkIn}&checkOut=${checkOut}`, {
            signal: controller.signal,
        })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error("Availability request failed.");
                }

                return (await response.json()) as AvailabilityResponse;
            })
            .then((data) => {
                setAvailabilityResult({
                    availability: data.availability,
                    checkIn,
                    checkOut,
                });
                setAvailabilityError(null);
            })
            .catch((error: Error) => {
                if (error.name === "AbortError") {
                    return;
                }

                setAvailabilityError({ checkIn, checkOut });
            });

        return () => controller.abort();
    }, [checkIn, checkOut, hasSelectedDates]);

    function handleOptionSelect(optionId: BookingOptionId) {
        const nextOption = bookingOptions.find((option) => option.id === optionId)!;

        setSelectedId(optionId);
        setGuestCount((currentGuests) => Math.min(currentGuests, nextOption.guests));
    }

    function handleGuestChange(value: string) {
        const nextGuestCount = Number(value);

        if (!Number.isFinite(nextGuestCount)) {
            return;
        }

        setGuestCount(
            Math.min(Math.max(Math.floor(nextGuestCount), 1), selectedOption.guests),
        );
    }

    function handleDateChange(field: "checkIn" | "checkOut", value: string) {
        if (field === "checkIn") {
            setCheckIn(value);
        } else {
            setCheckOut(value);
        }

        setShowGuestDetails(false);
        setIsSubmitted(false);
    }

    return (
        <section
            id="optiuni"
            className="mx-auto grid max-w-6xl gap-5 px-6 pb-20 md:grid-cols-3"
        >
            <div className="rounded-md border border-black/10 bg-white p-6 md:col-span-3">
                <p className="text-sm text-black/55">Primul pas</p>
                <h2 className="mt-2 text-2xl font-semibold">
                    Alege perioada sederii
                </h2>
                <p className="mt-2 text-sm text-black/60">
                    Dupa ce alegi check-in si check-out, vezi ce optiuni sunt
                    disponibile.
                </p>
            </div>

            <div className="grid gap-4 border-t border-black/10 pt-6 md:col-span-3 md:grid-cols-3">
                <label className="text-sm font-semibold">
                    Check-in
                    <input
                        value={checkIn}
                        onChange={(event) => handleDateChange("checkIn", event.target.value)}
                        type="date"
                        name="checkIn"
                        required
                        min={today}
                        className="mt-2 block h-12 w-full rounded-md border border-black/15 bg-white px-4 font-normal"
                    />
                </label>

                <label className="text-sm font-semibold">
                    Check-out
                    <input
                        value={checkOut}
                        onChange={(event) => handleDateChange("checkOut", event.target.value)}
                        type="date"
                        name="checkOut"
                        required
                        min={minCheckOut}
                        className="mt-2 block h-12 w-full rounded-md border border-black/15 bg-white px-4 font-normal"
                    />
                </label>

                {hasInvalidDates && (
                    <p className="text-sm font-semibold text-[#a33b20] md:col-span-3">
                        Data de check-out trebuie sa fie dupa data de check-in.
                    </p>
                )}
            </div>

            {!hasSelectedDates && (
                <p className="rounded-md border border-black/10 bg-[#f7f2ea] p-4 text-sm text-black/65 md:col-span-3">
                    Selecteaza datele pentru a vedea disponibilitatea apartamentelor.
                </p>
            )}

            {hasSelectedDates &&
                bookingOptions.map((option) => {
                    const isSelected = selectedId === option.id;
                    const isAvailable =
                        availabilityStatus === "ready" && availabilityByOptionId[option.id];
                    const availabilityText = getAvailabilityText(
                        availabilityStatus,
                        isAvailable,
                    );
                    const availabilityClass = getAvailabilityClass(
                        availabilityStatus,
                        isAvailable,
                    );

                    return (
                        <article
                            key={option.id}
                            className={`flex min-h-64 flex-col justify-between rounded-md border bg-white p-6 ${
                                isSelected
                                    ? "border-[#174f3a] ring-2 ring-[#174f3a]/15"
                                    : "border-black/10"
                            }`}
                        >
                            <div>
                                <div className="text-sm">
                                    <p className="text-black/55">
                                        Maximum {option.guests} persoane
                                    </p>
                                    <p className={`mt-2 font-semibold ${availabilityClass}`}>
                                        {availabilityText}
                                    </p>
                                </div>

                                <h2 className="mt-3 text-2xl font-semibold">
                                    {option.name}
                                </h2>
                                <p className="mt-3 leading-7 text-black/65">
                                    {option.description}
                                </p>
                            </div>

                            <div className="mt-8 flex items-end justify-between">
                                <p>
                                    <strong className="text-2xl">{option.price} lei</strong>
                                    <span className="block text-sm text-black/55">
                                        pe noapte
                                    </span>
                                </p>

                                <button
                                    type="button"
                                    aria-pressed={isSelected}
                                    disabled={!isAvailable}
                                    onClick={() => handleOptionSelect(option.id)}
                                    className="rounded-md bg-[#174f3a] px-4 py-3 font-semibold text-white hover:bg-[#103b2b] disabled:cursor-not-allowed disabled:bg-black/20 disabled:text-black/45"
                                >
                                    {availabilityStatus === "loading"
                                        ? "Verificare"
                                        : !isAvailable
                                          ? "Indisponibil"
                                          : isSelected
                                            ? "Selectat"
                                            : "Alege"}
                                </button>
                            </div>
                        </article>
                    );
                })}

            {hasSelectedDates && (
                <>
                    <label className="text-sm font-semibold">
                        Oaspeti
                        <input
                            value={guestCount}
                            onChange={(event) => handleGuestChange(event.target.value)}
                            type="number"
                            name="guests"
                            min={1}
                            max={selectedOption.guests}
                            step={1}
                            required
                            className="mt-2 block h-12 w-full rounded-md border border-black/15 bg-white px-4 font-normal"
                        />
                        <span className="mt-2 block text-xs font-normal text-black/55">
                            Maximum {selectedOption.guests} persoane pentru aceasta
                            optiune.
                        </span>
                    </label>

                    <div className="md:col-span-3">
                        <button
                            type="button"
                            disabled={!canContinue}
                            onClick={() => setShowGuestDetails(true)}
                            className="h-12 rounded-md bg-[#174f3a] px-6 font-semibold text-white transition hover:bg-[#103b2b] disabled:cursor-not-allowed disabled:bg-black/20 disabled:text-black/45"
                        >
                            Continua rezervarea
                        </button>

                        <p className="mt-3 text-sm text-black/55">
                            {availabilityStatus === "loading" &&
                                "Verificam disponibilitatea pentru perioada selectata."}
                            {availabilityStatus === "error" &&
                                "Nu am putut verifica disponibilitatea. Incearca din nou."}
                            {availabilityStatus === "ready" &&
                                selectedOptionIsAvailable &&
                                "Disponibilitatea va fi verificata inainte de confirmarea finala."}
                            {availabilityStatus === "ready" &&
                                !selectedOptionIsAvailable &&
                                "Alege o optiune disponibila pentru perioada selectata."}
                        </p>
                    </div>
                </>
            )}

            {hasSelectedDates && selectedOptionIsAvailable && (
                <div
                    aria-live="polite"
                    className="grid gap-4 border-t border-black/10 pt-6 md:col-span-3 md:grid-cols-[1fr_auto]"
                >
                    <div>
                        <p className="text-sm text-black/55">Ai selectat</p>
                        <p className="mt-1 text-xl font-semibold">{selectedOption.name}</p>

                        <div className="mt-4 space-y-1 text-sm text-black/65">
                            <p>
                                {nights} {nights === 1 ? "noapte" : "nopti"}
                            </p>
                            <p>
                                {guestCount}{" "}
                                {guestCount === 1 ? "oaspete" : "oaspeti"} din maximum{" "}
                                {selectedOption.guests}
                            </p>
                            <p>Cazare: {accommodationTotal} lei</p>

                            {cleaningFee > 0 && (
                                <p className="text-[#a33b20]">
                                    Taxa unica de curatenie: {cleaningFee} lei
                                </p>
                            )}
                        </div>
                    </div>

                    <p className="text-left md:text-right">
                        <strong className="text-2xl">{total} lei</strong>
                        <span className="block text-sm text-black/55">
                            total rezervare
                        </span>
                    </p>
                </div>
            )}

            {showGuestDetails && canContinue && (
                <form
                    className="grid gap-4 border-t border-black/10 pt-6 md:col-span-3 md:grid-cols-2"
                    onSubmit={(event) => {
                        event.preventDefault();
                        setIsSubmitted(true);
                    }}
                >
                    <label className="text-sm font-semibold">
                        Nume
                        <input
                            type="text"
                            name="lastName"
                            required
                            className="mt-2 block h-12 w-full rounded-md border border-black/15 bg-white px-4 font-normal"
                        />
                    </label>

                    <label className="text-sm font-semibold">
                        Prenume
                        <input
                            type="text"
                            name="firstName"
                            required
                            className="mt-2 block h-12 w-full rounded-md border border-black/15 bg-white px-4 font-normal"
                        />
                    </label>

                    <label className="text-sm font-semibold">
                        Email
                        <input
                            type="email"
                            name="email"
                            required
                            className="mt-2 block h-12 w-full rounded-md border border-black/15 bg-white px-4 font-normal"
                        />
                    </label>

                    <label className="text-sm font-semibold">
                        Telefon
                        <input
                            type="tel"
                            name="phone"
                            required
                            className="mt-2 block h-12 w-full rounded-md border border-black/15 bg-white px-4 font-normal"
                        />
                    </label>

                    <label className="flex items-start gap-3 text-sm text-black/70 md:col-span-2">
                        <input
                            type="checkbox"
                            name="termsAccepted"
                            required
                            className="mt-1 h-4 w-4"
                        />
                        <span>
                            Accept termenii si conditiile rezervarii si politica de
                            anulare.
                        </span>
                    </label>

                    <div className="rounded-md border border-black/10 bg-[#f7f2ea] p-4 text-sm text-black/70 md:col-span-2">
                        <p className="font-semibold text-black">Rezumat rezervare</p>

                        <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                            <div>
                                <dt className="text-black/50">Spatiu</dt>
                                <dd className="font-medium text-black">
                                    {selectedOption.name}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-black/50">Perioada</dt>
                                <dd className="font-medium text-black">
                                    {checkIn} - {checkOut}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-black/50">Oaspeti</dt>
                                <dd className="font-medium text-black">{guestCount}</dd>
                            </div>

                            <div>
                                <dt className="text-black/50">Nopti</dt>
                                <dd className="font-medium text-black">{nights}</dd>
                            </div>

                            <div>
                                <dt className="text-black/50">Cazare</dt>
                                <dd className="font-medium text-black">
                                    {accommodationTotal} lei
                                </dd>
                            </div>

                            <div>
                                <dt className="text-black/50">Curatenie</dt>
                                <dd className="font-medium text-black">
                                    {cleaningFee} lei
                                </dd>
                            </div>
                        </dl>

                        <p className="mt-4 border-t border-black/10 pt-3 text-base font-semibold text-black">
                            Total: {total} lei
                        </p>
                    </div>

                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            disabled={isSubmitted}
                            className="h-12 rounded-md bg-black px-6 font-semibold text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:bg-black/20 disabled:text-black/45"
                        >
                            {isSubmitted ? "Date primite" : "Trimite datele"}
                        </button>
                    </div>

                    {isSubmitted && (
                        <p
                            role="status"
                            className="rounded-md border border-[#174f3a]/20 bg-[#174f3a]/10 p-4 text-sm font-medium text-[#174f3a] md:col-span-2"
                        >
                            Datele au fost salvate temporar. Urmatorul pas este
                            verificarea disponibilitatii si confirmarea avansului.
                        </p>
                    )}
                </form>
            )}
        </section>
    );
}
