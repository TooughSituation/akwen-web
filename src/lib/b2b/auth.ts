/**
 * Kompatybilność wsteczna — mock klienta = pierwsze konto demo.
 * Nowe logowanie: Auth.js + seed-users.ts
 */
import { DEMO_B2B_USERS } from "./seed-users";
import type { B2BCustomer } from "./types";
import { profileToCustomer } from "./profile";

const first = DEMO_B2B_USERS[0];

export const MOCK_CUSTOMER: B2BCustomer = profileToCustomer(first.profile);

export const SAVED_DELIVERY_ADDRESSES = first.profile.deliveryAddresses.map(
  (a) => a.address
) as readonly string[];

export function getMockCustomer(): B2BCustomer {
  return MOCK_CUSTOMER;
}
