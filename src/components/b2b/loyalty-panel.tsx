"use client";

import { useState } from "react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import {
  Gift,
  History,
  Sparkles,
  Star,
  Tag,
  Package,
  Shirt,
} from "lucide-react";
import { useLoyalty } from "@/contexts/loyalty-context";
import {
  getRewardCategoryLabel,
  LOYALTY_REWARDS,
  PLN_PER_POINT,
} from "@/lib/b2b/loyalty";
import type { LoyaltyReward, LoyaltyRewardCategory } from "@/lib/b2b/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const CATEGORY_ICON: Record<LoyaltyRewardCategory, typeof Gift> = {
  discount: Tag,
  product: Package,
  gadget: Shirt,
};

/**
 * Panel lojalnościowy w „Moje dane”.
 * Analogia Excel: widok salda z arkusza Punkty + tabela Nagrody + Wymiany.
 */
export function LoyaltyPanel() {
  const { account, balance, isHydrated, redeem } = useLoyalty();
  const [selected, setSelected] = useState<LoyaltyReward | null>(null);
  const [message, setMessage] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);
  const [busy, setBusy] = useState(false);

  function handleConfirmRedeem() {
    if (!selected) return;
    setBusy(true);
    const result = redeem(selected.id);
    setBusy(false);
    setSelected(null);

    if (result.ok) {
      setMessage({
        type: "ok",
        text: `Wymieniono ${selected.pointsCost} pkt na „${selected.name}”. Handlowiec Akwen skontaktuje się w sprawie realizacji.`,
      });
    } else {
      setMessage({ type: "err", text: result.error });
    }
  }

  if (!isHydrated) {
    return (
      <Card className="border-border/60">
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          Ładowanie punktów…
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <Alert
          variant={message.type === "err" ? "destructive" : "default"}
          className={
            message.type === "ok"
              ? "border-turquoise-500/30 bg-turquoise-500/10"
              : undefined
          }
        >
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Saldo */}
      <Card className="border-turquoise-500/30 bg-gradient-to-br from-turquoise-500/10 to-transparent">
        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
          <div>
            <CardDescription>Program lojalnościowy Akwen</CardDescription>
            <CardTitle className="mt-1 flex items-center gap-2 text-2xl">
              <Star className="size-6 text-turquoise-600" />
              Masz {balance}{" "}
              {balance === 1 ? "punkt" : balance < 5 ? "punkty" : "punktów"}
            </CardTitle>
          </div>
          <Badge className="bg-turquoise-500/15 text-turquoise-700">
            1 pkt / {PLN_PER_POINT} zł netto
          </Badge>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Punkty naliczane automatycznie przy składaniu zamówienia (kwota netto
          po rabacie). Wymiana nagród jest rejestrowana i realizowana przez
          handlowca.
        </CardContent>
      </Card>

      {/* Katalog nagród */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Gift className="size-5 text-turquoise-600" />
          <h2 className="font-heading text-lg font-semibold">Katalog nagród</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {LOYALTY_REWARDS.map((reward) => {
            const Icon = CATEGORY_ICON[reward.category];
            const canAfford = balance >= reward.pointsCost;
            return (
              <Card
                key={reward.id}
                className={cn(
                  "border-border/60",
                  !canAfford && "opacity-80"
                )}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="secondary" className="text-[10px]">
                      <Icon className="mr-1 size-3" />
                      {getRewardCategoryLabel(reward.category)}
                    </Badge>
                    <span className="text-sm font-bold text-turquoise-700 dark:text-turquoise-400">
                      {reward.pointsCost} pkt
                    </span>
                  </div>
                  <CardTitle className="mt-2 text-base leading-snug">
                    {reward.name}
                  </CardTitle>
                  <CardDescription className="text-xs leading-relaxed">
                    {reward.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    size="sm"
                    className="w-full bg-turquoise-500 hover:bg-turquoise-600"
                    disabled={!canAfford}
                    onClick={() => setSelected(reward)}
                  >
                    {canAfford ? "Wymień" : "Za mało punktów"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Historia wymian */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="size-4 text-turquoise-600" />
            Historia wymian
          </CardTitle>
          <CardDescription>
            Zgłoszenia nagród (arkusz „Wymiany”)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {account.redemptions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Brak wymian. Zbieraj punkty przy zamówieniach i wybierz nagrodę z
              katalogu.
            </p>
          ) : (
            <ul className="space-y-2">
              {account.redemptions.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-2 text-sm last:border-0"
                >
                  <div>
                    <p className="font-medium">{item.rewardName}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(item.createdAt), "d MMM yyyy, HH:mm", {
                        locale: pl,
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-coral-600">
                      −{item.pointsSpent} pkt
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                      {item.status === "requested"
                        ? "Zgłoszone"
                        : item.status === "fulfilled"
                          ? "Zrealizowane"
                          : "Anulowane"}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Ostatnie ruchy punktów */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="size-4 text-turquoise-600" />
            Historia punktów
          </CardTitle>
          <CardDescription>
            Naliczenia i wymiany (arkusz „Punkty”)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {account.ledger.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Brak ruchów. Złóż zamówienie — punkty pojawią się automatycznie.
            </p>
          ) : (
            <ul className="max-h-64 space-y-2 overflow-y-auto">
              {account.ledger.slice(0, 20).map((entry) => (
                <li
                  key={entry.id}
                  className="flex justify-between gap-3 border-b border-border/40 pb-2 text-sm last:border-0"
                >
                  <div className="min-w-0">
                    <p className="line-clamp-1 font-medium">
                      {entry.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(entry.createdAt), "d MMM yyyy, HH:mm", {
                        locale: pl,
                      })}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 font-semibold",
                      entry.points > 0
                        ? "text-turquoise-700 dark:text-turquoise-400"
                        : "text-coral-600"
                    )}
                  >
                    {entry.points > 0 ? "+" : ""}
                    {entry.points} pkt
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(selected)}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Potwierdź wymianę</DialogTitle>
            <DialogDescription>
              {selected
                ? `Odejmiemy ${selected.pointsCost} pkt z konta (zostanie ${Math.max(0, balance - selected.pointsCost)} pkt).`
                : ""}
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
              <p className="font-medium">{selected.name}</p>
              <p className="mt-1 text-muted-foreground">
                {selected.description}
              </p>
              <p className="mt-2 font-semibold text-turquoise-700">
                Koszt: {selected.pointsCost} pkt
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSelected(null)}
              disabled={busy}
            >
              Anuluj
            </Button>
            <Button
              type="button"
              className="bg-turquoise-500 hover:bg-turquoise-600"
              onClick={handleConfirmRedeem}
              disabled={busy}
            >
              {busy ? "Wymieniam…" : "Potwierdź wymianę"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
