"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useLocalData, Doctor } from "@/hooks/use-local-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, X, GraduationCap, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function EditDoctorPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const { doctors, updateDoctor, loading } = useLocalData();

  // Basic Form State
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [quals, setQuals] = useState("");
  const [experience, setExperience] = useState("");
  const [timings, setTimings] = useState("");
  const [timingDays, setTimingDays] = useState("");
  const [availableToday, setAvailableToday] = useState(true);
  const [about, setAbout] = useState("");
  const [image, setImage] = useState("");

  // Services tags state
  const [services, setServices] = useState<string[]>([]);
  const [serviceInput, setServiceInput] = useState("");

  // Education state
  const [education, setEducation] = useState<{ degree: string; institution: string }[]>([]);
  const [eduDegree, setEduDegree] = useState("");
  const [eduInstitution, setEduInstitution] = useState("");

  // Load doctor details
  useEffect(() => {
    if (!loading && doctors.length > 0) {
      const doctor = doctors.find((d) => d.slug === slug);
      if (doctor) {
        setName(doctor.name);
        setSpecialty(doctor.specialty);
        setQuals(doctor.quals);
        setExperience(doctor.experience);
        setTimings(doctor.timings);
        setTimingDays(doctor.timingDays);
        setAvailableToday(doctor.availableToday);
        setAbout(doctor.about || "");
        setImage(doctor.image || "/dr_default.png");
        setServices(doctor.services || []);
        setEducation(doctor.education || []);
      }
    }
  }, [loading, doctors, slug]);

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (serviceInput.trim()) {
      if (!services.includes(serviceInput.trim())) {
        setServices([...services, serviceInput.trim()]);
      }
      setServiceInput("");
    }
  };

  const handleRemoveService = (srv: string) => {
    setServices(services.filter((s) => s !== srv));
  };

  const handleAddEducation = (e: React.FormEvent) => {
    e.preventDefault();
    if (eduDegree.trim() && eduInstitution.trim()) {
      setEducation([...education, { degree: eduDegree.trim(), institution: eduInstitution.trim() }]);
      setEduDegree("");
      setEduInstitution("");
    }
  };

  const handleRemoveEducation = (index: number) => {
    setEducation(education.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !specialty || !quals || !experience) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const updatedDoctor: Doctor = {
      slug,
      name,
      specialty,
      quals,
      experience,
      timings: timings || "By Appointment",
      timingDays,
      availableToday,
      about,
      image,
      services: services.length > 0 ? services : ["General Consultation"],
      education: education.length > 0 ? education : [{ degree: quals, institution: "Medical University" }],
    };

    updateDoctor(slug, updatedDoctor);
    toast.success(`Profile for ${name} has been updated successfully!`);
    router.push("/doctors");
  };

  const currentDoctorExists = doctors.some((d) => d.slug === slug);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#043164]" />
      </div>
    );
  }

  if (!currentDoctorExists) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-xl font-bold text-zinc-950">Profile not found</h2>
        <p className="text-zinc-500">The doctor profile slug &apos;{slug}&apos; does not exist in the local CMS database.</p>
        <Button asChild className="bg-[#043164] text-white">
          <Link href="/doctors">Back to Directory</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-500">
      {/* Back Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="h-10 w-10 border border-zinc-200 dark:border-zinc-800">
          <Link href="/doctors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Edit Doctor Profile
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Modify credentials, timing calendars or bio profiles for {name}.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Form Fields */}
        <Card className="md:col-span-2 border-zinc-200 dark:border-zinc-800">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>Primary profile fields displayed on MMI doctor finder.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="doc-name">Full Name <span className="text-rose-500">*</span></Label>
                  <Input
                    id="doc-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="border-zinc-200 dark:border-zinc-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doc-spec">Specialty <span className="text-rose-500">*</span></Label>
                  <Input
                    id="doc-spec"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    required
                    className="border-zinc-200 dark:border-zinc-800"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="doc-quals">Qualifications / Degrees <span className="text-rose-500">*</span></Label>
                  <Input
                    id="doc-quals"
                    value={quals}
                    onChange={(e) => setQuals(e.target.value)}
                    required
                    className="border-zinc-200 dark:border-zinc-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doc-exp">Experience <span className="text-rose-500">*</span></Label>
                  <Input
                    id="doc-exp"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    required
                    className="border-zinc-200 dark:border-zinc-800"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="doc-days">Consultation Days</Label>
                  <Input
                    id="doc-days"
                    value={timingDays}
                    onChange={(e) => setTimingDays(e.target.value)}
                    placeholder="e.g. Mon - Sat"
                    className="border-zinc-200 dark:border-zinc-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doc-hours">Consultation Hours</Label>
                  <Input
                    id="doc-hours"
                    value={timings}
                    onChange={(e) => setTimings(e.target.value)}
                    placeholder="e.g. 02:00 PM - 05:00 PM"
                    className="border-zinc-200 dark:border-zinc-800"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id="doc-avail"
                  checked={availableToday}
                  onChange={(e) => setAvailableToday(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300 text-[#043164] focus:ring-[#043164]"
                />
                <Label htmlFor="doc-avail" className="font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer">
                  Available for Consult Today
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="doc-about">Professional Summary / Bio</Label>
                <Textarea
                  id="doc-about"
                  rows={4}
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="border-zinc-200 dark:border-zinc-800 resize-none"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-900 pt-6">
              <Button variant="outline" asChild className="border-zinc-200 dark:border-zinc-800">
                <Link href="/doctors">Cancel</Link>
              </Button>
              <Button type="submit" className="bg-[#043164] hover:bg-[#1A3268] text-white font-medium">
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Dynamic Services & Education */}
        <div className="space-y-6">
          {/* Services */}
          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-[#043164]">
                <Sparkles className="h-4 w-4" />
                <CardTitle className="text-sm font-bold uppercase tracking-wider">Clinical Services</CardTitle>
              </div>
              <CardDescription>Add specialized medical services offered.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. Endoscopy"
                  value={serviceInput}
                  onChange={(e) => setServiceInput(e.target.value)}
                  className="h-9 border-zinc-200 dark:border-zinc-800"
                />
                <Button size="icon" className="h-9 w-9 bg-zinc-900 hover:bg-zinc-800" onClick={handleAddService}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-1.5 min-h-[50px] p-2 border rounded-lg bg-zinc-50/50 border-zinc-150 dark:bg-zinc-900/20">
                {services.length === 0 ? (
                  <span className="text-xs text-zinc-400 p-1">No services added yet.</span>
                ) : (
                  services.map((srv) => (
                    <Badge key={srv} variant="secondary" className="flex items-center gap-1 bg-white border dark:bg-zinc-900">
                      {srv}
                      <button type="button" onClick={() => handleRemoveService(srv)} className="hover:text-red-500">
                        <X size={10} />
                      </button>
                    </Badge>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-[#043164]">
                <GraduationCap className="h-4 w-4" />
                <CardTitle className="text-sm font-bold uppercase tracking-wider">Education & Faculty</CardTitle>
              </div>
              <CardDescription>Detail academic degrees and affiliations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="edu-deg" className="text-xs text-zinc-400">Degree / Rank</Label>
                  <Input
                    id="edu-deg"
                    placeholder="e.g. FCPS Pediatrics"
                    value={eduDegree}
                    onChange={(e) => setEduDegree(e.target.value)}
                    className="h-9 mt-1 border-zinc-200 dark:border-zinc-800"
                  />
                </div>
                <div>
                  <Label htmlFor="edu-inst" className="text-xs text-zinc-400">Institution</Label>
                  <Input
                    id="edu-inst"
                    placeholder="e.g. CPSP Pakistan"
                    value={eduInstitution}
                    onChange={(e) => setEduInstitution(e.target.value)}
                    className="h-9 mt-1 border-zinc-200 dark:border-zinc-800"
                  />
                </div>
                <Button className="w-full h-9 bg-zinc-900 hover:bg-zinc-800 text-xs" onClick={handleAddEducation}>
                  Add Credential
                </Button>
              </div>

              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {education.length === 0 ? (
                  <p className="text-xs text-zinc-400 text-center py-4 bg-zinc-50/50 border rounded-lg">No education history added.</p>
                ) : (
                  education.map((edu, idx) => (
                    <div key={idx} className="p-2 border rounded-lg bg-white dark:bg-zinc-900 text-xs relative group flex flex-col">
                      <strong className="text-zinc-800 dark:text-zinc-200 pr-4">{edu.degree}</strong>
                      <span className="text-zinc-500">{edu.institution}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveEducation(idx)}
                        className="absolute right-2 top-2 text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
