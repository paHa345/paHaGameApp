import GTSGameAttempt from "@/app/models/GTSGameAttemptModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const currentGTSGameAttemptTime = await GTSGameAttempt.findById(data.GTSGameAttemptID).select(
      "timeRemained"
    );

    const currentTime = JSON.parse(JSON.stringify(currentGTSGameAttemptTime.timeRemained));
    const updatedGTSGameAttempt = await GTSGameAttempt.findByIdAndUpdate(data.GTSGameAttemptID, {
      $set: { timeRemained: currentTime - 5 },
    });
    // Your code here to save the data to your database.
    return NextResponse.json({ message: "Data saved successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message }, { status: 400 });
  }
}
