# Projekt: akwen-web — Portal B2B MVP (Akwen)

> Ostatnia aktualizacja: 12.07.2026  
> Commit: `bf6d8d7`  
> Kontekst dla SuperGrok Web / kolejnych sesji AI

## Linki

| Zasób | URL |
|-------|-----|
| **Produkcja** | https://akwen-web.vercel.app |
| **GitHub** | https://github.com/TooughSituation/akwen-web |
| Stara strona (referencja) | https://www.akwen.bialystok.pl/ |
| Portal B2B (legacy) | https://b2b.akwen.bialystok.pl |

## Stack

- Next.js 15.5.20, React 19, TypeScript, Tailwind v4, shadcn/ui, xlsx
- Deploy: Vercel (auto-deploy z GitHub `master`)
- Kolory: Granat `#001F3F`, Turkus `#0077B6`, Koral `#FF6B35`

---

## Stan projektu — kompletny MVP B2B

Portal hurtowy `/b2b/*` jest **funkcjonalny i wdrożony na produkcji**.

### Moduły B2B

| Moduł | Ścieżka | Opis |
|-------|---------|------|
| Dashboard | `/b2b` | Statystyki + sekcja **„Polecane dla Ciebie"** (6 produktów z flagi Proponowany) |
| Katalog | `/b2b/katalog` | 517 produktów, filtry Kategoria/Rodzaj, sortowanie, zakładka Polecane |
| Koszyk | `/b2b/koszyk` | React Context + localStorage `akwen-b2b-cart` |
| Zamówienia | `/b2b/zamowienia` | Lista, szczegóły, „Zamów ponownie" |
| Moje dane | `/b2b/moje-dane` | Profil firmy + adresy dostawy, localStorage `akwen-b2b-profile` |
| Checkout | w koszyku | 3-krokowy flow, numer `AKW-YYYYMMDD-NNN` |

### Strona publiczna

`/`, `/o-nas`, `/oferta`, `/produkty`, `/kontakt`

---

## Dane produktów (Excel)

**Plik:** `public/data/produkty.xlsx`  
**Arkusz:** „Magazyn akt dla Jarka"  
**Wiersze:** 517

| Kolumna Excel | Pole w kodzie | Opis |
|---|---|---|
| Symbol | `symbol` / `id` | ID produktu |
| Nazwa | `name` | Nazwa produktu |
| Tag1 | `tag1` | Kategoria (22 wartości) |
| Tag2 | `tag2` | Rodzaj (76 wartości) |
| Proponowany | `isRecommended` | „Tak" = 134 produkty polecane |
| Ilość W magazynie Dostępna | `stock` | Stan magazynowy |
| Cena z cennika… Netto | `priceNet` | Cena hurtowa netto |
| Producent | `producer` | Producent |
| Jm | `unit` | Jednostka miary |

---

## Zdjęcia produktów (Grok Imagine)

**146 wygenerowanych zdjęć** w `public/images/products/*.jpg`  
**Pokrycie:** 517/517 produktów (100%) — jedno zdjęcie na parę Tag1+Tag2 (147 kombinacji)

### Przepływ

```
Excel (Tag1 + Tag2)
    ↓
buildImaginePrompt()  →  prompt dla Grok Imagine
    ↓
public/images/products/{slug}.jpg  (np. pasty-losos.jpg)
    ↓
product-image-manifest.json
    ↓
getProductImage()  →  ProductImage na kartach
```

**Przykład:** Tag1 „Pasty" + Tag2 „Łosoś" → pasta z łososiem w słoiku, fotografia produktowa, jasne tło.

**Fallback:** gradient morski + ikona kategorii gdy brak pliku.

### Pliki zdjęć

```
src/lib/b2b/image-prompts.ts
src/lib/b2b/images.ts
src/components/b2b/product-image.tsx
public/data/product-image-manifest.json
public/images/products/*.jpg
scripts/sync-image-manifest.mjs
scripts/coverage-report.mjs
scripts/generate-product-images-batch.mjs
```

---

## UX katalogu

- Filtry: **Kategoria** (Tag1) + **Rodzaj** (Tag2)
- Sortowanie: nazwa, cena, producent, stan, kategoria A–Z
- Zakładka **Polecane** — `/b2b/katalog?widok=proponowane`
- Brak żargonu technicznego (Tag1/Tag2) w UI
- Mobile: hamburger + Sheet
- Etykiety: `src/lib/b2b/labels.ts`

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
  types.ts, products.ts, images.ts, image-prompts.ts, labels.ts
  categories.ts, orders.ts, profile.ts, auth.ts, format.ts

src/contexts/
  cart-context.tsx, profile-context.tsx

src/components/b2b/
  catalog-client.tsx, product-card.tsx, product-image.tsx
  mobile-nav.tsx, sidebar.tsx, cart-checkout.tsx
  order-form.tsx, profile-form.tsx, orders-list.tsx

src/app/b2b/
  page.tsx, katalog/, koszyk/, zamowienia/, moje-dane/
```

---

## Historia commitów (ostatnie)

```
bf6d8d7  Wygenerowane zdjecia produktow B2B: 146 obrazow Grok Imagine
5281423  Poprawa UX katalogu: przyjazne etykiety, placeholdery
e8d8ac7  Dopracowanie MVP: tagi Tag1/Tag2, filtry, Proponowane
431ccc7  Modul Moje dane: profil firmy i adresy dostawy
```

---

## Testowanie na produkcji

| Co | URL |
|----|-----|
| Dashboard | https://akwen-web.vercel.app/b2b |
| Katalog | https://akwen-web.vercel.app/b2b/katalog |
| Polecane | https://akwen-web.vercel.app/b2b/katalog?widok=proponowane |
| Koszyk | https://akwen-web.vercel.app/b2b/koszyk |
| Moje dane | https://akwen-web.vercel.app/b2b/moje-dane |

---

## Ograniczenia MVP

- Brak prawdziwego logowania i API backend
- localStorage — brak sync między urządzeniami
- Rabat 5% nie stosowany do cen w koszyku
- Excel + zdjęcia wczytywane przy buildzie (zmiana = redeploy)
- Zdjęcia AI — nie są fotografiami rzeczywistych opakowań

---

## Sugerowane następne kroki

1. Prawdziwe zdjęcia produktów (fotografia studyjna)
2. Logowanie (Clerk / Auth0)
3. API + baza danych zamiast Excela/localStorage
4. Rabat % w koszyku
5. Filtry w URL (`?kategoria=Pasty&rodzaj=Łosoś`)
6. Eksport zamówienia (PDF / email)
7. Kolumna „Powód proponowania" w Excelu

---

## Kontekst developera

Użytkownik uczy się od podstaw (doświadczenie VBA/Excel). Preferuje wyjaśnienia krok po kroku z analogiami do Excela. Komunikacja po polsku.