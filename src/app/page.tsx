import { BookingSelector } from "@/components/booking-selector";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f6f2] text-[#171714]">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <strong className="text-xl">THE CAVE</strong>
          <span className="text-sm text-black/60">Cluj-Napoca</span>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="mb-4 text-sm font-semibold uppercase text-[#a33b20]">
          Cazare privată în Cluj-Napoca
        </p>

        <h1 className="max-w-3xl text-5xl font-semibold leading-tight">
          Alege spațiul potrivit pentru șederea ta.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-black/65">
          Două apartamente spațioase, disponibile separat sau împreună.
        </p>
      </section>

      <BookingSelector />
    </main>
  );
}