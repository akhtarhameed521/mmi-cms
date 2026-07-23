"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";

interface PageBlock {
  id: string;
  type: string;
  title: string;
  content: string;
  subtitle?: string;
  bgImage?: string;
  ctaText?: string;
  secCtaText?: string;
  viewAllText?: string;
  card1Title?: string;
  card1Desc?: string;
  card2Title?: string;
  card2Desc?: string;
  card3Title?: string;
  card3Desc?: string;
  stat1Num?: string;
  stat1Label?: string;
  stat2Num?: string;
  stat2Label?: string;
  stat3Num?: string;
  stat3Label?: string;
  stat4Num?: string;
  stat4Label?: string;
  stat5Num?: string;
  stat5Label?: string;
  stat6Num?: string;
  stat6Label?: string;
  description?: string;
  [key: string]: any;
}

const defaultQuickLinks = [
  { title: "Book Appointment", desc: "Schedule your visit", icon: "calendar" },
  { title: "Online Reports", desc: "Access your reports", icon: "reports" },
  { title: "Find a Doctor", desc: "Search our experts", icon: "doctor" },
  { title: "Emergency", desc: "24/7 Emergency Care", icon: "emergency" },
  { title: "Lab & Diagnostic", desc: "Book tests online", icon: "lab" },
  { title: "Blood Bank", desc: "Donate or request", icon: "blood" },
  { title: "Bed Availability", desc: "Check live status", icon: "bed" },
  { title: "Patient Portal", desc: "Manage your health", icon: "portal" }
];

const QUICK_LINK_ICONS: Record<string, React.ReactNode> = {
  calendar: (
    <svg width="24" height="27" viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.6 21.8L5.86667 17.0667L7.8 15.1333L10.6 17.9333L16.2 12.3333L18.1333 14.2667L10.6 21.8ZM2.66667 26.6667C1.93333 26.6667 1.30556 26.4056 0.783333 25.8833C0.261111 25.3611 0 24.7333 0 24V5.33333C0 4.6 0.261111 3.97222 0.783333 3.45C1.30556 2.92778 1.93333 2.66667 2.66667 2.66667H4V0H6.66667V2.66667H17.3333V0H20V2.66667H21.3333C22.0667 2.66667 22.6944 2.92778 23.2167 3.45C23.7389 3.97222 24 4.6 24 5.33333V24C24 24.7333 23.7389 25.3611 23.2167 25.8833C22.6944 26.4056 22.0667 26.6667 21.3333 26.6667H2.66667ZM2.66667 24H21.3333V10.6667H2.66667V24ZM2.66667 8H21.3333V5.33333H2.66667V8ZM2.66667 8V5.33333V8Z" fill="currentColor" />
    </svg>
  ),
  reports: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.33333 18.6667H14.6667V16H5.33333V18.6667ZM5.33333 13.3333H18.6667V10.6667H5.33333V13.3333ZM5.33333 8H18.6667V5.33333H5.33333V8ZM2.66667 24C1.93333 24 1.30556 23.7389 0.783333 23.2167C0.261111 22.6944 0 22.0667 0 21.3333V2.66667C0 1.93333 0.261111 1.30556 0.783333 0.783333C1.30556 0.261111 1.93333 0 2.66667 0H21.3333C22.0667 0 22.6944 0.261111 23.2167 0.783333C23.7389 1.30556 24 1.93333 24 2.66667V21.3333C24 22.0667 23.7389 22.6944 23.2167 23.2167C22.6944 23.7389 22.0667 24 21.3333 24H2.66667ZM2.66667 21.3333H21.3333V2.66667H2.66667V21.3333ZM2.66667 2.66667V21.3333V2.66667Z" fill="currentColor" />
    </svg>
  ),
  doctor: (
    <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.525 27C13.095 27 11.025 26.145 9.31499 24.435C7.60499 22.725 6.74999 20.655 6.74999 18.225V17.4487C4.815 17.1337 3.20625 16.2281 1.92375 14.7319C0.64125 13.2356 0 11.475 0 9.44999V1.35H4.05V0H6.74999V5.4H4.05V4.05H2.7V9.44999C2.7 10.935 3.22875 12.2062 4.28625 13.2637C5.34375 14.3212 6.61499 14.85 8.09999 14.85C9.58499 14.85 10.8562 14.3212 11.9137 13.2637C12.9712 12.2062 13.5 10.935 13.5 9.44999V4.05H12.15V5.4H9.44999V0H12.15V1.35H16.2V9.44999C16.2 11.475 15.5587 13.2356 14.2762 14.7319C12.9937 16.2281 11.385 17.1337 9.44999 17.4487V18.225C9.44999 19.9125 10.0406 21.3469 11.2219 22.5281C12.4031 23.7094 13.8375 24.3 15.525 24.3C17.2125 24.3 18.6469 23.7094 19.8281 22.5281C21.0094 21.3469 21.6 19.9125 21.6 18.225V15.9637C20.8125 15.6937 20.1656 15.21 19.6594 14.5125C19.1531 13.815 18.9 13.0275 18.9 12.15C18.9 11.025 19.2937 10.0687 20.0812 9.28124C20.8687 8.49374 21.825 8.09999 22.95 8.09999C24.075 8.09999 25.0312 8.49374 25.8187 9.28124C26.6062 10.0687 27 11.025 27 12.15C27 13.0275 26.7469 13.815 26.2406 14.5125C25.7344 15.21 25.0875 15.6937 24.3 15.9637V18.225C24.3 20.655 23.445 22.725 21.735 24.435C20.025 26.145 17.955 27 15.525 27ZM22.95 13.5C23.3325 13.5 23.6531 13.3706 23.9119 13.1119C24.1706 12.8531 24.3 12.5325 24.3 12.15C24.3 11.7675 24.1706 11.4469 23.9119 11.1881C23.6531 10.9294 23.3325 10.8 22.95 10.8C22.5675 10.8 22.2469 10.9294 21.9881 11.1881C21.7294 11.4469 21.6 11.7675 21.6 12.15C21.6 12.5325 21.7294 12.8531 21.9881 13.1119C22.2469 13.3706 22.5675 13.5 22.95 13.5Z" fill="currentColor" />
    </svg>
  ),
  emergency: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.2 24V16.0667L2.33333 20.0333L0 16L6.86667 12L0 8.03333L2.33333 4L9.2 7.96667V0H13.8667V7.96667L20.7333 4L23.0667 8.03333L16.2 12L23.0667 16L20.7333 20.0333L13.8667 16.0667V24H9.2Z" fill="currentColor" />
    </svg>
  ),
  lab: (
    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.70467 24C1.57134 24 0.765784 23.4944 0.288006 22.4833C-0.189772 21.4722 -0.0731049 20.5333 0.638006 19.6667L8.03801 10.6667V2.66667H6.70467C6.3269 2.66667 6.01023 2.53889 5.75467 2.28333C5.49912 2.02778 5.37134 1.71111 5.37134 1.33333C5.37134 0.955556 5.49912 0.638889 5.75467 0.383333C6.01023 0.127778 6.3269 0 6.70467 0H17.3713C17.7491 0 18.0658 0.127778 18.3213 0.383333C18.5769 0.638889 18.7047 0.955556 18.7047 1.33333C18.7047 1.71111 18.5769 2.02778 18.3213 2.28333C18.0658 2.53889 17.7491 2.66667 17.3713 2.66667H16.038V10.6667L23.438 19.6667C24.1491 20.5333 24.2658 21.4722 23.788 22.4833C23.3102 23.4944 22.5047 24 21.3713 24H2.70467ZM2.70467 21.3333H21.3713L13.3713 11.6V2.66667H10.7047V11.6L2.70467 21.3333Z" fill="currentColor" />
    </svg>
  ),
  blood: (
    <svg width="22" height="27" viewBox="0 0 22 27" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.8 27C7.71749 27 5.14687 25.9425 3.08812 23.8275C1.02937 21.7125 0 19.08 0 15.93C0 13.68 0.894374 11.2331 2.68312 8.58937C4.47187 5.94562 7.17749 3.0825 10.8 0C14.4225 3.0825 17.1281 5.94562 18.9169 8.58937C20.7056 11.2331 21.6 13.68 21.6 15.93C21.6 19.08 20.5706 21.7125 18.5119 23.8275C16.4531 25.9425 13.8825 27 10.8 27ZM10.8 24.3C13.14 24.3 15.075 23.5069 16.605 21.9206C18.135 20.3344 18.9 18.3375 18.9 15.93C18.9 14.2875 18.2194 12.4312 16.8581 10.3612C15.4969 8.29124 13.4775 6.03 10.8 3.5775C8.12249 6.03 6.10312 8.29124 4.74187 10.3612C3.38062 12.4312 2.7 14.2875 2.7 15.93C2.7 18.3375 3.465 20.3344 4.995 21.9206C6.525 23.5069 8.45999 24.3 10.8 24.3ZM6.74999 21.6H14.85V18.9H6.74999V21.6ZM9.44999 17.55H12.15V14.85H14.85V12.15H12.15V9.44999H9.44999V12.15H6.74999V14.85H9.44999V17.55" fill="currentColor" />
    </svg>
  ),
  bed: (
    <svg width="30" height="21" viewBox="0 0 30 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 20.4545V0H2.72727V13.6364H13.6364V2.72727H24.5455C26.0455 2.72727 27.3295 3.26136 28.3977 4.32955C29.4659 5.39773 30 6.68182 30 8.18182V20.4545H27.2727V16.3636H2.72727V20.4545H0ZM5.28409 11.0795C4.48864 10.2841 4.09091 9.31818 4.09091 8.18182C4.09091 7.04545 4.48864 6.07955 5.28409 5.28409C6.07955 4.48864 7.04545 4.09091 8.18182 4.09091C9.31818 4.09091 10.2841 4.48864 11.0795 5.28409C11.875 6.07955 12.2727 7.04545 12.2727 8.18182C12.2727 9.31818 11.875 10.2841 11.0795 11.0795C10.2841 11.875 9.31818 12.2727 8.18182 12.2727C7.04545 12.2727 6.07955 11.875 5.28409 11.0795ZM16.3636 13.6364H27.2727V8.18182C27.2727 7.43182 27.0057 6.78977 26.4716 6.25568C25.9375 5.72159 25.2955 5.45455 24.5455 5.45455H16.3636V13.6364ZM9.15341 9.15341C9.41477 8.89205 9.54545 8.56818 9.54545 8.18182C9.54545 7.79545 9.41477 7.47159 9.15341 7.21023C8.89205 6.94886 8.56818 6.81818 8.18182 6.81818C7.79545 6.81818 7.47159 6.94886 7.21023 7.21023C6.94886 7.47159 6.81818 7.79545 6.81818 8.18182C6.81818 8.56818 6.94886 8.89205 7.21023 9.15341C7.47159 9.41477 7.79545 9.54545 8.18182 9.54545C8.56818 9.54545 8.89205 9.41477 9.15341 9.54545C8.56818 9.54545 8.89205 9.41477 9.15341 9.15341Z" fill="currentColor" />
    </svg>
  ),
  portal: (
    <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.19748 20.3849C6.34498 19.5074 7.62748 18.8156 9.04497 18.3093C10.4625 17.8031 11.9475 17.5499 13.5 17.5499C15.0525 17.5499 16.5375 17.8031 17.9549 18.3093C19.3724 18.8156 20.6549 19.5074 21.8024 20.3849C22.5899 19.4624 23.2031 18.4162 23.6418 17.2462C24.0806 16.0762 24.2999 14.8275 24.2999 13.5C24.2999 10.5075 23.2481 7.95935 21.1443 5.85561C19.0406 3.75186 16.4924 2.69999 13.5 2.69999C10.5075 2.69999 7.95935 3.75186 5.85561 5.85561C3.75186 7.95935 2.69999 10.5075 2.69999 13.5C2.69999 14.8275 2.91937 16.0762 3.35811 17.2462C3.79686 18.4162 4.40999 19.4624 5.19748 20.3849ZM13.5 14.85C12.1725 14.85 11.0531 14.3943 10.1418 13.4831C9.2306 12.5718 8.77497 11.4525 8.77497 10.125C8.77497 8.79747 9.2306 7.6781 10.1418 6.76685C11.0531 5.85561 12.1725 5.39998 13.5 5.39998C14.8275 5.39998 15.9468 5.85561 16.8581 6.76685C17.7693 7.6781 18.2249 8.79747 18.2249 10.125C18.2249 11.4525 17.7693 12.5718 16.8581 13.4831C15.9468 14.3943 14.8275 14.85 13.5 14.85ZM13.5 26.9999C11.6325 26.9999 9.87747 26.6455 8.23497 25.9368C6.59248 25.228 5.16373 24.2662 3.94874 23.0512C2.73374 21.8362 1.77187 20.4074 1.06312 18.7649C0.354374 17.1224 0 15.3675 0 13.5C0 11.6325 0.354374 9.87747 1.06312 8.23497C1.77187 6.59248 2.73374 5.16373 3.94874 3.94874C5.16373 2.73374 6.59248 1.77187 8.23497 1.06312C9.87747 0.354374 11.6325 0 13.5 0C15.3675 0 17.1224 0.354374 18.7649 1.06312C20.4074 1.77187 21.8362 2.73374 23.0512 3.94874C24.2662 5.16373 25.228 6.59248 25.9368 8.23497C26.6062 10.0687 26.9999 11.6325 26.9999 13.5C26.9999 15.3675 26.6455 17.1224 25.9368 18.7649C25.228 20.4074 24.2658 21.8362 23.0512 23.0512C21.8362 24.2662 20.4074 25.228 18.7649 25.9368C17.1224 26.6455 15.3675 26.9999 13.5 26.9999ZM13.5 24.2999C14.6925 24.2999 15.8175 24.1256 16.8749 23.7768C17.9324 23.4281 18.8999 22.9274 19.7774 22.2749C18.8999 21.6224 17.9324 21.1218 16.8749 20.7731C15.8175 20.4243 14.6925 20.2499 13.5 20.2499C12.3075 20.2499 11.1825 20.4243 10.125 20.7731C9.06747 21.1218 8.09998 21.6224 7.22248 22.2749C8.09998 22.9274 9.06747 23.4281 10.125 23.7768C11.1825 24.1256 12.3075 24.2999 13.5 24.2999ZM13.5 12.15C14.085 12.15 14.5687 11.9587 14.9512 11.5762C15.3337 11.1937 15.525 10.71 15.525 10.125C15.525 9.53997 15.3337 9.05622 14.9512 8.67372C14.5687 8.29122 14.085 8.09998 13.5 8.09998C12.915 8.09998 12.4312 8.29122 12.0487 8.67372C11.6662 9.05622 11.475 9.53997 11.475 10.125C11.475 10.71 11.6662 11.1937 12.0487 11.5762C12.4312 11.9587 12.915 12.15 13.5 12.15Z" fill="currentColor"/>
    </svg>
  )
};

export default function PreviewPage() {
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [pageTitle, setPageTitle] = useState("Page Preview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Read from localStorage
    const savedBlocks = localStorage.getItem("mmi_preview_blocks");
    const savedTitle = localStorage.getItem("mmi_preview_title");
    
    if (savedBlocks) {
      try {
        setBlocks(JSON.parse(savedBlocks));
      } catch (e) {
        console.error("Error parsing preview blocks:", e);
      }
    }
    
    if (savedTitle) {
      setPageTitle(savedTitle);
    }
    
    setLoading(false);
  }, []);

  const renderFormattedText = (text: string) => {
    if (!text) return "";
    return text.split("\n").map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < text.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#043164] border-t-transparent" />
      </div>
    );
  }

  if (blocks.length === 0) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-white p-6 text-center">
        <h1 className="text-xl font-bold text-zinc-900">No Preview Available</h1>
        <p className="text-zinc-500 text-xs mt-2 max-w-xs leading-relaxed">
          Please add some blocks in the Page Builder first and click "Live Preview".
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-zinc-850 flex flex-col font-sans">
      {/* Standalone Hospital Header Mockup */}
      <header className="border-b border-zinc-100 bg-white py-4 px-8 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-[#043164] flex items-center justify-center text-white font-black text-sm">MMI</div>
          <div>
            <h2 className="font-extrabold text-sm text-[#043164] tracking-wider leading-none">MEMON MEDICAL INSTITUTE</h2>
            <span className="text-[9px] text-[#c5a742] font-semibold tracking-widest uppercase">Hospital Portal</span>
          </div>
        </div>
        <nav className="flex items-center gap-6 text-xs font-bold text-[#043164]">
          <span className="hover:text-[#c5a742] cursor-pointer">Home</span>
          <span className="hover:text-[#c5a742] cursor-pointer">Find Doctor</span>
          <span className="hover:text-[#c5a742] cursor-pointer">Online Services</span>
          <span className="hover:text-[#c5a742] cursor-pointer">Donations</span>
          <span className="hover:text-[#c5a742] cursor-pointer">Contact Us</span>
        </nav>
      </header>

      {/* Standalone page contents rendering */}
      <main className="flex-1 w-full space-y-0">
        {blocks.map((block, index) => {
          const isOverlappedQuickLinks = block.type === "quick-links" && index > 0 && blocks[index - 1].type === "hero";
          
          return (
            <div 
              key={block.id} 
              className={`w-full relative ${
                isOverlappedQuickLinks ? "-mt-[60px] z-30 overflow-visible" : "overflow-hidden"
              }`}
            >
              {/* 1. HERO BLOCK */}
              {block.type === "hero" && (() => {
                const bgUrl = (block.bgImage && !block.bgImage.includes("hero-bg.png")) ? block.bgImage : "/hero-banner.png";
                return (
                  <div className="relative w-full bg-white text-[#043164] flex select-none overflow-visible" style={{ height: '578px' }}>
                    {/* Full-width background image (matches MMI HeroSection) */}
                    <div className="absolute inset-0 z-[1]">
                      <img src={bgUrl} alt="Doctor" className="w-full h-full object-cover object-right" />
                    </div>
                    {/* Gradient overlay matching MMI's exact values */}
                    <div className="absolute inset-0 z-[2] pointer-events-none hidden sm:block" style={{ background: 'linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.9) 44%, rgba(255, 255, 255, 0) 61%)' }} />
                    <div className="absolute inset-0 bg-white/90 z-[2] pointer-events-none block sm:hidden" />
                    {/* Hero content with MMI-matching padding */}
                    <div className="relative z-[4] flex flex-col justify-start max-w-[700px] space-y-4" style={{ padding: '60px 0 80px 80px' }}>
                      <h1 className="text-4xl md:text-5xl font-bold leading-[1.15] text-[#002B5B] tracking-tight">
                        {renderFormattedText(block.title || block.content)}
                      </h1>
                      <p className="text-sm md:text-base text-[#43474F] leading-relaxed max-w-md font-medium">
                        {renderFormattedText(block.subtitle || "")}
                      </p>
                      <div className="flex items-center gap-4 flex-wrap">
                        <button className="bg-[#043164] text-white text-xs font-semibold px-6 py-3.5 rounded-[4px] shadow-sm flex items-center gap-2">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          {block.ctaText || "Book Appointment"}
                        </button>
                        <button className="bg-transparent text-[#043164] text-xs font-semibold px-6 py-3 rounded-[4px] border-[1.5px] border-[#043164] flex items-center gap-2">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                          </svg>
                          {block.secCtaText || "View Reports"}
                        </button>
                      </div>
                      <div className="search-bar-wrapper max-w-xl w-full pt-2">
                        <div className="search-bar bg-white rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-zinc-200 p-1.5 flex items-center justify-between">
                          <div className="flex items-center gap-2 pl-3 flex-1 min-w-0">
                            <Search className="h-4 w-4 text-zinc-400 flex-shrink-0" />
                            <input disabled placeholder="Search Doctors, Specialties or Conditions..." className="bg-transparent text-xs w-full focus:outline-none text-zinc-800" />
                          </div>
                          <div className="h-6 w-[1px] bg-zinc-200 mx-2 hidden sm:block" />
                          <select disabled className="text-xs bg-transparent font-bold text-zinc-650 border-none outline-none mr-2 hidden sm:block">
                            <option>All Specialties</option>
                          </select>
                          <button disabled className="bg-[#043164] p-2.5 rounded-lg text-white">
                            <Search className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 2. QUICK LINKS */}
              {block.type === "quick-links" && (
                <div className={`transition-all duration-300 ${isOverlappedQuickLinks ? "mx-8 sm:mx-12" : "p-8 bg-zinc-50 space-y-6"}`}>
                  <div className="flex flex-row items-stretch justify-center w-full bg-white rounded-[16px] shadow-[0_10px_45px_rgba(0,0,0,0.06)] border border-zinc-150 p-2 min-h-[110px]">
                    {Array.from({ length: 8 }).map((_, num) => {
                      const linkKey = `link${num + 1}`;
                      const defaultLink = defaultQuickLinks[num];
                      const title = block[`${linkKey}Title`] !== undefined ? block[`${linkKey}Title`] : defaultLink.title;
                      const desc = block[`${linkKey}Desc`] !== undefined ? block[`${linkKey}Desc`] : defaultLink.desc;
                      const iconName = block[`${linkKey}Icon`] !== undefined ? block[`${linkKey}Icon`] : defaultLink.icon;
                      const colorClass = iconName === "emergency" ? "text-[#BA1A1A]" : (iconName === "blood" ? "text-red-500" : "text-[#043164]");

                      return (
                        <div key={num} className="flex-1 flex flex-col items-center justify-center text-center p-2 relative group cursor-pointer hover:bg-zinc-50 transition-colors">
                          {num > 0 && <div className="absolute left-0 top-[15%] h-[70%] w-[1px] bg-zinc-200" />}
                          <div className={`h-8 flex items-center justify-center mb-2 transition-transform duration-200 group-hover:scale-105 ${colorClass}`}>
                            {QUICK_LINK_ICONS[iconName] || QUICK_LINK_ICONS.portal}
                          </div>
                          <span className="text-[11px] font-bold text-[#043164] leading-tight block truncate w-full px-1">{title}</span>
                          <span className="text-[9px] text-[#43474F] block leading-normal truncate w-full px-1">{desc}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. DOCTORS FINDER */}
              {block.type === "doctors-teaser" && (
                <div className="p-8 bg-gradient-to-r from-[#043164] to-[#1A3268] text-white flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="space-y-1.5 text-center sm:text-left">
                    <h3 className="text-xl font-bold tracking-tight text-white">{block.title || block.content}</h3>
                    <p className="text-zinc-200 text-xs max-w-md leading-relaxed">{block.subtitle || "Search our medical directories and book consult timings online."}</p>
                  </div>
                  <button className="bg-[#c5a742] text-[#043164] font-bold shadow-lg flex-shrink-0 px-6 h-10 rounded-[4px] text-xs hover:bg-[#b09230] transition-colors">
                    {block.ctaText || "Find Doctor"}
                  </button>
                </div>
              )}

              {/* 4. SPECIALTIES */}
              {block.type === "specialties" && (
                <div className="p-8 bg-white space-y-6 text-[#043164]">
                  <div className="flex items-center justify-between border-b border-zinc-150 pb-2">
                    <h3 className="text-sm font-extrabold uppercase tracking-wider">{block.title || block.content}</h3>
                    <span className="text-xs font-bold text-[#c5a742] hover:underline cursor-pointer">{block.viewAllText || "View All Specialties"}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                    {[
                      { name: "Cardiology", desc: "Heart care services" },
                      { name: "Neurology", desc: "Brain & nerve care" },
                      { name: "Pediatrics", desc: "Child care center" },
                      { name: "Oncology", desc: "Cancer treatment center" },
                      { name: "Orthopedics", desc: "Bone & joint care" },
                      { name: "Gynecology", desc: "Maternity & women's care" }
                    ].map((spec, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-zinc-150 text-center hover:shadow-md hover:border-[#043164]/30 transition-all cursor-pointer bg-zinc-50/50">
                        <div className="h-10 w-10 bg-[#043164]/5 rounded-full flex items-center justify-center mx-auto mb-2 text-[#043164] font-bold">
                          {spec.name[0]}
                        </div>
                        <strong className="block text-xs font-bold leading-tight">{spec.name}</strong>
                        <span className="text-[9px] text-zinc-400 block mt-1">{spec.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. INFO CARDS */}
              {block.type === "info-cards" && (
                <div className="p-8 bg-zinc-50 space-y-6 text-[#043164]">
                  <div className="text-center space-y-1">
                    <h3 className="text-xl font-extrabold uppercase tracking-wider">{block.title || block.content}</h3>
                  </div>
                  <div className="grid gap-6 md:grid-cols-3">
                    {[
                      { title: block.card1Title || "Zakat Campaign", desc: block.card1Desc || "Subsidized healthcare services for deserving patients." },
                      { title: block.card2Title || "General Donation", desc: block.card2Desc || "Support hospital operations and infrastructure growth." },
                      { title: block.card3Title || "Corporate Partners", desc: block.card3Desc || "Sponsor oncology and neonatal clinical procedures." }
                    ].map((card, idx) => (
                      <div key={idx} className="p-6 bg-white border rounded-xl space-y-3 flex flex-col justify-between hover:shadow-lg transition-shadow">
                        <div className="space-y-1.5">
                          <h4 className="font-extrabold text-xs uppercase tracking-wider text-[#c5a742]">{card.title}</h4>
                          <p className="text-zinc-500 text-xs leading-relaxed">{card.desc}</p>
                        </div>
                        <button className="w-full py-2 bg-[#043164] text-white font-bold text-xs rounded hover:bg-[#1A3268] transition-colors mt-2">
                          Support Campaign
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. STATS BANNER */}
              {block.type === "stats-banner" && (
                <div className="p-8 bg-[#043164] text-white space-y-6">
                  <div className="text-center pb-2 border-b border-white/10">
                    <h3 className="text-base font-bold text-zinc-100">{block.title || block.content}</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
                    {[
                      { val: block.stat1Num || "67+", label: block.stat1Label || "Years of Service" },
                      { val: block.stat2Num || "300+", label: block.stat2Label || "Expert Doctors" },
                      { val: block.stat3Num || "850+", label: block.stat3Label || "Hospital Beds" },
                      { val: block.stat4Num || "1.2M+", label: block.stat4Label || "Patients Treated" },
                      { val: block.stat5Num || "25+", label: block.stat5Label || "Specialties" },
                      { val: block.stat6Num || "24/7", label: block.stat6Label || "Emergency Care" }
                    ].map((stat, i) => (
                      <div key={i} className="space-y-0.5 border-r last:border-none border-white/10 pr-2">
                        <span className="block text-2xl font-black text-[#c5a742]">{stat.val}</span>
                        <span className="block text-[10px] text-zinc-200 font-semibold uppercase tracking-wider">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 7. WELFARE PILLARS */}
              {block.type === "pillars" && (
                <div className="p-8 bg-white space-y-6 text-[#043164]">
                  <div className="text-center space-y-1">
                    <h3 className="text-xl font-extrabold uppercase tracking-wider">{block.title || block.content}</h3>
                    <p className="text-zinc-400 text-xs font-medium">{block.description || "To deliver accessible, high quality, and subsidized medical healthcare."}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="p-5 rounded-xl border border-zinc-150 text-center space-y-2">
                      <strong className="block text-xs font-extrabold text-[#c5a742] uppercase tracking-wider">Compassion</strong>
                      <p className="text-[11px] text-zinc-400 leading-normal">Always treating patients with dignity, empathy and care.</p>
                    </div>
                    <div className="p-5 rounded-xl border border-zinc-150 text-center space-y-2">
                      <strong className="block text-xs font-extrabold text-[#c5a742] uppercase tracking-wider">Affordability</strong>
                      <p className="text-[11px] text-zinc-400 leading-normal">Highly subsidized medical procedures for welfare cases.</p>
                    </div>
                    <div className="p-5 rounded-xl border border-zinc-150 text-center space-y-2">
                      <strong className="block text-xs font-extrabold text-[#c5a742] uppercase tracking-wider">Quality</strong>
                      <p className="text-[11px] text-zinc-400 leading-normal">Advanced clinical care protocols matching ISO certified standards.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 8. NEWS */}
              {block.type === "news" && (
                <div className="p-8 bg-zinc-50 space-y-4 text-[#043164]">
                  <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                    <h3 className="text-sm font-extrabold uppercase tracking-wider">{block.title || block.content}</h3>
                    <span className="text-[10px] font-bold text-zinc-400">{block.subtitle || "Recent updates from our clinical board"}</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="p-3 bg-white border rounded-xl flex gap-3 items-center">
                      <div className="h-12 w-12 bg-zinc-100 rounded flex-shrink-0 flex items-center justify-center text-zinc-450 font-bold">N</div>
                      <div>
                        <strong className="block text-xs text-zinc-850 leading-tight">MMI Adds State-of-the-Art MRI Center</strong>
                        <span className="text-[9px] text-zinc-400 block mt-1">July 2026</span>
                      </div>
                    </div>
                    <div className="p-3 bg-white border rounded-xl flex gap-3 items-center">
                      <div className="h-12 w-12 bg-zinc-100 rounded flex-shrink-0 flex items-center justify-center text-zinc-450 font-bold">N</div>
                      <div>
                        <strong className="block text-xs text-zinc-850 leading-tight">Subsidized Neonatal Care Clinics Expanded</strong>
                        <span className="text-[9px] text-zinc-400 block mt-1">June 2026</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </main>

      {/* Standalone Hospital Footer Mockup */}
      <footer className="bg-zinc-950 text-zinc-400 py-10 px-8 border-t border-zinc-900 text-xs">
        <div className="max-w-7xl mx-auto grid gap-8 sm:grid-cols-3">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-[#c5a742] flex items-center justify-center text-[#043164] font-black text-xs">MMI</div>
              <span className="font-extrabold text-sm text-white tracking-wider">MMI HOSPITAL</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              Memon Medical Institute Hospital is a welfare healthcare provider offering advanced procedures at highly subsidized rates.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs">Contact Helpdesk</h4>
            <p className="text-[11px] leading-relaxed">
              KDA Scheme 33, Karachi, Pakistan<br />
              UAN Helpline: +92 21 111 664 111<br />
              Email: info@mmi.edu.pk
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs">Accreditations</h4>
            <p className="text-[11px] leading-relaxed">
              ISO 9001:2015 Certified Welfare Hospital<br />
              PMDC Licensed & Joint Commission compliant.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-zinc-900 text-center text-[10px] text-zinc-550 max-w-7xl mx-auto">
          &copy; {new Date().getFullYear()} Memon Medical Institute Hospital. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
