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
    const body: {
      telegramUserID: number;
      answerID: string;
      attemptID: string;
      userArtistAnserText: string;
    } = await req.json();

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

    const answerIDHasInArr = currentGameQuestions.GTSGameObj[
      currentAttempt[0].currentQuestion
    ].artist.artistAnswerArr.find((artist: any) => {
      return String(artist._id) === body.answerID;
    });

    if (!answerIDHasInArr) {
      return NextResponse.json(
        { message: "Не найден ответ в массиве ответов текущего вопроса" },
        { status: 400 }
      );
    }

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

    let bonusTime = 0;

    //если ответ правильный, то добавляемкпопытке 5 секунд
    // если не правильный, то отнимаем

    if (answerIsTrue) {
      console.log("Correct");
      bonusTime = 5;
      if (
        currentAttempt[0].timeRemained + currentAttempt[0].answerTime >
        currentAttempt[0].attemptTime
      ) {
        const updatedGTSGameAttemptTime = await GTSGameAttempt.findByIdAndUpdate(body.attemptID, {
          $set: {
            timeRemained: currentAttempt[0].timeRemained + bonusTime,
            attemptTime: currentAttempt[0].timeRemained + bonusTime,
          },
        });
      } else {
        const updatedGTSGameAttemptTime = await GTSGameAttempt.findByIdAndUpdate(body.attemptID, {
          $set: { timeRemained: currentAttempt[0].timeRemained + bonusTime },
        });
      }
    } else {
      console.log("Wrong");
      bonusTime = -5;
      await GTSGameAttempt.findByIdAndUpdate(body.attemptID, {
        $set: { timeRemained: currentAttempt[0].timeRemained + bonusTime },
      });
    }

    console.log(answerIsTrue);
    console.log(correctArtistText);

    // console.log(currentGameQuestions.GTSGameObj[currentAttempt.currentQuestion]);

    return NextResponse.json({
      message: "Success",
      result: {
        isCorrect: answerIsTrue,
        bonusTime: bonusTime,
        correctArtistText: correctArtistText,
        userArtistAnserText: body.userArtistAnserText,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message }, { status: 400 });
  }
}
