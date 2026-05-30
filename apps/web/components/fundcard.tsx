import { Card, CardContent, CardHeader } from "./ui/card";
import { ArrowRight } from "lucide-react";

export interface FundFiling {
  id: string;
  fundName: string;
  managerName: string;
  cik: string;
  filingDate: string;
  holdingsCount: number;
  portfolioValue: string;
  topHolding: string;
  positionChange: {
    value: string;
    isPositive: boolean;
  };
}

export default function FundCard({ fund }: { fund: FundFiling }) {
  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold text-zinc-100 group-hover:text-white transition-colors">
          {fund.fundName}
        </h3>
        <p className="text-xs text-zinc-500 mt-1 flex items-center gap-2">
          {fund.managerName}
          <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
          CIK: {fund.cik}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-zinc-800/50">
          <div>
            <p className="text-xs font-medium text-zinc-500 mb-1">
              Portfolio Value
            </p>
            <p className="text-sm font-medium text-zinc-200">
              {fund.portfolioValue}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-500 mb-1">Holdings</p>
            <p className="text-sm font-medium text-zinc-200">
              {fund.holdingsCount}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-500">
              Top Holding:
            </span>
            <span className="text-xs font-semibold text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded">
              {fund.topHolding}
            </span>
          </div>
          <span
            className={`text-xs font-medium flex items-center ${
              fund.positionChange.isPositive
                ? "text-emerald-400"
                : "text-rose-400"
            }`}
          >
            {fund.positionChange.isPositive ? "+" : ""}
            {fund.positionChange.value}
            <ArrowRight className="ml-1 h-3 w-3 -rotate-45" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
