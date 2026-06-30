import { NextResponse } from "next/server";

export async function GET() {
  const users = [
    { id: "1", name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", role: "Editor", status: "Active" },
  ];
  return NextResponse.json({ success: true, users });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ success: true, user: { id: Date.now().toString(), ...body } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
