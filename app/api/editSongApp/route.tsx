import { connectMongoDB } from "@/app/libs/MongoConnect";
import AttemptCrosswordGame from "@/app/models/AttemptCrosswordGameModel";
import Crossword from "@/app/models/CrosswordModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json({ message: "Для данного url только POST запросы" }, { status: 400 });
  }
  try {
    await connectMongoDB();
    const body = await req.json();

    console.log(URL.createObjectURL(new Blob([body.buffer], { type: "audio/mp3" })));

    console.log("get");

    return NextResponse.json({ status: "Success", result: "allGames" });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message, status: "Error" }, { status: 400 });
  }
}
