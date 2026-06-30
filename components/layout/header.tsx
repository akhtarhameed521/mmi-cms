"use client";

import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Bell, Menu, Search, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-zinc-200 bg-white/80 backdrop-blur-md px-6 dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 -ml-2 rounded-md text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            <Menu size={20} />
          </button>
        )}
        <div className="relative w-64 max-w-xs hidden sm:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            type="search"
            placeholder="Search resources..."
            className="pl-9 h-9 w-full bg-zinc-50 border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 placeholder-zinc-400 focus-visible:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <Sun size={18} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <Bell size={18} />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-indigo-600" />
        </Button>
        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm dark:bg-indigo-950 dark:text-indigo-300">
          A
        </div>
      </div>
    </header>
  );
}
