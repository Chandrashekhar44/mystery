import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import { getServerSession, User } from "next-auth";

import { authOptions } from "../../auth/[...nextauth]/options";



export   async function DELETE(request:Request,{params} : {params :{messageId : string}}){

    await dbConnect();
    const messageId  = params.messageId
    const session = await getServerSession(authOptions)
    const _user = session?.user
    if(!session || !_user){
        return Response.json({
            success:false,
            message:'Not Authenticated',
        },{status:401})
    }

    try {
        const response = await UserModel.updateOne({_id: _user._id},{
            $pull:{messages:{_id : messageId}}
        })

        if(response.modifiedCount === 0){
            return Response.json({
                success: false,
                message:'Message not found or already deleted'
            },{
                status:404
            })
        }
        return Response.json({
            message:'message deleted',
            success : true       },{
                status: 200
            })
    
    } catch (error) {
        console.error('Error deleting message',error);
        return Response.json({
            message:'Unexpected error',
            success : false       },{
                status: 500
            })
    }
};