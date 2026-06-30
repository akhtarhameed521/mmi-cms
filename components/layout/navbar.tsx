"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-white border-b border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800">
      <div className="flex items-center gap-6">
        <Link href="/" className="font-bold text-lg text-indigo-600 dark:text-indigo-400">
          CMS Builder
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild>
          <Link href="/login">Sign In</Link>
        </Button>
        <Button asChild>
          <Link href="/register">Sign Up</Link>
        </Button>
      </div>
    </nav>
  );
}
