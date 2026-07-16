export type BookingOptionId = "ibiza" | "rooftop" | "villa";

export type BookingOption = {
    id: BookingOptionId;
    name: string;
    description: string;
    guests: number;
    price: number;
};

export type AvailabilityByOptionId = Record<BookingOptionId, boolean>;

export const bookingOptions: BookingOption[] = [
    {
        id: "ibiza",
        name: "Apartament IBIZA",
        description:
            "110 mp, 2 dormitoare, 2 bai, living separat si bucatarie separata cu aragaz, potrivita pentru gatit.",
        guests: 5,
        price: 530,
    },
    {
        id: "rooftop",
        name: "The Rooftop",
        description:
            "100 mp, 2 dormitoare, 2 bai, rooftop de 80 mp si chicineta fara plita sau aragaz, cu frigider mic, mobilier si chiuveta.",
        guests: 5,
        price: 530,
    },
    {
        id: "villa",
        name: "Villa",
        description:
            "Ambele apartamente impreuna, maximum 10 persoane, cu acces la curte si spatiile exterioare disponibile.",
        guests: 10,
        price: 1060,
    },
];

export const emptyAvailability: AvailabilityByOptionId = {
    ibiza: false,
    rooftop: false,
    villa: false,
};
