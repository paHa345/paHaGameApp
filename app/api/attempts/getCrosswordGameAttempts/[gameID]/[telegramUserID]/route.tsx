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
      crosswordID: params.gameID,
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

    const value = await AttemptCrosswordGame.find({
      crosswordID: params.gameID,
      isCompleted: true,
    }).countDocuments();

    const page = parseInt(req.nextUrl.searchParams?.get("page") || "1", 10);
    const limit = parseInt(req.nextUrl.searchParams?.get("limit") || "3", 10);
    const skip = (page - 1) * limit;

    console.log(limit);

    const isLastPage = value <= skip + limit;

    console.log(isLastPage);
    const allGameAttempts = await AttemptCrosswordGame.aggregate([
      { $match: { crosswordID: params.gameID, isCompleted: true } },
      { $sort: { completedCorrectly: -1, durationNumberMs: 1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    return NextResponse.json({
      status: "Success",
      result: { allGameAttempts: allGameAttempts, isLastPage: isLastPage },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message, status: "Error" }, { status: 400 });
  }
}
