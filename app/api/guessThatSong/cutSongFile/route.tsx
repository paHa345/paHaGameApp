import Ffmpeg from "fluent-ffmpeg";
import ffmpeg, { FfmpegCommand, ffprobe } from "fluent-ffmpeg";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import ffmpegStatic from "ffmpeg-static";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const file = request.body || "";
  const filename = searchParams.get("filename") || "654654";
  const images = await request.blob();

  const song = await images.arrayBuffer();
  console.log(song);
  var decoder = new TextDecoder("utf-8");
  const str = decoder.decode(new Uint8Array(song));
  const buffer = Buffer.from(song);
  console.log(buffer);

  // fs.writeFileSync(path.join(process.cwd(), "public", filename), buffer);

  const videoPath = request.body;
  console.log(videoPath);

  // ffmpeg(song)
  //   .output("/public/ert.mp4")
  //   .size("1280x720")
  //   .outputOptions("-crf 28");

  // ffmpeg("/public/X2Twitter.com_JlE_a4DG59XqhI3u_1920p.mp4")
  //   .input("/public/X2Twitter.com_JlE_a4DG59XqhI3u_1920p.mp4")
  //   .input(
  //     fs.createReadStream("/public/X2Twitter.com_JlE_a4DG59XqhI3u_1920p.mp4")
  //   )

  //   .output("/public/new.mp4")
  //   .outputOptions("-crf 28");

  // var command = ffmpeg(
  //   fs.createReadStream("/public/X2Twitter.com_JlE_a4DG59XqhI3u_1920p.mp4")
  // );
  // console.log(command);

  // ffmpeg(command)
  //   .output("/public/ert.mp4")
  //   .ffprobe(function (err, data) {
  //     console.log("file metadata:");
  //     console.log(data);
  //   });

  //   ffmpeg -ss 132 -i input.mp3 output.mp3
  //   Ffmpeg(
  //     "./../../../../public/Black_Sabbath_-_Neon_Knights_47956657 (mp3cut.net).mp3"
  //   ).duration("20").

  return NextResponse.json({ message: "Seccess" });
}
