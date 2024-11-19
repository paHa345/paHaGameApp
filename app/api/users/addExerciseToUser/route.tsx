import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/app/libs/MongoConnect";
import User from "@/app/models/UserModel";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/utils/authOptions";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  //   console.log(session?.user?.email);
  if (!session) {
    return NextResponse.json(
      { message: "Только для зарегистрированных пользователей" },
      { status: 401 }
    );
  }

  await connectMongoDB();
  const body = await req.json();
  const currentUser = await User.findOne({ email: session?.user?.email });

  console.log(`ID ${currentUser._id}`);
  console.log(`Arr ${body.exercisesArr}`);

  const updatedUser = await User.findByIdAndUpdate(currentUser._id, {
    $push: { exercisesArr: body.exercisesArr },
  });

  return NextResponse.json({ message: "Success", result: updatedUser });
}
