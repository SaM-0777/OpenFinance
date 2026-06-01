import {
  CompanySchema,
  db,
  or,
  ilike,
  InsertCompanyValidationSchema,
  sql,
  eq,
  desc,
  and,
  HoldingSchema,
  AssetSchema,
} from "@openfinance/shared";
import { Context } from "hono";

export async function createSECCompanies(c: Context) {
  try {
    const body = await c.req.json();
    const validateBody = InsertCompanyValidationSchema.safeParse(body);
    if (!validateBody.success) {
      return c.json(
        {
          error: validateBody.error.issues,
          data: null,
        },
        400,
      );
    }

    const uniqueDBRecords = Array.from(
      new Map(validateBody.data.map((record) => [record.cik, record])).values(),
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

    return { error: null, data: uniqueDBRecords };
  } catch (error) {
    return {
      data: null,
      error: "Internal server error",
    };
  }
}

export async function getSECCompanies(search?: string) {
  try {
    const latestFilings = db.$with("latest_filings").as(
      db
        .select({
          cik: HoldingSchema.cik,
          latestFilingDate: sql<Date>`max(${HoldingSchema.filingDate})`.as(
            "latest_filing_date",
          ),
        })
        .from(HoldingSchema)
        .groupBy(HoldingSchema.cik),
    );

    const companies = await db
      .with(latestFilings)
      .select({
        id: CompanySchema.id,
        fundName: CompanySchema.name,
        managerName: CompanySchema.manager,
        cik: CompanySchema.cik,
        filingDate: latestFilings.latestFilingDate,
        holdingsCount: sql<number>`count(distinct ${HoldingSchema.cusip})`,
        portfolioValue: sql<string>`sum(${HoldingSchema.value})`,
      })
      .from(CompanySchema)
      .innerJoin(latestFilings, eq(CompanySchema.cik, latestFilings.cik))
      .innerJoin(
        HoldingSchema,
        and(
          eq(HoldingSchema.cik, CompanySchema.cik),
          eq(HoldingSchema.filingDate, latestFilings.latestFilingDate),
        ),
      )
      .where(
        search
          ? or(
              ilike(CompanySchema.cik, `%${search}%`),
              ilike(CompanySchema.name, `%${search}%`),
              ilike(CompanySchema.manager, `%${search}%`),
            )
          : undefined,
      )
      .groupBy(
        CompanySchema.id,
        CompanySchema.name,
        CompanySchema.manager,
        CompanySchema.cik,
        latestFilings.latestFilingDate,
      )
      .orderBy(
        desc(sql`sum(${HoldingSchema.value})`),
        desc(latestFilings.latestFilingDate),
      );

    return { data: companies, error: null };
  } catch (error) {
    console.error(`controller.sec.getSECCompanies.error ${String(error)}`);
    return { data: null, error: "Internal server error" };
  }
}

export async function getSECCompanyFillings(cik: string) {
  try {
    const company = await db
      .select()
      .from(CompanySchema)
      .where(and(eq(CompanySchema.cik, cik)));

    if (!company[0]) {
      throw new Error(`Company not found for cik ${cik}`);
    }

    const companyDetails = company[0];

    const filings = await db
      .select({
        cusip: HoldingSchema.cusip,
        ticker: AssetSchema.ticker,
        website: AssetSchema.website,
        issuer: HoldingSchema.issuer,
        securityClass: HoldingSchema.securityClass,
        value: HoldingSchema.value,
        shares: HoldingSchema.shares,
        sharetType: HoldingSchema.shareType,
        optionType: HoldingSchema.optionType,
        investmentDiscretion: HoldingSchema.investmentDiscretion,
        filingDate: HoldingSchema.filingDate,
        reportPeriod: HoldingSchema.reportPeriod,
      })
      .from(HoldingSchema)
      .leftJoin(AssetSchema, eq(HoldingSchema.cusip, AssetSchema.cusip))
      .where(eq(HoldingSchema.cik, cik))
      .groupBy(
        HoldingSchema.filingDate,
        HoldingSchema.cusip,
        AssetSchema.ticker,
        AssetSchema.website,
        HoldingSchema.issuer,
        HoldingSchema.securityClass,
        HoldingSchema.value,
        HoldingSchema.shares,
        HoldingSchema.shareType,
        HoldingSchema.optionType,
        HoldingSchema.investmentDiscretion,
        HoldingSchema.reportPeriod,
      )
      .orderBy(desc(HoldingSchema.filingDate));

    return {
      data: {
        company: {
          id: companyDetails.id,
          cik: companyDetails.cik,
          name: companyDetails.name,
          manager: companyDetails.manager,
          address: companyDetails.address,
          state: companyDetails.state,
          link: companyDetails.link,
        },

        filings,
      },

      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: "Internal server error",
    };
  }
}

export async function getStats() {
  try {
    const [companyStats] = await db
      .select({
        totalCompanies: sql<number>`
          count(*)
        `,
      })
      .from(CompanySchema);

    const [aumStats] = await db
      .select({
        totalAUM: sql<string>`
          coalesce(sum(${HoldingSchema.value}), 0)
        `,
      })
      .from(HoldingSchema);

    const [topHolding] = await db
      .select({
        cusip: HoldingSchema.cusip,
        issuer: HoldingSchema.issuer,
        totalValue: sql<string>`
          sum(${HoldingSchema.value})
        `,
        totalCompaniesHolding: sql<number>`
          count(distinct ${HoldingSchema.cik})
        `,
      })
      .from(HoldingSchema)
      .groupBy(HoldingSchema.cusip, HoldingSchema.issuer)
      .orderBy(sql`sum(${HoldingSchema.value}) desc`)
      .limit(1);

    const portfolioPercentage =
      topHolding && aumStats?.totalAUM
        ? Number(
            (
              (parseFloat(topHolding.totalValue) /
                parseFloat(aumStats.totalAUM)) *
              100
            ).toFixed(2),
          )
        : 0;

    return {
      data: {
        totalCompanies: companyStats?.totalCompanies ?? 0,
        totalAUM: aumStats?.totalAUM ?? "0",
        topHolding: topHolding ? { ...topHolding, portfolioPercentage } : null,
      },

      error: null,
    };
  } catch (error) {
    console.error(`controller.sec.getStats.error ${String(error)}`);
    return {
      data: null,
      error: "Internal server error",
    };
  }
}

export async function getTopHoldings(limit: number = 10) {
  try {
    const latestFilings = db.$with("latest_filings").as(
      db
        .select({
          cik: HoldingSchema.cik,
          latestFilingDate: sql<Date>`
            max(${HoldingSchema.filingDate})
          `.as("latest_filing_date"),
        })
        .from(HoldingSchema)
        .groupBy(HoldingSchema.cik),
    );

    const holdings = await db
      .with(latestFilings)
      .select({
        issuer: HoldingSchema.issuer,
        ticker: AssetSchema.ticker,
        cusip: HoldingSchema.cusip,
        totalValue: sql<number>`
          sum(${HoldingSchema.value})
        `.as("total_value"),

        holdersCount: sql<number>`
          count(distinct ${HoldingSchema.cik})
        `.as("holders_count"),
      })
      .from(HoldingSchema)
      .innerJoin(
        latestFilings,
        sql`
          ${HoldingSchema.cik} = ${latestFilings.cik}
          and
          ${HoldingSchema.filingDate} = ${latestFilings.latestFilingDate}
        `,
      )
      .leftJoin(AssetSchema, eq(HoldingSchema.cusip, AssetSchema.cusip))
      .groupBy(HoldingSchema.cusip, HoldingSchema.issuer, AssetSchema.ticker)
      .orderBy(desc(sql`sum(${HoldingSchema.value})`))
      .limit(limit);

    return {
      data: holdings,
      error: null,
    };
  } catch (error) {
    console.error(`controller.sec.getTopHoldings.error ${String(error)}`);

    return {
      data: null,
      error: "Internal server error",
    };
  }
}
