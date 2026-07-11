export const assets = {
  logo: "/images/logo.png",
  logoWhite: "/images/logo-white.png",
  hero: "/images/bg-hero.jpg",
  map: "/images/mapka.png",
  bgMap: "/images/bg-map.jpg",
  partnerLogos: [
    "/images/loga-1.png",
    "/images/loga-2.png",
    "/images/loga-3.png",
  ],
  ornaments: {
    up: "/images/ornament-up.png",
    down: "/images/ornament-down.png",
  },
  lithuanianProducts: "/images/oferta_litewskie.png",
  awards: {
    gazela: "/images/gazele-biznesu.png",
    kpo: "/images/pcdr.png",
    poRyby: "/images/po-ryby.png",
  },
  euLogos: {
    ue: "/images/loga-ue.png",
    kpo: "/images/logo-kpo.png",
    poRyby: "/images/po-ryby.png",
  },
} as const;

export const company = {
  name: "AKWEN Sp. z o.o.",
  heroTitle: "Morskie opowieści",
  heroSubtitle:
    "Dzięki nam świeże, pyszne ryby z całego świata trafiają na Twój stół.",
  slogan:
    "Dzięki nam świeże, pyszne ryby z całego świata trafiają na Twój stół.",
  b2bUrl: "https://b2b.akwen.bialystok.pl",
  b2bNote: "wkrótce dostępna dla naszych partnerów handlowych",
  address: {
    street: "ul. Tkacka 9",
    city: "15-689 Białystok",
  },
  nip: "9662218719",
  krs: "0001226345",
  contact: {
    mobile: "+48 608 313 868",
    tel1: "+48 85 66 41 041",
    tel2: "+48 85 66 41 061",
    office: "+48 530 955 123",
    email: "handel@akwen.bialystok.pl",
  },
};

export const aboutText = {
  headline:
    "Na morzach i oceanach całego świata wypatrujemy dla Ciebie najlepszych ryb",
  since: "AKWEN kontynuuje działalność w branży rybnej od 1991 roku.",
  paragraphs: [
    "Zajmujemy się dystrybucją ryb i przetworów rybnych na terenie północno-wschodniej Polski oraz części województwa mazowieckiego. Bezpośrednio współpracujemy z czołowymi producentami ryb wędzonych, przetworów i konserw rybnych oraz importerami ryb mrożonych. Dystrybuujemy także produkty rybne lokalnych producentów.",
    "Specjalizujemy się w dostarczaniu na rynek polski wyrobów rybnych wiodących producentów litewskich.",
    "Należymy do Polskiej Grupy Rybnej (PGR). W ramach grupy promujemy własną markę BMC, pod którą oferujemy konserwy rybne, łososia w plasterkach oraz słoiki ze szprotkami.",
    "Zostaliśmy wyróżnieni w 2011 roku jako Gazela Biznesu przez Puls Biznesu oraz w 2015 roku tytułem Orła Dystrybucji FMCG 2014–2015 przyznawanym przez magazyn Życie Handlowe.",
    "Aktualnie realizujemy projekt dofinansowany w ramach Krajowego Planu Odbudowy (KPO) – działanie 2: Tworzenie centrów przechowalniczo-dystrybucyjnych produktów rolnych, rybołówstwa i akwakultury.",
  ],
  poRyby:
    "W 2014 roku, korzystając z pomocy unijnej w ramach PO RYBY 2007-2013, zakończyliśmy realizację operacji budowy budynku wraz z zapleczem socjalno-biurowym związanego z hurtowym obrotem produktami rybnymi oraz zakup niezbędnych urządzeń i specjalistycznych środków transportu chłodniczego.",
  coverage:
    "Nasi przedstawiciele handlowi docierają do odbiorców w północno-wschodniej Polsce. Dostarczamy ryby do odbiorców z Polski i Litwy. Zapraszamy do współpracy partnerów z całej Polski.",
};

export const offerCategories = [
  {
    title: "Ryby mrożone",
    description:
      "Szeroki asortyment ryb mrożonych od czołowych importerów. Stała dostępność i pełna kontrola łańcucha chłodniczego.",
    icon: "snowflake" as const,
    image: "/images/oferta_mrozone.jpg",
  },
  {
    title: "Ryby wędzone",
    description:
      "Produkty od renomowanych wędzarni – klasyka smaku i najwyższa jakość wędzenia.",
    icon: "flame" as const,
    image: "/images/oferta_wedzone.jpg",
  },
  {
    title: "Konserwy",
    description:
      "Konserwy rybne własnej marki BMC oraz produktów partnerskich – gotowe do sprzedaży detalicznej i hurtowej.",
    icon: "package" as const,
    image: "/images/oferta_konserwy.jpg",
  },
  {
    title: "Przetwory rybne",
    description:
      "Szeroki wybór przetworów rybnych od lokalnych i międzynarodowych producentów.",
    icon: "fish" as const,
    image: "/images/oferta_przetwory.jpg",
  },
];

export const lithuanianBrands = [
  {
    name: "Dauparų žuvis",
    description:
      "Wyłączny dystrybutor na rynku polskim. Tradycyjne litewskie wyroby rybne najwyższej jakości.",
    role: "Wyłączny dystrybutor",
  },
  {
    name: "Norvelita",
    description:
      "Wyłączny dystrybutor produktów renomowanego litewskiego producenta przetworów rybnych.",
    role: "Wyłączny dystrybutor",
  },
  {
    name: "Vičiūnai Group",
    description:
      "Jeden z największych producentów ryb mrożonych w regionie bałtyckim. Szeroka gama produktów.",
    role: "Dystrybutor",
  },
  {
    name: "ICECO žuvis",
    description:
      "Nowoczesne przetwory rybne z Litwy – świeżość i jakość w każdym produkcie.",
    role: "Dystrybutor",
  },
];

export const lithuanianIntro =
  "Jesteśmy wyłącznym dystrybutorem produktów litewskich firm Dauparų žuvis i Norvelita. Dystrybuujemy również produkty Vičiūnai Group oraz ICECO žuvis.";

export const awards = [
  {
    label: "Gazela Biznesu 2011 – Puls Biznesu",
    image: assets.awards.gazela,
    alt: "Gazela Biznesu 2011",
  },
  {
    label: "Orzeł Dystrybucji FMCG 2014–2015 – Życie Handlowe",
    image: assets.awards.gazela,
    alt: "Orzeł Dystrybucji FMCG",
  },
  {
    label: "KPO – Krajowy Plan Odbudowy",
    image: assets.awards.kpo,
    alt: "Krajowy Plan Odbudowy",
  },
  {
    label: "PO RYBY 2007–2013",
    image: assets.awards.poRyby,
    alt: "PO RYBY 2007-2013",
  },
];