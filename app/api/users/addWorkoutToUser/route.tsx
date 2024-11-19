import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/app/libs/MongoConnect";
import Workout from "@/app/models/WorkoutModel";
import User from "@/app/models/UserModel";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/utils/authOptions";
import { ObjectId } from "mongodb";

export async function PATCH(req: NextRequest, res: NextResponse) {
  try {
    const session = await getServerSession(authOptions);
    console.log(session?.user?.email);
    if (!session) {
      return NextResponse.json(
        { message: "Только для зарегистрированных пользователей" },
        { status: 401 }
      );
    }

    await connectMongoDB();
    const body = await req.json();
    const currentUser = await User.findOne({ email: session?.user?.email });

    console.log(currentUser._id);
    console.log(body.workoutsArr);

    const updatedUser = await User.findByIdAndUpdate(currentUser._id, {
      $push: { workoutsArr: body.workoutsArr },
    });

    return NextResponse.json({ message: "Success", result: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message }, { status: 400 });
  }

  //   try {
  //     await connectMongoDB();
  //     const user = await User.findById(params?.userId).populate({
  //       path: "workoutsArr",
  //       populate: {
  //         path: "exercisesArr",
  //         model: "Exercise",
  //         select: "id name",
  //       },
  //     });
  //     return NextResponse.json({ message: "Success", result: user });
  //   } catch (error: any) {
  //     return NextResponse.json({ message: error?.message }, { status: 400 });
  //   }
}
