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

export function getMockCustomer(): B2BCustomer {
  return MOCK_CUSTOMER;
}