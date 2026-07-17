import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/b2b/orders";
import type { CreateOrderInput } from "@/lib/b2b/types";

/**
 * Mock API zamówień.
 *
 * Analogia do VBA:
 *  - GET  = odczyt listy (po stronie serwera mock nie trzyma localStorage
 *           przeglądarki — lista żyje u klienta; tu zwracamy kontrakt API)
 *  - POST = zbuduj zamówienie (jak makro CreateOrder) i zwróć rekord
 *
 * Kompatybilność: klient nadal zapisuje wynik do localStorage (`saveOrder`).
 */

export async function GET() {
  return NextResponse.json({
    orders: [],
    total: 0,
    meta: {
      source: "client-localStorage",
      storageKey: "akwen-b2b-orders",
      note:
        "Lista zamówień jest w przeglądarce (localStorage). Użyj GET tylko jako health-check API; pełna lista = klient.",
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateOrderInput;

    if (!body?.items?.length) {
      return NextResponse.json(
        { error: "Koszyk jest pusty — dodaj produkty." },
        { status: 400 }
      );
    }
    if (!body.customerId || !body.companyName) {
      return NextResponse.json(
        { error: "Brak danych klienta." },
        { status: 400 }
      );
    }
    if (!body.deliveryDate || !body.deliveryAddress?.trim()) {
      return NextResponse.json(
        { error: "Data i adres dostawy są wymagane." },
        { status: 400 }
      );
    }

    // createOrder na serwerze: bez localStorage — numer z pustej listy = …-001
    // Klient po zapisie ma pełną historię; unikalność id = UUID.
    const order = createOrder({
      items: body.items,
      customerId: body.customerId,
      companyName: body.companyName,
      discountPercent: body.discountPercent ?? 0,
      deliveryDate: body.deliveryDate,
      deliveryAddress: body.deliveryAddress,
      notes: body.notes ?? "",
    });

    return NextResponse.json(
      {
        order,
        meta: {
          source: "mock-api",
          persistHint: "Zapisz order w localStorage po stronie klienta (saveOrder).",
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Nie udało się utworzyć zamówienia." },
      { status: 500 }
    );
  }
}
