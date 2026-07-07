# The Cave - Technical Decisions

## D-001: Aplicație full-stack

Status: Acceptată

Folosim Next.js cu React și TypeScript. Site-ul public, panoul administrativ
și API-ul vor face parte din aceeași aplicație.

## D-002: App Router

Status: Acceptată

Folosim Next.js App Router. Componentele sunt Server Components implicit.
Adăugăm `"use client"` numai componentelor care necesită interacțiune sau stare.

## D-003: Modelul disponibilității

Status: Acceptată

Există două resurse reale:

- Apartament 110
- Penthouse Rooftop

„Proprietatea completă” consumă simultan ambele resurse. O rezervare pentru
ambele blochează fiecare apartament în perioada respectivă.

## D-004: Confirmarea rezervării

Status: Acceptată

Rezervarea este confirmată automat numai după confirmarea plății integrale.
Disponibilitatea trebuie reverificată pe server înainte de confirmare pentru
a preveni rezervările duble.

## D-005: Plăți

Status: Acceptată parțial

Datele cardului nu vor fi stocate în aplicație. Plata va fi procesată de un
furnizor autorizat. Furnizorul exact urmează să fie ales.

## D-006: Date personale

Status: Acceptată

Formularul public va colecta inițial numai datele necesare rezervării.
CNP-ul și copia actului nu vor fi solicitate până când necesitatea și baza
legală nu sunt confirmate.

## D-007: Conținut și imagini

Status: Acceptată

Folosim fotografiile originale primite de la proprietar. Nu descărcăm
fotografiile direct de pe Booking. Conținutul va exista în română și engleză.

## D-008: Administrare configurabilă

Status: Acceptată

Prețurile, taxele, perioadele blocate, perioadele nerambursabile, regulile,
fotografiile și facilitățile nu vor fi scrise permanent în interfață.
Administratorul le va putea modifica.

## D-009: Fus orar și monedă

Status: Acceptată

- Fus orar: Europe/Bucharest
- Monedă: RON
- Orele de check-in și check-out sunt interpretate în ora locală din România.

## D-010: Procesul de dezvoltare

Status: Acceptată

După fiecare modificare:

1. se verifică fișierele;
2. se rulează ESLint și TypeScript;
3. se testează comportamentul în browser;
4. se actualizează documentația la fiecare etapă importantă;
5. se creează un checkpoint Git când etapa este stabilă.