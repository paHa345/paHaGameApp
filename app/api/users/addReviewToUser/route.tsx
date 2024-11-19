import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/app/libs/MongoConnect";
import User from "@/app/models/UserModel";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/utils/authOptions";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Только для зарегистрированных пользователей" },
        { status: 401 }
      );
    }

    await connectMongoDB();
    const body = await req.json();
    const currentUser = await User.findOne({ email: session?.user?.email });

    const updatedUser = await User.findByIdAndUpdate(currentUser._id, {
      $push: { reviewsArr: body.reviewsArr },
    });

    return NextResponse.json({ message: "Success", result: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message }, { status: 400 });
  }
}
