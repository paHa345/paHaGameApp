import { connectMongoDB } from "@/app/libs/MongoConnect";
import AttemptCrosswordGame from "@/app/models/AttemptCrosswordGameModel";
import Crossword from "@/app/models/CrosswordModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, segmentData: any) {
  const params = await segmentData.params;
  try {
    await connectMongoDB();
    console.log(params.telegramID);
    const currentTelegtanUserAttempts = await AttemptCrosswordGame.find({
      telegramID: params.telegramID,
      isCompleted: true,
    });
    console.log(currentTelegtanUserAttempts);
    if (currentTelegtanUserAttempts.length === 0) {
      return NextResponse.json(
        {
          message:
            "Просмотр результатов возможен только для пользователей, выполнивших свои попытки",
        },
        { status: 401 }
      );
    }

    const allGames = await Crossword.find({
      isCompleted: true,
    }).select("name changeDate");

    return NextResponse.json({ status: "Success", result: allGames });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message, status: "Error" }, { status: 400 });
  }
}
