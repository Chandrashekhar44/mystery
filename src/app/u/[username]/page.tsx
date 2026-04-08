'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import {  Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {useCompletion} from '@ai-sdk/react';
import { useForm } from "react-hook-form";
import  {messageSchema}  from "@/schemas/messageSchema";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import {Textarea} from  '@/components/ui/textarea';
import { useSession } from "next-auth/react";


const specialChar = '||';

const initialMessageString =  "What's your favorite movie?||Do you have any pets?||What's your dream job?";
const parseStringMessages = (messageString: string): string[] => {
  if (!messageString) return [];

  return messageString
    .split(specialChar)
    .map((msg) => msg.trim())
    .filter(Boolean);
};


export default function Sendmessage (){

    const params = useParams<{username : string}>();
    const username = params.username;

    const {
  complete,
  completion,
  setCompletion,
  isLoading: isSuggestLoading,
  error,
} = useCompletion({
  api: "/api/suggest-message",
  initialCompletion: initialMessageString,
});


    const form = useForm<z.infer<typeof messageSchema>>({
        resolver:zodResolver(messageSchema),
    })

    const messagecontent = form.watch('content');

    const handleMessageClick = (message : string)=>{
      form.setValue('content',message)
    }

    const [isLoading,setIsLoading] = useState(false);
    const { data: session, status } = useSession();
    const router = useRouter();

    const onSubmit = async(data : z.infer<typeof messageSchema>) =>{
        setIsLoading(true);
        try {
            const response = await axios.post('/api/send-message',{
                ...data,
                username,
            })

            toast({
                title:response.data.message,
                variant:'default',
            })

            form.reset({...form.getValues(),content:''})
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>

             toast({
                title:'Error',
                description:`${axiosError.response?.data.message}`,
                variant:'destructive',
            })
            
        }finally{
            setIsLoading(false);
        }
    }
const fallbackMessageString =
  "What's a hobby you've always wanted to try?||If you could travel anywhere, where would you go?||What's something that always makes you smile?";

const fetchSuggestedMessages = async () => {
  try {
    const result = await complete("suggest");

    const finalMessages = result || fallbackMessageString;
    setCompletion(finalMessages);

   if (result) {
  toast({
    title: "Suggestions ready",
    description: "Fresh AI-generated suggestions have been loaded.",
  });
} else {
  toast({
    title: "Error",
    description:
      "Gemini couldn't generate suggestions because the API quota has been exceeded, so backup questions are being shown instead.",
      variant:"destructive"
  });
}
  } catch (error) {
    setCompletion(fallbackMessageString);

    toast({
      title: "Backup suggestions loaded",
      description:
        "Gemini AI suggestions are temporarily unavailable, so fallback questions are being shown.",
    });
  }
};







    return(
         <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !messagecontent}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            onClick={fetchSuggestedMessages}
            className="my-4"
            disabled={isSuggestLoading}
          >
            Suggest Messages
          </Button>
          <p>Click on any message below to select it.</p>
        </div>
       <Card>
  <CardHeader>
    <h3 className="text-xl font-semibold">Messages</h3>
  </CardHeader>
  <CardContent className="flex flex-col space-y-4 max-h-96 overflow-y-auto">
    {error ? (
      <p className="text-red-500">{error.message}</p>
    ) : (
      parseStringMessages(completion).map((message, index) => (
        <Button
          key={index}
          variant="outline"
          className="mb-2 whitespace-normal break-words text-left"
          onClick={() => handleMessageClick(message)}
        >
          {message}
        </Button>
      ))
    )}
  </CardContent>
</Card>

      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
         {!session ? (
        <Button onClick={() => router.replace("/sign-up")}>
          Create Your Account
        </Button>
      ) : (
        <Button onClick={() => router.replace("/dashboard")}>
          Go to Dashboard
        </Button>
      )}
      </div>
    </div>
    )
}


