import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/app/libs/MongoConnect";
import Workout from "@/app/models/WorkoutModel";
import User from "@/app/models/UserModel";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/utils/authOptions";
import { IExercise, IUser, IWorkout } from "@/app/types";
import Exercise from "@/app/models/ExerciseModel";

export async function PATCH(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions);
  console.log(session);
  if (!session) {
    return NextResponse.json(
      { message: "Только для зарегистрированных пользователей" },
      { status: 401 }
    );
  }

  try {
    await connectMongoDB();
    const body = await req.json();
    const currentUser: IUser | null = await User.findOne({ email: session.user?.email });
    const currentExercise: IExercise | null = await Exercise.findById(body.exerciseId);

    console.log(currentExercise);

    if (!currentExercise) {
      throw new Error("Не найдено тренировки");
    }

    if (String(currentExercise?.createdUserId) !== String(currentUser?._id)) {
      return NextResponse.json(
        { message: "У вас нет прав для удаления этой тренировки" },
        { status: 403 }
      );
    }

    console.log(body);
    console.log(currentExercise);

    const updatedUser: IUser | null = await User.findOneAndUpdate(
      { email: session.user?.email },
      { $pull: { exercisesArr: { $in: [body.exerciseId] } } }
    );

    // const updatedUser = await User.findByIdAndUpdate(currentUser?._id, {
    //   $push: { workoutsArr: body.workoutsArr },
    // });

    return NextResponse.json({ message: "Success", result: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
