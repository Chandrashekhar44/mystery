import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const fallbackQuestions =
  "What's a hobby you've always wanted to try?||If you could visit any country, where would you go?||What's something that always makes you smile?";

export async function POST(req: Request) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const result = await model.generateContent(
      `Suggest 3 anonymous questions someone can ask a stranger.
       Return them separated by || with no extra text, numbering, or explanation.`
    );

    return new Response(result.response.text().trim(), {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }catch (error: any) {
  console.warn(
    `Gemini failed (${error?.status || "unknown"}), using fallback`
  );

  return new Response(fallbackQuestions, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

}
