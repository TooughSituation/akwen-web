/**
 * Testowe konta B2B — jak arkusz „Użytkownicy” w Excelu.
 * Każdy wiersz = firma + login + hasło + rabat + adresy.
 *
 * Hasła są demo (plain) — tylko do środowiska MVP / pokazu właścicielowi.
 * W produkcji: prawdziwy IdP (Clerk/Auth0) + hashowanie.
 */

import type { B2BProfile } from "./types";

export interface DemoB2BUser {
  /** Unikalne ID (jak klucz w Access). */
  id: string;
  email: string;
  /** Hasło demo — tylko test. */
  password: string;
  /** Etykieta na liście kont na stronie logowania. */
  label: string;
  profile: B2BProfile;
}

export const DEMO_B2B_USERS: DemoB2BUser[] = [
  {
    id: "cust-001",
    email: "jan@morskafala.pl",
    password: "demo123",
    label: "Sklep detaliczny · rabat 5%",
    profile: {
      id: "cust-001",
      companyName: "Sklep Rybny Morska Fala",
      nip: "542-123-45-67",
      regon: "200123456",
      contactPerson: "Jan Kowalski",
      email: "jan@morskafala.pl",
      phone: "+48 600 123 456",
      discountPercent: 5,
      deliveryAddresses: [
        {
          id: "addr-mf-1",
          label: "Siedziba",
          address: "ul. Rybacka 12, 15-001 Białystok",
          isDefault: true,
        },
        {
          id: "addr-mf-2",
          label: "Magazyn chłodniczy",
          address: "ul. Ełcka 88, 15-001 Białystok",
          isDefault: false,
        },
      ],
    },
  },
  {
    id: "cust-002",
    email: "anna@gastrocentrum.pl",
    password: "demo123",
    label: "Gastronomia · rabat 8%",
    profile: {
      id: "cust-002",
      companyName: "Gastro Centrum Sp. z o.o.",
      nip: "525-987-65-43",
      regon: "146789012",
      contactPerson: "Anna Nowak",
      email: "anna@gastrocentrum.pl",
      phone: "+48 501 222 333",
      discountPercent: 8,
      deliveryAddresses: [
        {
          id: "addr-gc-1",
          label: "Kuchnia centralna",
          address: "ul. Zamenhofa 15, 15-435 Białystok",
          isDefault: true,
        },
        {
          id: "addr-gc-2",
          label: "Restauracja Centrum",
          address: "ul. Lipowa 4, 15-424 Białystok",
          isDefault: false,
        },
      ],
    },
  },
  {
    id: "cust-003",
    email: "piotr@superfish.pl",
    password: "demo123",
    label: "Hurt rybny · rabat 3%",
    profile: {
      id: "cust-003",
      companyName: "SuperFish Hurt Sp. j.",
      nip: "966-111-22-33",
      regon: "368001122",
      contactPerson: "Piotr Wiśniewski",
      email: "piotr@superfish.pl",
      phone: "+48 512 444 555",
      discountPercent: 3,
      deliveryAddresses: [
        {
          id: "addr-sf-1",
          label: "Magazyn główny",
          address: "ul. Przemysłowa 40, 16-400 Suwałki",
          isDefault: true,
        },
      ],
    },
  },
  {
    id: "cust-004",
    email: "ewa@baltyckismak.pl",
    password: "demo123",
    label: "Sieć delikatesów · rabat 10%",
    profile: {
      id: "cust-004",
      companyName: "Bałtycki Smak S.A.",
      nip: "584-200-30-40",
      regon: "221100334",
      contactPerson: "Ewa Zielińska",
      email: "ewa@baltyckismak.pl",
      phone: "+48 605 777 888",
      discountPercent: 10,
      deliveryAddresses: [
        {
          id: "addr-bs-1",
          label: "Centrum dystrybucji",
          address: "ul. Gdańska 100, 80-001 Gdańsk",
          isDefault: true,
        },
        {
          id: "addr-bs-2",
          label: "Oddział Olsztyn",
          address: "ul. Kościuszki 22, 10-001 Olsztyn",
          isDefault: false,
        },
        {
          id: "addr-bs-3",
          label: "Oddział Białystok",
          address: "ul. Hetmańska 30, 15-727 Białystok",
          isDefault: false,
        },
      ],
    },
  },
];

export function findDemoUserByEmail(email: string): DemoB2BUser | undefined {
  const normalized = email.trim().toLowerCase();
  return DEMO_B2B_USERS.find((u) => u.email.toLowerCase() === normalized);
}

export function findDemoUserById(id: string): DemoB2BUser | undefined {
  return DEMO_B2B_USERS.find((u) => u.id === id);
}

export function getDemoProfileForUser(userId: string): B2BProfile | null {
  const user = findDemoUserById(userId);
  if (!user) return null;
  // Kopia głęboka — żeby mutacje localStorage nie psuły seeda
  return JSON.parse(JSON.stringify(user.profile)) as B2BProfile;
}
