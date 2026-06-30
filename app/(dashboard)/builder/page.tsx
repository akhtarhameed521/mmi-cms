"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useLocalData, Page, PageBlock } from "@/hooks/use-local-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Layout,
  Plus,
  Trash2,
  Save,
  Settings,
  Heading,
  Layers,
  Image as ImageIcon,
  Sparkles,
  Stethoscope,
  Library,
  Search,
  Check,
  MousePointerClick,
} from "lucide-react";
import { toast } from "sonner";

// Wrap search params reading in Suspense as required by Next.js 15+ in client components
function BuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageIdParam = searchParams ? searchParams.get("id") : null;

  const { pages, updatePage, mediaItems, loading } = useLocalData();
  const [selectedPageId, setSelectedPageId] = useState<string>("");
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // Left Sidebar tab: "sections" or "media"
  const [leftActiveTab, setLeftActiveTab] = useState<"sections" | "media">("sections");
  const [mediaSearch, setMediaSearch] = useState("");

  // Right Inspector Dialog triggers for Media Picker
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [modalTargetField, setModalTargetField] = useState<"imageUrl" | "bgImage" | null>(null);

  // Inspector States
  const [inspectTitle, setInspectTitle] = useState("");
  const [inspectContent, setInspectContent] = useState("");
  const [inspectSubtitle, setInspectSubtitle] = useState("");
  const [inspectCta, setInspectCta] = useState("");
  const [inspectImageUrl, setInspectImageUrl] = useState("");
  const [inspectBgImage, setInspectBgImage] = useState("");

  const availableBlocks = [
    { type: "hero", title: "MMI Hero Banner", desc: "Hospital title, tagline & action buttons", icon: Sparkles },
    { type: "features", title: "Quick Links Grid", desc: "6-item grid (Appt, Reports, Emergency)", icon: Layers },
    { type: "cta", title: "Doctor Search Teaser", desc: "Teaser banner promoting Doctor Finder", icon: Stethoscope },
    { type: "text", title: "Rich Description Info", desc: "Subsidized welfare & donation text block", icon: Heading },
    { type: "image", title: "Facility Image Banner", desc: "Full-width visual image block", icon: ImageIcon },
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
        setInspectImageUrl(block.imageUrl || "");
        setInspectBgImage(block.bgImage || "");
      }
    } else {
      setInspectTitle("");
      setInspectContent("");
      setInspectSubtitle("");
      setInspectCta("");
      setInspectImageUrl("");
      setInspectBgImage("");
    }
  }, [selectedBlockId, blocks]);

  const handlePageChange = (id: string) => {
    setSelectedPageId(id);
    router.push(`/builder?id=${id}`);
  };

  const addBlock = (type: string, title: string, extraData?: Partial<PageBlock>) => {
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
          : type === "image"
          ? (extraData?.title || "Facility Image Banner")
          : "Professional medical care with a human touch.",
      subtitle:
        type === "hero"
          ? "Advanced healthcare with a human touch. Here for you, every step of the way."
          : type === "cta"
          ? "Search our medical directories and book consult timings online."
          : "",
      ctaText: type === "hero" || type === "cta" ? "Book Appointment" : undefined,
      ...extraData,
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
          imageUrl: inspectImageUrl || undefined,
          bgImage: inspectBgImage || undefined,
        };
      }
      return b;
    });
    setBlocks(updatedBlocks);
    toast.success("Block properties updated locally. Save page to persist.");
  };

  // Apply image to the currently selected block (if it's an image block or hero block)
  const applyImageToSelected = (url: string, name: string) => {
    if (!selectedBlockId) {
      toast.error("Please select a block on the canvas first.");
      return;
    }
    const currentBlock = blocks.find((b) => b.id === selectedBlockId);
    if (!currentBlock) return;

    if (currentBlock.type === "image") {
      setInspectImageUrl(url);
      const updated = blocks.map((b) => (b.id === selectedBlockId ? { ...b, imageUrl: url } : b));
      setBlocks(updated);
      toast.success(`Applied "${name}" as block image preview. Save page to persist.`);
    } else if (currentBlock.type === "hero") {
      setInspectBgImage(url);
      const updated = blocks.map((b) => (b.id === selectedBlockId ? { ...b, bgImage: url } : b));
      setBlocks(updated);
      toast.success(`Applied "${name}" as hero background banner. Save page to persist.`);
    } else {
      toast.warning(`Cannot apply image. Selected block type "${currentBlock.type}" does not use images.`);
    }
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

  // Filter media items in builder sidebar
  const filteredMedia = mediaItems.filter((item) =>
    item.name.toLowerCase().includes(mediaSearch.toLowerCase())
  );

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
        {/* Left Sidebar: Components Drawer & Media Library */}
        <aside className="w-72 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 flex flex-col flex-shrink-0 overflow-hidden">
          {/* Tab Selection */}
          <div className="flex border-b border-zinc-200 dark:border-zinc-800 flex-shrink-0 bg-zinc-50/50 dark:bg-zinc-900/20">
            <button
              onClick={() => setLeftActiveTab("sections")}
              className={`flex-1 py-3 text-center text-xs font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                leftActiveTab === "sections"
                  ? "border-[#043164] text-[#043164] dark:border-[#c5a742] dark:text-[#c5a742] bg-white dark:bg-zinc-950"
                  : "border-transparent text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200"
              }`}
            >
              <Layout className="h-3.5 w-3.5" />
              Sections
            </button>
            <button
              onClick={() => setLeftActiveTab("media")}
              className={`flex-1 py-3 text-center text-xs font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                leftActiveTab === "media"
                  ? "border-[#043164] text-[#043164] dark:border-[#c5a742] dark:text-[#c5a742] bg-white dark:bg-zinc-950"
                  : "border-transparent text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200"
              }`}
            >
              <Library className="h-3.5 w-3.5" />
              Media Library
            </button>
          </div>

          {/* Scrollable Tab Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {leftActiveTab === "sections" ? (
              <div className="space-y-4">
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
                            <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-50">
                              {item.title}
                            </h4>
                            <p className="text-[10px] text-zinc-400 leading-normal line-clamp-1">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                        <Plus className="h-3.5 w-3.5 text-zinc-400 group-hover:text-[#043164] dark:group-hover:text-[#c5a742]" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Use Media Photos
                  </h3>
                  <p className="text-[10px] text-zinc-450 dark:text-zinc-500 leading-normal">
                    Click `+` to insert as a block, or click the pointer to apply the image to your selected block.
                  </p>
                </div>

                {/* Local search in sidebar */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
                  <Input
                    placeholder="Filter photos..."
                    value={mediaSearch}
                    onChange={(e) => setMediaSearch(e.target.value)}
                    className="pl-8 text-xs h-8 bg-zinc-50/50 dark:bg-zinc-900/30"
                  />
                </div>

                {/* Sidebar Image Grid */}
                {filteredMedia.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                    <ImageIcon className="h-8 w-8 text-zinc-300 mx-auto mb-2" />
                    <p className="text-[10px] text-zinc-400">No images match filter.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {filteredMedia.map((item) => (
                      <div
                        key={item.id}
                        className="group relative aspect-video rounded-lg overflow-hidden border border-zinc-205 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900"
                      >
                        <img src={item.url} alt={item.name} className="h-full w-full object-cover" />
                        
                        {/* Hover Overlay with mini actions */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => addBlock("image", "Facility Image Banner", { imageUrl: item.url, title: item.name, content: "Custom uploaded clinical image banner" })}
                            className="p-1 rounded bg-white hover:bg-zinc-100 text-[#043164] transition-colors"
                            title="Insert as new Image Block"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                          
                          {selectedBlock && (selectedBlock.type === "image" || selectedBlock.type === "hero") && (
                            <button
                              onClick={() => applyImageToSelected(item.url, item.name)}
                              className="p-1 rounded bg-[#043164] hover:bg-[#1A3268] text-white transition-colors"
                              title="Apply to Selected Block"
                            >
                              <MousePointerClick className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                        <div className="absolute bottom-0 inset-x-0 bg-black/40 px-1 py-0.5 text-[8px] text-white truncate text-center">
                          {item.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="pt-2">
                  <Button asChild size="sm" variant="outline" className="w-full text-xs h-8 border-zinc-250 dark:border-zinc-800">
                    <Link href="/media">
                      Go to Media Library
                    </Link>
                  </Button>
                </div>
              </div>
            )}
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
                    <div 
                      className="p-10 text-center space-y-4 relative overflow-hidden bg-cover bg-center transition-all duration-300"
                      style={block.bgImage ? { backgroundImage: `linear-gradient(rgba(4, 49, 100, 0.85), rgba(4, 49, 100, 0.95)), url(${block.bgImage})` } : {}}
                    >
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full relative z-10 ${
                        block.bgImage 
                          ? "text-[#c5a742] bg-[#c5a742]/10" 
                          : "text-[#043164] dark:text-[#c5a742] bg-[#043164]/10 dark:bg-[#c5a742]/10"
                      }`}>
                        Hospital Hero Banner
                      </span>
                      <h1 className={`text-3xl font-black leading-tight relative z-10 ${block.bgImage ? "text-white" : "text-zinc-950 dark:text-zinc-50"}`}>
                        {block.content}
                      </h1>
                      <p className={`text-sm max-w-lg mx-auto leading-relaxed relative z-10 ${block.bgImage ? "text-zinc-250" : "text-zinc-500 dark:text-zinc-400"}`}>
                        {block.subtitle || "Advanced healthcare tagline banner template."}
                      </p>
                      <div className="pt-2 flex gap-3 justify-center relative z-10">
                        <Button className={block.bgImage ? "bg-[#c5a742] hover:bg-[#b09230] text-[#043164]" : "bg-[#043164] hover:bg-[#1A3268] text-white shadow"}>
                          {block.ctaText || "Book Appointment"}
                        </Button>
                        <Button variant="outline" className={block.bgImage ? "border-zinc-350 text-white bg-white/5 hover:bg-white/10" : "border-zinc-200 dark:border-zinc-800"}>
                          View Reports
                        </Button>
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
                      {block.imageUrl ? (
                        <img src={block.imageUrl} alt={block.title} className="absolute inset-0 h-full w-full object-cover transition-all duration-300" />
                      ) : (
                        <ImageIcon className="h-10 w-10 text-zinc-400 relative z-10 animate-pulse" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-6 text-white text-xs space-y-1 relative z-10">
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

              {/* Show Image Input for Image Blocks */}
              {selectedBlock.type === "image" && (
                <div className="space-y-1.5">
                  <Label htmlFor="image-url" className="text-xs">Image File URL</Label>
                  <div className="flex gap-2">
                    <input
                      id="image-url"
                      type="text"
                      value={inspectImageUrl}
                      onChange={(e) => setInspectImageUrl(e.target.value)}
                      className="w-full text-xs p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-lg focus:border-[#043164] focus:outline-none"
                      placeholder="/assets/uploads/image.png"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setModalTargetField("imageUrl");
                        setIsMediaModalOpen(true);
                      }}
                      className="text-xs h-9 border-zinc-200 dark:border-zinc-800 whitespace-nowrap px-3"
                    >
                      Browse
                    </Button>
                  </div>
                </div>
              )}

              {/* Show BgImage and other controls for Hero Blocks */}
              {selectedBlock.type === "hero" && (
                <div className="space-y-1.5">
                  <Label htmlFor="bg-image-url" className="text-xs">Background Banner Image</Label>
                  <div className="flex gap-2">
                    <input
                      id="bg-image-url"
                      type="text"
                      value={inspectBgImage}
                      onChange={(e) => setInspectBgImage(e.target.value)}
                      className="w-full text-xs p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-lg focus:border-[#043164] focus:outline-none"
                      placeholder="/assets/uploads/hero-bg.png"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setModalTargetField("bgImage");
                        setIsMediaModalOpen(true);
                      }}
                      className="text-xs h-9 border-zinc-200 dark:border-zinc-800 whitespace-nowrap px-3"
                    >
                      Browse
                    </Button>
                  </div>
                </div>
              )}

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
                className="w-full bg-[#043164] hover:bg-[#1A3268] text-white text-xs h-9 mt-4"
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

      {/* Media Select Dialog Overlay */}
      {isMediaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col mx-4">
            <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-850 pb-3 flex-shrink-0">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Select Image</h3>
                <p className="text-[10px] text-zinc-450 dark:text-zinc-500 mt-0.5">Choose an image from your clinic media assets below.</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setIsMediaModalOpen(false)}>Close</Button>
            </div>
            
            <div className="overflow-y-auto flex-1 p-1 min-h-[250px]">
              {mediaItems.length === 0 ? (
                <div className="text-center py-16 text-zinc-400 text-xs border border-dashed rounded-xl border-zinc-200 dark:border-zinc-800">
                  No images in Media Library. Upload some under <Link href="/media" className="underline text-[#043164] dark:text-[#c5a742]">Media Library</Link>.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {mediaItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (modalTargetField === "imageUrl") {
                          setInspectImageUrl(item.url);
                        } else if (modalTargetField === "bgImage") {
                          setInspectBgImage(item.url);
                        }
                        setIsMediaModalOpen(false);
                        toast.success(`Selected image: ${item.name}. Click 'Apply Changes' in the inspector panel to sync.`);
                      }}
                      className="group relative aspect-video rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 cursor-pointer hover:border-[#043164] dark:hover:border-[#c5a742] transition-all bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center shadow-sm"
                    >
                      <img src={item.url} alt={item.name} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold p-2 text-center">
                        <Check className="h-5 w-5 mb-1 text-emerald-450 text-emerald-400" />
                        <span className="truncate w-full">{item.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
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
