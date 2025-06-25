import { connectMongoDB } from "@/app/libs/MongoConnect";
import GTSGame from "@/app/models/GTSGameModel";

import { MongoClient } from "mongodb";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, segmentData: any) {
  try {
    await connectMongoDB();

    const params = await segmentData.params;

    console.log(params.gameType);

    const value = await GTSGame.find({
      isCompleted: true,
      GTSGameType: params.gameType,
    }).countDocuments();

    const page = parseInt(req.nextUrl.searchParams?.get("page") || "1", 10);
    const limit = parseInt(req.nextUrl.searchParams?.get("limit") || "3", 10);
    const skip = (page - 1) * limit;

    const isLastPage = value <= skip + limit;

    // const allCrosswords = await Crossword.find({ isCompleted: true }).select(
    //   " name userId changeDate"
    // );

    const availableGTSGames = await GTSGame.aggregate([
      {
        $match: {
          isCompleted: true,
          GTSGameType: params.gameType,
        },
      },
      { $skip: skip },
      { $limit: limit },
      { $project: { name: 1, changeDate: 1, userId: 1 } },
    ]);

    return NextResponse.json({
      message: "sucess",
      result: { availableGTSGames: availableGTSGames, isLastPage: isLastPage },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message }, { status: 400 });
  }
}
