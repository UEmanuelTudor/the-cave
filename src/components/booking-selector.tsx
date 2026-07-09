"use client";

import { useState } from "react";

const bookingOptions = [
    {
        id: "apartment-110",
        name: "Apartament 110",
        description: "2 dormitoare, 2 băi și bucătărie separată",
        guests: 5,
        price: 530,
    },
    {
        id: "penthouse",
        name: "Penthouse Rooftop",
        description: "2 dormitoare, rooftop de 80 mp și balcon",
        guests: 5,
        price: 530,
    },
    {
        id: "both",
        name: "Proprietatea completă",
        description: "Ambele apartamente și acces la curte",
        guests: 10,
        price: 1060,
    },
];

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

export function BookingSelector() {
    const [selectedId, setSelectedId] = useState("apartment-110");

    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guestCount, setGuestCount] = useState(1);
    const [showGuestDetails, setShowGuestDetails] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const selectedOption = bookingOptions.find(
        (option) => option.id === selectedId,
    )!;

    const nights = getNights(checkIn, checkOut);
    const cleaningFee = selectedOption.id === "both" && nights > 0 ? 100 : 0;
    const accommodationTotal = nights * selectedOption.price;
    const total = accommodationTotal + cleaningFee;
    const hasInvalidDates = checkIn !== "" && checkOut !== "" && nights === 0;
    const hasSelectedDates = nights > 0;
    const canContinue =
        checkIn !== "" &&
        checkOut !== "" &&
        nights > 0 &&
        guestCount >= 1 &&
        guestCount <= selectedOption.guests;
    function handleOptionSelect(optionId: string) {
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
                <h2 className="mt-2 text-2xl font-semibold">Alege perioada șederii</h2>
                <p className="mt-2 text-sm text-black/60">
                    După ce alegi check-in și check-out, vezi ce opțiuni sunt disponibile.
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
                        className="mt-2 block h-12 w-full rounded-md border border-black/15 bg-white px-4 font-normal"
                    />
                </label>
                {hasInvalidDates && (
                    <p className="text-sm font-semibold text-[#a33b20] md:col-span-3">
                        Data de check-out trebuie să fie după data de check-in.
                    </p>

                )}

            </div>
            {!hasSelectedDates && (
                <p className="rounded-md border border-black/10 bg-[#f7f2ea] p-4 text-sm text-black/65 md:col-span-3">
                    Selectează datele pentru a vedea disponibilitatea apartamentelor.
                </p>
            )}
            {hasSelectedDates && bookingOptions.map((option) => {
                const isSelected = selectedId === option.id;
                return (
                    <article
                        key={option.id}
                        className={`flex min-h-64 flex-col justify-between rounded-md border bg-white p-6 ${isSelected
                            ? "border-[#174f3a] ring-2 ring-[#174f3a]/15"
                            : "border-black/10"
                            }`}
                    >
                        <div>
                            <p className="text-sm text-black/55">
                                Maximum {option.guests} persoane
                            </p>
                            <h2 className="mt-3 text-2xl font-semibold">{option.name}</h2>
                            <p className="mt-3 leading-7 text-black/65">
                                {option.description}
                            </p>
                        </div>

                        <div className="mt-8 flex items-end justify-between">
                            <p>
                                <strong className="text-2xl">{option.price} lei</strong>
                                <span className="block text-sm text-black/55">pe noapte</span>
                            </p>

                            <button
                                type="button"
                                aria-pressed={isSelected}
                                onClick={() => handleOptionSelect(option.id)}
                                className="rounded-md bg-[#174f3a] px-4 py-3 font-semibold text-white hover:bg-[#103b2b]"
                            >
                                {isSelected ? "Selectat" : "Alege"}
                            </button>
                        </div>
                    </article>
                );
            })}
            {hasSelectedDates && (
  <>
                            <label className="text-sm font-semibold">
                    Oaspeți
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
                        Maximum {selectedOption.guests} persoane pentru această opțiune.
                    </span>
                </label>
                <div className="md:col-span-3">
                    <button
                        type="button"
                        disabled={!canContinue}
                        onClick={() => setShowGuestDetails(true)}
                        className="h-12 rounded-md bg-[#174f3a] px-6 font-semibold text-white transition hover:bg-[#103b2b] disabled:cursor-not-allowed disabled:bg-black/20 disabled:text-black/45"
                    >
                        Continuă rezervarea
                    </button>

                    <p className="mt-3 text-sm text-black/55">
                        Disponibilitatea va fi verificată înainte de plata finală.
                    </p>
                </div>
                  </>
)}
            {hasSelectedDates && (
                <div

                    aria-live="polite"
                    className="grid gap-4 border-t border-black/10 pt-6 md:col-span-3 md:grid-cols-[1fr_auto]"
                >
                    <div>
                        <p className="text-sm text-black/55">Ai selectat</p>
                        <p className="mt-1 text-xl font-semibold">{selectedOption.name}</p>

                        <div className="mt-4 space-y-1 text-sm text-black/65">
                            <p>{nights} {nights === 1 ? "noapte" : "nopți"}</p>
                            <p>
                                {guestCount} {guestCount === 1 ? "oaspete" : "oaspeți"} din maximum{" "}
                                {selectedOption.guests}
                            </p>
                            <p>Cazare: {accommodationTotal} lei</p>

                            {cleaningFee > 0 && (
                                <p className="text-[#a33b20]">
                                    Taxă unică de curățenie: {cleaningFee} lei
                                </p>
                            )}
                        </div>
                    </div>

                    <p className="text-left md:text-right">
                        <strong className="text-2xl">{total} lei</strong>
                        <span className="block text-sm text-black/55">total rezervare</span>
                    </p>
                </div>
            )}

            {showGuestDetails && canContinue && (
                <form
                    className="grid gap-4 border-t border-black/10 pt-6 md:col-span-3 md:grid-cols-2"
                    onSubmit={(event) => {
                        event.preventDefault();
                        setIsSubmitted(true);
                    }}                >
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
                            Accept termenii și condițiile rezervării și politica de anulare.
                        </span>
                    </label>

                    <div className="rounded-md border border-black/10 bg-[#f7f2ea] p-4 text-sm text-black/70 md:col-span-2">
                        <p className="font-semibold text-black">Rezumat rezervare</p>

                        <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                            <div>
                                <dt className="text-black/50">Spațiu</dt>
                                <dd className="font-medium text-black">{selectedOption.name}</dd>
                            </div>

                            <div>
                                <dt className="text-black/50">Perioadă</dt>
                                <dd className="font-medium text-black">
                                    {checkIn} - {checkOut}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-black/50">Oaspeți</dt>
                                <dd className="font-medium text-black">{guestCount}</dd>
                            </div>

                            <div>
                                <dt className="text-black/50">Nopți</dt>
                                <dd className="font-medium text-black">{nights}</dd>
                            </div>

                            <div>
                                <dt className="text-black/50">Cazare</dt>
                                <dd className="font-medium text-black">{accommodationTotal} lei</dd>
                            </div>

                            <div>
                                <dt className="text-black/50">Curățenie</dt>
                                <dd className="font-medium text-black">{cleaningFee} lei</dd>
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
                            Datele au fost salvate temporar. Următorul pas este verificarea
                            disponibilității și plata.
                        </p>
                    )}
                </form>
            )}
        </section >
    );
}