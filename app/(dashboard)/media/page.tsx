"use client";

import React, { useState, useRef } from "react";
import { useLocalData, MediaItem } from "@/hooks/use-local-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  UploadCloud,
  Copy,
  Check,
  Trash2,
  Image as ImageIcon,
  Search,
  ExternalLink,
  ArrowUpDown,
} from "lucide-react";
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
} from "@/components/ui/alert-dialog";

export default function MediaLibraryPage() {
  const { mediaItems, addMediaItem, deleteMediaItem, loading } = useLocalData();
  const [search, setSearch] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "name" | "size">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [deleteItem, setDeleteItem] = useState<MediaItem | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#043164] border-t-transparent" />
      </div>
    );
  }

  // Handle file upload api call
  const uploadFile = async (file: File) => {
    // Basic validation
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      toast.error(`Invalid file type: ${file.type}. Please upload an image.`);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Max size is 5MB.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      
      if (data.success) {
        const newItem: MediaItem = {
          id: "media-" + Date.now(),
          name: data.name || file.name,
          url: data.url,
          type: data.type || file.type,
          size: data.size || file.size,
          createdAt: new Date().toISOString().split("T")[0],
        };
        addMediaItem(newItem);
        toast.success(`"${newItem.name}" uploaded successfully!`);
      } else {
        toast.error("Failed to upload image.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("An error occurred during file upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleCopyUrl = (item: MediaItem) => {
    const absoluteUrl = window.location.origin + item.url;
    navigator.clipboard.writeText(absoluteUrl);
    setCopiedId(item.id);
    toast.success("Image URL copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteConfirm = () => {
    if (deleteItem) {
      deleteMediaItem(deleteItem.id);
      toast.error(`"${deleteItem.name}" deleted.`);
      setDeleteItem(null);
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  // Sort and filter items
  const filteredItems = mediaItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    let comparison = 0;
    if (sortBy === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === "size") {
      comparison = a.size - b.size;
    } else {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Media Library
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Upload, store, and select images to use across your clinic page builders and physician bio headers.
          </p>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? "border-[#043164] bg-[#043164]/5 dark:border-[#c5a742] dark:bg-[#c5a742]/5"
            : "border-zinc-200 hover:border-[#043164] hover:bg-zinc-50/50 dark:border-zinc-800 dark:hover:border-[#c5a742] dark:hover:bg-zinc-900/30"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          disabled={isUploading}
        />
        <div className="p-4 rounded-full bg-[#043164]/10 dark:bg-[#c5a742]/10 text-[#043164] dark:text-[#c5a742] mb-3">
          <UploadCloud className="h-8 w-8 animate-bounce" />
        </div>
        {isUploading ? (
          <div className="text-center space-y-1">
            <h3 className="font-bold text-sm text-zinc-850 dark:text-zinc-150">Uploading Image...</h3>
            <p className="text-xs text-zinc-450">Please wait while the server writes the file.</p>
          </div>
        ) : (
          <div className="text-center space-y-1">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
              Drag & drop image here, or <span className="text-[#043164] dark:text-[#c5a742] underline">browse files</span>
            </h3>
            <p className="text-xs text-zinc-450 dark:text-zinc-500">
              Supports JPEG, PNG, WEBP, and GIF up to 5MB.
            </p>
          </div>
        )}
      </div>

      {/* Filter and Sorting Toolbar */}
      <Card className="border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/30">
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search images by filename..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
            />
          </div>

          {/* Sort parameters */}
          <div className="flex items-center gap-3">
            <Label className="text-xs font-semibold text-zinc-450 dark:text-zinc-500 whitespace-nowrap">Sort by:</Label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-lg focus:outline-none text-zinc-700 dark:text-zinc-300"
            >
              <option value="date">Date Uploaded</option>
              <option value="name">File Name</option>
              <option value="size">File Size</option>
            </select>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleSortOrder}
              className="h-9 w-9 border-zinc-200 dark:border-zinc-800"
              title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
            >
              <ArrowUpDown className="h-4 w-4 text-zinc-500" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Media Grid */}
      {sortedItems.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950/50">
          <ImageIcon className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">No media assets found</h3>
          <p className="text-xs text-zinc-450 dark:text-zinc-500 mt-1">
            Search query matches zero results or no files have been uploaded yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedItems.map((item) => (
            <Card
              key={item.id}
              className="group border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
            >
              {/* Image Preview Container */}
              <div className="aspect-video w-full bg-zinc-100 dark:bg-zinc-900 relative overflow-hidden flex items-center justify-center">
                <img
                  src={item.url}
                  alt={item.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                
                {/* Hover overlay actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 bg-white hover:bg-zinc-100 text-zinc-750"
                    onClick={() => handleCopyUrl(item)}
                    title="Copy Image URL"
                  >
                    {copiedId === item.id ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 bg-white hover:bg-zinc-100 text-zinc-750"
                    asChild
                    title="Open in new window"
                  >
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8 bg-rose-600 hover:bg-rose-500 text-white"
                    onClick={() => setDeleteItem(item)}
                    title="Delete Image"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Card Meta details */}
              <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate" title={item.name}>
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-550 mt-0.5">
                    {item.type.split("/")[1]?.toUpperCase() || "IMG"} File
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-900 pt-2 text-[10px] text-zinc-500">
                  <span>{formatBytes(item.size)}</span>
                  <span>{item.createdAt}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
        <AlertDialogContent className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;<strong className="text-zinc-900 dark:text-zinc-100">{deleteItem?.name}</strong>&quot; from local storage. 
              Any web pages using this image URL will display a broken visual link.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-zinc-200 dark:border-zinc-800">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
