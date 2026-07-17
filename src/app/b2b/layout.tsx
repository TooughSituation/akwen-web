import { B2BSessionProvider } from "@/components/b2b/session-provider";
import { B2BProviders } from "@/components/b2b/b2b-providers";

export const metadata = {
  title: "Portal B2B – Akwen",
  description: "Platforma hurtowa dla partnerów handlowych Akwen",
};

/**
 * Layout root B2B — sesja + konteksty (koszyk/profil).
 * Sidebar jest tylko w grupie (portal), nie na /login.
 */
export default function B2BLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <B2BSessionProvider>
      <B2BProviders>{children}</B2BProviders>
    </B2BSessionProvider>
  );
}
