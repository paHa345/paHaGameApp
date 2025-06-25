import { connectMongoDB } from "@/app/libs/MongoConnect";
import GTSGameAttempt from "@/app/models/GTSGameAttemptModel";
import GTSGame from "@/app/models/GTSGameModel";

import { MongoClient } from "mongodb";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, segmentData: any) {
  if (req.method !== "GET") {
    return NextResponse.json({ message: "Для данного url только GET запросы" }, { status: 400 });
  }
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

    const currentGame = await GTSGame.findById(currentAttempt[0].GTSGameID).select(
      "GTSGameObj.secoundStep.secoundStepAnswerArr.text GTSGameObj.secoundStep.secoundStepAnswerArr._id"
    );

    if (!currentGame) {
      return NextResponse.json({ message: "Не удалось найти текущую игру" }, { status: 400 });
    }

    // получаем объект такого вида
    //     {
    //   artistAnswerArr: [
    //     { text: 'Manowar',
    //      _id: new ObjectId('67ed07958002dab7d9a7d01b')
    //     },
    //     { text: 'HammerFall',
    //     _id: new ObjectId('67ed07958002dab7d9a7d01b')
    //      },
    //   ]
    // }
    const artistsListVariants =
      currentGame.GTSGameObj[currentAttempt[0].currentQuestion].secoundStep.secoundStepAnswerArr;

    console.log(
      currentGame.GTSGameObj[currentAttempt[0].currentQuestion].secoundStep.secoundStepAnswerArr
    );

    return NextResponse.json({
      message: "sucess",
      result: artistsListVariants,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message }, { status: 400 });
  }
}
