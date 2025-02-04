import GTSGameAttempt from "@/app/models/GTSGameAttemptModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url as string);
  const type = searchParams.get("type") || null;
  const amount = parseFloat(searchParams.get("amount") || "0");
  const status = searchParams.get("status") === "start";

  if (!type || amount < 0) {
    return NextResponse.json({ message: "invalid transaction" }, { status: 400 });

    // return new Response(JSON.stringify({ error: "invalid transaction" }), {
    //   status: 400,
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
  }

  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();
  let closed = false;

  req.signal.onabort = () => {
    console.log("abort");
    writer.close();
  };

  let i = 0;

  let timer = setInterval(write, 1000);
  write();

  async function write() {
    if (req.signal.aborted) {
      clearInterval(timer);
    }

    // i++;

    // if (i == 4) {
    //   writer.write("event: bye\ndata: пока-пока\n\n");
    //   clearInterval(timer);

    //   // writer.close();
    //   return NextResponse.json({ message: "Stop" }, { status: 310 });
    // }
    if (!req.signal.aborted) {
      // writer.write("data: " + i + "\n\n");
      // const date = new Date();
      // const attempt = await GTSGameAttempt.findById("679affc8d6353d1c90440870");
      const currentGTSGameAttemptTime = await GTSGameAttempt.findById(
        "679affc8d6353d1c90440870"
      ).select("timeRemained");

      const currentTime = JSON.parse(JSON.stringify(currentGTSGameAttemptTime.timeRemained));
      const updatedGTSGameAttempt = await GTSGameAttempt.findByIdAndUpdate(
        "679affc8d6353d1c90440870",
        {
          $set: { timeRemained: currentTime - 10 },
        }
      );
      console.log(Date.now());
      writer.write(`event: increment\ndata: ${JSON.stringify(updatedGTSGameAttempt)}\n\n`);
    }
  }

  // const interval = setInterval(async () => {
  //   const date = new Date();
  //   // const attempt = await GTSGameAttempt.findById("679affc8d6353d1c90440870");
  //   const currentGTSGameAttemptTime = await GTSGameAttempt.findById(
  //     "679affc8d6353d1c90440870"
  //   ).select("timeRemained");

  //   const currentTime = JSON.parse(JSON.stringify(currentGTSGameAttemptTime.timeRemained));
  //   const updatedGTSGameAttempt = await GTSGameAttempt.findByIdAndUpdate(
  //     "679affc8d6353d1c90440870",
  //     {
  //       $set: { timeRemained: currentTime - 5 },
  //     }
  //   );
  //   writer.write(encoder.encode(`data: ${JSON.stringify({ message: updatedGTSGameAttempt })}\n\n`));
  // }, 1000);

  // setTimeout(() => {
  //   console.log("clear interval");
  //   clearInterval(interval);
  //   writer.close();

  //   return;
  // }, 10000);

  // for (let index = 10; index < 0; index--) {
  //   writer.write(encoder.encode(`data: ${JSON.stringify({ message: searchParams })}\n\n`));

  // }

  // writer.write(encoder.encode(`data: ${JSON.stringify({ message: status })}\n\n`));

  // writer.close();

  return new Response(responseStream.readable, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "Content-Encoding": "none",
    },
  });
}
