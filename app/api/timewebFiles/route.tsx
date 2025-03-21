import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

// const s3Client = new S3Client({ region: process.env.AWS_S3_REGION });

export async function GET() {
  const CREDENTIAL = {
    accessKeyId: "RUEYZDINIEP2SO663H37",
    secretAccessKey: "zqvXoz5xz82HIGMBqI2vKLhKaPdwSDTh9tVld9GG",
  };
  const s3Client = new S3Client({
    region: "ru-1",
    credentials: CREDENTIAL,
    endpoint: "https://swift.timeweb.cloud",
    forcePathStyle: true,
    apiVersion: "latest",
  });

  try {
    const command = new ListObjectsV2Command({
      Bucket: "f1525e96-2c5a759f-3888-4bd2-a52f-dbb62685b4bb",
    });

    console.log(command);

    const response = await s3Client.send(command);
    console.log(JSON.stringify(response));

    const files = response.Contents?.map((file) => ({
      name: file.Key,
      size: file.Size,
      lastModified: file.LastModified,
    }));

    return NextResponse.json({ files });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 });
  }
}
