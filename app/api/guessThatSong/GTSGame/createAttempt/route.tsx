import { connectMongoDB } from "@/app/libs/MongoConnect";
import AttemptCrosswordGame from "@/app/models/AttemptCrosswordGameModel";
import Crossword from "@/app/models/CrosswordModel";
import GTSGameAttempt from "@/app/models/GTSGameAttemptModel";
import GTSGame from "@/app/models/GTSGameModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    if (req.method !== "POST") {
      return NextResponse.json({ message: "Для данного url только POST запросы" }, { status: 400 });
    }
    await connectMongoDB();
    const body = await req.json();
    const currentGTSGame = await GTSGame.findById(body.GTSGameID);
    if (currentGTSGame === null) {
      return NextResponse.json({ message: "Не найдена игра" }, { status: 400 });
    }
    const completedAttempt = await GTSGameAttempt.find({
      GTSGameID: body.GTSGameID,
      telegramID: body.telegramID,
      isCompleted: true,
    });

    if (completedAttempt.length !== 0) {
      return NextResponse.json({ message: "Вы уже пытались сыграть в эту игру" }, { status: 400 });
    }

    const attemptQuestionStatus = currentGTSGame.GTSGameObj.map(
      (question: {
        _id: string;
        songURL: string;
        correctAnswerIndex: number;
        answersArr: { text: string };
      }) => {
        return { questionID: question._id, getAnswer: false };
      }
    );

    const uncompletedAttempt = await GTSGameAttempt.find({
      GTSGameID: body.GTSGameID,
      telegramID: body.telegramID,
      isCompleted: false,
    });

    if (uncompletedAttempt.length !== 0) {
      return NextResponse.json({ message: "Success", result: uncompletedAttempt });
    }

    const startDate = new Date();

    const newAttampt = await GTSGameAttempt.create({
      ...body,
      isCompleted: false,
      currentQuestion: 0,
      answerTime: 10,
      startDate: startDate,
      timeRemained: currentGTSGame.GTSGameObj.length * currentGTSGame.gameComplexity,
      attemptTime: currentGTSGame.GTSGameObj.length * currentGTSGame.gameComplexity,
      attemptQuestionStatus: attemptQuestionStatus,
    });
    return NextResponse.json({ message: "Success", result: newAttampt });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message }, { status: 400 });
  }
}
