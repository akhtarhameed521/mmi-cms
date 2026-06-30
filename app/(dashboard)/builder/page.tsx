"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useLocalData, Page, PageBlock } from "@/hooks/use-local-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Layout,
  Plus,
  Trash2,
  Save,
  Eye,
  Settings,
  Heading,
  Layers,
  Image as ImageIcon,
  MousePointerClick,
  Sparkles,
  Stethoscope,
  Heart,
  Droplet,
  ShieldAlert,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

// Wrap search params reading in Suspense as required by Next.js 15+ in client components
function BuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageIdParam = searchParams ? searchParams.get("id") : null;

  const { pages, updatePage, loading } = useLocalData();
  const [selectedPageId, setSelectedPageId] = useState<string>("");
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // Inspector States
  const [inspectTitle, setInspectTitle] = useState("");
  const [inspectContent, setInspectContent] = useState("");
  const [inspectSubtitle, setInspectSubtitle] = useState("");
  const [inspectCta, setInspectCta] = useState("");

  const availableBlocks = [
    { type: "hero", title: "MMI Hero Banner", desc: "Hospital title, tagline & action buttons", icon: Sparkles },
    { type: "features", title: "Quick Links Grid", desc: "6-item grid (Appt, Reports, Emergency)", icon: Layers },
    { type: "cta", title: "Doctor Search Teaser", desc: "Teaser banner promoting Doctor Finder", icon: Stethoscope },
    { type: "text", title: "Rich Description Info", desc: "Subsidized welfare & donation text block", icon: Heading },
    { type: "image", title: "Facility Image Banner", desc: "Full-width visual placeholder banner", icon: ImageIcon },
  ];

  // Set default page ID if param is present, otherwise fallback to first page
  useEffect(() => {
    if (!loading && pages.length > 0) {
      if (pageIdParam && pages.some((p) => p.id === pageIdParam)) {
        setSelectedPageId(pageIdParam);
      } else {
        setSelectedPageId(pages[0].id);
      }
    }
  }, [loading, pages, pageIdParam]);

  // Sync state when selectedPageId changes
  useEffect(() => {
    if (selectedPageId) {
      const activePage = pages.find((p) => p.id === selectedPageId);
      if (activePage) {
        setBlocks(activePage.blocks || []);
        if (activePage.blocks && activePage.blocks.length > 0) {
          setSelectedBlockId(activePage.blocks[0].id);
        } else {
          setSelectedBlockId(null);
        }
      }
    }
  }, [selectedPageId, pages]);

  // Sync inspector form when selectedBlockId changes
  useEffect(() => {
    if (selectedBlockId) {
      const block = blocks.find((b) => b.id === selectedBlockId);
      if (block) {
        setInspectTitle(block.title || "");
        setInspectContent(block.content || "");
        setInspectSubtitle(block.subtitle || "");
        setInspectCta(block.ctaText || "");
      }
    } else {
      setInspectTitle("");
      setInspectContent("");
      setInspectSubtitle("");
      setInspectCta("");
    }
  }, [selectedBlockId, blocks]);

  const handlePageChange = (id: string) => {
    setSelectedPageId(id);
    router.push(`/builder?id=${id}`);
  };

  const addBlock = (type: string, title: string) => {
    const newBlockId = type + "-" + Date.now();
    const newBlock: PageBlock = {
      id: newBlockId,
      type,
      title,
      content:
        type === "hero"
          ? "Trusted Care. Compassionate Excellence."
          : type === "features"
          ? "Our Subsidized Welfare Portals"
          : type === "cta"
          ? "Find the Right Doctor"
          : "Professional medical care with a human touch.",
      subtitle:
        type === "hero"
          ? "Advanced healthcare with a human touch. Here for you, every step of the way."
          : type === "cta"
          ? "Search our medical directories and book consult timings online."
          : "",
      ctaText: type === "hero" || type === "cta" ? "Book Appointment" : undefined,
    };

    const updatedBlocks = [...blocks, newBlock];
    setBlocks(updatedBlocks);
    setSelectedBlockId(newBlockId);
    toast.success(`${title} block added to canvas!`);
  };

  const removeBlock = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedBlocks = blocks.filter((b) => b.id !== id);
    setBlocks(updatedBlocks);
    if (selectedBlockId === id) {
      setSelectedBlockId(updatedBlocks.length > 0 ? updatedBlocks[0].id : null);
    }
    toast.error("Block removed from canvas.");
  };

  const handleSave = () => {
    const activePage = pages.find((p) => p.id === selectedPageId);
    if (activePage) {
      const updatedPage: Page = {
        ...activePage,
        blocks,
        updatedAt: new Date().toISOString().split("T")[0],
      };
      updatePage(selectedPageId, updatedPage);
      toast.success(`Layout for "${activePage.title}" saved successfully!`);
    }
  };

  const handleInspectorSave = () => {
    if (!selectedBlockId) return;
    const updatedBlocks = blocks.map((b) => {
      if (b.id === selectedBlockId) {
        return {
          ...b,
          title: inspectTitle,
          content: inspectContent,
          subtitle: inspectSubtitle,
          ctaText: inspectCta || undefined,
        };
      }
      return b;
    });
    setBlocks(updatedBlocks);
    toast.success("Block properties updated locally. Save page to persist.");
  };

  if (loading || !selectedPageId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#043164] border-t-transparent" />
      </div>
    );
  }

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);
  const activePage = pages.find((p) => p.id === selectedPageId);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col -m-6 md:-m-8 animate-in fade-in duration-500">
      {/* Builder Sub-header / Toolbar */}
      <div className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6 dark:border-zinc-800 dark:bg-zinc-950 flex-shrink-0">
        <div className="flex items-center gap-3 flex-1">
          <Layout className="h-5 w-5 text-[#043164] dark:text-[#c5a742]" />
          <span className="font-bold text-zinc-900 dark:text-zinc-100 hidden sm:inline">Visual Builder:</span>
          
          <Select value={selectedPageId} onValueChange={handlePageChange}>
            <SelectTrigger className="w-56 h-9 border-zinc-200 dark:border-zinc-800 bg-zinc-50/50">
              <SelectValue placeholder="Select Page to Edit" />
            </SelectTrigger>
            <SelectContent>
              {pages.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.title} ({p.slug})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="outline" size="sm" asChild className="h-9 border-zinc-200 dark:border-zinc-800">
            <Link href="/pages">
              Exit Builder
            </Link>
          </Button>
          <Button onClick={handleSave} size="sm" className="h-9 bg-[#043164] hover:bg-[#1A3268] text-white shadow-md">
            <Save className="mr-2 h-4 w-4" />
            Save Layout
          </Button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex flex-1 min-h-0">
        {/* Left Sidebar: Components Drawer */}
        <aside className="w-72 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 flex flex-col flex-shrink-0 overflow-y-auto p-4 space-y-4">
          <div>
            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-3">
              Add MMI Sections
            </h3>
            <div className="space-y-2">
              {availableBlocks.map((item) => (
                <button
                  key={item.type}
                  onClick={() => addBlock(item.type, item.title)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-zinc-200 hover:border-[#043164] hover:bg-[#043164]/5 dark:border-zinc-800 dark:hover:border-[#c5a742] dark:hover:bg-[#c5a742]/10 text-left transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-zinc-50 border border-zinc-100 text-zinc-550 dark:bg-zinc-900 dark:border-zinc-850 group-hover:text-[#043164] dark:group-hover:text-[#c5a742]">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-905 dark:text-zinc-50">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-zinc-400 leading-normal line-clamp-1">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  <Plus className="h-3.5 w-3.5 text-zinc-400 group-hover:text-emerald-655" />
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Center: Live Interactive MMI Styled Canvas */}
        <section className="flex-1 bg-zinc-100/60 dark:bg-zinc-900/60 overflow-y-auto p-8 flex justify-center items-start">
          <div className="w-full max-w-3xl space-y-5">
            {blocks.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-16 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl bg-white/70 text-center">
                <Layout className="h-10 w-10 text-zinc-400 mb-3" />
                <h3 className="text-lg font-bold text-zinc-950">Empty Webpage Layout</h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-xs leading-normal">
                  Click sections in the left sidebar to add hospital hero banners, quick links grid, or descriptions to this page.
                </p>
              </div>
            ) : (
              blocks.map((block) => (
                <div
                  key={block.id}
                  onClick={() => setSelectedBlockId(block.id)}
                  className={`group relative rounded-2xl border transition-all cursor-pointer overflow-hidden shadow-sm ${
                    selectedBlockId === block.id
                      ? "border-[#043164] ring-2 ring-[#043164]/25 bg-white dark:bg-zinc-950"
                      : "border-zinc-200 hover:border-zinc-400 bg-white dark:bg-zinc-950"
                  }`}
                >
                  {/* Selected/Hover Action Toolbar */}
                  <div className="absolute right-3 top-3 z-10 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-7 w-7 rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-sm"
                      onClick={(e) => removeBlock(block.id, e)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  {/* Rendering MMI Themed Mock Canvas Sections */}
                  {block.type === "hero" && (
                    <div className="p-10 text-center space-y-4 bg-gradient-to-br from-[#043164]/5 to-white">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#043164] dark:text-[#c5a742] bg-[#043164]/10 dark:bg-[#c5a742]/10 px-3 py-1 rounded-full">
                        Hospital Hero Banner
                      </span>
                      <h1 className="text-3xl font-black text-zinc-950 dark:text-zinc-50 leading-tight">
                        {block.content}
                      </h1>
                      <p className="text-zinc-500 text-sm max-w-lg mx-auto leading-relaxed">
                        {block.subtitle || "Advanced healthcare tagline banner template."}
                      </p>
                      <div className="pt-2 flex gap-3 justify-center">
                        <Button className="bg-[#043164] hover:bg-[#1A3268] text-white shadow">{block.ctaText || "Book Appointment"}</Button>
                        <Button variant="outline" className="border-zinc-200 dark:border-zinc-800">View Reports</Button>
                      </div>
                    </div>
                  )}

                  {block.type === "features" && (
                    <div className="p-8 space-y-6">
                      <div className="text-center space-y-1">
                        <h2 className="text-xl font-extrabold text-zinc-950 dark:text-zinc-50">{block.content || "Quick Portals"}</h2>
                        <p className="text-zinc-400 text-xs">Standardized navigation grids for Memon Medical patients.</p>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          { title: "Book Appointment", color: "text-[#043164] bg-[#043164]/10" },
                          { title: "Online Reports", color: "text-indigo-600 bg-indigo-50" },
                          { title: "Find Doctor", color: "text-blue-600 bg-blue-50" },
                          { title: "Emergency 24/7", color: "text-rose-600 bg-rose-50" },
                          { title: "Blood Bank", color: "text-red-655 bg-rose-50/40 text-red-600" },
                          { title: "Patient Portal", color: "text-teal-600 bg-teal-50" },
                        ].map((item, num) => (
                          <div key={num} className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-850 flex flex-col items-center justify-center text-center gap-1">
                            <div className={`h-8 w-8 rounded-full ${item.color} flex items-center justify-center font-bold text-xs`}>
                              {num + 1}
                            </div>
                            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-250 mt-1">{item.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {block.type === "cta" && (
                    <div className="p-8 bg-[#043164] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="space-y-1 text-center sm:text-left">
                        <h3 className="text-xl font-black">{block.content}</h3>
                        <p className="text-zinc-100/80 text-xs max-w-md leading-relaxed">{block.subtitle}</p>
                      </div>
                      <Button className="bg-white text-[#043164] hover:bg-zinc-50 shadow-md flex-shrink-0">
                        {block.ctaText || "Search Experts"}
                      </Button>
                    </div>
                  )}

                  {block.type === "text" && (
                    <div className="p-8 space-y-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">{block.title || "Content Section"}</span>
                      <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
                        {block.content}
                      </p>
                    </div>
                  )}

                  {block.type === "image" && (
                    <div className="aspect-[21/9] bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <ImageIcon className="h-10 w-10 text-zinc-400 relative z-10 animate-pulse" />
                      <div className="absolute bottom-4 left-6 text-white text-xs space-y-1">
                        <strong className="block text-sm">{block.title}</strong>
                        <span className="text-zinc-200 text-[10px]">{block.content}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Right Sidebar: Active Block Settings Inspector */}
        <aside className="w-80 border-l border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 flex flex-col flex-shrink-0 overflow-y-auto p-4 space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-3">
            <Settings className="h-4 w-4 text-zinc-500" />
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Inspector Panel</h3>
          </div>

          {selectedBlock ? (
            <div className="space-y-4">
              <div>
                <Label className="text-[10px] text-zinc-400 font-bold uppercase">Section Type</Label>
                <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-150 dark:border-zinc-850 capitalize mt-1">
                  {selectedBlock.type} Section
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="block-title" className="text-xs">Inspector Section Header</Label>
                <input
                  id="block-title"
                  type="text"
                  value={inspectTitle}
                  onChange={(e) => setInspectTitle(e.target.value)}
                  className="w-full text-xs p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-lg focus:border-[#043164] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="block-content" className="text-xs">Section Main Heading / Content</Label>
                <textarea
                  id="block-content"
                  rows={4}
                  value={inspectContent}
                  onChange={(e) => setInspectContent(e.target.value)}
                  className="w-full text-xs p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-lg focus:border-[#043164] focus:outline-none resize-y"
                />
              </div>

              {(selectedBlock.type === "hero" || selectedBlock.type === "cta") && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="block-sub" className="text-xs">Tagline Description Subtitle</Label>
                    <textarea
                      id="block-sub"
                      rows={3}
                      value={inspectSubtitle}
                      onChange={(e) => setInspectSubtitle(e.target.value)}
                      className="w-full text-xs p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-lg focus:border-[#043164] focus:outline-none resize-y"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="block-cta" className="text-xs">Button CTA Text</Label>
                    <input
                      id="block-cta"
                      type="text"
                      value={inspectCta}
                      onChange={(e) => setInspectCta(e.target.value)}
                      className="w-full text-xs p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-lg focus:border-[#043164] focus:outline-none"
                    />
                  </div>
                </>
              )}

              <Button
                onClick={handleInspectorSave}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs h-9 mt-4"
              >
                Apply Changes
              </Button>
            </div>
          ) : (
            <div className="text-center py-16 text-zinc-400 text-xs">
              Select a section on the layout canvas to edit its properties here.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#043164] border-t-transparent" />
      </div>
    }>
      <BuilderContent />
    </Suspense>
  );
}
