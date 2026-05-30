"use client";
import { Command, Search } from "lucide-react";

export default function Searchbar({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-zinc-800 bg-zinc-950/80 px-6 backdrop-blur-md">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-2xl group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
          <input
            type="text"
            placeholder="Search by Fund Name, CIK, Manager, or Ticker..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-900/50 pl-10 pr-12 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-600 focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-600 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-zinc-500 font-medium bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700">
            <Command className="h-3 w-3" />
            <span>K</span>
          </div>
        </div>
      </div>
    </header>
  );
}
