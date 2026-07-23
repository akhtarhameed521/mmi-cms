"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocalData, Page } from "@/hooks/use-local-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function CreatePageRoute() {
  const router = useRouter();
  const { addPage } = useLocalData();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"Draft" | "Published">("Draft");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) {
      toast.error("Title and Slug/Route Path are required.");
      return;
    }

    const cleanedSlug = slug.trim().toLowerCase();
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(cleanedSlug)) {
      toast.error("Slug must contain only lowercase letters, numbers, and hyphens (no slashes, spaces, or leading/trailing slashes).");
      return;
    }

    const newPage: Page = {
      id: Date.now().toString(),
      title,
      slug: cleanedSlug,
      description,
      status,
      updatedAt: new Date().toISOString().split("T")[0],
      blocks: [
        {
          id: "hero-" + Date.now(),
          type: "hero",
          title: "Hero Banner Section",
          content: "Welcome to " + title,
          subtitle: "Start editing this section in the Visual Page Builder.",
          ctaText: "Get Started",
        },
      ],
    };

    try {
      await addPage(newPage);
      toast.success(`Page "${title}" created successfully!`);
      router.push("/pages");
    } catch (err) {
      // toast is already fired inside addPage
    }
  };
  return (
    <div className="space-y-6 max-w-xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="h-10 w-10 border border-zinc-200 dark:border-zinc-800">
          <Link href="/pages">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Create Custom Page
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Configure access route paths and SEO metadata for a new webpage.
          </p>
        </div>
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
              <Label htmlFor="title">Page Title <span className="text-rose-500">*</span></Label>
              <Input
                id="title"
                placeholder="e.g. Executive Management Board"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="border-zinc-200 dark:border-zinc-800"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug / Route Path <span className="text-rose-500">*</span></Label>
              <div className="flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-zinc-200 bg-zinc-50 text-zinc-500 text-sm dark:border-zinc-800 dark:bg-zinc-900">
                  /
                </span>
                <Input
                  id="slug"
                  placeholder="about/executive-board"
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
                placeholder="A brief summary of page contents for search engine snippets..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border-zinc-200 dark:border-zinc-800 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Publish Status</Label>
              <Select value={status} onValueChange={(val: "Draft" | "Published") => setStatus(val)}>
                <SelectTrigger className="border-zinc-200 dark:border-zinc-800">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Published">Published (Publicly Visible)</SelectItem>
                  <SelectItem value="Draft">Draft (Internal Only)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-900 pt-6">
            <Button variant="outline" asChild className="border-zinc-200 dark:border-zinc-800">
              <Link href="/pages">Cancel</Link>
            </Button>
            <Button type="submit" className="bg-[#043164] hover:bg-[#1A3268] text-white font-medium">
              Create Page
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
