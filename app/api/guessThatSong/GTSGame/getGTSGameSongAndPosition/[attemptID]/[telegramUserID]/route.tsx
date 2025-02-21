import { connectMongoDB } from "@/app/libs/MongoConnect";
import GTSGameAttempt from "@/app/models/GTSGameAttemptModel";
import GTSGame from "@/app/models/GTSGameModel";

import { MongoClient } from "mongodb";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, segmentData: any) {
  try {
    await connectMongoDB();

    const params = await segmentData.params;
    // console.log(params.attemptID);
    // console.log(params.telegramUserID);

    const currentAttempt = await GTSGameAttempt.find({
      _id: params.attemptID,
      telegramID: params.telegramUserID,
    });
    if (!currentAttempt.length) {
      return NextResponse.json({ message: "Не удалось найти текущую попытку" }, { status: 400 });
    }

    const currentGame = await GTSGame.findById(currentAttempt[0].GTSGameID);

    if (!currentGame) {
      return NextResponse.json({ message: "Не удалось найти текущую игру" }, { status: 400 });
    }

    const songURL = currentGame.GTSGameObj[currentAttempt[0].currentQuestion].songURL;
    const questionAnswers = currentGame.GTSGameObj[currentAttempt[0].currentQuestion].answersArr;
    const attemptTimeRemained = currentAttempt[0].timeRemained;
    const attemptFullTime = currentAttempt[0].attemptTime;

    return NextResponse.json({
      message: "sucess",
      result: {
        songURL: songURL,
        questionAnswers: questionAnswers,
        attemptTimeRemained: attemptTimeRemained,
        attemptFullTime: attemptFullTime,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message }, { status: 400 });
  }
}
