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
    if (!currentAttempt[0]) {
      return NextResponse.json({ message: "Не найдена попытка" }, { status: 400 });
    }

    const currentGameQuestions = await GTSGame.findById(currentAttempt[0].GTSGameID).select(
      "GTSGameObj"
    );

    let answerIsTrue = false;
    let correctArtistText = "";

    currentGameQuestions.GTSGameObj[
      currentAttempt[0].currentQuestion
    ].artist.artistAnswerArr.forEach(
      (artist: { text: string; isCorrect: boolean; _id: string }, index: number) => {
        if (String(artist._id) === body.answerID) {
          answerIsTrue = artist.isCorrect;
        }
        if (artist.isCorrect) {
          correctArtistText = artist.text;
        }
      }
    );

    //если ответ правильный, то добавляемкпопытке 5 секунд
    // если не правильный, то отнимаем
    // if (answerIsTrue) {
    //   currentAttempt[0].bonusTime += 5;
    // } else {
    //   currentAttempt[0].bonusTime -= 5;
    // }

    console.log(answerIsTrue);
    console.log(correctArtistText);

    // console.log(currentGameQuestions.GTSGameObj[currentAttempt.currentQuestion]);

    return NextResponse.json({
      message: "Success",
      result: {
        name: "werwer",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message }, { status: 400 });
  }
}
