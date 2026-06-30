"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useLocalData, Page } from "@/hooks/use-local-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Hammer, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function EditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { pages, updatePage, loading } = useLocalData();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"Draft" | "Published">("Draft");
  const [blocks, setBlocks] = useState<any[]>([]);

  // Load page details
  useEffect(() => {
    if (!loading && pages.length > 0) {
      const page = pages.find((p) => p.id === id);
      if (page) {
        setTitle(page.title);
        setSlug(page.slug.startsWith("/") ? page.slug.slice(1) : page.slug);
        setDescription(page.description || "");
        setStatus(page.status);
        setBlocks(page.blocks || []);
      }
    }
  }, [loading, pages, id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) {
      toast.error("Title and Slug path are required.");
      return;
    }

    let cleanedSlug = slug.trim().toLowerCase();
    if (!cleanedSlug.startsWith("/")) {
      cleanedSlug = "/" + cleanedSlug;
    }

    const updatedPage: Page = {
      id,
      title,
      slug: cleanedSlug,
      description,
      status,
      updatedAt: new Date().toISOString().split("T")[0],
      blocks,
    };

    updatePage(id, updatedPage);
    toast.success(`Page properties for "${title}" updated successfully!`);
    router.push("/pages");
  };

  const currentPageExists = pages.some((p) => p.id === id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#043164]" />
      </div>
    );
  }

  if (!currentPageExists) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-xl font-bold text-zinc-950">Page not found</h2>
        <p className="text-zinc-500 font-medium">The page ID &apos;{id}&apos; does not exist in the local CMS database.</p>
        <Button asChild className="bg-[#043164] hover:bg-[#1A3268] text-white">
          <Link href="/pages">Back to Pages</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="h-10 w-10 border border-zinc-200 dark:border-zinc-800">
            <Link href="/pages">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              Edit Page #{id}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Update SEO details or open page content layout blocks in the builder.
            </p>
          </div>
        </div>

        <Button asChild className="bg-[#043164] hover:bg-[#1A3268] text-white shadow-md">
          <Link href={`/builder?id=${id}`}>
            <Hammer className="mr-2 h-4 w-4" />
            Visual Builder
          </Link>
        </Button>
      </div>

      <Card className="border-zinc-200 dark:border-zinc-800">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Page Configuration</CardTitle>
            <CardDescription>
              Basic page attributes and search engine optimization info.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Page Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="border-zinc-200 dark:border-zinc-800"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug / Route Path</Label>
              <div className="flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-zinc-200 bg-zinc-50 text-zinc-500 text-sm dark:border-zinc-800 dark:bg-zinc-900">
                  /
                </span>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  className="rounded-l-none border-zinc-200 dark:border-zinc-800"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Meta Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border-zinc-200 dark:border-zinc-800 resize-none font-sans"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Publish Status</Label>
              <Select value={status} onValueChange={(val: "Draft" | "Published") => setStatus(val)}>
                <SelectTrigger className="border-zinc-200 dark:border-zinc-800">
                  <SelectValue placeholder="Select publication status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Published">Published</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-900 pt-6">
            <Button variant="outline" asChild className="border-zinc-200 dark:border-zinc-800">
              <Link href="/pages">Cancel</Link>
            </Button>
            <Button type="submit" className="bg-[#043164] hover:bg-[#1A3268] text-white">
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
