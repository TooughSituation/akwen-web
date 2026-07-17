# Projekt: akwen-web — Portal B2B MVP (Akwen)

> Ostatnia aktualizacja: 17.07.2026  
> Commit Etapu 1: `279080f`  
> Kontekst dla GrokWeb / SuperGrok / kolejnych sesji AI (Grok Build)

## Linki

| Zasób | URL |
|-------|-----|
| **Produkcja** | https://akwen-web.vercel.app |
| **GitHub** | https://github.com/TooughSituation/akwen-web |
| Branch | `master` (Vercel auto-deploy) |
| Stara strona (referencja) | https://www.akwen.bialystok.pl/ |
| Portal B2B (legacy) | https://b2b.akwen.bialystok.pl |

## Stack

- Next.js 15.5, React 19, TypeScript, Tailwind v4, shadcn/ui, xlsx
- Deploy: Vercel (auto-deploy z GitHub `master`)
- Stan klienta: localStorage (MVP — bez backendu auth/DB)
- Kolory: Granat `#001F3F`, Turkus `#0077B6`, Koral `#FF6B35`

---

## Stan projektu — MVP + Etap 1

Portal hurtowy `/b2b/*` jest **funkcjonalny, wdrożony i dopracowany o rabat, proponowane, shareable filtry i lepsze zdjęcia**.

### Moduły B2B

| Moduł | Ścieżka | Stan |
|-------|---------|------|
| Dashboard | `/b2b` | Statystyki + Polecane z wyjaśnieniem i badge’ami powodów |
| Katalog | `/b2b/katalog` | 517 produktów, filtry Tag1/Tag2, Polecane, **shareable URL** |
| Koszyk | `/b2b/koszyk` | Context + localStorage; **rabat % z profilu** na cenach |
| Zamówienia | `/b2b/zamowienia` | Lista, szczegóły, reorder (bez podwójnego rabatu) |
| Moje dane | `/b2b/moje-dane` | Profil + adresy + rabat handlowy **read-only** |
| Checkout | w koszyku | 3-krokowy flow, numer `AKW-YYYYMMDD-NNN` |

### Strona publiczna

`/`, `/o-nas`, `/oferta`, `/produkty`, `/kontakt`, `/dotacje`

---

## Etap 1 — szczegóły implementacji (commit `279080f`)

### 1) Rabat klienta

- Źródło: `profile.discountPercent` (mock default **5%** w `src/lib/b2b/auth.ts`)
- Helpery: `applyDiscount`, `sumCartNet`, `sumDiscountSavings` w `src/lib/b2b/format.ts`
- Koszyk trzyma **ceny katalogowe**; rabat nakładany w UI i w `createOrder`
- Zamówienie zapisuje: `discountPercent`, `listPriceNet`, `priceNet` (po rabacie)
- Reorder bierze `listPriceNet` → **nie dubluje rabatu**
- Pliki: `cart-checkout.tsx`, `order-form.tsx`, `orders.ts`, `types.ts`, `profile-form.tsx`, `cart-context.tsx`

### 2) Proponowane — powody

- Excel **nie ma** kolumny „powód”
- Wyliczanie: `src/lib/b2b/recommend.ts` z marży (cena vs wartość/szt), stanu, rozpiętości dat dostaw
- Powody: **Wysoka marża** | **Świeża partia** | **Duży stan** | **Oferta limitowana** | **Wybór handlowca**
- UI: badge + opis na `product-card.tsx`; hint na Dashboard i w Katalogu (widok Polecane)
- Pola produktu: `recommendReason`, `recommendReasonDetail`

### 3) Shareable filtry katalogu

- URL: `?tag1=Pasty&tag2=Łosoś&widok=proponowane&q=...&stock=1&sort=price-asc`
- Sync dwukierunkowy w `catalog-client.tsx` (`router.replace`, back/forward)
- Przycisk **Udostępnij** kopiuje pełny URL
- Helper: `buildCatalogSearchParams`

### 4) Zdjęcia produktów

- **146** obrazów Grok Imagine, 100% pokrycie po Tag1+Tag2 w `public/images/products/`
- Lepsze prompty: `src/lib/b2b/image-prompts.ts` (pełne KIND_EN, sceny Tag1, struktura quality)
- Fallback chain: generated → lokalne oferty (`/images/oferta_*.jpg`) → HQ Unsplash → gradient
- UI: `product-image.tsx` z kolejnymi fallbackami przy `onError`
- Batch: `scripts/generate-product-images-batch.mjs` → `public/data/image-generation-batch.json`

---

## Dane produktów (Excel)

**Plik:** `public/data/produkty.xlsx`  
**Arkusz:** „Magazyn akt dla Jarka”  
**Wiersze:** 517  
**Proponowany=Tak:** ~134

| Kolumna Excel | Pole w kodzie | Opis |
|---|---|---|
| Symbol | `symbol` / `id` | ID produktu |
| Nazwa | `name` | Nazwa produktu |
| Tag1 | `tag1` | Kategoria (22 wartości) |
| Tag2 | `tag2` | Rodzaj (~76 wartości) |
| Proponowany | `isRecommended` | „Tak” = polecane |
| Ilość OGÓŁEM | (sygnał recommend) | Do szacunku marży |
| Ilość W magazynie Dostępna | `stock` | Stan magazynowy |
| Wartość ogółem | (sygnał recommend) | Do szacunku marży |
| Data dostawy Różnica dni | (sygnał recommend) | Świeżość partii |
| Cena z cennika… Netto | `priceNet` | Cena hurtowa netto (katalog) |
| Producent | `producer` | Producent |
| Jm | `unit` | Jednostka miary |

---

## Storage (browser)

| Klucz | Zawartość |
|-------|-----------|
| `akwen-b2b-cart` | Koszyk (ceny katalogowe) |
| `akwen-b2b-profile` | Profil + adresy + rabat % |
| `akwen-b2b-orders` | Zamówienia (ceny po rabacie) |

---

## Architektura

| Warstwa | Technologia |
|---------|-------------|
| Server | Server Components, `server-only`, React `cache()` |
| Produkty | Excel przy buildzie (`products.ts`) |
| Stan klienta | Context + localStorage |
| Auth | Mock (`auth.ts`) |

### Kluczowe pliki

```
src/lib/b2b/
  types.ts, products.ts, recommend.ts, format.ts
  images.ts, image-prompts.ts, labels.ts
  categories.ts, orders.ts, profile.ts, auth.ts

src/contexts/
  cart-context.tsx, profile-context.tsx

src/components/b2b/
  catalog-client.tsx, product-card.tsx, product-image.tsx
  cart-checkout.tsx, order-form.tsx, order-success.tsx
  profile-form.tsx, orders-list.tsx, mobile-nav.tsx, sidebar.tsx

src/app/b2b/
  page.tsx, katalog/, koszyk/, zamowienia/, moje-dane/

scripts/
  generate-product-images-batch.mjs
  sync-image-manifest.mjs
  coverage-report.mjs
```

---

## Weryfikacja na produkcji (Etap 1)

1. `/b2b/koszyk` — ceny z −5%, linia oszczędności  
2. `/b2b` — Polecane z badge’ami powodów  
3. `/b2b/katalog?tag1=Pasty&tag2=Łosoś` — filtry z URL + Udostępnij  
4. `/b2b/moje-dane` — rabat handlowy read-only  
5. Złóż zamówienie → podsumowanie z rabatem → **Zamów ponownie** bez double discount  

| Co | URL |
|----|-----|
| Dashboard | https://akwen-web.vercel.app/b2b |
| Katalog | https://akwen-web.vercel.app/b2b/katalog |
| Polecane | https://akwen-web.vercel.app/b2b/katalog?widok=proponowane |
| Koszyk | https://akwen-web.vercel.app/b2b/koszyk |
| Moje dane | https://akwen-web.vercel.app/b2b/moje-dane |

---

## Ograniczenia (kandydaci Etap 2+)

- Brak prawdziwego logowania / ról / multi-tenant  
- Backend API + baza — wszystko w localStorage  
- Edycja rabatu przez admina (UI tylko read-only)  
- VAT / cenniki wielopoziomowe  
- Real-time stany z ERP  
- Wyszukiwanie globalne w headerze (placeholder UI)  
- Testy automatyczne e2e  
- Osobna kolumna „powód proponowania” w Excelu (obecnie heurystyka)  
- Zdjęcia AI — nie są fotografiami rzeczywistych opakowań  
- Excel + zdjęcia przy buildzie (zmiana = redeploy)  

---

## Checklist Etapu 2 (propozycja)

Priorytet do ustalenia z właścicielem — do implementacji w Grok Build:

- [ ] **Rabat na kartach katalogu** — opcjonalnie toggle „Cena katalogowa / Twoja cena”  
- [ ] **Kolumna Powód w Excelu** — mapowanie zamiast heurystyki w `recommend.ts`  
- [ ] **Globalne wyszukiwanie w headerze** — zamiast placeholdera  
- [ ] **E2E smoke** — koszyk + rabat + checkout + reorder  
- [ ] **Mock API (Route Handlers)** — zamówienia zamiast samego localStorage  
- [ ] **Ulepszenie promptów Imagine** — słabe Tag1 (Mięsne, Warzywa) + regeneracja batch  
- [ ] **Eksport zamówienia** — PDF / e-mail  
- [ ] **Auth** — Clerk / Auth0 (gdy właściciel gotowy na konta)  

### Gotowe prompty dla sesji Grok Build

1. „Zaktualizuj PROJECT_SUMMARY.md o Etap 1 (commit 279080f) i checklistę Etapu 2.” ✅ (ten plik)  
2. „Etap 2: rabat w katalogu na kartach produktów (opcjonalnie toggle cena katalogowa/Twoja cena).”  
3. „Dodaj kolumnę Powód do Excelu i mapuj zamiast heurystyki w recommend.ts.”  
4. „E2E smoke: koszyk + rabat + checkout + reorder.”  
5. „Backend mock API (Route Handlers) zamiast localStorage dla zamówień.”  
6. „Ulepsz prompty Imagine dla konkretnych słabych Tag1 (np. Mięsne, Warzywa) i regeneruj batch.”  

---

## Historia commitów (istotne)

```
279080f  Etap 1 B2B: rabat, proponowane z powodami, shareable filtry, lepsze zdjęcia
d0557bc  Strona Dotacje (KPO)
32b1961  PROJECT_SUMMARY (wcześniejszy kontekst)
bf6d8d7  146 obrazów Grok Imagine Tag1+Tag2
5281423  UX katalogu: etykiety, placeholdery
e8d8ac7  MVP: Tag1/Tag2, filtry, Proponowane
```

---

## Kontekst developera

Użytkownik uczy się od podstaw (doświadczenie VBA/Excel). Preferuje wyjaśnienia krok po kroku z analogiami do Excela. Komunikacja po polsku.  
Praca z GrokWeb (plan/prompty) + Grok Build (implementacja).
