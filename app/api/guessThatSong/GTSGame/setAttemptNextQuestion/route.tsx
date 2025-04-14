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

    const currentAttempt = await GTSGameAttempt.find({
      _id: body.attemptID,
      telegramID: body.telegramUserID,
      isCompleted: false,
    });
    const currentGameQuestions = await GTSGame.findById(currentAttempt[0].GTSGameID).select(
      "GTSGameObj"
    );

    console.log("Data");
    // console.log(currentAttempt[0]);
    console.log(
      currentGameQuestions.GTSGameObj[
        currentAttempt[0].currentQuestion
      ].artist.artistAnswerArr.find((artist: any) => {
        return String(artist._id) === body.answerID;
      })
    );

    //проверки
    if (!currentAttempt[0]) {
      return NextResponse.json({ message: "Не найдена попытка" }, { status: 400 });
    }
    if (!currentGameQuestions) {
      return NextResponse.json({ message: "Не найдена игра" }, { status: 400 });
    }
    if (
      !currentGameQuestions.GTSGameObj[
        currentAttempt[0].currentQuestion
      ].artist.artistAnswerArr.find((artist: any) => {
        return String(artist._id) === body.answerID;
      })
    ) {
      return NextResponse.json({ message: "Не найден ответ" }, { status: 400 });
    }

    // если вопрос последний, то завершаем попытку
    let updatedAttempt;
    let attemptIsCompleted = false;

    //если время не осталось, то завершвем попытку

    if (currentAttempt[0].timeRemained <= 0) {
      updatedAttempt = await GTSGameAttempt.findByIdAndUpdate(
        body.attemptID,
        {
          $set: { isCompleted: true },
        },
        { new: true }
      );
      attemptIsCompleted = true;

      return NextResponse.json({
        message: "Success",
        result: {
          attemptIsCompleted: attemptIsCompleted,
          attempt: updatedAttempt,
        },
      });
    }

    if (currentAttempt[0].currentQuestion === currentGameQuestions.GTSGameObj.length - 1) {
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
          $set: { currentQuestion: currentAttempt[0].currentQuestion + 1 },
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
