import { connectMongoDB } from "@/app/libs/MongoConnect";
import User from "@/app/models/UserModel";
import { authOptions } from "@/app/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
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
        userType: 1,
      }
    );
    if (currentUser.length === 0) {
      throw new Error("Пользователь не найден");
    }
    return NextResponse.json({ message: "Success", result: currentUser });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message }, { status: 400 });
  }
}
