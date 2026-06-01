import { trpc } from "@/lib/trpc";

export function useStats() {
  return trpc.company.stats.useQuery();
}

export function useTopHoldings(limit: number = 10) {
  return trpc.company.topHoldings.useQuery({ limit });
}

export function useCompanies(search?: string) {
  return trpc.company.list.useQuery({
    search,
  });
}

export function useCompanyFillings(cik: string) {
  return trpc.company.companyFillings.useQuery({ cik });
}
