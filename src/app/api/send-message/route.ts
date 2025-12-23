import dbConnect from "@/lib/dbConnect"
import UserModel, { Message } from "@/model/User";
import { success } from "zod";




export async function POST(request : Request){
    await dbConnect();
      const { username ,content} =await request.json()
      try {
        const user = await UserModel.findOne({username}).exec()

        if(!user){
            return Response.json({
                message:'User not found ',
                success:false
            },{
                status:404
            })
        }
        if(!user.isAcceptingMessages){
            return Response.json({
                message:'User is not accepting the messages ',
                success:false
            },{
                status:403
            })
        }

        const message = {
            content,
            createdAt : new Date()
        }

        user.messages.push(message as Message);
        await user.save();

        return Response.json({
                message:'Message sent successfully ',
                success:true
            },{
                status:201
            })

      } catch (error) {
        console.error('Error sending the message ',error
        )
         return Response.json({
                message:'Error adding message ',
                success:false
            },{
                status:500
            })

      }
}