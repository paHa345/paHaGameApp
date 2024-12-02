import { connectMongoDB } from "@/app/libs/MongoConnect";
import AttemptCrosswordGame from "@/app/models/AttemptCrosswordGameModel";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest, segmentData: any) {
  const params = await segmentData.params;
  try {
    await connectMongoDB();
    console.log(params.telegramID);
    const currentTelegtanUserAttempts = await AttemptCrosswordGame.find({
      telegramID: params.telegramID,
      isCompleted: true,
    });
    console.log(currentTelegtanUserAttempts);
    if (currentTelegtanUserAttempts.length === 0) {
      return NextResponse.json(
        { message: "Только для пользователей выполнивших свои попытки" },
        { status: 400 }
      );
    }

    return NextResponse.json({ status: "Success", result: "" });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message, status: "Error" }, { status: 400 });
  }
}
