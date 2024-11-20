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

    const allCrosswords = await Crossword.find({ isCompleted: true }).select(
      " name userId changeDate"
    );

    return NextResponse.json({ message: "sucess", result: allCrosswords });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message }, { status: 400 });
  }
}
