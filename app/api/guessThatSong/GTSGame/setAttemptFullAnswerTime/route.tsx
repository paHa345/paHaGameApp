import { connectMongoDB } from "@/app/libs/MongoConnect";
import GTSGameAttempt from "@/app/models/GTSGameAttemptModel";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    if (req.method !== "PATCH") {
      return NextResponse.json(
        { message: "Для данного url только PATCH запросы" },
        { status: 400 }
      );
    }
    await connectMongoDB();
    const body: { telegramUserID: number; answerID: string; attemptID: string } = await req.json();
    console.log(body);
    const currentAttempt = await GTSGameAttempt.find({
      _id: body.attemptID,
      telegramID: body.telegramUserID,
    });
    if (!currentAttempt) {
      return NextResponse.json({ message: "Не удалось найти текущую попытку" }, { status: 400 });
    }
    const currentUpdatedAttempt = await GTSGameAttempt.findByIdAndUpdate(
      body.attemptID,
      {
        $set: { answerTime: 10 },
      },
      { new: true }
    );

    console.log("Full time");
    console.log(currentUpdatedAttempt);
    return NextResponse.json({
      message: "Success",
      result: currentUpdatedAttempt,
    });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
