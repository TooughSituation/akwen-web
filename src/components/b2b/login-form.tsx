"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Building2, Loader2, Lock, Mail } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface DemoAccountCard {
  email: string;
  password: string;
  companyName: string;
  contactPerson: string;
  discountPercent: number;
  label: string;
}

interface LoginFormProps {
  callbackUrl: string;
  demoAccounts: DemoAccountCard[];
}

/**
 * Formularz logowania B2B.
 * Analogia Access: Form_Logowanie z polami Login/Hasło + przyciski „szybki wybór użytkownika”.
 */
export function LoginForm({ callbackUrl, demoAccounts }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError("Nieprawidłowy e-mail lub hasło. Sprawdź dane testowe poniżej.");
        setLoading(false);
        return;
      }

      router.push(result?.url || callbackUrl || "/b2b");
      router.refresh();
    } catch {
      setError("Nie udało się zalogować. Spróbuj ponownie.");
      setLoading(false);
    }
  }

  function fillDemo(account: DemoAccountCard) {
    setEmail(account.email);
    setPassword(account.password);
    setError(null);
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <Card className="border-border/60 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="font-heading text-2xl">Zaloguj się</CardTitle>
          <CardDescription>
            Portal partnerów handlowych Akwen — użyj konta testowego lub
            wpisz e-mail i hasło.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">E-mail firmowy</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="username"
                  placeholder="np. jan@morskafala.pl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Hasło</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-turquoise-500 hover:bg-turquoise-600"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Logowanie…
                </>
              ) : (
                "Zaloguj do portalu"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <p className="text-center text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Konta demo (kliknij, aby wypełnić)
        </p>
        <div className="grid gap-2">
          {demoAccounts.map((account) => (
            <button
              key={account.email}
              type="button"
              onClick={() => fillDemo(account)}
              className={cn(
                "flex w-full items-start gap-3 rounded-lg border border-border bg-card p-3 text-left transition-colors",
                "hover:border-turquoise-500/40 hover:bg-turquoise-500/5"
              )}
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-navy-900 text-sm font-semibold text-white">
                {account.companyName.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-medium text-foreground">
                    {account.companyName}
                  </p>
                  <Badge className="bg-turquoise-500/15 text-turquoise-700">
                    −{account.discountPercent}%
                  </Badge>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {account.contactPerson} · {account.email}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Building2 className="size-3" />
                  {account.label} · hasło:{" "}
                  <code className="rounded bg-muted px-1">{account.password}</code>
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
