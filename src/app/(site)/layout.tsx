import { Header } from "@/components/header";
import { FundingLogos } from "@/components/funding-logos";
import { Footer } from "@/components/footer";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <FundingLogos />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}