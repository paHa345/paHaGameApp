import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/app/libs/MongoConnect";
import Workout from "@/app/models/WorkoutModel";
import User from "@/app/models/UserModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/utils/authOptions";

export async function GET(req: NextRequest, { params }: { params: { exerciseId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Только для зарегистрированных пользователей" },
        { status: 401 }
      );
    }
    await connectMongoDB();
    const currentUser = await User.findOne({ email: session?.user?.email }, "name").populate({
      path: "reviewsArr",
      match: { exerciseId: { $eq: params?.exerciseId } },
    });

    return NextResponse.json({ message: "Success", result: currentUser });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message }, { status: 400 });
  }
}
