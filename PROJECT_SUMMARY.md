# Projekt: akwen-web — Portal B2B (Akwen)

> Ostatnia aktualizacja: 17.07.2026  
> Etapy 1–3: rabat, proponowane, search, mock API, smoke  
> **Etap 4: Auth.js — logowanie B2B, middleware, dane per użytkownik**  
> Kontekst dla GrokWeb / Grok Build

## Linki

| Zasób | URL |
|-------|-----|
| **Produkcja** | https://akwen-web.vercel.app |
| **GitHub** | https://github.com/TooughSituation/akwen-web |
| Branch | `master` (Vercel auto-deploy) |
| Stara strona | https://www.akwen.bialystok.pl/ |

## Stack

- Next.js 15.5, React 19, TypeScript, Tailwind v4, shadcn/ui, xlsx
- Deploy: Vercel (auto z `master`)
- Stan: localStorage (MVP — bez backend auth/DB)
- Kolory: Granat `#001F3F`, Turkus `#0077B6`, Koral `#FF6B35`

---

## Stan projektu

| Etap | Status | Opis |
|------|--------|------|
| MVP B2B | ✅ | Katalog, koszyk, zamówienia, profil, dashboard |
| **Etap 1** | ✅ | Rabat w koszyku, proponowane z powodami, shareable filtry, zdjęcia |
| **Etap 2** | ✅ | Kolumna Excel PowodProponowania, rabat na kartach, prompty Imagine |
| **Etap 3** | ✅ | Globalne wyszukiwanie w headerze, mock API Route Handlers, E2E smoke |
| **Etap 4** | ✅ | Auth.js (Credentials), `/b2b/login`, middleware, localStorage per user |
| **Etap 5** | ✅ | Program lojalnościowy: punkty, nagrody, wymiana, historia |
| **Etap 6** | ✅ | PDF zamówienia + mock e-mail potwierdzenia |
| **Ulubione** | ✅ | Serce na karcie, widok w katalogu, localStorage per user |
| **Promocje** | ✅ | Progi 500 zł (−5%) i 800 zł (gratis), licznik „brakuje” live |
| **Czat mock** | ✅ | Sheet z handlowcem, auto-odpowiedź 2–3 s, historia per user |
| Etap 7+ | ⏳ | Prawdziwa baza, Resend SMTP, ERP… |

### Moduły B2B

| Moduł | Ścieżka | Stan |
|-------|---------|------|
| Dashboard | `/b2b` | Polecane + toggle + **global search w headerze** |
| Katalog | `/b2b/katalog` | Filtry URL + `?q=` z headera |
| Koszyk | `/b2b/koszyk` | Rabat %; createOrder przez `/api/orders` |
| Zamówienia | `/b2b/zamowienia` | Reorder bez double discount |
| Moje dane | `/b2b/moje-dane` | Profil; walidacja PUT `/api/profile` |
| Smoke | `/b2b/smoke` | Automatyczny smoke API + checklista |

Strona publiczna: `/`, `/o-nas`, `/oferta`, `/produkty`, `/kontakt`, `/dotacje`

---

## Etap 1 (przypomnienie)

1. **Rabat w koszyku** — `applyDiscount` / `sumCartNet`; koszyk trzyma ceny katalogowe  
2. **Proponowane** — badge + opis (najpierw heurystyka)  
3. **Shareable URL** — `?tag1=&tag2=&widok=&q=&stock=&sort=` + Udostępnij  
4. **Zdjęcia** — prompty Tag1+Tag2, fallback chain  

---

## Etap 2 — szczegóły

### 1) Kolumna Excel `PowodProponowania`

**Analogia do Excela:** nowa kolumna obok `Proponowany` (jak ręczna lista rozwijana).

| Wartość przykładowa | Znaczenie |
|---------------------|-----------|
| Wysoka marża | Atrakcyjna marża |
| Krótki termin | Krótki horyzont rotacji / świeża partia |
| Bestseller | Duży stan / popularny asortyment |
| Oferta limitowana | Niski stan |
| Wybór handlowca | Fallback handlowy |

- Plik: `public/data/produkty.xlsx`  
- Skrypt uzupełniający: `scripts/add-powod-proponowania.cjs`  
- Odczyt: `products.ts` → pole `PowodProponowania`  
- Mapowanie: `recommend.ts` → `reasonFromExcelLabel` (Excel ma priorytet, heurystyka = fallback)  
- UI: badge na karcie + `recommendReasonDetail`  

### 2) Rabat na kartach katalogu

**Analogia do Excela:** trzy „kolumny” na karcie — cennik, po rabacie, różnica.

Gdy klient ma rabat (np. 5%) i tryb **Twoja cena** (domyślny):

1. Cena katalogowa — **przekreślona**  
2. Cena po rabacie — **pogrubiona** (turkus)  
3. Oszczędność — np. `−5% (−1,23 zł)`  

- Helpery: `formatDiscountSavingsLabel`, `unitDiscountSavings` w `format.ts`  
- Toggle: `PriceModeToggle` — Twoja cena / Katalogowa (`akwen-b2b-price-mode`)  
- Pliki: `product-card.tsx`, `price-display-context.tsx`  

### 3) Prompty Grok Imagine (ulepszone)

Szczególnie: **Mięsne**, **Warzywa**, **Mrożonki**, **Konserwy rybne** — więcej detali (opakowanie, mróz, metal puszki, marbling mięsa).

Struktura promptu: subject → composition → backdrop → lighting (softboxy) → lens 85mm → quality → negatives.

- `src/lib/b2b/image-prompts.ts`  
- Batch: `scripts/generate-product-images-batch.mjs`  

---

## Dane (Excel)

**Plik:** `public/data/produkty.xlsx` · arkusz „Magazyn akt dla Jarka” · **517** wierszy

| Kolumna Excel | Pole w kodzie | Opis |
|---|---|---|
| Symbol | `symbol` / `id` | ID |
| Nazwa | `name` | Nazwa |
| Tag1 | `tag1` | Kategoria (22) |
| Tag2 | `tag2` | Rodzaj (~76) |
| Proponowany | `isRecommended` | Tak ≈ 134 |
| **PowodProponowania** | `recommendReason` | Etap 2 — powód z arkusza |
| Ilość W magazynie Dostępna | `stock` | Stan |
| Cena z cennika… Netto | `priceNet` | Cennik |
| Producent | `producer` | Producent |
| Jm | `unit` | Jm |
| Wartość ogółem / Ilość OGÓŁEM | (heurystyka) | Fallback marży |
| Data dostawy Różnica dni | (heurystyka) | Fallback świeżości |

---

## Storage (browser)

| Klucz | Zawartość |
|-------|-----------|
| `akwen-b2b-cart` | Koszyk (ceny katalogowe) |
| `akwen-b2b-profile` | Profil + rabat % |
| `akwen-b2b-orders` | Zamówienia |
| `akwen-b2b-price-mode` | `yours` \| `list` |

---

## Kluczowe pliki

```
src/lib/b2b/
  products.ts, recommend.ts, format.ts, types.ts
  image-prompts.ts, images.ts, orders.ts, profile.ts

src/contexts/
  cart-context.tsx, profile-context.tsx, price-display-context.tsx

src/components/b2b/
  product-card.tsx, price-mode-toggle.tsx, catalog-client.tsx
  cart-checkout.tsx, product-image.tsx

scripts/
  add-powod-proponowania.cjs
  generate-product-images-batch.mjs
  sync-image-manifest.mjs
```

---

## Weryfikacja produkcji

1. `/b2b/koszyk` — rabat −5%, oszczędność  
2. `/b2b` — Polecane: badge powodów z Excela + toggle cen  
3. `/b2b/katalog?tag1=Pasty&tag2=Łosoś` — filtry URL; na kartach: przekreślona katalogowa, pogrubiona po rabacie, `−5% (−X zł)`  
4. `/b2b/moje-dane` — rabat read-only  
5. Reorder zamówienia — bez double discount  

---

## Etap 4 — autoryzacja (Auth.js)

**Dlaczego Auth.js, nie Clerk:** kilka kont demo z różnymi rabatami/firmami bez dashboardu zewnętrznego.

| Element | Ścieżka / plik |
|---------|----------------|
| Logowanie | `/b2b/login` |
| Middleware | `src/middleware.ts` — chroni `/b2b/*` (oprócz login) |
| Konfiguracja | `src/auth.ts` + `src/app/api/auth/[...nextauth]/route.ts` |
| Konta demo | `src/lib/b2b/seed-users.ts` (hasło: `demo123`) |
| Storage per user | `akwen-b2b-cart:{userId}`, `…-profile:{userId}`, `…-orders:{userId}` |
| Env | `AUTH_SECRET` (wymagane na Vercel) |

### Konta testowe

| E-mail | Hasło | Firma | Rabat |
|--------|-------|-------|-------|
| jan@morskafala.pl | demo123 | Sklep Rybny Morska Fala | 5% |
| anna@gastrocentrum.pl | demo123 | Gastro Centrum | 8% |
| piotr@superfish.pl | demo123 | SuperFish Hurt | 3% |
| ewa@baltyckismak.pl | demo123 | Bałtycki Smak | 10% |

### Analogia VBA
- Logowanie = Form_Logowanie sprawdzające tabelę Użytkownicy  
- Middleware = Form_Open z `If Not LoggedIn Then Cancel`  
- Per-user localStorage = osobny skoroszyt na firmę  

---

## Etap 3 — szczegóły

### 1) Globalne wyszukiwanie (header)

- Komponent: `src/components/b2b/global-search.tsx`
- Szuka po: nazwa, symbol, producent, Tag1, Tag2 (+ etykiety)
- Logika: `src/lib/b2b/search.ts` (`matchesProductQuery`)
- Podpowiedzi z `GET /api/products?q=&compact=1`
- Enter → `/b2b/katalog?q=…` (shareable)
- Desktop w pasku headera; mobile pod tytułem strony

### 2) Mock API (Route Handlers)

| Endpoint | Metody | Rola |
|----------|--------|------|
| `/api/products` | GET | Katalog z Excel (q, tag1, tag2, limit, compact) |
| `/api/orders` | GET, POST | POST buduje zamówienie + rabat; lista = localStorage u klienta |
| `/api/profile` | GET, PUT | Walidacja profilu; zapis trwały = localStorage |

- Klient: `src/lib/b2b/api-client.ts`
- Kompatybilność: order-form i profile-form wołają API, potem `saveOrder` / `saveProfile`
- Fallback offline: lokalny `createOrder` / zapis bez API

### 3) E2E smoke

- UI: `/b2b/smoke` — przycisk **Uruchom smoke**
- Docs: `docs/E2E_SMOKE.md` — checklista ręczna + curl

---

## Etap 5 — program lojalnościowy

| Element | Szczegóły |
|---------|-----------|
| Reguła | 1 punkt za każde pełne **10 zł netto** (po rabacie) |
| Naliczanie | `createOrder` → `loyaltyPointsEarned`; `saveOrder` → `earnPointsForOrder` |
| Storage | `akwen-b2b-loyalty:{userId}` |
| UI | `/b2b/moje-dane` — saldo, katalog nagród, wymiana, historia |
| Header | Badge „X pkt” → Moje dane |
| Pliki | `loyalty.ts`, `loyalty-context.tsx`, `loyalty-panel.tsx` |

Analogia Excel: arkusz **Punkty** (ledger), **Nagrody** (katalog), **Wymiany** (redemptions).

---

## Czat na żywo (mock)

| Element | Szczegóły |
|---------|-----------|
| Storage | `akwen-b2b-chat:{userId}` — historia wiadomości |
| Lib / context | `chat.ts`, `chat-context.tsx` |
| UI | Ikona w headerze → Sheet (`live-chat.tsx`) |
| Agent | „Przedstawiciel handlowy Akwen” |
| Auto-odpowiedź | 2–3 s po wiadomości usera (`pickMockAgentReply`) |
| Powitanie | Przy pierwszym otwarciu (pusty wątek) |

Analogia VBA: formularz czatu + `Application.OnTime` na auto-odpowiedź.

---

## Promocje koszykowe (dynamiczne)

| Element | Szczegóły |
|---------|-----------|
| Definicje | `src/lib/b2b/promotions.ts` — próg 500 zł → −5%, 800 zł → gratis |
| Formuła | `brakuje = MAX(0; próg − suma_netto_po_rabacie)` |
| Koszyk | `CartPromotionsBanner` — pasek postępu + komunikat live |
| Karta | Badge promocji + linia „Brakuje Ci X zł…” |
| Checkout | Info o progu w podsumowaniu zamówienia |

---

## Ulubione produkty

| Element | Szczegóły |
|---------|-----------|
| Storage | `akwen-b2b-favorites:{userId}` — tablica ID produktów |
| Context | `favorites-context.tsx` + `favorites.ts` |
| UI karty | Serce (pusty/wypełniony) na zdjęciu + przycisk „Ulubione” |
| Katalog | Zakładka **Ulubione** · URL `?widok=ulubione` |
| Header | Licznik serc → katalog ulubionych |

Analogia Excel: arkusz „Ulubione” z kolumną ProductId (jak lista zaznaczonych wierszy).

---

## Etap 6 — PDF + mock e-mail

| Element | Szczegóły |
|---------|-----------|
| PDF | `@react-pdf/renderer` — `OrderPdfDocument` w `order-pdf.tsx` |
| Pobieranie | Przycisk **Pobierz PDF** na sukcesie zamówienia i w szczegółach |
| Treść PDF | Nagłówek Akwen, klient, dostawa, pozycje, rabat, suma, punkty, numer |
| E-mail | Mock `sendOrderConfirmationEmailMock` → `console.info` (DevTools) |
| UI | Auto-mock po złożeniu + przycisk „Wyślij e-mail (mock)” |

Analogia VBA: `DoCmd.OutputTo acOutputReport, , acFormatPDF` + `DoCmd.SendObject`.

---

## Checklist dalszych kroków (Etap 7+)

- [ ] Prawdziwy e-mail (Resend / SMTP) zamiast console.log  
- [ ] Regeneracja batch Imagine  
- [ ] Migracja na Clerk produkcyjny (opcjonalnie)  
- [ ] Prawdziwa baza zamiast localStorage  
- [ ] VAT / cenniki wielopoziomowe  
- [ ] Realizacja nagród po stronie handlowca (status fulfilled)  

---

## Kontekst developera

Użytkownik uczy się od podstaw (VBA/Excel). Preferuje analogie do arkuszy i wyjaśnienia krok po kroku. Komunikacja po polsku.
