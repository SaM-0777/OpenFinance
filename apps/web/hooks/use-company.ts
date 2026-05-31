import { trpc } from "@/lib/trpc";

export function useCompanies(search?: string) {
  return trpc.company.list.useQuery({
    search,
  });
}

export function useCompanyFillings(cik: string) {
  return trpc.company.companyFillings.useQuery({ cik });
}
