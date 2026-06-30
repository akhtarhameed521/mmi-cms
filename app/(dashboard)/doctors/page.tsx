"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLocalData } from "@/hooks/use-local-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Search, Edit, Trash2, Calendar, Stethoscope, Clock, CheckCircle2, AlertCircle } from "lucide-react";
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

export default function DoctorsListPage() {
  const { doctors, deleteDoctor, loading } = useLocalData();
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("ALL");
  const [onlyAvailableToday, setOnlyAvailableToday] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#043164] border-t-transparent" />
      </div>
    );
  }

  // Get unique specialties for filter dropdown
  const specialtiesList = Array.from(new Set(doctors.map((d) => d.specialty)));

  // Filter doctors
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(search.toLowerCase()) ||
      doctor.quals.toLowerCase().includes(search.toLowerCase());
    
    const matchesSpecialty = specialty === "ALL" || doctor.specialty === specialty;
    const matchesAvailable = !onlyAvailableToday || doctor.availableToday;

    return matchesSearch && matchesSpecialty && matchesAvailable;
  });

  const handleDelete = (slug: string, name: string) => {
    deleteDoctor(slug);
    toast.error(`${name} profile has been deleted.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Doctors Directory
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Manage medical professionals, specialist clinics, and consult timings for Memon Medical Institute.
          </p>
        </div>
        <Button asChild className="bg-[#043164] hover:bg-[#1A3268] text-white shadow-md">
          <Link href="/doctors/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Doctor Profile
          </Link>
        </Button>
      </div>

      {/* Filter Toolbar */}
      <Card className="border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/30">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-end">
          {/* Search bar */}
          <div className="flex-1 space-y-1.5 w-full">
            <Label htmlFor="search-doctors">Search Doctors</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <Input
                id="search-doctors"
                placeholder="Search by name, degrees or qualifications..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
              />
            </div>
          </div>

          {/* Specialty Dropdown */}
          <div className="w-full md:w-56 space-y-1.5">
            <Label>Filter Specialty</Label>
            <Select value={specialty} onValueChange={setSpecialty}>
              <SelectTrigger className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
                <SelectValue placeholder="All Specialties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Specialties</SelectItem>
                {specialtiesList.map((spec) => (
                  <SelectItem key={spec} value={spec}>
                    {spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Available today toggle */}
          <div className="flex items-center gap-2 pb-2 h-10 select-none">
            <input
              type="checkbox"
              id="available-today"
              checked={onlyAvailableToday}
              onChange={(e) => setOnlyAvailableToday(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-[#043164] focus:ring-[#043164]"
            />
            <Label htmlFor="available-today" className="font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer">
              Available Today Only
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Grid of Doctor Cards */}
      {filteredDoctors.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950 text-center">
          <Stethoscope className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mb-3 animate-pulse" />
          <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">No doctors match your query</h3>
          <p className="text-zinc-500 text-sm mt-1 max-w-sm">
            Try adjusting your search criteria or filter options to locate the profile.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDoctors.map((doctor) => (
            <Card
              key={doctor.slug}
              className="border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Visual Header */}
                <div className="p-6 pb-4 flex items-start gap-4">
                  <div className="h-16 w-16 rounded-full bg-[#043164]/10 dark:bg-[#c5a742]/10 flex items-center justify-center text-[#043164] dark:text-[#c5a742] border border-[#043164]/20 dark:border-[#c5a742]/20 flex-shrink-0">
                    <Stethoscope size={28} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-100 line-clamp-1">
                        {doctor.name}
                      </h3>
                      <Badge
                        variant={doctor.availableToday ? "default" : "outline"}
                        className={
                          doctor.availableToday
                            ? "bg-[#043164]/10 text-[#043164] border-[#043164]/20 dark:bg-[#c5a742]/10 dark:text-[#c5a742]"
                            : "bg-zinc-50 text-zinc-400 border-zinc-200"
                        }
                      >
                        {doctor.availableToday ? (
                          <CheckCircle2 className="h-3 w-3 mr-1 inline fill-[#043164]/20 dark:fill-transparent" />
                        ) : (
                          <AlertCircle className="h-3 w-3 mr-1 inline" />
                        )}
                        {doctor.availableToday ? "Available" : "Away"}
                      </Badge>
                    </div>
                    <p className="text-xs font-bold text-[#043164] dark:text-[#c5a742] uppercase tracking-wider">
                      {doctor.specialty}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                      {doctor.quals}
                    </p>
                  </div>
                </div>

                {/* Details list */}
                <div className="px-6 py-3 border-t border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-950/20 text-xs space-y-2 text-zinc-600 dark:text-zinc-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-zinc-400" />
                    <span>Days: <strong className="text-zinc-900 dark:text-zinc-200">{doctor.timingDays}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-zinc-400" />
                    <span>Hours: <strong className="text-zinc-900 dark:text-zinc-200">{doctor.timings}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Exp:</span>
                    <span className="text-zinc-900 dark:text-zinc-200">{doctor.experience}</span>
                  </div>
                </div>

                {/* Services Tags teaser */}
                <div className="p-6 pt-4 pb-0">
                  <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">Services</p>
                  <div className="flex flex-wrap gap-1.5">
                    {doctor.services.slice(0, 3).map((srv, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 font-medium"
                      >
                        {srv}
                      </span>
                    ))}
                    {doctor.services.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 text-zinc-400 font-bold">
                        +{doctor.services.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-6 pt-4 flex gap-2 justify-end">
                <Button variant="outline" size="sm" asChild className="h-9 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100">
                  <Link href={`/doctors/${doctor.slug}`}>
                    <Edit className="h-3.5 w-3.5 mr-1" /> Edit Profile
                  </Link>
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-9 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the profile of <strong className="text-zinc-900 dark:text-zinc-100">{doctor.name}</strong> from the directory list.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-zinc-200 dark:border-zinc-800">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(doctor.slug, doctor.name)}
                        className="bg-rose-600 text-white hover:bg-rose-700"
                      >
                        Yes, Delete Profile
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
