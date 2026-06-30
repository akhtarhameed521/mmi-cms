"use client";

import React from "react";
import Link from "next/link";
import { useLocalData } from "@/hooks/use-local-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Hammer,
  ArrowUpRight,
  PlusCircle,
  Stethoscope,
  Calendar,
  Heart,
  Droplet,
  Check,
  X,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  const { doctors, pages, appointments, updateAppointmentStatus, loading } = useLocalData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#043164] border-t-transparent" />
      </div>
    );
  }

  // Calculate statistics
  const totalDoctors = doctors.length;
  const totalPages = pages.length;
  const pendingAppointments = appointments.filter((a) => a.status === "Pending");
  const recentAppointments = appointments.slice(0, 4);

  const stats = [
    {
      name: "Doctors Active",
      value: totalDoctors.toString(),
      change: "2 departments added recently",
      icon: Stethoscope,
      color: "text-[#043164] dark:text-[#c5a742]",
      bg: "bg-[#043164]/10 dark:bg-[#c5a742]/10",
      href: "/doctors",
    },
    {
      name: "Pages Configured",
      value: totalPages.toString(),
      change: "All metadata SEO optimized",
      icon: FileText,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/30",
      href: "/pages",
    },
    {
      name: "Pending Bookings",
      value: pendingAppointments.length.toString(),
      change: "Requires staff validation",
      icon: Calendar,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/30",
      href: "/appointments",
    },
    {
      name: "Zakat Welfare Fund",
      value: "PKR 4.2M",
      change: "72% of June target reached",
      icon: Heart,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-950/30",
      href: "#welfare",
    },
  ];

  const handleConfirm = (id: string, name: string) => {
    updateAppointmentStatus(id, "Confirmed");
    toast.success(`Appointment for ${name} confirmed successfully!`);
  };

  const handleCancel = (id: string, name: string) => {
    updateAppointmentStatus(id, "Cancelled");
    toast.error(`Appointment for ${name} has been cancelled.`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            MMI Hospital Dashboard
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Memon Medical Institute Hospital CMS. Manage pages, doctor directory, and clinical appointments.
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="border-zinc-200 dark:border-zinc-800">
            <Link href="/doctors/create">
              <PlusCircle className="mr-2 h-4 w-4 text-[#043164]" />
              Add Doctor
            </Link>
          </Button>
          <Button asChild className="bg-[#043164] hover:bg-[#1A3268] text-white shadow-md">
            <Link href="/builder">
              <Hammer className="mr-2 h-4 w-4" />
              Visual Builder
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="border-zinc-200 dark:border-zinc-800 hover:shadow-lg transition-all duration-300 group">
            <Link href={stat.href}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300">
                  {stat.name}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-zinc-950 dark:text-zinc-50">
                  {stat.value}
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                  {stat.change}
                </p>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Appointments Queue Summary */}
        <Card className="lg:col-span-2 border-zinc-200 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Patient Bookings</CardTitle>
              <CardDescription>Verify and schedule incoming patient appointments.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-[#043164] dark:text-[#c5a742] hover:text-[#1A3268]">
              <Link href="/appointments" className="flex items-center gap-1">
                View Queue <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAppointments.length === 0 ? (
              <p className="text-center py-6 text-zinc-400">No recent appointments booked.</p>
            ) : (
              recentAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-zinc-150 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">{apt.patientName}</span>
                      <Badge
                        variant={apt.status === "Confirmed" ? "default" : apt.status === "Pending" ? "outline" : "secondary"}
                        className={
                          apt.status === "Confirmed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/35"
                            : apt.status === "Pending"
                            ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/35 animate-pulse"
                            : apt.status === "Cancelled"
                            ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/35"
                            : "bg-zinc-100 text-zinc-700 border-zinc-200"
                        }
                      >
                        {apt.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Doctor: <strong className="text-zinc-700 dark:text-zinc-300">{apt.doctorName}</strong> ({apt.doctorSpecialty})
                    </p>
                    <p className="text-xs text-zinc-400 font-mono">
                      Schedule: {apt.date} at {apt.time} • Phone: {apt.phone}
                    </p>
                  </div>

                  {apt.status === "Pending" && (
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                        onClick={() => handleCancel(apt.id, apt.patientName)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        className="h-8 bg-[#043164] hover:bg-[#1A3268] text-white"
                        onClick={() => handleConfirm(apt.id, apt.patientName)}
                      >
                        <Check className="h-4 w-4 mr-1" /> Confirm
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Welfare, Blood Bank & Campaigns */}
        <div className="space-y-6" id="welfare">
          {/* Blood Bank Warnings */}
          <Card className="border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-rose-50/50 to-white dark:from-zinc-950 dark:to-zinc-900">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-rose-600">
                <Droplet className="h-5 w-5 fill-rose-600 animate-bounce" />
                <CardTitle className="text-base font-bold">Blood Bank Live Status</CardTitle>
              </div>
              <CardDescription>Subsidized community collection alert level.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">O- Negative Group</span>
                <span className="font-bold text-rose-600 bg-rose-100 dark:bg-rose-950/40 px-2.5 py-0.5 rounded-full text-xs">
                  CRITICAL DRAFT (2 Bags Left)
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">A+ Positive Group</span>
                <span className="font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-0.5 rounded-full text-xs">
                  Normal (18 Bags)
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">B+ Positive Group</span>
                <span className="font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-0.5 rounded-full text-xs">
                  Normal (22 Bags)
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Zakat Tracker Progress */}
          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Zakat Medical Welfare Campaign</CardTitle>
              <CardDescription>Funding diagnostic & surgical fees for deserving patients.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-zinc-500">Collected: PKR 4.2M</span>
                <span className="text-zinc-900 dark:text-zinc-200">Goal: PKR 6.0M</span>
              </div>
              <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#043164] dark:bg-[#c5a742] rounded-full transition-all duration-500" style={{ width: "72%" }} />
              </div>
              <p className="text-[11px] text-zinc-500 leading-normal">
                Donations are strictly audited and dispersed for critical neonatal and oncology surgical aids at MMI.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pages Summary Card */}
      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Core Website Pages</CardTitle>
            <CardDescription>Pages managed by the visual builder editor.</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild className="text-[#043164] dark:text-[#c5a742] hover:text-[#1A3268]">
            <Link href="/pages" className="flex items-center gap-1">
              Manage Pages <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pages.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-xl border border-zinc-250 dark:border-zinc-800 hover:border-[#043164] dark:hover:border-[#c5a742] bg-white dark:bg-zinc-950 transition-all flex flex-col justify-between gap-3 shadow-sm hover:shadow"
            >
              <div>
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">{p.title}</h4>
                <p className="text-xs text-zinc-500 font-mono mt-0.5">{p.slug}</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 line-clamp-2 mt-2">{p.description || "No description set."}</p>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-900">
                <Badge
                  variant={p.status === "Published" ? "default" : "secondary"}
                  className={
                    p.status === "Published"
                      ? "bg-[#043164]/10 text-[#043164] border-[#043164]/20 dark:bg-[#c5a742]/10 dark:text-[#c5a742]"
                      : "bg-zinc-100 text-zinc-650 dark:bg-zinc-800 dark:text-zinc-300"
                  }
                >
                  {p.status}
                </Badge>
                <Button size="sm" variant="ghost" asChild className="h-7 text-xs px-2 text-indigo-600 dark:text-indigo-400">
                  <Link href={`/builder?id=${p.id}`}>
                    <Hammer className="h-3 w-3 mr-1" /> Build
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
