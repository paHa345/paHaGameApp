import { connectMongoDB } from "@/app/libs/MongoConnect";
import AttemptCrosswordGame from "@/app/models/AttemptCrosswordGameModel";
import Crossword from "@/app/models/CrosswordModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, segmentData: any) {
  const params = await segmentData.params;
  try {
    await connectMongoDB();
    console.log(params);
    const currentTelegtanUserAttempts = await AttemptCrosswordGame.find({
      telegramID: params.telegramUserID,
      isCompleted: true,
    });
    if (currentTelegtanUserAttempts.length === 0) {
      return NextResponse.json(
        {
          message:
            "Просмотр результатов возможен только для пользователей, выполнивших свои попытки",
        },
        { status: 401 }
      );
    }

    const allGameAttempts = await AttemptCrosswordGame.find({
      crosswordID: params.gameID,
    });

    return NextResponse.json({ status: "Success", result: allGameAttempts });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message, status: "Error" }, { status: 400 });
  }
}
