"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  FileText,
  Hammer,
  Settings,
  X,
  Stethoscope,
  Calendar,
  HeartPulse,
  Image,
  Layers,
} from "lucide-react";

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

export function Sidebar({ className, onClose }: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Doctors Manager", href: "/doctors", icon: Stethoscope },
    { name: "Appointments Queue", href: "/appointments", icon: Calendar },
    { name: "Pages Manager", href: "/pages", icon: FileText },
    { name: "Page Builder", href: "/builder", icon: Hammer },
    { name: "Navigation Menu", href: "/navigation", icon: Layers },
    { name: "Media Library", href: "/media", icon: Image },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div
      className={cn(
        "flex h-full w-64 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950",
        className
      )}
    >
      <div className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 dark:border-zinc-800">
        <Link href="/" className="flex items-center gap-2">
          <HeartPulse className="h-6 w-6 text-[#043164] dark:text-[#c5a742] animate-pulse" />
          <span className="text-lg font-black tracking-wider text-[#043164] dark:text-white">
            MMI CMS
          </span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-500"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-4 py-6">
        {navigation.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "bg-[#043164] text-white dark:bg-[#c5a742] dark:text-[#043164] font-bold shadow-md shadow-[#043164]/10 dark:shadow-none"
                  : "text-zinc-650 hover:bg-zinc-50 hover:text-[#043164] dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
              )}
            >
              <item.icon
                size={18}
                className={cn(
                  "transition-colors",
                  isActive
                    ? "text-white dark:text-[#043164]"
                    : "text-zinc-400 group-hover:text-[#043164] dark:group-hover:text-zinc-200"
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-[#043164] dark:bg-[#c5a742] flex items-center justify-center text-white dark:text-[#043164] font-black text-sm shadow-md">
            A
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
              Admin User
            </p>
            <p className="text-[10px] text-zinc-500 truncate">
              admin@mmi.edu.pk
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
