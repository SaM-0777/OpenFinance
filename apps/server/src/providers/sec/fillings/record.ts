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
    const holdings = await getSECHoldings(cik);
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
        optionType: h.optionType ?? "",
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
            HoldingSchema.optionType,
            HoldingSchema.otherManager,
            HoldingSchema.votingAuthoritySole,
            HoldingSchema.votingAuthoritySole,
            HoldingSchema.votingAuthorityShared,
            HoldingSchema.votingAuthorityNone,
          ],
          set: {
            issuer: sql`excluded.issuer`,
            securityClass: sql`excluded.security_class`,
            value: sql`excluded.value`,
            shares: sql`excluded.shares`,
            shareType: sql`excluded.share_type`,
            optionType: sql`excluded.option_type`,
            investmentDiscretion: sql`excluded.investment_discretion`,
            otherManager: sql`excluded.other_manager`,
            votingAuthoritySole: sql`excluded.voting_authority_sole`,
            votingAuthorityShared: sql`excluded.voting_authority_shared`,
            votingAuthorityNone: sql`excluded.voting_authority_none`,
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
