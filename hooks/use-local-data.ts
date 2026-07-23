"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface Doctor {
  slug: string;
  name: string;
  specialty: string;
  quals: string;
  experience: string;
  timings: string;
  timingDays: string;
  image: string;
  about: string;
  availableToday: boolean;
  services: string[];
  education: { degree: string; institution: string }[];
}

export interface PageBlock {
  id: string;
  type: string;
  title: string;
  content: string;
  [key: string]: any;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: "Draft" | "Published";
  updatedAt: string;
  blocks: PageBlock[];
}

export interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  doctorSpecialty: string;
  date: string;
  time: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  phone: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  createdAt: string;
}

const DEFAULT_DOCTORS: Doctor[] = [
  {
    slug: "dr-faisal-memon",
    name: "Dr. Faisal Memon",
    specialty: "Cardiology",
    quals: "MBBS, FCPS - Cardiology",
    experience: "15+ Years Experience",
    timings: "02:00 PM - 05:00 PM",
    timingDays: "Mon - Sat",
    image: "/dr_faisal_memon.png",
    about: "Dr. Faisal Memon is a highly experienced Cardiologist at Memon Medical Institute Hospital. He specializes in coronary artery disease management, heart failure therapy, and non-invasive cardiac imaging.",
    availableToday: true,
    services: [
      "Coronary Angiography",
      "Echocardiography",
      "Heart Failure Management",
      "Cardiac Rehabilitation",
      "Preventive Cardiology",
    ],
    education: [
      { degree: "FCPS (Cardiology)", institution: "College of Physicians and Surgeons Pakistan" },
      { degree: "MBBS", institution: "DOW University of Health & Sciences" },
    ],
  },
  {
    slug: "dr-samina-khan",
    name: "Dr. Samina Khan",
    specialty: "Neurology",
    quals: "MBBS, FCPS - Neurology",
    experience: "12+ Years Experience",
    timings: "10:00 AM - 01:00 PM",
    timingDays: "Mon - Sat",
    image: "/dr_samina_khan.png",
    about: "Dr. Samina Khan is a distinguished Neurologist offering comprehensive care for central and peripheral nervous system disorders. Her expertise includes stroke management, epilepsy, and neuropathy.",
    availableToday: true,
    services: [
      "Stroke Management",
      "Epilepsy Treatment",
      "Neuropathy Care",
      "EEG Monitoring",
      "Headache Clinic",
    ],
    education: [
      { degree: "FCPS (Neurology)", institution: "College of Physicians and Surgeons Pakistan" },
      { degree: "MBBS", institution: "Aga Khan University" },
    ],
  },
  {
    slug: "dr-danish-ahmed",
    name: "Dr. Danish Ahmed",
    specialty: "Orthopedics",
    quals: "MBBS, FCPS - Orthopedics",
    experience: "10+ Years Experience",
    timings: "04:00 PM - 07:00 PM",
    timingDays: "Mon - Sat",
    image: "/dr_danish_ahmed.png",
    about: "Dr. Danish Ahmed is a consultant Orthopedic Surgeon specializing in joint replacement, complex fracture management, and sports medicine.",
    availableToday: true,
    services: [
      "Knee Joint Replacement",
      "Hip Joint Replacement",
      "Arthroscopic Surgery",
      "Fracture Management",
      "Sports Injury Clinic",
    ],
    education: [
      { degree: "FCPS (Orthopedic Surgery)", institution: "College of Physicians and Surgeons Pakistan" },
      { degree: "MBBS", institution: "DOW University of Health & Sciences" },
    ],
  },
  {
    slug: "dr-abdul-qayyum",
    name: "Dr. Abdul Qayyum",
    specialty: "Oncology",
    quals: "BDS, MPhil, FCPS (Maxillo-Facial Surgery)",
    experience: "26+ Years Experience",
    timings: "11:00 AM - 01:00 PM",
    timingDays: "Wed, Sat",
    image: "/image61.png",
    about: "Dr. Abdul Qayyum is a consultant oncologist with 26 years of experience. He treats all types of cancers, including lymphomas, and specializes in maxillo-facial oncology reconstruction.",
    availableToday: false,
    services: [
      "Maxillo-Facial Surgery",
      "Oral Rehabilitation",
      "Corrective Jaw Surgery",
      "Oral Oncology Care",
      "Trauma Care",
    ],
    education: [
      { degree: "FCPS (Maxillo-Facial Surgery)", institution: "College of Physicians and Surgeons Pakistan" },
      { degree: "MPhil (Dental Sciences)", institution: "Postgraduate Medical Institute" },
      { degree: "Bachelor of Dental Surgery (BDS)", institution: "DOW University of Health & Sciences" },
    ],
  },
  {
    slug: "dr-ghazala-iqbal",
    name: "Dr. Ghazala Iqbal",
    specialty: "Pulmonology",
    quals: "MBBS, FRCP",
    experience: "20+ Years Experience",
    timings: "09:00 AM - 12:00 PM",
    timingDays: "Mon - Fri",
    image: "/image 51.png",
    about: "Dr. Ghazala Iqbal is a highly regarded Pulmonologist with over two decades of clinical practice. She specializes in asthma, COPD, sleep disorders, and tuberculosis management.",
    availableToday: true,
    services: [
      "Asthma management",
      "COPD therapy",
      "Sleep Apnea diagnosis",
      "Tuberculosis care",
      "Pulmonary Function Tests",
    ],
    education: [
      { degree: "FRCP (Pulmonology)", institution: "Royal College of Physicians, Edinburgh" },
      { degree: "MBBS", institution: "Liaquat University of Medical and Health Sciences" },
    ],
  },
];

const DEFAULT_PAGES: Page[] = [
  {
    id: "1",
    title: "MMI Hospital Home Page",
    slug: "home",
    description: "Welcome to Memon Medical Institute Hospital - Advanced healthcare with a human touch.",
    status: "Published",
    updatedAt: "2026-06-27",
    blocks: [
      {
        id: "hero",
        type: "hero",
        title: "Hero Banner",
        content: "Trusted Care. Compassionate Excellence.",
        subtitle: "Advanced healthcare with a human touch. Here for you, every step of the way.",
        ctaText: "Book Appointment",
        secCtaText: "View Reports",
      },
      {
        id: "quick-links",
        type: "features",
        title: "Quick Links Grid",
        content: "Quickly access our essential services and portals.",
      },
      {
        id: "doctors-teaser",
        type: "cta",
        title: "Doctors Search Teaser",
        content: "Find the Right Doctor. Search by name, specialty, or condition.",
      },
    ],
  },
];

const DEFAULT_APPOINTMENTS: Appointment[] = [
  {
    id: "apt-101",
    patientName: "Aisha Khan",
    doctorName: "Dr. Faisal Memon",
    doctorSpecialty: "Cardiology",
    date: "2026-06-29",
    time: "02:30 PM",
    status: "Pending",
    phone: "+92 321 4567890",
  },
  {
    id: "apt-102",
    patientName: "Muhammad Ahmed",
    doctorName: "Dr. Samina Khan",
    doctorSpecialty: "Neurology",
    date: "2026-06-29",
    time: "11:00 AM",
    status: "Confirmed",
    phone: "+92 333 1234567",
  },
  {
    id: "apt-103",
    patientName: "Zainab Fatima",
    doctorName: "Dr. Danish Ahmed",
    doctorSpecialty: "Orthopedics",
    date: "2026-06-30",
    time: "04:30 PM",
    status: "Pending",
    phone: "+92 300 9876543",
  },
  {
    id: "apt-104",
    patientName: "Omar Yousuf",
    doctorName: "Dr. Ghazala Iqbal",
    doctorSpecialty: "Pulmonology",
    date: "2026-06-28",
    time: "10:15 AM",
    status: "Completed",
    phone: "+92 312 5558822",
  },
  {
    id: "apt-105",
    patientName: "Fatima Ali",
    doctorName: "Dr. Abdul Qayyum",
    doctorSpecialty: "Oncology",
    date: "2026-07-01",
    time: "12:00 PM",
    status: "Cancelled",
    phone: "+92 345 6677889",
  },
];

export const DEFAULT_MEDIA_ITEMS: MediaItem[] = [
  {
    id: "media-1",
    name: "mmi-lobby.jpg",
    url: "https://images.unsplash.com/photo-1586773860418-d37222d8fce2?q=80&w=800&auto=format&fit=crop",
    type: "image/jpeg",
    size: 245000,
    createdAt: "2026-06-25",
  },
  {
    id: "media-2",
    name: "cardiology-unit.jpg",
    url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop",
    type: "image/jpeg",
    size: 198000,
    createdAt: "2026-06-26",
  },
  {
    id: "media-3",
    name: "clinical-lab.jpg",
    url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop",
    type: "image/jpeg",
    size: 312000,
    createdAt: "2026-06-27",
  },
  {
    id: "media-4",
    name: "mri-scanner.jpg",
    url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop",
    type: "image/jpeg",
    size: 156000,
    createdAt: "2026-06-28",
  },
  {
    id: "media-5",
    name: "surgery-theater.jpg",
    url: "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=800&auto=format&fit=crop",
    type: "image/jpeg",
    size: 420000,
    createdAt: "2026-06-29",
  },
  {
    id: "media-6",
    name: "consultant-doctor.jpg",
    url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop",
    type: "image/jpeg",
    size: 185000,
    createdAt: "2026-06-30",
  },
];

export function useLocalData() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Pages from Backend
  const fetchPagesFromBackend = async () => {
    try {
      const token = localStorage.getItem("mmi_token");
      if (!token) {
        // Fallback to local storage if no token is available (e.g. before login)
        const storedPages = localStorage.getItem("mmi_pages");
        if (storedPages) {
          setPages(JSON.parse(storedPages));
        } else {
          localStorage.setItem("mmi_pages", JSON.stringify(DEFAULT_PAGES));
          setPages(DEFAULT_PAGES);
        }
        return;
      }

      const res = await fetch("http://localhost:5000/api/cms/pages", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const mapped = data.data.map((p: any) => {
          let parsedBlocks = [];
          try {
            parsedBlocks = JSON.parse(p.content);
          } catch {
            parsedBlocks = [
              {
                id: "hero-" + p.id,
                type: "hero",
                title: "Hero Banner Section",
                content: p.title,
                subtitle: p.metaDescription || "Start editing this section in the Visual Page Builder.",
                ctaText: "Get Started",
              }
            ];
          }

          return {
            id: p.id.toString(),
            title: p.title,
            slug: p.slug,
            description: p.metaDescription || "",
            status: p.status === "Active" ? "Published" : "Draft",
            updatedAt: p.updatedAt ? p.updatedAt.split("T")[0] : (p.createdAt ? p.createdAt.split("T")[0] : new Date().toISOString().split("T")[0]),
            blocks: parsedBlocks
          };
        });
        setPages(mapped);
      } else {
        const storedPages = localStorage.getItem("mmi_pages");
        if (storedPages) setPages(JSON.parse(storedPages));
      }
    } catch (err) {
      console.error("Error fetching pages from backend:", err);
      const storedPages = localStorage.getItem("mmi_pages");
      if (storedPages) setPages(JSON.parse(storedPages));
    }
  };

  // Initialize
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedDoctors = localStorage.getItem("mmi_doctors");
      const storedAppointments = localStorage.getItem("mmi_appointments");
      const storedMedia = localStorage.getItem("mmi_media");

      if (storedDoctors) {
        setDoctors(JSON.parse(storedDoctors));
      } else {
        localStorage.setItem("mmi_doctors", JSON.stringify(DEFAULT_DOCTORS));
        setDoctors(DEFAULT_DOCTORS);
      }

      if (storedAppointments) {
        setAppointments(JSON.parse(storedAppointments));
      } else {
        localStorage.setItem("mmi_appointments", JSON.stringify(DEFAULT_APPOINTMENTS));
        setAppointments(DEFAULT_APPOINTMENTS);
      }

      if (storedMedia) {
        setMediaItems(JSON.parse(storedMedia));
      } else {
        localStorage.setItem("mmi_media", JSON.stringify(DEFAULT_MEDIA_ITEMS));
        setMediaItems(DEFAULT_MEDIA_ITEMS);
      }

      // Fetch pages from API
      fetchPagesFromBackend().finally(() => {
        setLoading(false);
      });
    }
  }, []);

  const saveDoctors = (newDoctors: Doctor[]) => {
    setDoctors(newDoctors);
    localStorage.setItem("mmi_doctors", JSON.stringify(newDoctors));
  };

  const savePages = (newPages: Page[]) => {
    setPages(newPages);
    localStorage.setItem("mmi_pages", JSON.stringify(newPages));
  };

  const saveAppointments = (newApts: Appointment[]) => {
    setAppointments(newApts);
    localStorage.setItem("mmi_appointments", JSON.stringify(newApts));
  };

  const saveMediaItems = (newMedia: MediaItem[]) => {
    setMediaItems(newMedia);
    localStorage.setItem("mmi_media", JSON.stringify(newMedia));
  };

  // Doctors Actions
  const addDoctor = (doctor: Doctor) => {
    const updated = [doctor, ...doctors];
    saveDoctors(updated);
  };

  const updateDoctor = (slug: string, updatedDoctor: Doctor) => {
    const updated = doctors.map((d) => (d.slug === slug ? updatedDoctor : d));
    saveDoctors(updated);
  };

  const deleteDoctor = (slug: string) => {
    const updated = doctors.filter((d) => d.slug !== slug);
    saveDoctors(updated);
  };

  // Pages Actions
  const addPage = async (page: Page) => {
    const token = localStorage.getItem("mmi_token");
    if (!token) {
      const updated = [...pages, page];
      savePages(updated);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/cms/pages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: page.title,
          slug: page.slug.trim().toLowerCase().replace(/^\//, ""), // Clean slug
          content: JSON.stringify(page.blocks || []),
          metaTitle: page.title,
          metaDescription: page.description || ""
        })
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to create page on backend");
      }
      await fetchPagesFromBackend();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to create page on backend");
      throw error;
    }
  };

  const updatePage = async (id: string, updatedPage: Page) => {
    const token = localStorage.getItem("mmi_token");
    if (!token) {
      const updated = pages.map((p) => (p.id === id ? updatedPage : p));
      savePages(updated);
      return;
    }

    try {
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        throw new Error("Invalid page ID");
      }

      const res = await fetch(`http://localhost:5000/api/cms/pages/${numericId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: updatedPage.title,
          slug: updatedPage.slug.trim().toLowerCase().replace(/^\//, ""), // Clean slug
          content: JSON.stringify(updatedPage.blocks || []),
          metaTitle: updatedPage.title,
          metaDescription: updatedPage.description || ""
        })
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to update page on backend");
      }
      await fetchPagesFromBackend();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to update page on backend");
      throw error;
    }
  };

  const deletePage = async (id: string) => {
    const token = localStorage.getItem("mmi_token");
    if (!token) {
      const updated = pages.filter((p) => p.id !== id);
      savePages(updated);
      return;
    }

    try {
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        throw new Error("Invalid page ID");
      }

      const res = await fetch(`http://localhost:5000/api/cms/pages/${numericId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to delete page on backend");
      }
      await fetchPagesFromBackend();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to delete page on backend");
      throw error;
    }
  };

  // Appointments Actions
  const addAppointment = (apt: Appointment) => {
    const updated = [apt, ...appointments];
    saveAppointments(updated);
  };

  const updateAppointmentStatus = (id: string, status: Appointment["status"]) => {
    const updated = appointments.map((a) => (a.id === id ? { ...a, status } : a));
    saveAppointments(updated);
  };

  const deleteAppointment = (id: string) => {
    const updated = appointments.filter((a) => a.id !== id);
    saveAppointments(updated);
  };

  // Media Actions
  const addMediaItem = (item: MediaItem) => {
    const updated = [item, ...mediaItems];
    saveMediaItems(updated);
  };

  const deleteMediaItem = (id: string) => {
    const updated = mediaItems.filter((m) => m.id !== id);
    saveMediaItems(updated);
  };

  return {
    doctors,
    pages,
    appointments,
    mediaItems,
    loading,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    addPage,
    updatePage,
    deletePage,
    addAppointment,
    updateAppointmentStatus,
    deleteAppointment,
    addMediaItem,
    deleteMediaItem,
    fetchPagesFromBackend
  };
}
