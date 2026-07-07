# The Cave - Project Status

Last updated: 2026-07-06

## Current milestone

Fundația fluxului public de rezervare.

## Completed

- Proiect Next.js creat cu React, TypeScript și Tailwind CSS
- App Router configurat
- Metadata și limba română configurate
- Pagină principală responsive
- Trei opțiuni de rezervare afișate
- Selecție interactivă între cele trei opțiuni
- Stare vizuală și `aria-pressed` pentru selecție
- Sumarul opțiunii selectate
- Taxa de curățenie afișată numai pentru proprietatea completă
- Câmpuri pentru check-in și check-out
- Documentarea cerințelor în `PROJECT.md`
- Documentarea deciziilor în `DECISIONS.md`

## Verification

Ultima verificare a trecut:

- ESLint
- TypeScript
- testarea selecțiilor în browser
- testarea taxei de curățenie
- completarea câmpurilor de dată
- verificarea afișării pe mobil
- zero erori în consola browserului

## Current files

- `src/app/page.tsx`
- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/components/booking-selector.tsx`
- `docs/PROJECT.md`
- `docs/DECISIONS.md`
- `docs/STATUS.md`

## Next step

Transformarea câmpurilor de dată în controale React și calcularea automată a:

- numărului de nopți;
- prețului cazării;
- taxei de curățenie;
- totalului rezervării.

## Following steps

1. Selectarea numărului de oaspeți
2. Validarea perioadei
3. Verificarea disponibilității
4. Baza de date
5. Panoul administrativ
6. Autentificarea administratorului
7. Integrarea plăților
8. Sincronizarea Booking
9. Emailurile și notificările
10. Conținutul bilingv
11. Testarea și publicarea

## Pending business information

Consultă secțiunea „Informații încă neconfirmate” din `PROJECT.md`.

## Local development

```powershell
npm run dev
```