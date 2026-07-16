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

      <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-20 md:grid-cols-4">
        <article className="rounded-md border border-black/10 bg-white p-5">
          <h2 className="font-semibold">Check-in</h2>
          <p className="mt-2 text-sm leading-6 text-black/65">
            Intrarea se face de la ora 15:00, iar check-out-ul până la 11:00.
          </p>
        </article>

        <article className="rounded-md border border-black/10 bg-white p-5">
          <h2 className="font-semibold">Acces</h2>
          <p className="mt-2 text-sm leading-6 text-black/65">
            Accesul se face prin cutie cu cod. Detaliile se trimit cu 24 de ore înainte.
          </p>
        </article>

        <article className="rounded-md border border-black/10 bg-white p-5">
          <h2 className="font-semibold">Plată</h2>
          <p className="mt-2 text-sm leading-6 text-black/65">
            Rezervarea cere avans cu cardul. Restul poate fi achitat conform confirmării.
          </p>
        </article>

        <article className="rounded-md border border-black/10 bg-white p-5">
          <h2 className="font-semibold">Reguli</h2>
          <p className="mt-2 text-sm leading-6 text-black/65">
            Fără animale, fără petreceri. Fumatul este permis doar pe terase sau în curte.
          </p>
        </article>
      </section>
    </main>
  );
}
