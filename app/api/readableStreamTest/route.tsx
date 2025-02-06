export const config = {
  runtime: "edge",
};

const delay = (ms: any) => new Promise((res) => setTimeout(res, ms));

export async function GET() {
  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode(`${String(Date.now())}  `));
      await delay(1000);
      controller.enqueue(encoder.encode(`${String(Date.now())}  `));
      await delay(1000);
      controller.enqueue(encoder.encode(`${String(Date.now())}  `));
      await delay(1000);
      controller.enqueue(encoder.encode(`${String(Date.now())}  `));
      await delay(1000);
      controller.enqueue(encoder.encode(`${String(Date.now())}  `));
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
