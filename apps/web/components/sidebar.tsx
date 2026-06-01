"use client";
import React from "react";
import { Bell, LayoutDashboard, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/" },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    href: "/notification",
  },
  { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-950/50 hidden md:flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <Link
          href={"/"}
          className="text-zinc-100 font-semibold text-lg tracking-tight"
        >
          <span>Terminal 13F</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.includes(item.id);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                isActive
                  ? "bg-zinc-800/80 text-zinc-100 font-medium"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40 font-medium"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
