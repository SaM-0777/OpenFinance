import fs from "fs/promises";
import Papa from "papaparse";

import {
  db,
  AssetSchema,
  type InferInsertModel,
  sql,
} from "@openfinance/shared";

type EquityCsvRow = {
  symbol: string;
  name: string;
  summary: string;
  currency: string;
  sector: string;
  industry_group: string;
  industry: string;
  exchange: string;
  mic: string;
  market: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  website: string;
  market_cap: string;
  isin: string;
  cusip: string;
};

export async function seedAssets(csvFilePath: string) {
  try {
    const csv = await fs.readFile(csvFilePath, "utf8");

    const parsed = Papa.parse<EquityCsvRow>(csv, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
    });

    if (parsed.errors.length) {
      throw new Error(parsed.errors.map((e) => e.message).join(", "));
    }

    const records: InferInsertModel<typeof AssetSchema>[] = parsed.data.map(
      (row) => ({
        ticker: row.symbol?.trim(),
        cusip: String(row.cusip?.trim() || ""),
        name: row.name?.trim() ?? "",
        summary: row.summary?.trim() || null,
        currency: row.currency?.trim() || null,
        sector: row.sector?.trim() || null,
        industryGroup: row.industry_group?.trim() || null,
        industry: row.industry?.trim() || null,
        exchange: row.exchange?.trim() || null,
        mic: row.mic?.trim() || null,
        market: row.market?.trim() || null,
        country: row.country?.trim() || null,
        state: row.state?.trim() || null,
        city: row.city?.trim() || null,
        zipCode: row.zipcode?.trim() || null,
        website: row.website?.trim() || null,
        marketCap: row.market_cap ? Number(row.market_cap) : null,
        isin: String(row.isin?.trim() || null),
      }),
    );

    const seenTickers = new Set<string>();
    const seenCusips = new Set<string>();

    const BATCH_SIZE = 1000;

    const uniqueRecords = records.filter((record) => {
      const ticker = record.ticker ?? "";
      const cusip = record.cusip ?? "";

      if (
        (ticker && seenTickers.has(ticker)) ||
        (cusip && seenCusips.has(cusip))
      ) {
        return false;
      }

      if (ticker) {
        seenTickers.add(ticker);
      }

      if (cusip) {
        seenCusips.add(cusip);
      }

      return true;
    });

    for (let i = 0; i < uniqueRecords.length; i += BATCH_SIZE) {
      const batch = uniqueRecords.slice(i, i + BATCH_SIZE);

      await db
        .insert(AssetSchema)
        .values(batch)
        .onConflictDoUpdate({
          target: [AssetSchema.cusip],
          set: {
            name: sql`excluded.name`,
            summary: sql`excluded.summary`,
            currency: sql`excluded.currency`,
            sector: sql`excluded.sector`,
            industryGroup: sql`excluded.industry_group`,
            industry: sql`excluded.industry`,
            exchange: sql`excluded.exchange`,
            mic: sql`excluded.mic`,
            market: sql`excluded.market`,
            country: sql`excluded.country`,
            state: sql`excluded.state`,
            city: sql`excluded.city`,
            zipCode: sql`excluded.zip_code`,
            website: sql`excluded.website`,
            isin: sql`excluded.isin`,
            cusip: sql`excluded.cusip`,
            updatedAt: sql`now()`,
          },
        });

      console.log(
        `Processed ${Math.min(
          i + BATCH_SIZE,
          records.length,
        )}/${records.length}`,
      );
    }

    console.log(`Successfully imported ${records.length} assets`);

    return records.length;
  } catch (error) {
    console.error({
      //name: error?.name,
      message: error?.message,
      cause: error?.cause,
      //stack: error?.stack,
    });
    throw new Error(`Failed to seed assets`);
  }
}

await seedAssets("./dataset/cleaned_us_equities.csv");
