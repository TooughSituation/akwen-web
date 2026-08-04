import type { Metadata } from "next";
import { Inter, Playfair_Display, Montserrat } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

/**
 * Typografia 2026 (quiet luxury + morski charakter):
 *  - Body: Inter — czytelny UI, latin-ext
 *  - Nagłówki: Playfair Display — elegancja marki (zamiast Satoshi: bardziej „premium food”)
 *  - Display / etykiety: Montserrat — uppercase labels, tracking
 */
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Akwen – Dystrybutor ryb z Białegostoku od 1991 roku",
  description:
    "AKWEN Sp. z o.o. – dystrybucja ryb i przetworów rybnych. Produkty litewskie, marka BMC, PGR. Białystok, północno-wschodnia Polska.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} ${montserrat.variable} min-h-screen antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}