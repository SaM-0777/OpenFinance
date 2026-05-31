import { CompanySchema, db } from "@openfinance/shared";

export async function getCompanies() {
  return await db.select().from(CompanySchema);
}

