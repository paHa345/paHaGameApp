import { connectMongoDB } from "@/app/libs/MongoConnect";
import AttemptCrosswordGame from "@/app/models/AttemptCrosswordGameModel";
import Crossword from "@/app/models/CrosswordModel";
import GameData from "@/app/models/GameDataModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    const gamesData = await GameData.find();

    return NextResponse.json({ status: "Success", result: gamesData[0].chooseGameButtonData });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message, status: "Error" }, { status: 400 });
  }
}
