import { NextRequest, NextResponse } from "next/server";
import { S3, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

const CREDENTIAL = {
  accessKeyId: process.env.NEXT_PUBLIC_ACCESSKEYID as string,
  secretAccessKey: process.env.NEXT_PUBLIC_SECRETACCESSKEY as string,
};
const s3Client = new S3Client({
  region: "ru-1",
  credentials: CREDENTIAL,
  endpoint: "https://s3.timeweb.com",
  forcePathStyle: true,
  apiVersion: "latest",
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadParams = {
      Bucket: "f1525e96-2c5a759f-3888-4bd2-a52f-dbb62685b4bb",
      Key: `uploads/${Date.now()}-${file.name}`,
      Body: buffer,
      ContentType: file.type,
    };

    console.log(uploadParams);

    await s3Client.send(new PutObjectCommand(uploadParams));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: "Upload failed", details: error }, { status: 500 });
  }
}
