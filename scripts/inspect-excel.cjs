const XLSX = require("xlsx");

const wb = XLSX.readFile("public/data/produkty.xlsx");
const ws = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(ws, { defval: "" });

console.log("Sheets:", wb.SheetNames);
console.log("Rows:", data.length);
console.log("Columns:", Object.keys(data[0] || {}));
console.log("Sample:", JSON.stringify(data.slice(0, 8), null, 2));