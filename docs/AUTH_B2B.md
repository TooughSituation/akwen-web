# Auth B2B — Etap 4

## Co jest zrobione

- **Auth.js (NextAuth v5)** z providerm **Credentials**
- Strona `/b2b/login` (design Akwen)
- Middleware chroni wszystkie `/b2b/*` oprócz logowania
- 4 konta demo (różne firmy, rabaty, adresy)
- Koszyk, profil, zamówienia w localStorage **per userId**
- Wylogowanie → `/b2b/login`

## Konta demo

| E-mail | Hasło | Rabat |
|--------|-------|-------|
| `jan@morskafala.pl` | `demo123` | 5% |
| `anna@gastrocentrum.pl` | `demo123` | 8% |
| `piotr@superfish.pl` | `demo123` | 3% |
| `ewa@baltyckismak.pl` | `demo123` | 10% |

## Env

```env
AUTH_SECRET=<min 32 znaki losowe>
# opcjonalnie na produkcji:
AUTH_URL=https://akwen-web.vercel.app
```

Na Vercel: **Project → Settings → Environment Variables → AUTH_SECRET**

## Pliki

```
src/auth.ts
src/middleware.ts
src/app/api/auth/[...nextauth]/route.ts
src/app/b2b/login/page.tsx
src/components/b2b/login-form.tsx
src/lib/b2b/seed-users.ts
src/lib/b2b/storage-keys.ts
```

## Test ręczny

1. Otwórz `/b2b` → przekierowanie na `/b2b/login`
2. Kliknij konto demo lub wpisz e-mail/hasło
3. Sprawdź rabat w headerze (różny per firma)
4. Dodaj do koszyka → wyloguj → zaloguj innym kontem → koszyk pusty (osobny storage)
5. Wyloguj z sidebara / headera
