import { MOCK_CUSTOMER, SAVED_DELIVERY_ADDRESSES } from "./auth";
import type { B2BCustomer, B2BProfile, DeliveryAddress } from "./types";

export const PROFILE_STORAGE_KEY = "akwen-b2b-profile";
export const PROFILE_UPDATED_EVENT = "akwen-profile-updated";

export function getDefaultProfile(): B2BProfile {
  return {
    id: MOCK_CUSTOMER.id,
    companyName: MOCK_CUSTOMER.companyName,
    nip: MOCK_CUSTOMER.nip,
    regon: "",
    contactPerson: MOCK_CUSTOMER.contactPerson,
    email: MOCK_CUSTOMER.email,
    phone: MOCK_CUSTOMER.phone,
    discountPercent: MOCK_CUSTOMER.discountPercent,
    deliveryAddresses: SAVED_DELIVERY_ADDRESSES.map((address, index) => ({
      id: `addr-default-${index}`,
      label:
        index === 0
          ? "Siedziba"
          : index === 1
            ? "Magazyn chłodniczy"
            : "Punkt odbioru",
      address,
      isDefault: index === 0,
    })),
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

export function getProfile(): B2BProfile {
  if (typeof window === "undefined") {
    return getDefaultProfile();
  }

  try {
    const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!saved) return getDefaultProfile();

    const parsed = JSON.parse(saved) as B2BProfile;
    if (!parsed?.companyName || !Array.isArray(parsed.deliveryAddresses)) {
      return getDefaultProfile();
    }

    return {
      ...getDefaultProfile(),
      ...parsed,
      deliveryAddresses: parsed.deliveryAddresses.filter(
        (item) => item.id && item.address?.trim()
      ),
    };
  } catch {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    return getDefaultProfile();
  }
}

export function saveProfile(profile: B2BProfile): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
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