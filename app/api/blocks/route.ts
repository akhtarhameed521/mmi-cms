import { NextResponse } from "next/server";

export async function GET() {
  const blocks = [
    { type: "hero", name: "Hero Header", category: "Headers" },
    { type: "features", name: "Features Grid", category: "Layout" },
    { type: "cta", name: "Call To Action", category: "Interactive" },
  ];
  return NextResponse.json({ success: true, blocks });
}
