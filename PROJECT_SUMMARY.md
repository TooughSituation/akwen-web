# Projekt: Nowa strona Akwen (akwen-web)

> Ostatnia aktualizacja: 11.07.2026

## Cel projektu

Przebudowa strony firmowej **AKWEN Sp. z o.o.** (dystrybutor ryb z Białegostoku, działalność od 1991) z zachowaniem 100% treści i logów ze starej strony https://www.akwen.bialystok.pl/, w nowoczesnym, premium designie.

## Brief projektowy (wersja 2.0, 11.07.2026)

- **Paleta:** Granat `#001F3F`, Teal `#0077B6`, Koral `#FF6B35`
- **Typografia:** Playfair Display / Montserrat (nagłówki), Inter (tekst)
- Duży nacisk na apetyczne zdjęcia produktów
- **Slogan:** „Morskie opowieści”
- **CTA:** „Nasza oferta” + „Przejdź do portalu B2B”

## Stack technologiczny

- Next.js 15.5.20 (App Router)
- React 19
- Tailwind CSS v4
- shadcn/ui + Base UI
- next-themes (tryb jasny/ciemny)
- TypeScript
- Deploy: Vercel (auto-deploy z GitHub)

## Linki

| Zasób | URL |
|-------|-----|
| Strona live | https://akwen-web.vercel.app |
| GitHub | https://github.com/TooughSituation/akwen-web |
| Stara strona (referencja) | https://www.akwen.bialystok.pl/ |
| Portal B2B (docelowy) | https://b2b.akwen.bialystok.pl |

## Struktura projektu

```
src/
  app/
    page.tsx          — strona główna
    o-nas/page.tsx    — o firmie
    oferta/page.tsx   — oferta
    produkty/page.tsx — produkty litewskie
    kontakt/page.tsx  — kontakt
    b2b/page.tsx      — portal B2B (placeholder)
    layout.tsx        — layout + fonty
    globals.css       — paleta kolorów z briefu
  components/
    header.tsx        — sticky navbar z logo, scroll-aware
    hero.tsx          — sekcja hero
    footer.tsx        — stopka z mapą i logotypami UE/KPO
    partner-logos.tsx — pasek logo partnerów
    section-heading.tsx, wave-divider.tsx, page-header.tsx, theme-toggle.tsx
  lib/
    content.ts        — wszystkie treści + ścieżki do assetów

public/images/        — grafiki pobrane ze starej strony
```

## Co zostało zrobione

### Design i UX

- [x] Paleta kolorów z briefu (granat, teal, koral)
- [x] Fonty: Inter, Playfair Display, Montserrat
- [x] Sticky navbar — przezroczysty nad hero, solidny granat po scrollu
- [x] Hero: duże zdjęcie (`bg-hero.jpg`), slogan, 2 CTA
- [x] Pasek logo partnerów pod hero (`loga-1/2/3.png`)
- [x] Karty oferty ze zdjęciami produktów (hover zoom)
- [x] Sekcja produktów litewskich ze zdjęciem + ornamenty
- [x] Footer z białym logo, mapą, logotypami UE/KPO/PO RYBY

### Treści (migracja ze starej strony)

- [x] 100% tekstów w `src/lib/content.ts`
- [x] Dane kontaktowe, NIP, KRS
- [x] Sekcja O nas (5 akapitów + PO RYBY + zasięg)
- [x] 4 kategorie oferty (mrożone, wędzone, konserwy, przetwory)
- [x] 4 marki litewskie (Dauparų žuvis, Norvelita, Vičiūnai, ICECO)
- [x] Wyróżnienia: Gazela Biznesu, Orzeł Dystrybucji, KPO, PO RYBY

### Grafiki (pobrane z akwen.bialystok.pl)

- `logo.png`, `logo-white.png`
- `bg-hero.jpg` (tło hero)
- `oferta_mrozone.jpg`, `oferta_wedzone.jpg`, `oferta_konserwy.jpg`, `oferta_przetwory.jpg`
- `oferta-litewskie.png`
- `gazele-biznesu.png`, `pcdr.png`, `po-ryby.png`
- `mapka.png`, `bg-map.jpg`
- `loga-1.png`, `loga-2.png`, `loga-3.png`
- `loga-ue.png`, `logo-kpo.png`
- `ornament-up.png`, `ornament-down.png`

### Deploy

- [x] Repo na GitHub (`TooughSituation/akwen-web`)
- [x] Vercel — strona live i działająca
- [x] Naprawiony bug: ścieżka obrazka produktów litewskich (`oferta-litewskie.png`)

## Strony i status

| URL | Status |
|-----|--------|
| `/` | OK — pełna strona główna |
| `/o-nas` | OK — pełna treść + nagrody |
| `/oferta` | OK — karty ze zdjęciami |
| `/produkty` | OK — marki + zdjęcie |
| `/kontakt` | OK — dane + mapa |
| `/b2b` | OK — placeholder |

## Backlog

- [ ] Podlinkowanie B2B do https://b2b.akwen.bialystok.pl (obecnie wewnętrzna strona `/b2b`)
- [ ] Własna domena (`www.akwen.bialystok.pl`) w Vercel
- [ ] Osobna grafika „Orzeł Dystrybucji FMCG” (obecnie reużywana Gazela)
- [ ] Favicon ze starej strony
- [ ] Zdjęcia poszczególnych marek litewskich
- [ ] Dopracowanie mobile UX
- [ ] SEO: meta tagi, Open Graph, structured data
- [ ] Formularz kontaktowy
- [ ] Aktualizacja README.md

## Jak pracować lokalnie

```powershell
cd C:\Users\user\akwen-web
npx next dev --turbopack
# → http://localhost:3000
```

## Jak wdrażać zmiany

```powershell
git add .
git commit -m "Opis zmiany"
git push
# → Vercel auto-deploy w ~1-2 min
```

## Kluczowe pliki do edycji

| Plik | Zawartość |
|------|-----------|
| `src/lib/content.ts` | Wszystkie teksty i ścieżki grafik |
| `src/app/page.tsx` | Układ strony głównej |
| `src/components/hero.tsx` | Sekcja hero |
| `src/components/header.tsx` | Nawigacja |
| `src/components/footer.tsx` | Stopka |
| `src/app/globals.css` | Kolory i style globalne |

## Status projektu

**Działający prototyp podglądowy** — gotowy do pokazania zespołowi. Treści i grafiki ze starej strony przeniesione. Design zgodny z briefem v2.0. Następne kroki zależą od feedbacku zespołu.