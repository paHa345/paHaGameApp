import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/app/libs/MongoConnect";
import Workout from "@/app/models/WorkoutModel";
import User from "@/app/models/UserModel";
import { UserType } from "@/app/types";

export async function GET(req: NextRequest, { params }: { params: { userEmail: string } }) {
  //   console.log(req.query.exerciseId);
  //   const currentId = new ObjectId(String(req.query.exerciseId));
  try {
    const { userEmail } = await params;
    console.log(userEmail);
    await connectMongoDB();
    const user = await User.findOne({ email: userEmail }, { userType: 1 });

    return NextResponse.json({ message: "Success", result: user });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message }, { status: 400 });
  }
}
