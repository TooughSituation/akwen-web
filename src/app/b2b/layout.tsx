import { B2BSidebar } from "@/components/b2b/sidebar";

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
    <div className="flex min-h-screen bg-muted/30">
      <B2BSidebar />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}