import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export interface MarketStat {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
}

export default function StatCard({ stat }: { stat: MarketStat }) {
  return (
    <Card className="rounded-sm">
      <CardHeader>
        <CardTitle>{stat.label}</CardTitle>
      </CardHeader>
      <CardContent className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-zinc-100 tracking-tight">
          {stat.value}
        </span>
        <span
          className={`flex items-center text-xs font-medium ${
            stat.trend === "up"
              ? "text-emerald-400"
              : stat.trend === "down"
                ? "text-rose-400"
                : "text-zinc-500"
          }`}
        >
          {stat.trend === "up" && <TrendingUp className="mr-1 h-3 w-3" />}
          {stat.trend === "down" && <TrendingDown className="mr-1 h-3 w-3" />}
          {stat.change}
        </span>
      </CardContent>
    </Card>
  );
}
