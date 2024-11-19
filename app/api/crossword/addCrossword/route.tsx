import { connectMongoDB } from "@/app/libs/MongoConnect";
import Comment from "@/app/models/CommentModel";
import Crossword from "@/app/models/CrosswordModel";
import User from "@/app/models/UserModel";
import { authOptions } from "@/app/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { message: "Только для зарегистрированных пользователей" },
      { status: 401 }
    );
  }
  if (req.method !== "POST") {
    return NextResponse.json({ message: "Для данного url только POST запросы" }, { status: 400 });
  }
  try {
    await connectMongoDB();
    const body = await req.json();
    // console.log(body);

    const currentUser = await User.findOne({ email: session.user?.email }).select("_id");

    // body.data = new Date(Date.now());
    body.userId = String(currentUser._id);
    body.changeDate = Date.now();
    console.log("Save");
    console.log(body);

    const addedCrossword = await Crossword.create(body);

    return NextResponse.json({ message: "Success", result: addedCrossword });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message }, { status: 400 });
  }
}
