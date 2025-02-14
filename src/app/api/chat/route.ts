import OpenAI from "openai";

let requests: { [key: string]: { count: number; startTime: number } } = {};
const RATE_LIMIT = 100;
const TIME_FRAME = 60 * 60 * 1000;

function checkRateLimit(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    (req.headers.get("cf-connecting-ip") ?? "unknown");

  const now = Date.now();

  requests[ip as keyof typeof requests] = requests[
    ip as keyof typeof requests
  ] || { count: 0, startTime: now };
  const record = requests[ip];

  if (now - record.startTime > TIME_FRAME) {
    Object.assign(record, { count: 1, startTime: now });
    return false;
  }

  record.count++;
  return record.count > RATE_LIMIT;
}

export async function POST(request: Request) {
  if (checkRateLimit(request)) {
    return new Response(JSON.stringify({ message: "Too Many Requests" }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { messages, model } = await request.json();
  const openai = new OpenAI({
    baseURL: "https://api.055ai.cn/v1/",
    apiKey: process.env.DEEP_SEEK_API_KEY,
  });

  try {
    const response = await openai.chat.completions.create({
      model: "deepseek-ai/DeepSeek-R1",
      messages,
      stream: true,
    });

    return new Response(
      new ReadableStream({
        async start(controller) {
          for await (const chunk of response) {
            controller.enqueue(
              `data: ${JSON.stringify({
                content: chunk.choices[0]?.delta?.content || "",
              })}\n\n`
            );
          }
          controller.close();
        },
      }),
      {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      }
    );
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
