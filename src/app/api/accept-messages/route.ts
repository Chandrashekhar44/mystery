import dbConnect from "@/lib/dbConnect";
import {getServerSession} from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import UserModel from "@/model/User";
import { success } from "zod";



export async function POST(request :Request){
    dbConnect();

   const session = await getServerSession(authOptions);
   const user = session?.user;

   if(!session || !session.user){
      return Response.json({
        success:false,
        message :"Not authenticated"
      },{
        status : 401
      })
   }

   const userId = user?._id
   const {acceptingMessages} = await request.json()

   try {
   const updatedUSer = await UserModel.findByIdAndUpdate(userId,{
        isAcceptingMessages : acceptingMessages
    },{new : true})

    if(!updatedUSer){
         return Response.json({
        success:false,
        message :"Unable to find user to make changes in message acceptance"
      },{
        status : 404
      })
    }

    return  Response.json({
        success : true,
        message :`Message acceptance is ${updatedUSer.isAcceptingMessages ? 'ON' : 'OFF'}`
      },{
        status : 200
      })



   } catch (error) {
    
     console.error("Error updating message acceptance status",error)
    return  Response.json({
        success : true,
        message :"Error updating message acceptance status"
      },{
        status : 500
      })
   }

}

export async function GET(request : Request){
     dbConnect()

    const session = await getServerSession(authOptions);
    const user = session?.user;

    if(!session || !user){
        return Response.json({
          success: false,
          message : "Not authenticated"     
        },{
            status : 401
        })
    }

    try {

       const foundUser = await UserModel.findById(user?._id)
       if(!foundUser){
        return Response.json({
          success: false,
          message : "User not found "     
        },{
            status : 404
        })
       }


        return Response.json({
          success: true,
          isAcceptingMessages : foundUser.isAcceptingMessages  
        },{
            status : 200
        })

        
    } catch (error) {
        console.error("Error retreiving message acceptance status",error)

         return Response.json({
          success: false,
          message :" Error retreiving message acceptance status"
        },{
            status : 500
        })


        
    }
}