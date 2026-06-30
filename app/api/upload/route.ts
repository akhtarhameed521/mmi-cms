import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name.replace(/\s+/g, "-");
    const uploadDir = path.join(process.cwd(), "public", "assets", "uploads");

    // Ensure the directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Save the file
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      url: `/assets/uploads/${filename}`,
      name: filename,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("Upload handler error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
