# Projekt: akwen-web — Strona publiczna + Portal B2B (Akwen)

> Ostatnia aktualizacja: **04.08.2026**  
> Kontekst dla GrokWeb / Grok Build  
> **Ostatnia zmiana:** `FundingLogos` — prawie przezroczysta nakładka **nad** hero (zdjęcie w pełni widoczne), mniejsze loga

## Linki

| Zasób | URL |
|-------|-----|
| **Produkcja** | https://akwen-web.vercel.app |
| **GitHub** | https://github.com/TooughSituation/akwen-web |
| Branch | `master` (Vercel: push + CLI `--prod`) |
| Stara strona | https://www.akwen.bialystok.pl/ |
| Vercel project | `toough-situation/akwen-web` |

## Stack

- Next.js 15.5 (Turbopack), React 19, TypeScript, Tailwind v4, shadcn/ui, Framer Motion, xlsx
- Deploy: Vercel (projekt `akwen-web`, domena `akwen-web.vercel.app`)
- Auth B2B: Auth.js (Credentials)
- Stan B2B: localStorage (MVP — bez backend DB)
- Kolory: Granat `#001F3F`, Turkus `#0077B6`, Koral `#FF6B35`
- Typografia: Inter (body), Playfair Display (nagłówki), Montserrat (etykiety display)

---

## ⚠️ Ważne — izolacja projektów

| Projekt | GitHub | Vercel | Lokalnie |
|---------|--------|--------|----------|
| **akwen-web** | `TooughSituation/akwen-web` · branch `master` | `toough-situation/akwen-web` | `C:\Users\user\akwen-web` |
| **cmkw-patient-portal** | `TooughSituation/cmkw-patient-portal` · branch `main` | `toough-situation/cmkw-patient-portal` | `C:\Users\user\cmkw-patient-portal` (sibling, **nie** podfolder Akwen) |

Projekty są **w pełni odseparowane**: osobne repo, osobne Vercel, osobne `package.json` / `.env` / `node_modules`.  
Brak wspólnych importów, zależności i konfiguracji.  
`cmkw-patient-portal` **nie** jest submodulem ani częścią tree akwen-web.

Zabezpieczenia (gdyby folder wrócił lokalnie pod Akwen):

- `.gitignore` → `cmkw-patient-portal/`
- `.vercelignore` → `cmkw-patient-portal/`
- `tsconfig.json` → `exclude: ["cmkw-patient-portal", "mcps"]`
- `eslint.config.mjs` → `ignores: ["cmkw-patient-portal/**", …]`

---

## Stan projektu

| Etap | Status | Opis |
|------|--------|------|
| Strona publiczna | ✅ | Hero, oferta, o nas, produkty, kontakt, dotacje |
| **Logotypy dofinansowania** | ✅ | UE / KPO / PO RYBY u góry · **overlay nad hero** (subtelny gradient, małe loga) |
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
| **Przewodnik** | ✅ | Tour po B2B (overlay), start z sidebara, localStorage tour-seen |
| **UI 2026** | ✅ | Quiet luxury: white space, typografia, Framer Motion, karty |
| **Edycja zamówień B2B** | ✅ | Edycja / anulacja + blokada przy zaległościach |
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
Layout publiczny:

```
Header (sticky)
└─ relative flex-1
   ├─ FundingLogos  ← absolute top-0 z-20 (overlay)
   └─ main          ← Hero / PageHeader prześwieca pod belką
Footer
```

Portal B2B: `/b2b/*` — **bez** belki logotypów dofinansowania (osobny layout)

---

## Ostatnia zmiana (04.08.2026) — logotypy dofinansowania (v3 — final)

### Cel (wymóg prawny + design)
Logotypy UE / KPO / PO RYBY **widoczne u góry** strony publicznej (pod nawigacją), **nie w stopce**.  
Belka ma być **prawie niewidoczna jako element UI** — loga czytelne, a zdjęcie hero w pełni widoczne pod spodem.

### Historia iteracji (nie wracać do starych)

| v | Styl | Problem |
|---|------|---------|
| v1 | Pełny biały pasek | Agresywnie odcina od hero / morskiego designu |
| v2 | Ciemny glass + duża biała karta / solid `#001F3F` | Zasłania zdjęcie hero, zbyt dominująca |
| **v3 (aktualny)** | **Overlay** + subtelny gradient + małe kafelki | Hero widać; belka minimalistyczna |

### Architektura (ważne!)

- `FundingLogos` = `position: absolute; inset-x-0; top-0; z-20` **nad** `main`
- **Nie** w normalnym flow między Header a main (wtedy pod belką jest puste tło, nie hero)
- Layout: `src/app/(site)/layout.tsx` — wrapper `relative flex-1` wokół overlay + main
- `pointer-events-none` na belce (loga nie są linkami)
- `hero.tsx` / `page-header.tsx` — większy `pt` na treści, żeby nie wchodziła pod loga

### Logotypy (asset paths)

| Logo | Plik | `assets.euLogos` |
|------|------|------------------|
| Unia Europejska / EFR (+ PO RYBY w stripie) | `/images/loga-ue.png` | `ue` |
| Krajowy Plan Odbudowy | `/images/logo-kpo.png` | `kpo` |
| PO RYBY 2007–2013 (osobny wariant) | `/images/po-ryby.png` | `poRyby` |

Definicje: `src/lib/content.ts` → `assets.euLogos`  
Uwaga: `loga-ue.png` to **złożony strip** (UE + PO RYBY); `po-ryby.png` to drugi wariant (świadek) — celowe „oba warianty”.

### UI belki (`FundingLogos`) — v3 aktualny

| Element | Wartość |
|---------|---------|
| Pozycja | `absolute` nad hero / page header |
| Tło belki | Gradient `rgba(0,20,40, 0.32 → 0.18 → 0)` — **bez** mocnego blur, **bez** solid navy |
| Kafelki log | `bg-white/80`, `rounded-md/lg`, minimalny cień, `backdrop-blur-[2px]` tylko na kafelku |
| Rozmiar log | `h-7`–`h-9` (~15% mniejsze vs v2) |
| Układ | Wyśrodkowany, `flex-wrap`, `gap-2` / `sm:gap-3`, `py-2.5` / `sm:py-3` |
| Mobile | `max-w-[min(38vw,190px)]`, zawijanie |
| A11y | `role="region"`, `aria-label`, `priority` |

**Zasady designu (kolejne sesje):**
- ❌ Nie wracać do pełnego białego paska full-width  
- ❌ Nie wracać do solid `#001F3F` / mocnego `backdrop-blur-md` na całej belce  
- ❌ Nie wracać log do stopki  
- ✅ Hero / maritime page header **musi** przeświecać pod belką (overlay)  
- ✅ Loga małe, wyśrodkowane, czytelne (wymóg prawny)

### Commity (logotypy)

| Hash | Opis |
|------|------|
| `94b18b6` | Przeniesienie logotypów ze stopki na górę |
| `5a66251` | Izolacja lokalnego `cmkw-patient-portal` w buildzie |
| `eb55ef1` | v2: glass / granat (superseded) |
| **`723ba71`** | **v3: przezroczysta nakładka nad hero, mniejsze loga** ← aktualny |

### Deploy

- Branch: `master` @ `723ba71`  
- Produkcja: **https://akwen-web.vercel.app** (Vercel Ready)  
- **Nie deployować / nie edytować** `cmkw-patient-portal` (osobny sibling: `C:\Users\user\cmkw-patient-portal`)

### Czego NIE ruszać

- Reszty treści strony (sekcje poniżej hero, B2B)
- Nagrody w „O nas” na homepage (osobne badge, nie belka prawna)
- Layoutu portalu B2B
- Projektu **cmkw-patient-portal** (poza workspace Akwen)

---

## Strona publiczna — kluczowe pliki

```
src/app/(site)/layout.tsx        # Header + relative(FundingLogos overlay + main) + Footer
src/components/header.tsx        # Sticky nav (zawsze granat #001F3F)
src/components/funding-logos.tsx # Overlay UE / KPO / PO RYBY (v3)
src/components/footer.tsx        # Stopka BEZ logów dofinansowania
src/components/hero.tsx          # pt-32/pt-36 — miejsce na belkę
src/components/page-header.tsx   # pt-20/pt-24 — miejsce na belkę
src/components/section-heading.tsx
src/lib/content.ts               # company, assets.euLogos, copy
```
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

## Przewodnik (product tour)

| Element | Szczegóły |
|---------|-----------|
| Start | Sidebar → **Przewodnik** (+ auto-start przy 1. wizycie) |
| UI | Custom overlay + spotlight (`tour-overlay.tsx`) |
| Kroki | Dashboard, Katalog, Ulubione, Koszyk, Zamówienia, Moje dane, Lojalność, Czat |
| Nawigacja | Poprzedni / Następny / Zakończ |
| Storage | `akwen-b2b-tour-seen:{userId}` = `"1"` po zakończeniu |
| Atrybuty | `data-tour="nav-*"` / `header-*` na elementach |

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
- [ ] (Opcjonalnie) drugi wariant PO RYBY / dodatkowe loga UE, jeśli formalnie wymagane  

---

## Szybki start dla GrokWeb (kolejna sesja)

1. **Repo:** `akwen-web` · `master` · https://akwen-web.vercel.app  
2. **Nie dotykać** `cmkw-patient-portal` (osobny projekt: `C:\Users\user\cmkw-patient-portal`, własne repo + Vercel)  
3. **FundingLogos v3:** overlay `absolute` nad `main` — subtelny gradient, małe kafelki `white/80`; **nie** solid navy, **nie** biały pasek, **nie** stopka  
4. **B2B:** Auth.js + localStorage per user; dane z `public/data/produkty.xlsx`  
5. **Deploy:** `git push origin master` i/lub `npx vercel --prod --yes` (katalog akwen-web)  
6. **Język:** polski; analogie Excel/VBA gdy pomaga  

### Wklejka kontekstowa (krótka)

```
akwen-web · https://akwen-web.vercel.app · master · 723ba71

FundingLogos (wymóg prawny, strona publiczna):
- Plik: src/components/funding-logos.tsx
- Layout: (site)/layout — absolute overlay nad main (hero prześwieca)
- Loga: UE (loga-ue.png), KPO (logo-kpo.png), PO RYBY (po-ryby.png)
- Styl v3: gradient rgba(0,20,40,0.32→0), kafelki bg-white/80, h-7–h-9
- NIE: stopka, biały full-width pasek, solid #001F3F na belce, mocny blur
- NIE ruszać: cmkw-patient-portal (sibling C:\Users\user\cmkw-patient-portal)

B2B: Auth.js, localStorage, Excel produkty — osobny layout bez FundingLogos.
```


---

## Kontekst developera

Użytkownik uczy się od podstaw (VBA/Excel). Preferuje analogie do arkuszy i wyjaśnienia krok po kroku. Komunikacja po polsku.
