import { OpenAI } from "openai";
import Stream from "stream";
const client = new OpenAI();

export async function POST(req: Request){
  try {
  const stream = await client.responses.create({
      model: "gpt-5",
      input: [
          {
              role: "user",
              content:  "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.",
          },
      ],
      stream: true,
  });
console.log(stream);
  return new Response(stream.toReadableStream(), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
} catch (error : any) {
   console.error("Suggestion not completed", error);
    return new Response("Error generating suggestions", { status: 500 });
}
}
