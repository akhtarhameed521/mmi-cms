"use client";

import React, { useState } from "react";
import { useLocalData, Appointment } from "@/hooks/use-local-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  Search,
  Check,
  X,
  Trash2,
  CheckSquare,
  Clock,
  User,
  Filter,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AppointmentsQueuePage() {
  const { appointments, updateAppointmentStatus, deleteAppointment, loading } = useLocalData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [doctorFilter, setDoctorFilter] = useState("ALL");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#043164] border-t-transparent" />
      </div>
    );
  }

  // Aggregate stats
  const total = appointments.length;
  const pending = appointments.filter((a) => a.status === "Pending").length;
  const confirmed = appointments.filter((a) => a.status === "Confirmed").length;
  const completed = appointments.filter((a) => a.status === "Completed").length;

  // Doctors list for filter
  const doctorsList = Array.from(new Set(appointments.map((a) => a.doctorName)));

  // Filtered appointments
  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch = apt.patientName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || apt.status === statusFilter;
    const matchesDoctor = doctorFilter === "ALL" || apt.doctorName === doctorFilter;

    return matchesSearch && matchesStatus && matchesDoctor;
  });

  const handleConfirm = (id: string, name: string) => {
    updateAppointmentStatus(id, "Confirmed");
    toast.success(`Appointment for ${name} confirmed!`);
  };

  const handleComplete = (id: string, name: string) => {
    updateAppointmentStatus(id, "Completed");
    toast.success(`Appointment for ${name} marked as completed.`);
  };

  const handleCancel = (id: string, name: string) => {
    updateAppointmentStatus(id, "Cancelled");
    toast.error(`Appointment for ${name} cancelled.`);
  };

  const handleDelete = (id: string, name: string) => {
    deleteAppointment(id);
    toast.error(`Booking record for ${name} has been deleted.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
          Appointments Queue
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Review patient booking requests, confirm consults, and manage the outpatient clinic queues.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-zinc-200 dark:border-zinc-800 bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 font-semibold uppercase">Total Requests</p>
              <h3 className="text-2xl font-black mt-1 text-zinc-900 dark:text-zinc-50">{total}</h3>
            </div>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <User size={20} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 dark:border-zinc-800 bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 font-semibold uppercase">Pending Staff Action</p>
              <h3 className="text-2xl font-black mt-1 text-amber-600 dark:text-amber-400">{pending}</h3>
            </div>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Clock size={20} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 dark:border-zinc-800 bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 font-semibold uppercase">Confirmed Slots</p>
              <h3 className="text-2xl font-black mt-1 text-[#043164] dark:text-[#c5a742]">{confirmed}</h3>
            </div>
            <div className="p-2 bg-[#043164]/10 dark:bg-[#c5a742]/10 text-[#043164] dark:text-[#c5a742] rounded-lg">
              <Check size={20} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 dark:border-zinc-800 bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 font-semibold uppercase">Completed Consults</p>
              <h3 className="text-2xl font-black mt-1 text-blue-600 dark:text-blue-400">{completed}</h3>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <CheckSquare size={20} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter panel */}
      <Card className="border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/30">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-end">
          {/* Patient name search */}
          <div className="flex-1 space-y-1.5 w-full">
            <Label htmlFor="search-pt">Patient Name</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <Input
                id="search-pt"
                placeholder="Search patient by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
              />
            </div>
          </div>

          {/* Doctor filter */}
          <div className="w-full md:w-56 space-y-1.5">
            <Label>Filter Doctor</Label>
            <Select value={doctorFilter} onValueChange={setDoctorFilter}>
              <SelectTrigger className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
                <SelectValue placeholder="All Doctors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Doctors</SelectItem>
                {doctorsList.map((doc) => (
                  <SelectItem key={doc} value={doc}>
                    {doc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status filter */}
          <div className="w-full md:w-48 space-y-1.5">
            <Label>Filter Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Confirmed">Confirmed</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Table */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50/55 dark:bg-zinc-900/50">
            <TableRow>
              <TableHead className="font-bold text-zinc-700 dark:text-zinc-300">Patient Name</TableHead>
              <TableHead className="font-bold text-zinc-700 dark:text-zinc-300">Doctor Profile</TableHead>
              <TableHead className="font-bold text-zinc-700 dark:text-zinc-300">Appt Date & Time</TableHead>
              <TableHead className="font-bold text-zinc-700 dark:text-zinc-300">Phone</TableHead>
              <TableHead className="font-bold text-zinc-700 dark:text-zinc-300">Status</TableHead>
              <TableHead className="text-right font-bold text-zinc-700 dark:text-zinc-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-zinc-400">
                  No appointments match the filter parameters.
                </TableCell>
              </TableRow>
            ) : (
              filteredAppointments.map((apt) => (
                <TableRow key={apt.id} className="hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10">
                  <TableCell className="font-bold text-zinc-900 dark:text-zinc-100">
                    {apt.patientName}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="font-semibold text-xs text-zinc-800 dark:text-zinc-200">{apt.doctorName}</p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-450 uppercase font-medium">{apt.doctorSpecialty}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 text-xs">
                      <Calendar size={13} className="text-zinc-400" />
                      <span>{apt.date} at {apt.time}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-zinc-500 font-mono">{apt.phone}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        apt.status === "Confirmed"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-450 dark:border-emerald-900/35"
                          : apt.status === "Pending"
                          ? "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/35"
                          : apt.status === "Cancelled"
                          ? "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/20 dark:text-rose-450 dark:border-rose-900/35"
                          : "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/20 dark:text-blue-405 dark:border-blue-900/35"
                      }
                    >
                      {apt.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Confirm Action */}
                      {apt.status === "Pending" && (
                        <>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 text-[#043164] border-[#043164]/20 hover:bg-[#043164]/10"
                            onClick={() => handleConfirm(apt.id, apt.patientName)}
                            title="Confirm Appointment"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 text-rose-600 border-rose-100 hover:bg-rose-50 hover:text-rose-700"
                            onClick={() => handleCancel(apt.id, apt.patientName)}
                            title="Cancel Appointment"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}

                      {/* Complete Action */}
                      {apt.status === "Confirmed" && (
                        <Button
                          size="sm"
                          className="h-8 bg-[#043164] hover:bg-[#1A3268] text-white"
                          onClick={() => handleComplete(apt.id, apt.patientName)}
                        >
                          <CheckSquare className="h-3.5 w-3.5 mr-1" /> Complete
                        </Button>
                      )}

                      {/* Cancelled/Completed Actions - allow delete */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-400 hover:text-rose-600"
                            title="Delete Record"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Appointment Record?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove the appointment log of <strong className="text-zinc-900 dark:text-zinc-100">{apt.patientName}</strong>? This action is irreversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-zinc-200 dark:border-zinc-800">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(apt.id, apt.patientName)}
                              className="bg-rose-600 text-white hover:bg-rose-700"
                            >
                              Yes, Delete
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
