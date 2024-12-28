import { connectMongoDB } from "@/app/libs/MongoConnect";
import AttemptCrosswordGame from "@/app/models/AttemptCrosswordGameModel";
import Crossword from "@/app/models/CrosswordModel";
import { AddedWordDirection } from "@/app/store/crosswordSlice";
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

    const body = await req.json();

    if (!body.attemptID || !body.crosswordID) {
      return NextResponse.json({ message: "Отправлены неверные данные" }, { status: 400 });
    }

    const currentAttempt = await AttemptCrosswordGame.findById(body.attemptID);
    if (currentAttempt === null) {
      return NextResponse.json({ message: "Неверный ID попытки" }, { status: 400 });
    }

    const crossword: any = await Crossword.findById(body.crosswordID);

    if (crossword === null) {
      return NextResponse.json({ message: "Неверный ID кроссворда" }, { status: 400 });
    }

    const userAnswers: {
      row: number;
      col: number;
      addedWordArr: {
        direction: AddedWordDirection;
        value: string;
        isCorrect?: boolean;
        question: string | undefined;
      }[];
    }[] = body.answersArr;

    const crosswordAnswers: any = JSON.parse(JSON.stringify(crossword.answersArr));

    let isCorrect = true;
    for (let i = 0; i < userAnswers.length; i++) {
      if (userAnswers[i]?.addedWordArr?.length > 0) {
        for (let j = 0; j < userAnswers[i]?.addedWordArr?.length; j++) {
          if (
            userAnswers[i]?.addedWordArr[j].direction !==
              crosswordAnswers[i]?.addedWordArr[j].direction ||
            userAnswers[i]?.addedWordArr[j].value !== crosswordAnswers[i]?.addedWordArr[j].value
          ) {
            userAnswers[i].addedWordArr[j].isCorrect = false;

            isCorrect = false;
            // break;
          } else {
            userAnswers[i].addedWordArr[j].isCorrect = true;
          }
        }
      }
    }

    console.log(userAnswers);

    const finishDate = new Date();
    const durationNumberMs = finishDate.valueOf() - currentAttempt.startDate.valueOf();

    function msToTime(duration: number) {
      var milliseconds = Math.floor((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor(duration / (1000 * 60 * 60));
      hours = hours < 10 ? 0 + hours : hours;
      minutes = minutes < 10 ? 0 + minutes : minutes;
      seconds = seconds < 10 ? 0 + seconds : seconds;
      return `${hours}:${minutes}:${seconds}`;
    }

    const durationString = msToTime(durationNumberMs);

    const finishAttampt = await AttemptCrosswordGame.findByIdAndUpdate(currentAttempt._id, {
      isCompleted: true,
      finishDate: finishDate,
      completedCorrectly: isCorrect,
      duration: durationString,
      crosswordName: crossword.name,
      userPhoto: body.userPhoto,
      durationNumberMs: durationNumberMs,
      firstName: body.firstName,
      lastName: body.lastName,
      userAnswers: userAnswers,
    });

    const updatedFinishAttampt = await AttemptCrosswordGame.findById(currentAttempt._id);
    return NextResponse.json({ message: "Success", result: updatedFinishAttampt });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message }, { status: 400 });
  }
}
