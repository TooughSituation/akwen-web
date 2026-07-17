import { B2BSidebar } from "@/components/b2b/sidebar";
import { B2BMobileNav } from "@/components/b2b/mobile-nav";

/** Chroniony portal z menu bocznym (jak główne menu po zalogowaniu w Access). */
export default function B2BPortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <B2BSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <B2BMobileNav />
        {children}
      </div>
    </div>
  );
}
