"use client";

import { useCallback, useState } from "react";
import {
  CheckCircle2,
  Circle,
  Loader2,
  Play,
  XCircle,
} from "lucide-react";
import { apiCreateOrder, apiSearchProducts, apiValidateProfile } from "@/lib/b2b/api-client";
import { applyDiscount, formatPrice } from "@/lib/b2b/format";
import { getDefaultProfile } from "@/lib/b2b/profile";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StepStatus = "idle" | "running" | "pass" | "fail";

interface SmokeStep {
  id: string;
  title: string;
  detail: string;
  status: StepStatus;
  message?: string;
}

const INITIAL_STEPS: SmokeStep[] = [
  {
    id: "api-products",
    title: "API produktów",
    detail: "GET /api/products?q=łosoś&limit=5 — jak filtr AutoFilter w Excelu",
    status: "idle",
  },
  {
    id: "api-profile",
    title: "API profilu",
    detail: "PUT /api/profile — walidacja wiersza „Dane firmy”",
    status: "idle",
  },
  {
    id: "api-orders",
    title: "API zamówień",
    detail: "POST /api/orders — makro CreateOrder + rabat",
    status: "idle",
  },
  {
    id: "discount-math",
    title: "Rabat 5%",
    detail: "applyDiscount — jak formuła =Cena*(1-5%)",
    status: "idle",
  },
  {
    id: "search-header",
    title: "Wyszukiwanie globalne",
    detail: "Header → katalog ?q= (ścieżka UI)",
    status: "idle",
  },
];

/**
 * E2E smoke — automatyczne testy kontraktów API + rabat.
 * Reszta ścieżek (UI kliknięcia) opisana w docs/E2E_SMOKE.md.
 */
export function SmokeTestPanel() {
  const [steps, setSteps] = useState<SmokeStep[]>(INITIAL_STEPS);
  const [running, setRunning] = useState(false);

  const updateStep = useCallback(
    (id: string, patch: Partial<SmokeStep>) => {
      setSteps((current) =>
        current.map((step) => (step.id === id ? { ...step, ...patch } : step))
      );
    },
    []
  );

  const runAll = useCallback(async () => {
    setRunning(true);
    setSteps(INITIAL_STEPS.map((s) => ({ ...s, status: "idle", message: undefined })));

    // 1) Products API
    updateStep("api-products", { status: "running" });
    try {
      const res = await apiSearchProducts({ q: "łosoś", limit: 5, compact: true });
      if (res.returned < 1 || res.total < 1) {
        throw new Error("Brak wyników dla „łosoś”");
      }
      updateStep("api-products", {
        status: "pass",
        message: `OK — ${res.total} trafień, zwrócono ${res.returned}`,
      });
    } catch (e) {
      updateStep("api-products", {
        status: "fail",
        message: e instanceof Error ? e.message : "Błąd",
      });
    }

    // 2) Profile API
    updateStep("api-profile", { status: "running" });
    try {
      const profile = await apiValidateProfile(getDefaultProfile());
      if (!profile.companyName || profile.discountPercent < 0) {
        throw new Error("Nieprawidłowy profil z API");
      }
      updateStep("api-profile", {
        status: "pass",
        message: `OK — ${profile.companyName}, rabat ${profile.discountPercent}%`,
      });
    } catch (e) {
      updateStep("api-profile", {
        status: "fail",
        message: e instanceof Error ? e.message : "Błąd",
      });
    }

    // 3) Orders API
    updateStep("api-orders", { status: "running" });
    try {
      const order = await apiCreateOrder({
        items: [
          {
            productId: "smoke-test",
            symbol: "SMOKE",
            name: "Produkt testowy smoke",
            unit: "szt",
            priceNet: 10,
            stock: 100,
            quantity: 2,
          },
        ],
        customerId: "smoke-customer",
        companyName: "Smoke Test Sp. z o.o.",
        discountPercent: 5,
        deliveryDate: "2030-01-15",
        deliveryAddress: "ul. Testowa 1, 15-001 Białystok",
        notes: "Automatyczny smoke test — nie realizować",
      });
      if (!order.orderNumber || order.totalNet <= 0) {
        throw new Error("Brak numeru lub sumy zamówienia");
      }
      // 10 zł * 2 * 0.95 = 19
      const expected = 19;
      if (Math.abs(order.totalNet - expected) > 0.02) {
        throw new Error(
          `Suma ${order.totalNet} ≠ oczekiwane ${expected} (rabat 5%)`
        );
      }
      updateStep("api-orders", {
        status: "pass",
        message: `OK — ${order.orderNumber}, suma ${formatPrice(order.totalNet)}`,
      });
    } catch (e) {
      updateStep("api-orders", {
        status: "fail",
        message: e instanceof Error ? e.message : "Błąd",
      });
    }

    // 4) Discount math
    updateStep("discount-math", { status: "running" });
    try {
      const unit = applyDiscount(20, 5);
      if (unit !== 19) {
        throw new Error(`applyDiscount(20,5)=${unit}, oczekiwano 19`);
      }
      updateStep("discount-math", {
        status: "pass",
        message: "OK — 20 zł −5% = 19 zł",
      });
    } catch (e) {
      updateStep("discount-math", {
        status: "fail",
        message: e instanceof Error ? e.message : "Błąd",
      });
    }

    // 5) Search path (document-level pass — link works if products API worked)
    updateStep("search-header", { status: "running" });
    try {
      const res = await apiSearchProducts({ q: "pasta", limit: 3 });
      if (res.total < 1) throw new Error("Brak past w katalogu");
      updateStep("search-header", {
        status: "pass",
        message: `OK — ścieżka /b2b/katalog?q=pasta ma sens (${res.total} wyników API)`,
      });
    } catch (e) {
      updateStep("search-header", {
        status: "fail",
        message: e instanceof Error ? e.message : "Błąd",
      });
    }

    setRunning(false);
  }, [updateStep]);

  const passed = steps.filter((s) => s.status === "pass").length;
  const failed = steps.filter((s) => s.status === "fail").length;

  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
        <div>
          <CardTitle>E2E smoke (automatyczny)</CardTitle>
          <CardDescription>
            Szybkie sprawdzenie API i rabatu — jak uruchomienie makra testowego
            na arkuszu. Pełna checklista UI:{" "}
            <code className="text-xs">docs/E2E_SMOKE.md</code>
          </CardDescription>
        </div>
        <Button
          className="bg-turquoise-500 hover:bg-turquoise-600"
          onClick={runAll}
          disabled={running}
        >
          {running ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Testuję…
            </>
          ) : (
            <>
              <Play className="size-4" />
              Uruchom smoke
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {(passed > 0 || failed > 0) && !running && (
          <p className="text-sm text-muted-foreground">
            Wynik:{" "}
            <span className="font-medium text-green-700 dark:text-green-400">
              {passed} OK
            </span>
            {failed > 0 && (
              <>
                {" · "}
                <span className="font-medium text-destructive">
                  {failed} błąd
                </span>
              </>
            )}
          </p>
        )}

        <ul className="space-y-2">
          {steps.map((step) => (
            <li
              key={step.id}
              className={cn(
                "rounded-lg border px-3 py-2.5",
                step.status === "pass" && "border-green-500/30 bg-green-500/5",
                step.status === "fail" && "border-destructive/30 bg-destructive/5",
                step.status === "running" && "border-turquoise-500/30 bg-turquoise-500/5"
              )}
            >
              <div className="flex items-start gap-2">
                <StatusIcon status={step.status} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-xs text-muted-foreground">{step.detail}</p>
                  {step.message && (
                    <p
                      className={cn(
                        "mt-1 text-xs",
                        step.status === "fail"
                          ? "text-destructive"
                          : "text-foreground"
                      )}
                    >
                      {step.message}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function StatusIcon({ status }: { status: StepStatus }) {
  if (status === "pass") {
    return <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-600" />;
  }
  if (status === "fail") {
    return <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />;
  }
  if (status === "running") {
    return (
      <Loader2 className="mt-0.5 size-4 shrink-0 animate-spin text-turquoise-600" />
    );
  }
  return <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />;
}
