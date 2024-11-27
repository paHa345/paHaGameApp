import { connectMongoDB } from "@/app/libs/MongoConnect";
import AttemptCrosswordGame from "@/app/models/AttemptCrosswordGameModel";
import Crossword from "@/app/models/CrosswordModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    if (req.method !== "POST") {
      return NextResponse.json({ message: "Для данного url только POST запросы" }, { status: 400 });
    }
    await connectMongoDB();
    const body = await req.json();
    const crossword = await Crossword.findById(body.crosswordID);
    if (crossword === null) {
      return NextResponse.json({ message: "Не найдена игра" }, { status: 400 });
    }
    const attempt = await AttemptCrosswordGame.find({
      crosswordID: body.crosswordID,
      telegramID: body.telegramID,
    });
    console.log(attempt);
    if (attempt.length !== 0) {
      return NextResponse.json({ message: "Вы уже пытались сыграть в эту игру" }, { status: 400 });
    }
    const startDate = new Date();

    const newAttampt = await AttemptCrosswordGame.create({ ...body, startDate: startDate });
    return NextResponse.json({ message: "Success", result: newAttampt });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message }, { status: 400 });
  }
}
