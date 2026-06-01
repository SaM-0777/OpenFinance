"use client";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Searchbar from "@/components/searchbar";
import FundCard from "@/components/fundcard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCompanies, useStats } from "@/hooks/use-company";
import StatCard from "@/components/statcard";
import { formatMarketValue } from "@/lib/utils";

export default function App() {
  const [searchQuery, setSearchQuery] = useState<string | undefined>();
  const { data: stats } = useStats();
  const { data } = useCompanies(searchQuery);

  return (
    <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
      <Searchbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <ScrollArea className="flex-1 overflow-auto">
        <div className="p-6 space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
                Dashboard
              </h1>
              <p className="text-sm text-zinc-400 mt-1">
                Overview of latest institutional 13F filings and market
                activity.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              stat={{
                label: "Total AUM Tracked",
                value: formatMarketValue(stats?.data?.totalAUM ?? 0),
                change: "",
                trend: "neutral",
              }}
            />
            <StatCard
              stat={{
                label: "Total 13F Filings",
                value: (stats?.data?.totalCompanies ?? 0).toString(),
                change: "",
                trend: "neutral",
              }}
            />
            <StatCard
              stat={{
                label: "Top Holdings",
                value: stats?.data?.topHolding?.issuer ?? "",
                change: `${stats?.data?.topHolding?.portfolioPercentage.toString()}%`,
                trend: "up",
              }}
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-zinc-100">
                  Latest 13F Filings
                </h2>
                <button className="text-xs font-medium text-zinc-400 hover:text-zinc-100 flex items-center transition-colors">
                  View all <ArrowRight className="ml-1 h-3 w-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data?.data ? (
                  data.data.map((fund) => (
                    <FundCard key={fund.id} fund={fund} />
                  ))
                ) : (
                  <div className="col-span-2 p-8 text-center border border-zinc-800 rounded-lg border-dashed text-zinc-500 text-sm">
                    {`No filings found matching`}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {/*<div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-zinc-100">
                      AUM Trend (Trillions)
                    </h2>
                    <span className="text-xs text-zinc-500 font-medium bg-zinc-900 px-2 py-1 rounded">
                      YTD
                    </span>
                  </div>
                  <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={CHART_DATA}
                        margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="colorValue"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#52525b"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor="#52525b"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10, fill: "#71717a" }}
                          dy={10}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10, fill: "#71717a" }}
                          domain={["dataMin - 0.2", "dataMax + 0.2"]}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#18181b",
                            borderColor: "#27272a",
                            borderRadius: "6px",
                            fontSize: "12px",
                          }}
                          itemStyle={{ color: "#e4e4e7" }}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#a1a1aa"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorValue)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>*/}

              {/*<div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-zinc-100">
                      Live Activity
                    </h2>
                    <button className="text-xs text-zinc-400 hover:text-zinc-100 transition-colors">
                      Settings
                    </button>
                  </div>
                  <div className="space-y-4">
                    {RECENT_ALERTS.map((alert) => (
                      <div
                        key={alert.id}
                        className="flex gap-3 items-start group cursor-pointer"
                      >
                        <div
                          className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                            alert.impact === "high"
                              ? "bg-rose-400"
                              : "bg-zinc-500"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors truncate">
                            {alert.fund}
                          </p>
                          <p className="text-xs text-zinc-500 mt-0.5">
                            {alert.action}{" "}
                            <span className="text-zinc-300 font-semibold">
                              {alert.ticker}
                            </span>
                          </p>
                        </div>
                        <span className="text-[10px] text-zinc-600 font-medium whitespace-nowrap">
                          {alert.time}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-5 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-100 border border-zinc-800 rounded-md hover:bg-zinc-800/50 transition-colors">
                    View Alert Feed
                  </button>
                </div>*/}
            </div>
          </div>
        </div>
      </ScrollArea>
    </main>
  );
}
