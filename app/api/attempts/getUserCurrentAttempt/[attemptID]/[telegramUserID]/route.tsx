import { connectMongoDB } from "@/app/libs/MongoConnect";
import AttemptCrosswordGame from "@/app/models/AttemptCrosswordGameModel";
import Crossword from "@/app/models/CrosswordModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, segmentData: any) {
  const params = await segmentData.params;
  try {
    await connectMongoDB();
    console.log(params);
    const currentTelegtanUserAttempt = await AttemptCrosswordGame.findById(params.attemptID);
    console.log(currentTelegtanUserAttempt);
    if (currentTelegtanUserAttempt === null) {
      return NextResponse.json(
        {
          message: "Не найдена попытка с таким ID в БД",
        },
        { status: 400 }
      );
    }
    // if (currentTelegtanUserAttempt.length === 0) {
    //   return NextResponse.json(
    //     {
    //       message:
    //         "Просмотр результатов возможен только для пользователей, выполнивших свои попытки",
    //     },
    //     { status: 401 }
    //   );
    // }

    // const allGameAttempts = await AttemptCrosswordGame.aggregate([
    //   { $match: { crosswordID: params.gameID, isCompleted: true } },
    //   { $sort: { durationNumberMs: 1 } },
    // ]);

    return NextResponse.json({ status: "Success", result: currentTelegtanUserAttempt });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message, status: "Error" }, { status: 400 });
  }
}
