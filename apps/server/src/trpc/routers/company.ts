import { z } from "@openfinance/shared/validations";

import { router, publicProcedure } from "../trpc";
import {
  getSECCompanies,
  getSECCompanyFillings,
  getStats,
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
});
