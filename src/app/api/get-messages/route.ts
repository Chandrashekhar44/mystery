import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/model/User";



export async function GET(request : Request){
    await dbConnect();

    const session = await getServerSession(authOptions)
    const _user  = session?.user;

    if(!session || !_user){
        return Response.json({
            message:'Not authenticated',
            success:false
        },{
            status:401
        })
    }

    const userId = new mongoose.Types.ObjectId(_user._id)

    try {
        const user = await UserModel.aggregate([
          {  $match :{_id : userId}},
          {$unwind : '$messages'},
          {$sort :{ 'messages.createdAt' : -1}},
          {$group :{ _id:'$_id',messages : {$push : '$messages'} }}
        ]).exec()

        if(!user || user.length === 0){
            return Response.json({
                message : 'No messages found',
                success:false
            },{
                status:200
            })
        }

         return Response.json(
      {
        success: true,
        messages: user[0].messages,
      },
      { status: 200 }
    );
    } catch (error) {
        console.error('An unexpected error occured',error)
         return Response.json({
                message : 'Internal server error ',
                success:false
            },{
                status:500
            })
        
    }

}