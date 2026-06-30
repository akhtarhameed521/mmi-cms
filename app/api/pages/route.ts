import { NextResponse } from "next/server";

export async function GET() {
  const pages = [
    { id: "1", title: "Home Page", slug: "/", status: "Published" },
    { id: "2", title: "About Us", slug: "/about", status: "Draft" },
  ];
  return NextResponse.json({ success: true, pages });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ success: true, page: { id: Date.now().toString(), ...body } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid layout config" }, { status: 400 });
  }
}
