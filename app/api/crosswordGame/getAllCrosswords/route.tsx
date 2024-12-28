import { connectMongoDB } from "@/app/libs/MongoConnect";
import Crossword from "@/app/models/CrosswordModel";
import Exercise from "@/app/models/ExerciseModel";
import { MongoClient } from "mongodb";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();

    // const allCrosswords = await Crossword.find(
    //   { isCompleted: true },
    //   {
    //     "crosswordObj.addedWordLetter": 0,
    //     "crosswordObj.addedWordArr.value": 0,
    //     "crosswordObj.addedWordArr.addedWordArr.addedLetter": 0,
    //   }
    // );

    const value = await Crossword.find({ isCompleted: true }).countDocuments();

    const page = parseInt(req.nextUrl.searchParams?.get("page") || "1", 10);
    const limit = parseInt(req.nextUrl.searchParams?.get("limit") || "3", 10);
    const skip = (page - 1) * limit;

    const isLastPage = value <= skip + limit;

    // const allCrosswords = await Crossword.find({ isCompleted: true }).select(
    //   " name userId changeDate"
    // );

    const crosswords = await Crossword.aggregate([
      {
        $match: {
          isCompleted: true,
        },
      },
      { $skip: skip },
      { $limit: limit },
      { $project: { name: 1, changeDate: 1, userId: 1 } },
    ]);

    return NextResponse.json({
      message: "sucess",
      result: { crosswords: crosswords, isLastPage: isLastPage },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message }, { status: 400 });
  }
}
