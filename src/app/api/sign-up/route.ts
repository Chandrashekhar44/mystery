import dbConnect from "@/lib/dbConnect";
import  UserModel  from "@/model/User";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import bcrypt from "bcryptjs";


export async function POST (request:Request){
    await dbConnect()

    try {
        const {username,email,password} = await request.json();

        const existingVerifiedUserByusername = await UserModel.findOne({
            username,
            isVerified:true
        })
         if(existingVerifiedUserByusername){
           return Response.json({
            success:false,
            message:"Username is already taken"   
           },{
            status:400
           })
        }

        const existinguserByEmail = await  UserModel.findOne(email)
        let verifyCode = Math.floor(1000000 + Math.random() * 900000).toString();
        if(existinguserByEmail){
           if(existinguserByEmail.isVerified){
            return Response.json({
                success:false,
                message:'User already exists with this email'
            },{
                status:400
            })
           }else{
              const hashedPassword = await bcrypt.hash(password,10);
              existinguserByEmail.password = hashedPassword;
              existinguserByEmail.verifyCode = verifyCode;
              existinguserByEmail.verifyCodeExpiry= new Date(Date.now()+ 3600000);
              await existinguserByEmail.save();
           }
        }else{
            const hashedPassword = await bcrypt.hash(password,10)
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password:hashedPassword,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessages:true,
                messages:[]


            });
            await newUser.save();
        }

        const emailResponse = await sendVerificationEmail(email,username,verifyCode)
        if(!emailResponse){
            return Response.json({
                success:false,
                message:"Error while sending Verification Email"

            },{
                status:500
            })
        }

        return Response.json({
            success:true,
            message:'User registered successfully . Please verify your account'
        },{
            status:201
        })


        
    } catch (error) {
        console.error('Error registering user :',error);
        return Response.json(
            {
                success:false,
                message:'Error registering user'
            },{
                status : 500
            }
        )
        
    }
}