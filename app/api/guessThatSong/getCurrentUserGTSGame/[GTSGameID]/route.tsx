import { connectMongoDB } from "@/app/libs/MongoConnect";
import GTSGame from "@/app/models/GTSGameModel";
import User from "@/app/models/UserModel";
import { authOptions } from "@/app/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, segmentData: any) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { message: "Только для зарегистрированных пользователей" },
      { status: 401 }
    );
  }
  if (req.method !== "GET") {
    return NextResponse.json({ message: "Для данного url только GET запросы" }, { status: 400 });
  }
  try {
    const params = await segmentData.params;

    console.log(params);

    await connectMongoDB();
    const currentUserID = await User.findOne({ email: session.user?.email }).select("_id");
    console.log(currentUserID);
    if (!currentUserID) {
      return NextResponse.json(
        { message: "Данный пользователь не зарегистрирован" },
        { status: 401 }
      );
    }

    const GTSCurrentGame = await GTSGame.findOne({ _id: params.GTSGameID });

    return NextResponse.json({ message: "Success", result: GTSCurrentGame }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message }, { status: 400 });
  }
}
