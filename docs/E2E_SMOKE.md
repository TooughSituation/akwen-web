# E2E smoke — akwen-web (Etap 3)

Analogia do VBA: to jest **makro testowe** + **checklista ręczna** po wdrożeniu,
zamiast pełnego Selenium/Playwright (na razie).

## A) Automatycznie w portalu

1. Otwórz https://akwen-web.vercel.app/b2b/smoke (lub lokalnie `/b2b/smoke`)
2. Kliknij **Uruchom smoke**
3. Oczekiwany wynik: wszystkie kroki **OK**

Co jest sprawdzane:

| Krok | Co | Analogia Excel/VBA |
|------|-----|-------------------|
| API produktów | `GET /api/products?q=łosoś` | AutoFilter na arkuszu Magazyn |
| API profilu | `PUT /api/profile` | Walidacja wiersza Dane firmy |
| API zamówień | `POST /api/orders` + rabat 5% | Makro CreateOrder |
| Rabat | `applyDiscount(20, 5) = 19` | Formuła `=Cena*(1-5%)` |
| Wyszukiwanie | API pod ścieżkę header → katalog | Znajdź w skoroszycie |

## B) Ręczna ścieżka UI (5 minut)

### 1. Globalne wyszukiwanie
- [ ] Wejdź na `/b2b`
- [ ] W headerze wpisz min. 2 znaki (np. `pasta`)
- [ ] Pojawia się lista podpowiedzi (nazwa, symbol, tagi, cena)
- [ ] Enter lub „Pokaż wszystkie wyniki” → `/b2b/katalog?q=pasta`
- [ ] Katalog pokazuje przefiltrowane produkty

### 2. Rabat na kartach
- [ ] Toggle **Twoja cena** (domyślny)
- [ ] Na karcie: katalogowa ~~przekreślona~~, po rabacie **pogrubiona**, linia `−5% (−X zł)`
- [ ] Toggle **Katalogowa** pokazuje cennik

### 3. Koszyk + checkout
- [ ] Dodaj 2 produkty do koszyka
- [ ] `/b2b/koszyk` — rabat i oszczędność widoczne
- [ ] Złóż zamówienie (data + adres)
- [ ] Numer `AKW-YYYYMMDD-NNN`, suma po rabacie

### 4. Reorder
- [ ] `/b2b/zamowienia` → szczegóły → **Zamów ponownie**
- [ ] W koszyku ceny katalogowe; rabat nakładany raz (bez double discount)

### 5. Profil
- [ ] `/b2b/moje-dane` — zmień telefon → Zapisz
- [ ] Odśwież stronę — zmiana trzyma się (localStorage)
- [ ] Rabat read-only nadal widoczny

### 6. Shareable filtry
- [ ] `/b2b/katalog?tag1=Pasty&tag2=Łosoś` ładuje filtry
- [ ] **Udostępnij** kopiuje URL

## C) Szybkie curl / przeglądarka (API)

```bash
# Produkty (wyszukiwanie)
curl "http://localhost:3000/api/products?q=losos&limit=3&compact=1"

# Profil domyślny
curl "http://localhost:3000/api/profile"

# Zamówienie (POST JSON)
curl -X POST "http://localhost:3000/api/orders" \
  -H "Content-Type: application/json" \
  -d "{\"items\":[{\"productId\":\"1\",\"symbol\":\"T\",\"name\":\"Test\",\"unit\":\"szt\",\"priceNet\":10,\"stock\":5,\"quantity\":1}],\"customerId\":\"c1\",\"companyName\":\"Test\",\"discountPercent\":5,\"deliveryDate\":\"2030-01-01\",\"deliveryAddress\":\"Adres\",\"notes\":\"\"}"
```

## D) Kryteria pass / fail

- **Pass:** smoke panel 5/5 OK + ręczna checklista bez blokerów
- **Fail:** API 500, brak wyników wyszukiwania, zły rabat w POST order, double discount na reorder
