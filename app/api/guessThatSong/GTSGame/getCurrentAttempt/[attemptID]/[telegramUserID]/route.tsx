import { connectMongoDB } from "@/app/libs/MongoConnect";
import GTSGameAttempt from "@/app/models/GTSGameAttemptModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, segmentData: any) {
  try {
    if (req.method !== "GET") {
      return NextResponse.json({ message: "Для данного url только GET запросы" }, { status: 400 });
    }
    await connectMongoDB();

    const params = await segmentData.params;
    console.log(params);
    const currentAttempt = await GTSGameAttempt.find({
      telegramID: params.telegramUserID,
      _id: params.attemptID,
    });
    if (!currentAttempt.length) {
      return NextResponse.json({ message: "Не удалось найти текущую попытку" }, { status: 400 });
    }
    return NextResponse.json({ message: "sucess", result: currentAttempt[0] });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message }, { status: 400 });
  }
}
