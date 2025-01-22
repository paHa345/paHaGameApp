import { connectMongoDB } from "@/app/libs/MongoConnect";
import GTSGame from "@/app/models/GTSGameModel";
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

    const GTSGameBody = await req.json();
    let addedGTSGame;
    if (GTSGameBody.gameID) {
      console.log("Update Game in DB");
      console.log(GTSGameBody);
      // тут нужно вернуть объект и записать его в addedGTSGame
      addedGTSGame = await GTSGame.findByIdAndUpdate(GTSGameBody.gameID, GTSGameBody, {
        new: true,
      });
    } else {
      const currentUser = await User.findOne({ email: session.user?.email }).select("_id");

      GTSGameBody.userID = currentUser._id;
      GTSGameBody.changeDate = new Date(Date.now());
      console.log(GTSGameBody);

      addedGTSGame = await GTSGame.create(GTSGameBody);
    }

    return NextResponse.json({ message: "Success", result: addedGTSGame }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message }, { status: 400 });
  }
}
