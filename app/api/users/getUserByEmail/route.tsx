import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/app/libs/MongoConnect";
import Workout from "@/app/models/WorkoutModel";
import User from "@/app/models/UserModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/utils/authOptions";
import { UserType } from "@/app/types";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Только для зарегистрированных пользователей" },
        { status: 401 }
      );
    }
    await connectMongoDB();
    const currentUser = await User.findOne(
      { email: session?.user?.email },
      {
        email: 1,
        name: 1,
        workoutsArr: 1,
        addToStudentsRequests: 1,
        exercisesArr: 1,
        reviewsArr: 1,
        userType: 1,
        coachesArr: 1,
      }
    )
      .populate({
        path: "workoutsArr",
        populate: {
          path: "exercisesArr",
          model: "Exercise",
          select: "id name",
        },
      })
      .populate({
        path: "addToStudentsRequests",
        model: "AddToCoachRequest",
      });

    return NextResponse.json({ message: "Success", result: currentUser });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message }, { status: 400 });
  }
}
