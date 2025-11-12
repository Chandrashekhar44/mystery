import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';



export async function POST(req: Request) {
  const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";


 try {
     const {text} = await generateText({
       model: openai('gpt-4o'),
       system: 'You are a helpful assistant.',
       prompt,
     });
   
     return Response.json({result : text});
 } catch (error) {
    if(error instanceof OpenAI.APIError){
        const {name,status,message} = error;
        return NextResponse.json({name,status,message})
    }else{
       console.error("An unexpected error occured",error);
       throw error;
    }
    
 }
}