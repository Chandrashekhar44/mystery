'use client'
import { useState } from "react"
import { Message } from "@/model/User"

const [messages,setMessages] = useState<Message[]>([])

const handleDeleteMessage = (messageId : string) => {
     setMessages( messages.filter((message)=> message._id.toString() != messageId))
};

