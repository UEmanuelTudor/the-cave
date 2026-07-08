# The Cave - Project Status

Last updated: 2026-07-08

## Current milestone

Flux public de rezervare fără backend.

## Completed

- Proiect Next.js creat cu React, TypeScript și Tailwind CSS
- App Router configurat
- Metadata și limba română configurate
- Pagină principală responsive
- Trei opțiuni de rezervare afișate
- Selecție interactivă între cele trei opțiuni
- Calcul automat pentru numărul de nopți
- Calcul automat pentru cazare, taxă de curățenie și total
- Selectarea numărului de oaspeți
- Validarea capacității pentru fiecare opțiune
- Buton `Continuă rezervarea` activ doar pentru date valide
- Formular client cu nume, prenume, email, telefon și acceptare termeni
- Rezumat final al rezervării
- Confirmare temporară după trimiterea datelor
- Documentarea cerințelor în `PROJECT.md`
- Documentarea deciziilor în `DECISIONS.md`

## Verification

Ultima verificare a trecut:

- ESLint
- TypeScript
- testare în browser pentru date valide și invalide
- testare în browser pentru taxa de curățenie
- testare în browser pentru limitele de oaspeți
- testare în browser pentru formularul clientului
- testare în browser pentru confirmarea temporară
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

Pregătirea arhitecturii pentru backend:

- alegerea bazei de date;
- definirea modelului de rezervare;
- definirea modelului pentru apartamente și disponibilitate;
- pregătirea verificării disponibilității pe server.

## Following steps

1. Modelarea datelor
2. Baza de date
3. Verificarea disponibilității
4. Salvarea rezervărilor
5. Panoul administrativ
6. Autentificarea administratorului
7. Integrarea plăților
8. Sincronizarea Booking
9. Emailurile și notificările
10. Conținutul bilingv
11. Design final cu fotografii reale
12. Testarea și publicarea

## Pending business information

Consultă secțiunea „Informații încă neconfirmate” din `PROJECT.md`.

## Local development

```powershell
npm run dev