import { NextRequest, NextResponse } from "next/server";
import Exercise from "@/app/models/ExerciseModel";
import { connectMongoDB } from "@/app/libs/MongoConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/utils/authOptions";
import { IExercise, IUser } from "@/app/types";
import User from "@/app/models/UserModel";
import Workout from "@/app/models/WorkoutModel";
import Crossword from "@/app/models/CrosswordModel";
import AttemptCrosswordGame from "@/app/models/AttemptCrosswordGameModel";

export async function GET(req: NextRequest, segmentData: any) {
  //   const session = await getServerSession(authOptions);
  //   if (!session) {
  //     return NextResponse.json(
  //       { message: "Только для зарегистрированных пользователей" },
  //       { status: 401 }
  //     );
  //   }
  const params = await segmentData.params;

  console.log(params);

  try {
    await connectMongoDB();

    // const currentUser: IUser | null = await User.findOne({ email: session.user?.email });
    // console.log(currentUser);

    const currentUserCrosswordAttempt = await AttemptCrosswordGame.find({
      crosswordID: params.crosswordId,
      telegramID: params.telegramUserID,
      isCompleted: true,
    });

    if (currentUserCrosswordAttempt.length > 0) {
      return NextResponse.json(
        { message: "Вы уже выполнили попытку", status: "Error" },
        { status: 400 }
      );
    }

    // console.log(currentUserCrosswordAttempt);

    const crossword = await Crossword.findById(params.crosswordId, {
      "crosswordObj.addedWordLetter": 0,
      "crosswordObj.addedWordDirectionJbj": 0,
      "crosswordObj.addedWordArr.value": 0,
      "crosswordObj.addedWordArr.addedWordArr.addedLetter": 0,
      answersArr: 0,
    });

    console.log(crossword);

    return NextResponse.json({ status: "Success", result: crossword });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message, status: "Error" }, { status: 400 });
  }
}
