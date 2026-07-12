import { B2BSidebar } from "@/components/b2b/sidebar";
import { B2BMobileNav } from "@/components/b2b/mobile-nav";
import { B2BProviders } from "@/components/b2b/b2b-providers";

export const metadata = {
  title: "Portal B2B – Akwen",
  description: "Platforma hurtowa dla partnerów handlowych Akwen",
};

export default function B2BLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <B2BProviders>
      <div className="flex min-h-screen bg-muted/30">
        <B2BSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <B2BMobileNav />
          {children}
        </div>
      </div>
    </B2BProviders>
  );
}