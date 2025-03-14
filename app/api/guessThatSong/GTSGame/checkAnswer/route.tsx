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

    // console.log(currentGameQuestions.GTSGameObj[currentAttempt.currentQuestion]);

    const userAnswerIndex = currentGameQuestions.GTSGameObj[
      currentAttempt.currentQuestion
    ].answersArr.findIndex((answer: any) => {
      return String(answer._id) === body.answerID;
    });

    if (userAnswerIndex === -1) {
      return NextResponse.json({ message: "Не удалось найти ответ" }, { status: 400 });
    }

    let isCorrect;
    let bonusTime = 0;

    if (
      userAnswerIndex ===
      currentGameQuestions.GTSGameObj[currentAttempt.currentQuestion].correctAnswerIndex
    ) {
      console.log("Correct");
      isCorrect = true;
      bonusTime = currentAttempt.answerTime;
      if (currentAttempt.timeRemained + currentAttempt.answerTime > currentAttempt.attemptTime) {
        const updatedGTSGameAttemptTime = await GTSGameAttempt.findByIdAndUpdate(body.attemptID, {
          $set: {
            timeRemained: currentAttempt.timeRemained + currentAttempt.answerTime,
            attemptTime: currentAttempt.timeRemained + currentAttempt.answerTime,
          },
        });
      } else {
        const updatedGTSGameAttemptTime = await GTSGameAttempt.findByIdAndUpdate(body.attemptID, {
          $set: { timeRemained: currentAttempt.timeRemained + currentAttempt.answerTime },
        });
      }
    } else {
      console.log("Wrong");
      isCorrect = false;
    }

    //меняем attemptQuestionStatus

    const currentAttemptQuestionStatus = JSON.parse(
      JSON.stringify(currentAttempt.attemptQuestionStatus)
    );

    console.log(currentGameQuestions);
    //установливаем правильное название песни
    currentAttemptQuestionStatus[currentAttempt.currentQuestion].correctAnswerSongName =
      currentGameQuestions.GTSGameObj[currentAttempt.currentQuestion].answersArr[
        currentGameQuestions.GTSGameObj[currentAttempt.currentQuestion].correctAnswerIndex
      ].text;

    console.log("userAnswerIndex");
    console.log(userAnswerIndex);

    //установливаем  название песни выбранное пользователем
    //проверить
    currentAttemptQuestionStatus[currentAttempt.currentQuestion].userAnswerSongName =
      currentGameQuestions.GTSGameObj[currentAttempt.currentQuestion].answersArr[
        userAnswerIndex
      ].text;

    currentAttemptQuestionStatus[currentAttempt.currentQuestion].getAnswer = true;
    isCorrect
      ? (currentAttemptQuestionStatus[currentAttempt.currentQuestion].answerIsCorrect = true)
      : (currentAttemptQuestionStatus[currentAttempt.currentQuestion].answerIsCorrect = false);

    // сохраняем изменения в базу
    const updatedGTSGameAttempt = await GTSGameAttempt.findByIdAndUpdate(body.attemptID, {
      $set: { attemptQuestionStatus: currentAttemptQuestionStatus },
    });

    // если вопрос последний, то завершаем попытку
    let attemptIsCompleted = false;
    if (currentAttempt.currentQuestion === currentGameQuestions.GTSGameObj.length - 1) {
      await GTSGameAttempt.findByIdAndUpdate(body.attemptID, {
        $set: { isCompleted: true },
      });
      attemptIsCompleted = true;
    } else {
      await GTSGameAttempt.findByIdAndUpdate(body.attemptID, {
        $set: { currentQuestion: currentAttempt.currentQuestion + 1 },
      });
    }

    // переключаем на следующий вопрос

    return NextResponse.json({
      message: "Success",
      result: {
        attemptIsCompleted: attemptIsCompleted,
        bonusTime: bonusTime,
        isCorrect: isCorrect,
        attempt: currentAttempt,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message }, { status: 400 });
  }
}
