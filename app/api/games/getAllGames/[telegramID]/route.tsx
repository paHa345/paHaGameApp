import { connectMongoDB } from "@/app/libs/MongoConnect";
import AttemptCrosswordGame from "@/app/models/AttemptCrosswordGameModel";
import Crossword from "@/app/models/CrosswordModel";
import GameData from "@/app/models/GameDataModel";
import GTSGame from "@/app/models/GTSGameModel";
import { NextRequest, NextResponse } from "next/server";
import GTSGameAttempt from "../../../../models/GTSGameAttemptModel";

export async function GET(req: NextRequest, segmentData: any) {
  const params = await segmentData.params;
  try {
    await connectMongoDB();
    console.log(params.telegramID);

    // const currentTelegtanUserAttempts = await AttemptCrosswordGame.find({
    //   telegramID: params.telegramID,
    //   isCompleted: true,
    // });

    // if (currentTelegtanUserAttempts.length === 0) {
    //   return NextResponse.json(
    //     {
    //       message:
    //         "Просмотр результатов возможен только для пользователей, выполнивших свои попытки",
    //     },
    //     { status: 401 }
    //   );
    // }

    const value = await Crossword.find({ isCompleted: true }).countDocuments();

    const page = parseInt(req.nextUrl.searchParams?.get("page") || "1", 10);
    const limit = parseInt(req.nextUrl.searchParams?.get("limit") || "3", 10);
    const skip = (page - 1) * limit;

    const isLastPage = value <= skip + limit;

    const GTSGames = await GTSGame.find();

    const games = await Crossword.aggregate([
      {
        $match: {
          isCompleted: true,
        },
      },
      { $skip: skip },
      { $limit: limit },
      { $project: { name: 1, changeDate: 1 } },
    ]);

    // const allExercises = await Exercise.aggregate([
    //   {
    //     $match: {
    //       $and: [
    //         { name: { $regex: `(${searchQuery})`, $options: "i" } },
    //         { $or: [{ createdUserId: String(currentUser?._id) }, { isBest: true }] },
    //       ],
    //     },
    //   },
    //   { $sort: sortQuery },
    //   { $skip: skip },
    //   { $limit: limit },
    // ]);

    return NextResponse.json({
      status: "Success",
      result: { games: GTSGames, isLastPage: isLastPage },
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message, status: "Error" },
      { status: 400 }
    );
  }
}
