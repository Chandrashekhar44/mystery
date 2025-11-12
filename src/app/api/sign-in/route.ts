import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import bcrypt from "bcryptjs"



export async function POST(request:Request){

    dbConnect()
     
   try {
     const{username,password} = await request.json()
 
     if(!username){
        return Response.json({
         success:false,
         message:"username is missing"
     },{
        status:400
     })
     }
 
      if(!password){
        return Response.json({
         success:false,
         message:"password is missing"
     },{
        status:400
     })
     }
 
    const user =  await UserModel.findOne(username)
 
    if(!user){
     return Response.json({
         success:false,
         message:"No user exists with the username"
     },{
        status:400
     })
    }
 
    const comaprePassword = bcrypt.compare(password,user.password)
 
    if(!comaprePassword){
     return Response.json({
         success:false,
         message:"password is wrong"
     },{
        status:400
     })
    }

   return Response.json({
         success:true,
         message:"user sign in successfull"
     },{
        status:200
     })


   } catch (error) {
    console.error("Error while sign in",error)
     return Response.json({
         success:false,
         message:"Error while sign in"
     },{
        status:500
     })
   }



}