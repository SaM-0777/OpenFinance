import { z } from "@openfinance/shared/validations";

import { router, publicProcedure } from "../trpc";
import {
  getSECCompanies,
  getSECCompanyFillings,
  getStats,
  getTopHoldings,
} from "../../controllers/sec";

export const companyRouter = router({
  stats: publicProcedure.query(async () => {
    return getStats();
  }),
  list: publicProcedure
    .input(
      z.object({
        search: z.string({ message: "Provide valid search query" }).optional(),
      }),
    )
    .query(async ({ input }) => {
      return getSECCompanies(input.search);
    }),

  companyFillings: publicProcedure
    .input(
      z.object({
        cik: z.string().min(1, "CIK is required"),
      }),
    )
    .query(async ({ input }) => {
      return getSECCompanyFillings(input.cik);
    }),

  topHoldings: publicProcedure
    .input(
      z.object({
        limit: z
          .number({ message: "Provide a valid limit value between 10 and 50" })
          .min(10, "Minimum allowed value is 10")
          .max(50, "Max allowed value is 50"),
      }),
    )
    .query(async ({ input }) => {
      return getTopHoldings(input.limit);
    }),
});
