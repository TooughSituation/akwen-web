import type { B2BCustomer } from "./types";

export const MOCK_CUSTOMER: B2BCustomer = {
  id: "cust-001",
  companyName: "Sklep Rybny Morska Fala",
  nip: "542-123-45-67",
  contactPerson: "Jan Kowalski",
  email: "jan.kowalski@morskafala.pl",
  phone: "+48 600 123 456",
  address: "ul. Rybacka 12, 15-001 Białystok",
  discountPercent: 5,
};

export const SAVED_DELIVERY_ADDRESSES = [
  MOCK_CUSTOMER.address,
  "Magazyn chłodniczy, ul. Ełcka 88, 15-001 Białystok",
  "Punkt odbioru — hala targowa, ul. Baranowicka 117, Białystok",
] as const;

export function getMockCustomer(): B2BCustomer {
  return MOCK_CUSTOMER;
}