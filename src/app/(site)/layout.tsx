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
      {/* FundingLogos absolute nad treścią — hero / page header prześwieca pod belką */}
      <div className="relative flex-1">
        <FundingLogos />
        <main>{children}</main>
      </div>
      <Footer />
    </div>
  );
}
