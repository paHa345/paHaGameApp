import { NextRequest, NextResponse } from "next/server";
import Exercise from "@/app/models/ExerciseModel";
import { connectMongoDB } from "@/app/libs/MongoConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/utils/authOptions";
import { IExercise, IUser } from "@/app/types";
import User from "@/app/models/UserModel";
import Workout from "@/app/models/WorkoutModel";
import Crossword from "@/app/models/CrosswordModel";

export async function GET(req: NextRequest, segmentData: any) {
  //   const session = await getServerSession(authOptions);
  //   if (!session) {
  //     return NextResponse.json(
  //       { message: "Только для зарегистрированных пользователей" },
  //       { status: 401 }
  //     );
  //   }
  const params = await segmentData.params;
  const slug = params.slug;

  try {
    await connectMongoDB();

    // const currentUser: IUser | null = await User.findOne({ email: session.user?.email });
    // console.log(currentUser);

    const crossword = await Crossword.findById(params.crosswordId, {
      "crosswordObj.addedWordLetter": 0,
      "crosswordObj.addedWordArr.value": 0,
      "crosswordObj.addedWordArr.addedWordArr.addedLetter": 0,
    });

    console.log(crossword);

    return NextResponse.json({ status: "Success", result: crossword });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message, status: "Error" }, { status: 400 });
  }
}
