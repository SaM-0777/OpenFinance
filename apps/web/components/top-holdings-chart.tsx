"use client";
import { useMemo } from "react";
import { useTopHoldings } from "@/hooks/use-company";
import { ChartContainer } from "./ui/chart";
import { Bar, BarChart, Rectangle, Tooltip, XAxis, YAxis } from "recharts";
import { formatMarketValue } from "@/lib/utils";

export default function TopHoldingsChart() {
  const { data } = useTopHoldings();
  const holdings = data?.data;

  const chartData = useMemo(() => {
    if (!holdings?.length) return [];

    return holdings.map((d) => ({
      ticker: d.ticker
        ? d.ticker.slice(0, 4).toUpperCase()
        : d.issuer.slice(0, 4).toUpperCase(),
      issuer: d.issuer,
      cusip: d.cusip,
      totalValue: d.totalValue,
      holdersCount: d.holdersCount,
    }));
  }, [holdings]);

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-zinc-100">
          Most Held Assets
        </h2>
        <span className="text-xs text-zinc-500 font-medium bg-zinc-900 px-2 py-1 rounded">
          By Value
        </span>
      </div>

      <div className="h-56 w-full">
        <ChartContainer config={{}}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 0, left: -4, bottom: 4 }}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="ticker"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#a1a1aa" }}
              width={45}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ fill: "#27272a", opacity: 0.4, radius: 4 }}
            />
            <Bar
              dataKey="totalValue"
              fill="#52525b"
              radius={[0, 4, 4, 0]}
              barSize={20}
              shape={
                <Rectangle
                  radius={[0, 4, 4, 0]}
                  className="hover:fill-zinc-300 transition-colors duration-300 cursor-pointer"
                />
              }
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ChartTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg shadow-xl outline-none z-50">
        <p className="text-sm font-semibold text-zinc-100">
          {data.issuer} ({data.ticker})
        </p>
        <div className="mt-2 space-y-1">
          <p className="text-xs text-zinc-400">
            Total Value:{" "}
            <span className="font-medium text-emerald-400">
              ${formatMarketValue(data.totalValue)}
            </span>
          </p>
          <p className="text-xs text-zinc-400">
            Holders:{" "}
            <span className="font-medium text-zinc-200">
              {data.holdersCount} funds
            </span>
          </p>
          <p className="text-[10px] text-zinc-500 font-mono mt-1 pt-1 border-t border-zinc-800/50">
            CUSIP: {data.cusip}
          </p>
        </div>
      </div>
    );
  }
  return null;
}
