import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  
  // Return page builder structure for the given ID
  return NextResponse.json({
    success: true,
    pageId: id,
    blocks: [
      { id: "1", type: "hero", content: "Hero Header Title" },
      { id: "2", type: "features", content: "Features Description Text" },
    ],
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ success: true, saved: body.blocks });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save layout" }, { status: 400 });
  }
}
