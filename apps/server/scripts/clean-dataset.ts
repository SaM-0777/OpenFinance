import fs from "fs";
import Papa from "papaparse";

interface Row {
  symbol: string;
  name: string;
  summary?: string;
  currency?: string;
  sector?: string;
  industry_group?: string;
  industry?: string;
  exchange?: string;
  mic?: string;
  market?: string;
  country?: string;
  state?: string;
  city?: string;
  zipcode?: string;
  website?: string;
  market_cap?: string | number;
  isin?: string;
  cusip: string;
  figi?: string;
  composite_figi?: string;
  shareclass_figi?: string;
  [key: string]: any;
}

const inputFile = "/Users/sam/Desktop/projects/equities.csv";
const outputFile = "/Users/sam/Desktop/projects/openfinance/apps/server/dataset/cleaned_us_equities.csv";

const fileContent = fs.readFileSync(inputFile, "utf8");

Papa.parse<Row>(fileContent, {
  header: true,
  skipEmptyLines: true,
  dynamicTyping: false,
  complete: (results) => {
    let data: Row[] = results.data;
    console.log(`Original rows: ${data.length.toLocaleString()}`);

    data = data.filter((row) => {
      const cusip = (row.cusip || "").toString().trim();
      return cusip !== "" && cusip !== "null" && cusip !== "undefined";
    });

    console.log(`After removing empty CUSIP: ${data.length.toLocaleString()}`);

    // remove symbols containing
    data = data.filter((row) => {
      const symbol = (row.symbol || "").toString().trim();
      return !/[.-]/.test(symbol);
    });

    console.log(
      `After removing symbols with '.' or '-': ${data.length.toLocaleString()}`,
    );

    data = data.map((row) => ({
      ...row,
      symbol: (row.symbol || "").toString().trim(),
      cusip: (row.cusip || "").toString().trim().toUpperCase(), // CUSIPs are uppercase
      name: (row.name || "").toString().trim(),
    }));

    // remove exact duplicates based on symbol + cusip
    const seen = new Set<string>();
    data = data.filter((row) => {
      const key = `${row.symbol}|${row.cusip}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    console.log(`Final cleaned rows: ${data.length.toLocaleString()}`);

    // convert back to CSV and save
    const csv = Papa.unparse(data, {
      quotes: true,
      delimiter: ",",
    });

    fs.writeFileSync(outputFile, csv);
    console.log(`✅ Cleaned dataset saved as: ${outputFile}`);
  },
  error: (error: Error) => {
    console.error("❌ Parsing error:", error);
  },
});
