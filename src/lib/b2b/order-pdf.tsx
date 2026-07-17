/**
 * PDF potwierdzenia zamówienia — jak „Drukuj / Eksportuj do PDF” w Access/VBA.
 * Biblioteka: @react-pdf/renderer (generuje plik w przeglądarce, bez serwera).
 */

import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { B2BOrder } from "./types";
import { formatPrice } from "./format";

// Font z polskimi znakami (Helvetica ich nie ma — jak brak Unicode w starym Excelu)
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: 400,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: 700,
    },
  ],
});

const navy = "#001F3F";
const turquoise = "#0077B6";
const muted = "#64748b";
const border = "#e2e8f0";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
    fontSize: 10,
    paddingTop: 40,
    paddingBottom: 48,
    paddingHorizontal: 40,
    color: navy,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: turquoise,
    paddingBottom: 12,
  },
  brand: {
    fontSize: 18,
    fontWeight: 700,
    color: navy,
  },
  brandSub: {
    fontSize: 9,
    color: turquoise,
    marginTop: 4,
  },
  orderMeta: {
    textAlign: "right",
  },
  orderNumber: {
    fontSize: 12,
    fontWeight: 700,
    color: turquoise,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 6,
    marginTop: 14,
    color: navy,
  },
  row: {
    flexDirection: "row",
    marginBottom: 3,
  },
  label: {
    width: 110,
    color: muted,
  },
  value: {
    flex: 1,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderBottomWidth: 1,
    borderBottomColor: border,
    paddingVertical: 6,
    paddingHorizontal: 4,
    marginTop: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: border,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  colName: { width: "42%" },
  colSym: { width: "16%" },
  colQty: { width: "12%", textAlign: "right" },
  colPrice: { width: "15%", textAlign: "right" },
  colTotal: { width: "15%", textAlign: "right" },
  th: { fontWeight: 700, fontSize: 9, color: muted },
  totals: {
    marginTop: 12,
    alignItems: "flex-end",
  },
  totalLine: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 3,
    minWidth: 220,
  },
  totalLabel: {
    width: 130,
    textAlign: "right",
    color: muted,
    marginRight: 12,
  },
  totalValue: {
    width: 80,
    textAlign: "right",
    fontWeight: 700,
  },
  grandTotal: {
    marginTop: 4,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: navy,
  },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 40,
    right: 40,
    fontSize: 8,
    color: muted,
    borderTopWidth: 1,
    borderTopColor: border,
    paddingTop: 8,
  },
  notes: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#f8fafc",
    borderRadius: 4,
  },
});

function formatDatePl(isoOrYmd: string): string {
  try {
    const d = isoOrYmd.includes("T")
      ? new Date(isoOrYmd)
      : new Date(`${isoOrYmd}T12:00:00`);
    return d.toLocaleDateString("pl-PL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return isoOrYmd;
  }
}

function formatDateTimePl(iso: string): string {
  try {
    return new Date(iso).toLocaleString("pl-PL", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export interface OrderPdfProps {
  order: B2BOrder;
  customerEmail?: string;
  contactPerson?: string;
}

export function OrderPdfDocument({
  order,
  customerEmail,
  contactPerson,
}: OrderPdfProps) {
  const listTotal = order.items.reduce((sum, item) => {
    const list = item.listPriceNet ?? item.priceNet;
    return sum + list * item.quantity;
  }, 0);

  return (
    <Document
      title={`Zamówienie ${order.orderNumber}`}
      author="AKWEN Sp. z o.o."
      subject="Potwierdzenie zamówienia hurtowego B2B"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.brand}>AKWEN Sp. z o.o.</Text>
            <Text style={styles.brandSub}>
              Portal hurtowy B2B · Dystrybucja ryb i przetworów
            </Text>
            <Text style={{ fontSize: 8, color: muted, marginTop: 4 }}>
              Białystok · www.akwen.bialystok.pl
            </Text>
          </View>
          <View style={styles.orderMeta}>
            <Text style={styles.orderNumber}>{order.orderNumber}</Text>
            <Text style={{ fontSize: 9, color: muted, marginTop: 4 }}>
              Potwierdzenie zamówienia
            </Text>
            <Text style={{ fontSize: 9, marginTop: 2 }}>
              Złożono: {formatDateTimePl(order.createdAt)}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Dane klienta</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Firma</Text>
          <Text style={styles.value}>{order.companyName}</Text>
        </View>
        {contactPerson ? (
          <View style={styles.row}>
            <Text style={styles.label}>Osoba kontaktowa</Text>
            <Text style={styles.value}>{contactPerson}</Text>
          </View>
        ) : null}
        {customerEmail ? (
          <View style={styles.row}>
            <Text style={styles.label}>E-mail</Text>
            <Text style={styles.value}>{customerEmail}</Text>
          </View>
        ) : null}
        <View style={styles.row}>
          <Text style={styles.label}>ID klienta</Text>
          <Text style={styles.value}>{order.customerId}</Text>
        </View>

        <Text style={styles.sectionTitle}>Dostawa</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Data dostawy</Text>
          <Text style={styles.value}>{formatDatePl(order.deliveryDate)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Adres</Text>
          <Text style={styles.value}>{order.deliveryAddress}</Text>
        </View>
        {order.notes ? (
          <View style={styles.notes}>
            <Text style={{ fontWeight: 700, marginBottom: 2 }}>Uwagi</Text>
            <Text>{order.notes}</Text>
          </View>
        ) : null}

        <Text style={styles.sectionTitle}>Pozycje zamówienia (netto)</Text>
        {order.discountPercent > 0 ? (
          <Text style={{ fontSize: 9, color: turquoise, marginBottom: 4 }}>
            Rabat handlowy klienta: −{order.discountPercent}%
          </Text>
        ) : null}

        <View style={styles.tableHeader}>
          <Text style={[styles.colName, styles.th]}>Produkt</Text>
          <Text style={[styles.colSym, styles.th]}>Symbol</Text>
          <Text style={[styles.colQty, styles.th]}>Ilość</Text>
          <Text style={[styles.colPrice, styles.th]}>Cena jedn.</Text>
          <Text style={[styles.colTotal, styles.th]}>Suma</Text>
        </View>

        {order.items.map((item) => (
          <View key={item.productId} style={styles.tableRow} wrap={false}>
            <Text style={styles.colName}>{item.name}</Text>
            <Text style={styles.colSym}>{item.symbol}</Text>
            <Text style={styles.colQty}>
              {item.quantity} {item.unit}
            </Text>
            <Text style={styles.colPrice}>{formatPrice(item.priceNet)}</Text>
            <Text style={styles.colTotal}>{formatPrice(item.lineTotal)}</Text>
          </View>
        ))}

        <View style={styles.totals}>
          {order.discountPercent > 0 && listTotal > order.totalNet ? (
            <View style={styles.totalLine}>
              <Text style={styles.totalLabel}>Wartość katalogowa</Text>
              <Text style={[styles.totalValue, { fontWeight: 400 }]}>
                {formatPrice(listTotal)}
              </Text>
            </View>
          ) : null}
          {order.discountPercent > 0 && listTotal > order.totalNet ? (
            <View style={styles.totalLine}>
              <Text style={styles.totalLabel}>
                Rabat −{order.discountPercent}%
              </Text>
              <Text style={[styles.totalValue, { fontWeight: 400 }]}>
                −{formatPrice(listTotal - order.totalNet)}
              </Text>
            </View>
          ) : null}
          <View style={[styles.totalLine, styles.grandTotal]}>
            <Text style={[styles.totalLabel, { color: navy, fontWeight: 700 }]}>
              Razem netto
            </Text>
            <Text style={styles.totalValue}>{formatPrice(order.totalNet)}</Text>
          </View>
          {(order.loyaltyPointsEarned ?? 0) > 0 ? (
            <View style={styles.totalLine}>
              <Text style={styles.totalLabel}>Punkty lojalnościowe</Text>
              <Text style={[styles.totalValue, { fontWeight: 400 }]}>
                +{order.loyaltyPointsEarned} pkt
              </Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.footer}>
          Dokument wygenerowany automatycznie z portalu B2B Akwen ·{" "}
          {order.orderNumber} · ceny netto bez VAT · nie stanowi faktury VAT ·
          w razie pytań skontaktuj się z handlowcem Akwen.
        </Text>
      </Page>
    </Document>
  );
}
