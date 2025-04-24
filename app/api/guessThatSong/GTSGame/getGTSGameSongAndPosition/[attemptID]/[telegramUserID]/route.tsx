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
      isCompleted: false,
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
    const answerTime = currentAttempt[0].answerTime;
    const questionsStatus = currentAttempt[0].attemptQuestionStatus;
    const currentQuestion = currentAttempt[0].currentQuestion;
    const GTSGameName = currentAttempt[0].GTSGameName;

    return NextResponse.json({
      message: "sucess",
      result: {
        songURL: songURL,
        questionAnswers: questionAnswers,
        timeRemained: attemptTimeRemained,
        attemptTime: attemptFullTime,
        answerTime: answerTime,
        questionsStatus: questionsStatus,
        currentQuestion: currentQuestion,
        GTSGameName: GTSGameName,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message }, { status: 400 });
  }
}
