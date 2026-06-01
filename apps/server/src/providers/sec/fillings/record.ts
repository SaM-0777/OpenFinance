import { db, HoldingSchema, InferInsertModel, sql } from "@openfinance/shared";
import { getSECHoldings } from "./data";

export async function recordSecCompanyHolding({
  cik,
  link,
}: {
  cik: string;
  link: string;
}) {
  try {
    const holdings = await getSECHoldings(link);
    const dbRecord: InferInsertModel<typeof HoldingSchema>[] = [];

    for (const h of holdings) {
      dbRecord.push({
        cik,
        issuer: h.issuer,
        cusip: h.cusip,
        securityClass: h.titleOfClass,
        value: h.value,
        shares: h.shares,
        reportPeriod: new Date(h.reportPeriod),
        filingDate: new Date(h.filingDate),
        shareType: h.shareType,
        optionType: h.optionType,
        investmentDiscretion: h.investmentDiscretion,
      });
    }

    if (dbRecord.length) {
      await db
        .insert(HoldingSchema)
        .values(dbRecord)
        .onConflictDoUpdate({
          target: [
            HoldingSchema.cik,
            HoldingSchema.cusip,
            HoldingSchema.filingDate,
            HoldingSchema.investmentDiscretion,
          ],
          set: {
            issuer: sql`excluded.issuer`,
            securityClass: sql`excluded.security_class`,
            shares: sql`excluded.shares`,
            value: sql`excluded.value`,
            shareType: sql`excluded.share_type`,
            optionType: sql`excluded.option_type`,
            investmentDiscretion: sql`excluded.investment_discretion`,
          },
        });
    }

    console.log(`Successfully batch-updated ${dbRecord.length} records`);

    return dbRecord;
  } catch (error) {
    throw new Error(
      `Failed to record SEC company holding for cik ${cik} ${String(error)}`,
    );
  }
}
