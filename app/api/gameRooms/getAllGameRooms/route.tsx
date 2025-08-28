import { connectMongoDB } from "@/app/libs/MongoConnect";
import GameRoom from "@/app/models/GameRoom";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    const allGameRooms = await GameRoom.find();
    return NextResponse.json({
      status: "Success",
      result: { allGamesRoomList: allGameRooms, isLastPage: "" },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message, status: "Error" }, { status: 400 });
  }
}
