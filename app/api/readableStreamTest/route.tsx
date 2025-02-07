import { connectMongoDB } from "@/app/libs/MongoConnect";
import GTSGameAttempt from "@/app/models/GTSGameAttemptModel";

export const config = {
  runtime: "edge",
};

// const delay = (ms: any) => new Promise((res) => setTimeout(res, ms));
export const maxDuration = 20;

export async function GET() {
  const encoder = new TextEncoder();
  await connectMongoDB();

  const readable = new ReadableStream({
    async start(controller) {
      const intervalID = setInterval(async () => {
        // const currentGTSGameAttemptTime = await GTSGameAttempt.findById(
        //   "679affc8d6353d1c90440870"
        // ).select("timeRemained");

        // const currentTime = JSON.parse(JSON.stringify(currentGTSGameAttemptTime.timeRemained));
        // const updatedGTSGameAttempt = await GTSGameAttempt.findByIdAndUpdate(
        //   "679affc8d6353d1c90440870",
        //   {
        //     $set: { timeRemained: currentTime - 10 },
        //   }
        // );
        // console.log(updatedGTSGameAttempt.timeRemained);
        // console.log(readable);
        // if (readable.locked) {
        //   controller.enqueue(encoder.encode(`${String(Date.now())}  `));
        // }
        fetchData();
      }, 1000);

      async function fetchData() {
        console.log(readable);
        if (readable.locked) {
          const currentGTSGameAttemptTime = await GTSGameAttempt.findById(
            "679affc8d6353d1c90440870"
          ).select("timeRemained");

          const currentTime = JSON.parse(JSON.stringify(currentGTSGameAttemptTime.timeRemained));
          const updatedGTSGameAttempt = await GTSGameAttempt.findByIdAndUpdate(
            "679affc8d6353d1c90440870",
            {
              $set: { timeRemained: currentTime - 10 },
            },
            {
              new: true,
            }
          ).select("timeRemained");
          console.log(updatedGTSGameAttempt.timeRemained);
          controller.enqueue(encoder.encode(`${String(updatedGTSGameAttempt.timeRemained)}  `));
        } else {
          clearInterval(intervalID);
          controller.close();
        }
      }

      // controller.enqueue(encoder.encode(`${String(Date.now())}  `));
      // await delay(1000);

      // controller.enqueue(encoder.encode(`${String(Date.now())}  `));
      // await delay(1000);
      // controller.enqueue(encoder.encode(`${String(Date.now())}  `));
      // await delay(1000);
      // controller.enqueue(encoder.encode(`${String(Date.now())}  `));
      // await delay(1000);
      // controller.enqueue(encoder.encode(`${String(Date.now())}  `));
      // controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
