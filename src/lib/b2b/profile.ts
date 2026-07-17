import { formatPrice } from "./format";
import { getDemoProfileForUser } from "./seed-users";
import { profileStorageKey, STORAGE_BASE } from "./storage-keys";
import type { B2BCustomer, B2BProfile, DeliveryAddress } from "./types";

export const PROFILE_STORAGE_KEY = STORAGE_BASE.profile;
export const PROFILE_UPDATED_EVENT = "akwen-profile-updated";

/**
 * Czy profil ma aktywną blokadę z powodu zaległości (mock).
 * Analogia VBA: If Range("Zaleglosci") = True Then Exit Sub
 */
export function hasPaymentArrears(profile: B2BProfile): boolean {
  return Boolean(profile.paymentArrears?.hasArrears);
}

/**
 * Komunikat do UI koszyka (Alert). null = brak blokady.
 */
export function getPaymentArrearsMessage(profile: B2BProfile): string | null {
  if (!hasPaymentArrears(profile)) return null;

  const amount = profile.paymentArrears?.amountNet ?? 0;
  const note = profile.paymentArrears?.note?.trim();
  const amountPart =
    Number.isFinite(amount) && amount > 0
      ? ` Zaległość: ${formatPrice(amount)} netto.`
      : "";
  const notePart = note ? ` (${note})` : "";

  return `Składanie zamówień jest zablokowane z powodu zaległości płatniczych.${amountPart}${notePart} Skontaktuj się z działem handlowym AKWEN.`;
}

/** Domyślny profil — preferuj seed użytkownika, inaczej pierwszy demo. */
export function getDefaultProfile(userId?: string | null): B2BProfile {
  if (userId) {
    const seeded = getDemoProfileForUser(userId);
    if (seeded) return seeded;
  }
  const fallback = getDemoProfileForUser("cust-001");
  if (fallback) return fallback;

  return {
    id: "cust-001",
    companyName: "Sklep Rybny Morska Fala",
    nip: "542-123-45-67",
    regon: "",
    contactPerson: "Jan Kowalski",
    email: "jan@morskafala.pl",
    phone: "+48 600 123 456",
    discountPercent: 5,
    deliveryAddresses: [],
  };
}

export function profileToCustomer(profile: B2BProfile): B2BCustomer {
  const defaultAddress =
    profile.deliveryAddresses.find((item) => item.isDefault) ??
    profile.deliveryAddresses[0];

  return {
    id: profile.id,
    companyName: profile.companyName,
    nip: profile.nip,
    contactPerson: profile.contactPerson,
    email: profile.email,
    phone: profile.phone,
    address: defaultAddress?.address ?? "",
    discountPercent: profile.discountPercent,
  };
}

export function getProfile(userId?: string | null): B2BProfile {
  if (typeof window === "undefined") {
    return getDefaultProfile(userId);
  }

  const key = profileStorageKey(userId);

  try {
    const saved = localStorage.getItem(key);
    if (!saved) return getDefaultProfile(userId);

    const parsed = JSON.parse(saved) as B2BProfile;
    if (!parsed?.companyName || !Array.isArray(parsed.deliveryAddresses)) {
      return getDefaultProfile(userId);
    }

    return {
      ...getDefaultProfile(userId),
      ...parsed,
      deliveryAddresses: parsed.deliveryAddresses.filter(
        (item) => item.id && item.address?.trim()
      ),
    };
  } catch {
    localStorage.removeItem(key);
    return getDefaultProfile(userId);
  }
}

export function saveProfile(
  profile: B2BProfile,
  userId?: string | null
): void {
  if (typeof window === "undefined") return;

  const key = profileStorageKey(userId ?? profile.id);
  localStorage.setItem(key, JSON.stringify(profile));
  window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT));
}

export function createDeliveryAddress(
  label: string,
  address: string,
  isDefault = false
): DeliveryAddress {
  return {
    id: crypto.randomUUID(),
    label: label.trim(),
    address: address.trim(),
    isDefault,
  };
}

export function ensureSingleDefaultAddress(
  addresses: DeliveryAddress[]
): DeliveryAddress[] {
  if (addresses.length === 0) return addresses;

  const hasDefault = addresses.some((item) => item.isDefault);
  if (hasDefault) return addresses;

  return addresses.map((item, index) => ({
    ...item,
    isDefault: index === 0,
  }));
}
