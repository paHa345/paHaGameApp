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
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { message: "Только для зарегистрированных пользователей" },
      { status: 401 }
    );
  }
  const params = await segmentData.params;
  const slug = params.slug;

  try {
    await connectMongoDB();

    const currentUser: IUser | null = await User.findOne({ email: session.user?.email });

    const crossword = await Crossword.findById(params?.crosswordId);

    console.log(currentUser);
    console.log(crossword);

    return NextResponse.json({ status: "Success", result: crossword });
    // return NextResponse.json({ message: "Olol" });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message, status: "Error" }, { status: 400 });
  }
}

// export async function DELETE(req: NextRequest, { params }: { params: { exerciseId: string } }) {
//   const session = await getServerSession(authOptions);
//   if (!session) {
//     return NextResponse.json(
//       { message: "Только для зарегистрированных пользователей" },
//       { status: 401 }
//     );
//   }

//   try {
//     await connectMongoDB();
//     console.log(params?.exerciseId);
//     const currentUser: IUser | null = await User.findOne({ email: session.user?.email });
//     const currentExercise: IExercise | null = await Exercise.findById(params?.exerciseId);

//     if (!currentExercise) {
//       return NextResponse.json({ message: "Упражнение не найдено" }, { status: 404 });
//     }

//     if (String(currentExercise?.createdUserId) !== String(currentUser?._id)) {
//       throw new Error("У вас нет прав для удаления этой трнировки");
//     }
//     const exercise: any = await Exercise.findByIdAndDelete(params?.exerciseId);
//     // if (!exercise) {
//     //   return NextResponse.json({ message: "Упражнение не найдено" }, { status: 404 });
//     // }
//     console.log(exercise);

//     return NextResponse.json({ message: "Success", result: exercise });
//   } catch (error: any) {
//     return NextResponse.json({ message: error.message }, { status: 400 });
//   }
// }
