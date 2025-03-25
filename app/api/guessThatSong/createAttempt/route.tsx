import { connectMongoDB } from "@/app/libs/MongoConnect";
import AttemptCrosswordGame from "@/app/models/AttemptCrosswordGameModel";
import Crossword from "@/app/models/CrosswordModel";
import GTSGameAttempt from "@/app/models/GTSGameAttemptModel";
import GTSGame from "@/app/models/GTSGameModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    if (req.method !== "POST") {
      return NextResponse.json({ message: "Для данного url только POST запросы" }, { status: 400 });
    }
    await connectMongoDB();
    const body = await req.json();
    const currentGTSGame = await GTSGame.findById(body.GTSGameID);
    if (currentGTSGame === null) {
      return NextResponse.json({ message: "Не найдена игра" }, { status: 400 });
    }
    const completedAttempt = await GTSGameAttempt.find({
      GTSGameID: body.GTSGameID,
      telegramUserID: body.telegramUserID,
      isCompleted: true,
    });
    if (completedAttempt.length !== 0) {
      return NextResponse.json({ message: "Вы уже пытались сыграть в эту игру" }, { status: 400 });
    }

    const uncompletedAttempt = await GTSGameAttempt.find({
      crosswordID: body.crosswordID,
      telegramID: body.telegramID,
      isCompleted: false,
    });

    if (uncompletedAttempt.length !== 0) {
      return NextResponse.json({ message: "Success", result: uncompletedAttempt });
    }

    const startDate = new Date();

    const newAttampt = await GTSGameAttempt.create({ ...body, startDate: startDate });

    console.log(newAttampt);
    return NextResponse.json({ message: "Success", result: newAttampt });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message }, { status: 400 });
  }
}
