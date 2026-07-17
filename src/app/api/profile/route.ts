import { NextRequest, NextResponse } from "next/server";
import {
  ensureSingleDefaultAddress,
  getDefaultProfile,
} from "@/lib/b2b/profile";
import type { B2BProfile } from "@/lib/b2b/types";

/**
 * Mock API profilu klienta.
 *
 * Analogia do Excela: arkusz „Dane firmy” — GET = domyślny wiersz startowy,
 * PUT = walidacja i zwrot zaktualizowanego wiersza (trwały zapis = localStorage w przeglądarce).
 */

function isValidProfile(value: unknown): value is B2BProfile {
  if (!value || typeof value !== "object") return false;
  const p = value as B2BProfile;
  return (
    typeof p.companyName === "string" &&
    typeof p.nip === "string" &&
    Array.isArray(p.deliveryAddresses)
  );
}

export async function GET() {
  const profile = getDefaultProfile();
  return NextResponse.json({
    profile,
    meta: {
      source: "mock-default",
      storageKey: "akwen-b2b-profile",
      note:
        "Domyślny profil serwera. Zapisany profil użytkownika jest w localStorage przeglądarki.",
    },
  });
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    if (!isValidProfile(body)) {
      return NextResponse.json(
        { error: "Nieprawidłowa struktura profilu." },
        { status: 400 }
      );
    }

    if (!body.companyName.trim()) {
      return NextResponse.json(
        { error: "Nazwa firmy jest wymagana." },
        { status: 400 }
      );
    }
    if (!body.nip.trim()) {
      return NextResponse.json(
        { error: "NIP jest wymagany." },
        { status: 400 }
      );
    }
    if (body.deliveryAddresses.length === 0) {
      return NextResponse.json(
        { error: "Dodaj co najmniej jeden adres dostawy." },
        { status: 400 }
      );
    }

    const profile: B2BProfile = {
      ...getDefaultProfile(),
      ...body,
      companyName: body.companyName.trim(),
      nip: body.nip.trim(),
      regon: (body.regon ?? "").trim(),
      contactPerson: (body.contactPerson ?? "").trim(),
      email: (body.email ?? "").trim(),
      phone: (body.phone ?? "").trim(),
      discountPercent:
        typeof body.discountPercent === "number"
          ? body.discountPercent
          : getDefaultProfile().discountPercent,
      deliveryAddresses: ensureSingleDefaultAddress(body.deliveryAddresses),
    };

    return NextResponse.json({
      profile,
      meta: {
        source: "mock-api",
        persistHint:
          "Zapisz profile w localStorage po stronie klienta (saveProfile).",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Nie udało się zapisać profilu." },
      { status: 500 }
    );
  }
}
