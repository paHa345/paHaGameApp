import { connectMongoDB } from "@/app/libs/MongoConnect";
import AttemptCrosswordGame from "@/app/models/AttemptCrosswordGameModel";
import Crossword from "@/app/models/CrosswordModel";
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

    const userAnswers = body.answersArr;

    const crosswordAnswers: any = JSON.parse(JSON.stringify(crossword.answersArr));

    let isCorrect = true;
    for (let i = 0; i < userAnswers.length; i++) {
      if (userAnswers[i]?.addedWordArr?.length > 0) {
        for (let j = 0; j < userAnswers[i]?.addedWordArr?.length; j++) {
          // console.log(userAnswers[i]?.addedWordArr[j]);
          // console.log(crosswordAnswers[i]?.addedWordArr[j]);
          if (
            userAnswers[i]?.addedWordArr[j].direction !==
              crosswordAnswers[i]?.addedWordArr[j].direction ||
            userAnswers[i]?.addedWordArr[j].value !== crosswordAnswers[i]?.addedWordArr[j].value
          ) {
            isCorrect = false;
            break;
          }
        }
      }
    }

    console.log(isCorrect);

    return NextResponse.json({ message: "Success", result: "" });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message }, { status: 400 });
  }
}
