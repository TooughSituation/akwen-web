import { B2BHeader } from "@/components/b2b/b2b-header";
import { SmokeTestPanel } from "@/components/b2b/smoke-test-panel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function B2BSmokePage() {
  return (
    <>
      <B2BHeader
        title="Smoke test"
        description="Etap 3 — szybka weryfikacja API, rabatu i wyszukiwania"
      />
      <div className="space-y-6 p-6">
        <SmokeTestPanel />

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Ręczna checklista UI</CardTitle>
            <CardDescription>
              Kroki „jak użytkownik” — pełna lista w{" "}
              <code className="text-xs">docs/E2E_SMOKE.md</code>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
              <li>
                Header → wpisz „łosoś” → wybierz podpowiedź lub Enter → katalog z{" "}
                <code className="text-xs">?q=</code>
              </li>
              <li>
                Karta produktu: cena katalogowa przekreślona, po rabacie
                pogrubiona, oszczędność −5%
              </li>
              <li>Dodaj do koszyka → suma z rabatem → złóż zamówienie</li>
              <li>Zamówienia → szczegóły → Zamów ponownie (bez double discount)</li>
              <li>Moje dane → zapisz profil (PUT /api/profile + localStorage)</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
