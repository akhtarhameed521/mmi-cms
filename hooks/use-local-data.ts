"use client";

import { useState, useEffect } from "react";

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
    slug: "/",
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
  {
    id: "2",
    title: "About MMI - Trustees",
    slug: "/about/trustees",
    description: "Board of Trustees of Memon Medical Institute.",
    status: "Published",
    updatedAt: "2026-06-25",
    blocks: [
      {
        id: "trustees-hero",
        type: "hero",
        title: "Hero Section",
        content: "Our Board of Trustees",
        subtitle: "The visionary leaders driving Memon Medical Institute towards medical excellence.",
      },
      {
        id: "trustees-text",
        type: "text",
        title: "Introduction",
        content: "MMI Hospital is governed by a dedicated board of trustees committed to providing state-of-the-art medical services at highly subsidized rates to all patients, regardless of cast or creed.",
      },
    ],
  },
  {
    id: "3",
    title: "Antenatal Care Program",
    slug: "/facilities/antenatal-care-program",
    description: "Comprehensive antenatal care services at Memon Medical Institute Hospital.",
    status: "Published",
    updatedAt: "2026-06-22",
    blocks: [
      {
        id: "antenatal-hero",
        type: "hero",
        title: "Antenatal Program Header",
        content: "Antenatal Care Program",
        subtitle: "Safe Motherhood, Healthy Babies. Specialized clinical pathways for pregnancy and childbirth.",
      },
    ],
  },
  {
    id: "4",
    title: "Future Projects",
    slug: "/about/future-projects",
    description: "Expansion plans and future medical blocks at Memon Medical Institute.",
    status: "Draft",
    updatedAt: "2026-06-28",
    blocks: [
      {
        id: "future-hero",
        type: "hero",
        title: "Future Projects Header",
        content: "Building the Future of Healthcare",
        subtitle: "Expanding facilities, introducing advanced departments, and bringing new hope.",
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

export function useLocalData() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedDoctors = localStorage.getItem("mmi_doctors");
      const storedPages = localStorage.getItem("mmi_pages");
      const storedAppointments = localStorage.getItem("mmi_appointments");

      if (storedDoctors) {
        setDoctors(JSON.parse(storedDoctors));
      } else {
        localStorage.setItem("mmi_doctors", JSON.stringify(DEFAULT_DOCTORS));
        setDoctors(DEFAULT_DOCTORS);
      }

      if (storedPages) {
        setPages(JSON.parse(storedPages));
      } else {
        localStorage.setItem("mmi_pages", JSON.stringify(DEFAULT_PAGES));
        setPages(DEFAULT_PAGES);
      }

      if (storedAppointments) {
        setAppointments(JSON.parse(storedAppointments));
      } else {
        localStorage.setItem("mmi_appointments", JSON.stringify(DEFAULT_APPOINTMENTS));
        setAppointments(DEFAULT_APPOINTMENTS);
      }

      setLoading(false);
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
  const addPage = (page: Page) => {
    const updated = [...pages, page];
    savePages(updated);
  };

  const updatePage = (id: string, updatedPage: Page) => {
    const updated = pages.map((p) => (p.id === id ? updatedPage : p));
    savePages(updated);
  };

  const deletePage = (id: string) => {
    const updated = pages.filter((p) => p.id !== id);
    savePages(updated);
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

  return {
    doctors,
    pages,
    appointments,
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
  };
}
