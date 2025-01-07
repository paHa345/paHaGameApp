import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { put } from "@vercel/blob";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const file = request.body || "";
  const filename = searchParams.get("filename") || "654654";

  const blob = await put(filename, file, {
    access: "public",
  });

  return NextResponse.json(blob);

  // const data = await request.formData();
  // const file: File | null = data.get("file") as unknown as File;

  // if (!file) {
  //   return NextResponse.json({ success: false });
  // }

  // const bytes = await file.arrayBuffer();
  // const buffer = Buffer.from(bytes);

  // const path = join(`./public/${file.name}`);
  // await writeFile(path, buffer);
  // console.log(`open ${path} to see the uploaded file`);

  // return NextResponse.json({ success: true });
}
