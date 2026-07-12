const CATEGORY_LABELS: Record<string, string> = {
  "Ryba Wędzona": "Ryby wędzone",
  "Konserwy rybne": "Konserwy rybne",
  "Garmażeria mrożona": "Garmażeria mrożona",
  "Filety rybne": "Filety rybne",
  "Ryba w oleju": "Ryby w oleju",
  "Ryba w sosie": "Ryby w sosie",
  "Ryba faszerowana": "Ryby faszerowane",
  "Ryby pieczone": "Ryby pieczone",
  "Dania rybne": "Dania rybne",
  "Farsz rybny": "Farsz rybny",
  "Wątrobka rybna": "Wątrobka rybna",
  "Paluszki krabowe": "Paluszki krabowe",
  "Owoce morza": "Owoce morza",
  Inne: "Inne produkty",
};

const KIND_LABELS: Record<string, string> = {
  Błękitek: "Błękitek",
  Kałamarnica: "Kałamarnica",
};

export function formatCategoryLabel(value: string): string {
  if (!value) return "";
  return CATEGORY_LABELS[value] ?? value;
}

export function formatKindLabel(value: string): string {
  if (!value) return "";
  return KIND_LABELS[value] ?? value;
}