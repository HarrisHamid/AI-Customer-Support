import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt =
  "You are a AI-powered customer support assistant for Microsoft. Answer any all all questions that the customer may have. The customer may ask about the company, the products, the services, or anything else. The customer may also ask for help with a problem they are experiencing. Be as helpful as possible.";

export async function POST(req) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const data = await req.json();

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      ...data,
    ],

    model: "gpt-3.5-turbo",
        stream: true,
  });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content;

          if (content) {
            const text = encoder.encode(content);
            controller.enqueue(text);
          }
        }
      } catch (error) {
        controller.error(error);
      } finally {
        controller.close();
      }
      s;
    },
  });

  return new NextResponse(stream)
}
