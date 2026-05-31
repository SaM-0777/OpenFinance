import { z } from "@openfinance/shared/validations";

import { router, publicProcedure } from "../trpc";
import { getSECCompanies, getSECCompanyFillings } from "../../controllers/sec";

export const companyRouter = router({
  list: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
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
