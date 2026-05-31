import {
  type InferInsertModel,
  db,
  CompanySchema,
  sql,
} from "@openfinance/shared";
import { getSECFillings } from "./data";

export async function recordSecCompanies() {
  try {
    const companies = await getSECFillings({ count: 40 });
    const dbRecord: InferInsertModel<typeof CompanySchema>[] = [];

    for (const c of companies) {
      dbRecord.push({
        name: c.fundName,
        manager: c.managerName || "N/A",
        cik: c.cik,
        link: c.link,
        updatedAt: c.filingDate ? new Date(c.filingDate) : undefined,
      });
    }

    const uniqueDBRecords = Array.from(
      new Map(dbRecord.map((record) => [record.cik, record])).values(),
    );

    if (uniqueDBRecords.length) {
      await db
        .insert(CompanySchema)
        .values(uniqueDBRecords)
        .onConflictDoUpdate({
          target: CompanySchema.cik,
          set: {
            name: sql`excluded.name`,
            manager: sql`excluded.manager`,
            link: sql`excluded.link`,
            updatedAt: sql`excluded.updated_at`,
          },
        });
    }

    console.log(`Successfully batch-updated ${dbRecord.length} records`);

    return dbRecord;
  } catch (error) {
    throw new Error(`Failed to record SEC companies ${String(error)}`);
  }
}
