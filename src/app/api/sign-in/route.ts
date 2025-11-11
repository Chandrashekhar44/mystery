import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import { success } from "zod"
import { fa } from "zod/locales"



export async function POST(request:Request){

    dbConnect()
     
    const{username,password} = await request.json()

   const user =  await UserModel.findOne(username,password)

   if(!user){
    return Response.json({
        success:false,
        message:"No user exists with the username"
    })
   }


}