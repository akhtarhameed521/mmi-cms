"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLocalData, Page } from "@/hooks/use-local-data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowUp, 
  ArrowDown, 
  ChevronRight, 
  Folder, 
  FolderPlus, 
  Link2, 
  Plus, 
  Save, 
  Trash2, 
  Edit, 
  Layers, 
  ExternalLink,
  ChevronLeft,
  ChevronsUpDown
} from "lucide-react";
import { toast } from "sonner";

interface NavbarItem {
  id: number;
  label: string;
  url: string | null;
  pageId: number | null;
  parentId: number | null;
  order: number;
  isOpenNewTab: boolean;
  page?: { id: number; title: string; slug: string } | null;
  children?: NavbarItem[];
}

export default function NavigationPage() {
  const { pages, loading: pagesLoading } = useLocalData();
  const [navbarItems, setNavbarItems] = useState<NavbarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<NavbarItem | null>(null);

  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [pageId, setPageId] = useState<string>("none");
  const [parentId, setParentId] = useState<string>("none");
  const [isOpenNewTab, setIsOpenNewTab] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load navbar tree
  const fetchNavbarTree = async () => {
    try {
      const token = localStorage.getItem("mmi_token");
      if (!token) return;

      const res = await fetch("http://localhost:5000/api/cms/navbar/tree", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setNavbarItems(data.data);
      }
    } catch (error) {
      console.error("Error fetching navbar tree:", error);
      toast.error("Failed to load navigation menu items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNavbarTree();
  }, []);

  // Sync Form states when switching items
  const startEdit = (item: NavbarItem) => {
    setSelectedItem(item);
    setIsEditing(true);
    setLabel(item.label);
    setUrl(item.url || "");
    setPageId(item.pageId ? item.pageId.toString() : "none");
    setParentId(item.parentId ? item.parentId.toString() : "none");
    setIsOpenNewTab(item.isOpenNewTab);
  };

  const startCreate = () => {
    setSelectedItem(null);
    setIsEditing(false);
    setLabel("");
    setUrl("");
    setPageId("none");
    setParentId("none");
    setIsOpenNewTab(false);
  };

  // Convert nested tree to a flat list for parent dropdowns (avoid circular nesting)
  const getFlatItems = (nodes: NavbarItem[], depth = 0): { id: number; label: string; depth: number }[] => {
    let list: { id: number; label: string; depth: number }[] = [];
    nodes.forEach(node => {
      list.push({ id: node.id, label: node.label, depth });
      if (node.children && node.children.length > 0) {
        list = [...list, ...getFlatItems(node.children, depth + 1)];
      }
    });
    return list;
  };
  
  const flatNavbarItems = getFlatItems(navbarItems);

  // When Page association is selected, automatically update URL slug
  const handlePageSelect = (val: string) => {
    setPageId(val);
    if (val !== "none") {
      const associatedPage = pages.find((p) => p.id === val);
      if (associatedPage) {
        // Auto-generate preview slug
        setUrl(`/pages/${associatedPage.slug}`);
      }
    } else {
      setUrl("");
    }
  };

  // Delete Navbar item
  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("mmi_token");
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:5000/api/cms/navbar/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        toast.error("Menu item deleted");
        if (selectedItem?.id === id) {
          startCreate();
        }
        fetchNavbarTree();
      } else {
        toast.error(data.message || "Failed to delete item");
      }
    } catch (err) {
      toast.error("Network error deleting item");
    }
  };

  // Create or Update form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label) {
      toast.error("Menu Label is required");
      return;
    }

    const token = localStorage.getItem("mmi_token");
    if (!token) return;

    setIsSubmitting(true);
    try {
      const payload = {
        label,
        url: url || null,
        pageId: pageId !== "none" ? parseInt(pageId, 10) : null,
        parentId: parentId !== "none" ? parseInt(parentId, 10) : null,
        isOpenNewTab,
        order: selectedItem ? selectedItem.order : navbarItems.length
      };

      const urlEndpoint = selectedItem 
        ? `http://localhost:5000/api/cms/navbar/${selectedItem.id}`
        : "http://localhost:5000/api/cms/navbar";

      const response = await fetch(urlEndpoint, {
        method: selectedItem ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (data.success) {
        toast.success(selectedItem ? "Menu item updated" : "Menu item created");
        startCreate();
        fetchNavbarTree();
      } else {
        toast.error(data.message || "Operation failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network communication error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Locate and modify node positions in local tree state
  const findAndMove = (
    list: NavbarItem[], 
    targetId: number, 
    direction: "up" | "down" | "promote" | "demote"
  ): boolean => {
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === targetId) {
        if (direction === "up" && i > 0) {
          // Swap with previous node
          const temp = list[i];
          list[i] = list[i - 1];
          list[i - 1] = temp;
          return true;
        }
        if (direction === "down" && i < list.length - 1) {
          // Swap with next node
          const temp = list[i];
          list[i] = list[i + 1];
          list[i + 1] = temp;
          return true;
        }
        return false;
      }
      if (list[i].children && list[i].children!.length > 0) {
        const moved = findAndMove(list[i].children!, targetId, direction);
        if (moved) return true;
      }
    }
    return false;
  };

  // Re-adjust node orders locally
  const moveItem = (id: number, direction: "up" | "down") => {
    const updatedTree = JSON.parse(JSON.stringify(navbarItems));
    const successfullyMoved = findAndMove(updatedTree, id, direction);
    if (successfullyMoved) {
      // Re-assign order numbers sequentially
      const assignOrders = (nodes: NavbarItem[], parentVal: number | null = null) => {
        nodes.forEach((node, index) => {
          node.order = index;
          node.parentId = parentVal;
          if (node.children && node.children.length > 0) {
            assignOrders(node.children, node.id);
          }
        });
      };
      assignOrders(updatedTree);
      setNavbarItems(updatedTree);
      toast.info("Order adjusted locally. Click 'Save Hierarchy' to apply.");
    }
  };

  // Save the entire re-ordered nodes to the API
  const handleSaveOrder = async () => {
    const token = localStorage.getItem("mmi_token");
    if (!token) return;

    // Build flat array of items for order payload
    const getPayloadItems = (nodes: NavbarItem[], parentVal: number | null = null): any[] => {
      let list: any[] = [];
      nodes.forEach((node, index) => {
        list.push({
          id: node.id,
          order: index,
          parentId: parentVal
        });
        if (node.children && node.children.length > 0) {
          list = [...list, ...getPayloadItems(node.children, node.id)];
        }
      });
      return list;
    };

    const reorderPayload = {
      items: getPayloadItems(navbarItems)
    };

    try {
      const res = await fetch("http://localhost:5000/api/cms/navbar/reorder", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(reorderPayload)
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Navigation menu hierarchy saved successfully!");
        fetchNavbarTree();
      } else {
        toast.error(data.message || "Failed to save menu ordering");
      }
    } catch (err) {
      toast.error("Network error saving hierarchy");
    }
  };

  // Recursive Tree Rendering
  const renderTree = (nodes: NavbarItem[], depth = 0) => {
    return nodes.map((node, index) => (
      <div key={node.id} className="space-y-2">
        <div 
          onClick={() => startEdit(node)}
          className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
            selectedItem?.id === node.id 
              ? "border-[#043164] bg-[#043164]/5 dark:border-[#c5a742] dark:bg-[#c5a742]/10" 
              : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/40 backdrop-blur-sm"
          }`}
          style={{ marginLeft: `${depth * 1.5}rem` }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="text-zinc-400">
              {depth > 0 ? (
                <ChevronRight className="h-4 w-4 text-[#c5a742] dark:text-[#c5a742]" />
              ) : (
                <Folder className="h-4 w-4 text-[#043164] dark:text-zinc-400" />
              )}
            </div>
            <div className="truncate">
              <span className="font-bold text-sm text-zinc-900 dark:text-zinc-150">{node.label}</span>
              <span className="text-[10px] text-zinc-400 block truncate font-mono">
                {node.url || "(No url linked)"}
              </span>
            </div>
            {node.isOpenNewTab && (
              <ExternalLink className="h-3 w-3 text-zinc-400 flex-shrink-0" />
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0" onClick={e => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-zinc-400 hover:text-zinc-650"
              onClick={() => moveItem(node.id, "up")}
              disabled={index === 0}
              title="Move Up"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-zinc-400 hover:text-zinc-650"
              onClick={() => moveItem(node.id, "down")}
              disabled={index === nodes.length - 1}
              title="Move Down"
            >
              <ArrowDown className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-rose-500 hover:bg-rose-50"
              onClick={() => handleDelete(node.id)}
              title="Delete Item"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        {node.children && node.children.length > 0 && (
          <div className="space-y-2">
            {renderTree(node.children, depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  if (loading || pagesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#043164] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Navigation Menu
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Build and manage headers, dropdown link tree hierarchies, and route connections.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleSaveOrder} className="bg-[#043164] hover:bg-[#1A3268] text-white shadow-md">
            <Save className="mr-2 h-4 w-4" />
            Save Hierarchy
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        {/* Left Side: Tree Structure View */}
        <Card className="md:col-span-3 border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle>Menu Item Tree Hierarchy</CardTitle>
              <CardDescription>Drag or use arrows to order; items nest under parent nodes.</CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={startCreate} className="border-zinc-200 dark:border-zinc-855 border-zinc-300">
              <Plus className="mr-1.5 h-3.5 w-3.5 text-[#043164] dark:text-[#c5a742]" /> Add Link
            </Button>
          </CardHeader>
          <CardContent className="space-y-3 min-h-[300px]">
            {navbarItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-center">
                <Layers className="h-10 w-10 text-zinc-300 mb-3" />
                <h3 className="text-sm font-bold text-zinc-900">No navigation items</h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-xs leading-normal">
                  Click the plus icon to add your first header node or associate a CMS page.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {renderTree(navbarItems)}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Side: Add / Edit Form */}
        <Card className="md:col-span-2 border-zinc-200 dark:border-zinc-800">
          <CardHeader>
            <CardTitle>{isEditing ? `Edit Link: ${selectedItem?.label}` : "Add Navigation Link"}</CardTitle>
            <CardDescription>
              {isEditing ? "Modify the properties of this navigation menu node." : "Insert a new link or menu directory in the header."}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="menu-label">Menu Label</Label>
                <Input
                  id="menu-label"
                  placeholder="e.g. Services, About Us"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="border-zinc-200 dark:border-zinc-800"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="page-select">Associate CMS Page (Optional)</Label>
                <Select value={pageId} onValueChange={handlePageSelect}>
                  <SelectTrigger className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <SelectValue placeholder="Link to a CMS page..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Custom / No Page Link</SelectItem>
                    {pages.map((page) => (
                      <SelectItem key={page.id} value={page.id}>
                        {page.title} ({page.slug})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="menu-url">Redirect Path / URL</Label>
                <Input
                  id="menu-url"
                  placeholder="e.g. /doctors, /contact, or full url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="border-zinc-200 dark:border-zinc-800 font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parent-select">Parent Item (For Nesting)</Label>
                <Select value={parentId} onValueChange={setParentId}>
                  <SelectTrigger className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <SelectValue placeholder="Select parent menu..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Root Level (No Parent)</SelectItem>
                    {flatNavbarItems
                      .filter(item => !selectedItem || item.id !== selectedItem.id) // Cannot nest under self
                      .map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {"—".repeat(item.depth)} {item.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-900">
                <div className="space-y-0.5">
                  <Label htmlFor="new-tab" className="text-sm font-semibold">Open in New Tab</Label>
                  <p className="text-[10px] text-zinc-400">Trigger target=&quot;_blank&quot; redirection.</p>
                </div>
                <Switch
                  id="new-tab"
                  checked={isOpenNewTab}
                  onCheckedChange={setIsOpenNewTab}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-900 pt-6">
              {isEditing && (
                <Button type="button" variant="outline" onClick={startCreate} className="border-zinc-200 dark:border-zinc-800">
                  Cancel Edit
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting} className="bg-[#043164] hover:bg-[#1A3268] text-white">
                {isSubmitting ? "Processing..." : isEditing ? "Update Link" : "Add to Menu"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
