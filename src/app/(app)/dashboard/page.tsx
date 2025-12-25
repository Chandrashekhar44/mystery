'use client'
import { useCallback, useEffect, useState } from "react"
import { Message } from "@/model/User"
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageSchema } from "@/schemas/messageSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCcw } from "lucide-react";
import {MessageCard} from '@/components/MessageCard'

function UserDashboard () {
const [messages,setMessages] = useState<Message[]>([])
const [isSwitchLoading,setIsSwitchLoading] = useState(false);
const [isLoading,setIsLoading] = useState(false);

const handleDeleteMessage = (messageId : string) => {
     setMessages( messages.filter((message)=> message._id.toString() != messageId))
};

const {data : session,status} = useSession()


const form = useForm({
    resolver : zodResolver(MessageSchema)
}) 

const {setValue,watch,register} = form
const acceptMessages = watch('acceptMessages')

const fetchAcceptMessage = useCallback(async () =>{
    setIsSwitchLoading(true)
    try {
        const response = await axios.get<ApiResponse>('/api/accept-messages')
        setValue('acceptMessages',response.data.isAcceptingMessages ?? false)

    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
            title:'Error',
            description:axiosError.response?.data.message ?? 'Failed to fetch message settings',
            variant:"destructive"

        })
        
    } finally{
        setIsSwitchLoading(false);
    }

},[setValue,toast])



const fetchMessages = useCallback(async (refresh : boolean = false) =>{
    setIsLoading(true);
    setIsSwitchLoading(true)
   try {
     const response = await axios.get<ApiResponse>('/api/get-messages')
     setMessages(response.data.messages || [])
   } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>
    toast({
        title:'Error',
        description:axiosError.response?.data.message ?? "Failed to fetch messages",
        variant:"destructive"
    })
   }finally{
    setIsLoading(false),
    setIsSwitchLoading(false)
   }
}
 ,[setIsLoading,setMessages,toast]      
)

useEffect(()=>{
    if(!session || !session.user )  return;

    fetchAcceptMessage();

    fetchMessages();
},[toast,fetchAcceptMessage,fetchMessages,setValue,session])

const handleSwitchChange = async () =>{
    try {
        const response = await axios.post<ApiResponse>('/api/accept-messages',{acceptMessages : !acceptMessages})
        setValue('acceptMessages' , !acceptMessages)
        toast({
            title:response.data.message,
            variant:'default'
        })
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        toast({
            title:'Error',
            description:axiosError.response?.data.message ?? "Failed to update message",
            variant:'destructive'
        })
    }
}

    if(!session || !session.user){
     <div></div>;
    }

    if(status == "loading"){
  return <p>Loading...</p>
}

if(!session?.user){
  return <p> NOT AUTHENTICATED</p>
}
//This page could not be found   http://localhost:3000/u/shekhar

    const {username} = session?.user! as User
    console.log(username)
    const baseUrl =
  typeof window !== "undefined"? `${window.location.protocol}//${window.location.host}`: "";

    const profileUrl = `${baseUrl}/u/${username}`

    const copyToClipboard = ()=>{
        navigator.clipboard.writeText(profileUrl)
        toast({
            title:'URL copied',
            description:'Profile url has been copied to clipboard successfully'
        })
    };

       return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id.toString()}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );}

  export default UserDashboard;