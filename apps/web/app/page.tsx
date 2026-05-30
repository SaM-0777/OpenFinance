"use client";
import { useState, useMemo } from "react";
import {
  ArrowRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Sidebar from "@/components/sidebar";
import Searchbar from "@/components/searchbar";
import StatCard from "@/components/statcard";
import FundCard from "@/components/fundcard";
import { ScrollArea } from "@/components/ui/scroll-area";

// --- Types for E2E Type Safety ---

interface Alert {
  id: string;
  fund: string;
  action: string;
  ticker: string;
  time: string;
  impact: "high" | "medium" | "low";
}

// --- Mock Data ---

const MARKET_STATS: MarketStat[] = [
  { label: "Total AUM Tracked", value: "$4.2T", change: "+2.4%", trend: "up" },
  { label: "13F Filings Today", value: "142", change: "+12", trend: "up" },
  {
    label: "Institutional Sentiment",
    value: "Bullish",
    change: "Tech heavy",
    trend: "neutral",
  },
];

const RECENT_FILINGS: FundFiling[] = [
  {
    id: "f1",
    fundName: "Renaissance Technologies LLC",
    managerName: "Peter Brown",
    cik: "0001037389",
    filingDate: "2 hours ago",
    holdingsCount: 3842,
    portfolioValue: "$64.2B",
    topHolding: "NVO",
    positionChange: { value: "+4.2%", isPositive: true },
  },
  {
    id: "f2",
    fundName: "Pershing Square Capital",
    managerName: "William A. Ackman",
    cik: "0001336528",
    filingDate: "4 hours ago",
    holdingsCount: 8,
    portfolioValue: "$10.4B",
    topHolding: "CMG",
    positionChange: { value: "-1.1%", isPositive: false },
  },
  {
    id: "f3",
    fundName: "Bridgewater Associates, LP",
    managerName: "Ray Dalio",
    cik: "0001350694",
    filingDate: "5 hours ago",
    holdingsCount: 724,
    portfolioValue: "$16.8B",
    topHolding: "IVV",
    positionChange: { value: "+0.8%", isPositive: true },
  },
  {
    id: "f4",
    fundName: "Appaloosa Management LP",
    managerName: "David Tepper",
    cik: "0001006438",
    filingDate: "6 hours ago",
    holdingsCount: 38,
    portfolioValue: "$5.2B",
    topHolding: "META",
    positionChange: { value: "+8.4%", isPositive: true },
  },
  {
    id: "f5",
    fundName: "Duquesne Family Office",
    managerName: "Stanley Druckenmiller",
    cik: "0001551693",
    filingDate: "Yesterday",
    holdingsCount: 42,
    portfolioValue: "$3.1B",
    topHolding: "NVDA",
    positionChange: { value: "+12.5%", isPositive: true },
  },
  {
    id: "f6",
    fundName: "Elliott Investment Management",
    managerName: "Paul Singer",
    cik: "0001053074",
    filingDate: "Yesterday",
    holdingsCount: 94,
    portfolioValue: "$14.1B",
    topHolding: "SRE",
    positionChange: { value: "-0.3%", isPositive: false },
  },
];

const RECENT_ALERTS: Alert[] = [
  {
    id: "a1",
    fund: "Renaissance Tech",
    action: "New Position",
    ticker: "PLTR",
    time: "10m ago",
    impact: "high",
  },
  {
    id: "a2",
    fund: "Pershing Square",
    action: "Increased",
    ticker: "GOOGL",
    time: "1h ago",
    impact: "medium",
  },
  {
    id: "a3",
    fund: "Bridgewater",
    action: "Liquidated",
    ticker: "JNJ",
    time: "2h ago",
    impact: "high",
  },
  {
    id: "a4",
    fund: "Tiger Global",
    action: "Decreased",
    ticker: "SNOW",
    time: "4h ago",
    impact: "medium",
  },
];

const CHART_DATA = [
  { name: "Jan", value: 3.8 },
  { name: "Feb", value: 3.9 },
  { name: "Mar", value: 4.1 },
  { name: "Apr", value: 4.0 },
  { name: "May", value: 4.2 },
  { name: "Jun", value: 4.4 },
];

// --- Main Application ---

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");

  // Simulating search filter
  const filteredFilings = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return RECENT_FILINGS.filter(
      (f) =>
        f.fundName.toLowerCase().includes(q) ||
        f.managerName.toLowerCase().includes(q) ||
        f.cik.includes(q),
    );
  }, [searchQuery]);

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-zinc-50 font-sans selection:bg-zinc-800 selection:text-zinc-100 overflow-hidden">
      <Sidebar />

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
              {MARKET_STATS.map((stat, idx) => (
                <StatCard key={idx} stat={stat} />
              ))}
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
                  {filteredFilings.length > 0 ? (
                    filteredFilings.map((fund) => (
                      <FundCard key={fund.id} fund={fund} />
                    ))
                  ) : (
                    <div className="col-span-2 p-8 text-center border border-zinc-800 rounded-lg border-dashed text-zinc-500 text-sm">
                      {`No filings found matching "${searchQuery}"`}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-5">
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
                </div>

                {/* Recent Alerts Feed */}
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-5">
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
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
