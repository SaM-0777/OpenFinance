"use client";
import { useMemo, useState } from "react";
import {
  MapPin,
  ExternalLink,
  ArrowLeft,
  Search,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import { useCompanyFillings } from "@/hooks/use-company";
import { formatCurrency, formatDate } from "@openfinance/shared/src/utils";
import { formatMarketValue } from "@/lib/utils";
import { useParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function FundPage() {
  const { cik } = useParams();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { data } = useCompanyFillings(cik?.toString() ?? "ƒ");

  const totalValue = useMemo(
    () => data?.data?.filings.reduce((sum, f) => sum + f.value, 0) ?? 0,
    [data?.data?.filings],
  );

  const sortedFilings = useMemo(() => {
    return [...(data?.data?.filings ?? [])]
      .filter(
        (f) =>
          f.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (f.cusip && f.cusip.includes(searchQuery)),
      )
      .sort((a, b) => b.value - a.value);
  }, [data?.data?.filings, searchQuery]);

  const topHolding = useMemo(
    () => (sortedFilings.length > 0 ? sortedFilings[0] : null),
    [sortedFilings],
  );

  return (
    <main className="flex-1 flex flex-col min-w-0">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-zinc-800 bg-zinc-950/80 px-8 backdrop-blur-md">
        <Link
          href={"/"}
          className="flex items-center text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Funds
        </Link>
      </header>

      <ScrollArea className="flex-1 overflow-auto">
        <div className="p-8 max-w-8xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">
                {data?.data?.company.name}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 text-zinc-500" />
                  <span>{data?.data?.company.manager}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>CIK: {data?.data?.company.cik}</span>
                </div>
                {(data?.data?.company.address || data?.data?.company.state) && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-zinc-500" />
                    <span>
                      {data?.data?.company.address}
                      {data?.data?.company.state
                        ? `, ${data?.data?.company.state}`
                        : ""}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {data?.data?.company.link && (
                <Link
                  href={data?.data?.company.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-950 bg-zinc-100 rounded-md hover:bg-white transition-colors shadow-sm"
                >
                  SEC Source
                  <ExternalLink className="h-4 w-4" />
                </Link>
              )}
              {/*<button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-950 bg-zinc-100 rounded-md hover:bg-white transition-colors shadow-sm">
                Follow Fund
              </button>*/}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-5 shadow-sm">
              <h3 className="text-sm font-medium text-zinc-400">
                Total Portfolio Value
              </h3>
              <p className="mt-2 text-2xl font-semibold text-zinc-100 tracking-tight">
                {formatMarketValue(totalValue ?? 0)}
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-5 shadow-sm">
              <h3 className="text-sm font-medium text-zinc-400">
                Total Holdings
              </h3>
              <p className="mt-2 text-2xl font-semibold text-zinc-100 tracking-tight">
                {data?.data?.filings.length ?? 0}
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-5 shadow-sm">
              <h3 className="text-sm font-medium text-zinc-400">Top Holding</h3>
              <p className="mt-2 text-lg font-semibold text-zinc-100 tracking-tight truncate">
                {topHolding?.issuer || "N/A"}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">
                {topHolding ? formatCurrency(topHolding.value) : ""}
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-5 shadow-sm">
              <h3 className="text-sm font-medium text-zinc-400">Filed date</h3>
              <p className="mt-2 text-lg font-semibold text-zinc-100 tracking-tight">
                {formatDate(data?.data?.filings[0]?.filingDate) || "N/A"}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">
                Report:{" "}
                {formatDate(data?.data?.filings[0]?.reportPeriod) || "N/A"}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-900/20 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/40">
              <h2 className="text-base font-semibold text-zinc-100">
                Holdings Information Table
              </h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search issuer or CUSIP..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 w-64 rounded-md border border-zinc-700 bg-zinc-950 pl-9 pr-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-all"
                  />
                </div>
                {/*<button className="flex items-center justify-center h-9 w-9 border border-zinc-700 bg-zinc-950 rounded-md hover:bg-zinc-800 text-zinc-400 transition-colors">
                    <SlidersHorizontal className="h-4 w-4" />
                  </button>
                  <button className="flex items-center gap-2 h-9 px-3 border border-zinc-700 bg-zinc-950 rounded-md hover:bg-zinc-800 text-zinc-300 text-sm font-medium transition-colors">
                    <Download className="h-4 w-4" />
                    CSV
                  </button>*/}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-zinc-900/80 text-xs uppercase text-zinc-500 font-medium border-b border-zinc-800">
                  <tr>
                    <th className="px-6 py-4">Issuer</th>
                    <th className="px-6 py-4">Symbol</th>
                    <th className="px-6 py-4">CUSIP</th>
                    <th className="px-6 py-4">Security Class</th>
                    <th className="px-6 py-4 text-right">Value (USD)</th>
                    <th className="px-6 py-4 text-right">Weight</th>
                    <th className="px-6 py-4 text-right">Shares</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Discretion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {sortedFilings.map((filing, idx) => {
                    const weight =
                      (totalValue ?? 0 > 0)
                        ? ((filing.value / totalValue) * 100).toFixed(2)
                        : "0.00";
                    return (
                      <tr
                        key={idx}
                        className="hover:bg-zinc-800/20 transition-colors group"
                      >
                        <td className="px-6 py-4 font-medium text-zinc-200 group-hover:text-zinc-50 transition-colors">
                          {filing.issuer}
                        </td>
                        <td className="px-6 py-4 font-medium text-zinc-200 group-hover:text-zinc-50 transition-colors">
                          <Link
                            href={`${filing.website}`}
                            className="hover:underline"
                          >
                            {filing.ticker}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-zinc-400 font-mono text-xs">
                          {filing.cusip || "-"}
                        </td>
                        <td className="px-6 py-4 text-zinc-400 font-mono text-xs">
                          {filing.securityClass || "-"}
                        </td>
                        <td className="px-6 py-4 text-right text-zinc-200 font-medium">
                          {formatCurrency(filing.value)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="inline-flex items-center gap-2">
                            <span className="text-zinc-300">{weight}%</span>
                            <span className="w-12 h-1.5 bg-zinc-800 rounded-full overflow-hidden flex">
                              <span
                                className="h-full bg-zinc-500 rounded-full"
                                style={{ width: `${weight}%` }}
                              />
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-zinc-400">
                          {filing.shares}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-400">
                              {filing.sharetType || "-"}
                            </span>
                            {filing.optionType && (
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${
                                  filing.optionType.toLowerCase() === "call"
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                }`}
                              >
                                {filing.optionType}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-zinc-500 text-xs">
                          {filing.investmentDiscretion || "-"}
                        </td>
                      </tr>
                    );
                  })}
                  {sortedFilings.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-12 text-center text-zinc-500"
                      >
                        No holdings found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-zinc-800 bg-zinc-900/40 flex items-center justify-between text-sm text-zinc-500">
              <span>
                Showing 1 to {sortedFilings.length} of{" "}
                {data?.data?.filings.length} entries
              </span>
              <div className="flex gap-1">
                <button
                  className="px-3 py-1 rounded-md border border-zinc-800 hover:bg-zinc-800 transition-colors disabled:opacity-50"
                  disabled
                >
                  Prev
                </button>
                <button
                  className="px-3 py-1 rounded-md border border-zinc-800 hover:bg-zinc-800 transition-colors disabled:opacity-50"
                  disabled
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </main>
  );
}
