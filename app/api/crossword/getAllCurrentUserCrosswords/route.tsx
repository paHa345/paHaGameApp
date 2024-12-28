import { connectMongoDB } from "@/app/libs/MongoConnect";
import Comment from "@/app/models/CommentModel";
import Crossword from "@/app/models/CrosswordModel";
import User from "@/app/models/UserModel";
import { authOptions } from "@/app/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { message: "Только для зарегистрированных пользователей" },
      { status: 401 }
    );
  }
  if (req.method !== "GET") {
    return NextResponse.json({ message: "Для данного url только POST запросы" }, { status: 400 });
  }
  try {
    await connectMongoDB();

    const currentUser = await User.findOne({ email: session.user?.email }).select("_id");
    console.log(currentUser);
    const crosswords = await Crossword.find({ userId: currentUser._id }).select(
      "_id name isCompleted changeDate"
    );

    return NextResponse.json({ message: "Success", result: crosswords });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message }, { status: 400 });
  }
}
