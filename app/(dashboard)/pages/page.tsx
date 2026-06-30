"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLocalData } from "@/hooks/use-local-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Edit, Trash2, Globe, FileClock, Search, Hammer } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function PagesManagementPage() {
  const { pages, deletePage, loading } = useLocalData();
  const [search, setSearch] = useState("");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#043164] border-t-transparent" />
      </div>
    );
  }

  const filteredPages = pages.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string, title: string) => {
    deletePage(id);
    toast.error(`Page "${title}" has been deleted.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Pages Manager
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Create, edit and publish custom webpage configurations for Memon Medical Institute.
          </p>
        </div>
        <Button asChild className="bg-[#043164] hover:bg-[#1A3268] text-white shadow-md">
          <Link href="/pages/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Page
          </Link>
        </Button>
      </div>

      {/* Filter Panel */}
      <Card className="border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/30">
        <CardContent className="p-4">
          <div className="space-y-1.5 w-full">
            <Label htmlFor="search-pages">Search Pages</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <Input
                id="search-pages"
                placeholder="Search pages by title or access slug route..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50/55 dark:bg-zinc-900/50">
            <TableRow>
              <TableHead className="font-bold text-zinc-700 dark:text-zinc-300">Page Title</TableHead>
              <TableHead className="font-bold text-zinc-700 dark:text-zinc-300">Route Path / Slug</TableHead>
              <TableHead className="font-bold text-zinc-700 dark:text-zinc-300">Status</TableHead>
              <TableHead className="font-bold text-zinc-700 dark:text-zinc-300">Last Modified</TableHead>
              <TableHead className="text-right font-bold text-zinc-700 dark:text-zinc-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-zinc-400">
                  No pages found matching query.
                </TableCell>
              </TableRow>
            ) : (
              filteredPages.map((page) => (
                <TableRow key={page.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
                  <TableCell className="font-bold text-zinc-900 dark:text-zinc-100">
                    {page.title}
                  </TableCell>
                  <TableCell className="text-zinc-500 font-mono text-xs">
                    {page.slug}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={page.status === "Published" ? "default" : "outline"}
                      className={
                        page.status === "Published"
                          ? "bg-[#043164]/10 text-[#043164] border border-[#043164]/20 dark:bg-[#c5a742]/10 dark:text-[#c5a742] dark:border-none"
                          : "bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
                      }
                    >
                      {page.status === "Published" ? (
                        <Globe className="mr-1 h-3.5 w-3.5 inline text-[#043164] dark:text-[#c5a742]" />
                      ) : (
                        <FileClock className="mr-1 h-3.5 w-3.5 inline text-zinc-400" />
                      )}
                      {page.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-650 dark:text-zinc-400 text-xs">
                    {page.updatedAt}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" asChild className="h-8 border-zinc-200 dark:border-zinc-800" title="Open Builder">
                        <Link href={`/builder?id=${page.id}`} className="text-xs">
                          <Hammer className="h-3.5 w-3.5 mr-1 text-[#043164] dark:text-[#c5a742]" /> Visual Builder
                        </Link>
                      </Button>

                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="Edit Properties">
                        <Link href={`/pages/${page.id}`}>
                          <Edit className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                        </Link>
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-400 hover:text-rose-600"
                            title="Delete Page"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the page config of &quot;<strong className="text-zinc-900 dark:text-zinc-100">{page.title}</strong>&quot; and destroy its layout blocks.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-zinc-200 dark:border-zinc-800">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(page.id, page.title)}
                              className="bg-rose-600 text-white hover:bg-rose-700"
                            >
                              Yes, Delete Page
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
