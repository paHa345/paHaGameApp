import { connectMongoDB } from "@/app/libs/MongoConnect";
import GTSGameAttempt from "@/app/models/GTSGameAttemptModel";
import GTSGame from "@/app/models/GTSGameModel";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    if (req.method !== "PATCH") {
      return NextResponse.json(
        { message: "Для данного url только PATCH запросы" },
        { status: 400 }
      );
    }
    await connectMongoDB();
    const body: { telegramUserID: number; answerID: string; attemptID: string } = await req.json();

    const currentAttempt = await GTSGameAttempt.findById(body.attemptID);
    const currentGameQuestions = await GTSGame.findById(currentAttempt.GTSGameID).select(
      "GTSGameObj"
    );

    // если вопрос последний, то завершаем попытку
    let updatedAttempt;
    let attemptIsCompleted = false;
    if (currentAttempt.currentQuestion === currentGameQuestions.GTSGameObj.length - 1) {
      updatedAttempt = await GTSGameAttempt.findByIdAndUpdate(
        body.attemptID,
        {
          $set: { isCompleted: true },
        },
        { new: true }
      );
      attemptIsCompleted = true;
    } else {
      updatedAttempt = await GTSGameAttempt.findByIdAndUpdate(
        body.attemptID,
        {
          $set: { currentQuestion: currentAttempt.currentQuestion + 1 },
        },
        { new: true }
      );
    }

    // переключаем на следующий вопрос

    return NextResponse.json({
      message: "Success",
      result: {
        attemptIsCompleted: attemptIsCompleted,
        attempt: updatedAttempt,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message }, { status: 400 });
  }
}
