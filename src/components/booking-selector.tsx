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

export function BookingSelector() {
    const [selectedId, setSelectedId] = useState("apartment-110");

    const selectedOption = bookingOptions.find(
        (option) => option.id === selectedId,
    )!;

    return (
        <section
            id="optiuni"
            className="mx-auto grid max-w-6xl gap-5 px-6 pb-20 md:grid-cols-3"
        >
            {bookingOptions.map((option) => {
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
                                onClick={() => setSelectedId(option.id)}
                                className="rounded-md bg-[#174f3a] px-4 py-3 font-semibold text-white hover:bg-[#103b2b]"
                            >
                                {isSelected ? "Selectat" : "Alege"}
                            </button>
                        </div>
                    </article>
                );
            })}
            <div
                aria-live="polite"
                className="flex flex-col justify-between gap-4 border-t border-black/10 pt-6 md:col-span-3 md:flex-row md:items-center"
            >
                <div>
                    <p className="text-sm text-black/55">Ai selectat</p>
                    <p className="mt-1 text-xl font-semibold">{selectedOption.name}</p>

                    {selectedOption.id === "both" && (
                        <p className="mt-1 text-sm text-[#a33b20]">
                            + 100 lei taxă unică de curățenie
                        </p>
                    )}
                </div>

                <p className="text-right">
                    <strong className="text-2xl">{selectedOption.price} lei</strong>
                    <span className="block text-sm text-black/55">pe noapte</span>
                </p>
            </div>
            <div className="grid gap-4 border-t border-black/10 pt-6 md:col-span-3 md:grid-cols-2">
                <label className="text-sm font-semibold">
                    Check-in
                    <input
                        type="date"
                        name="checkIn"
                        required
                        className="mt-2 block h-12 w-full rounded-md border border-black/15 bg-white px-4 font-normal"
                    />
                </label>

                <label className="text-sm font-semibold">
                    Check-out
                    <input
                        type="date"
                        name="checkOut"
                        required
                        className="mt-2 block h-12 w-full rounded-md border border-black/15 bg-white px-4 font-normal"
                    />
                </label>
            </div>
        </section>
    );
}