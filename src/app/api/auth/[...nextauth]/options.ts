import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import bcrypt from 'bcryptjs';
import {NextAuthOptions} from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";


export const authOptions : NextAuthOptions ={
    providers : [
    CredentialsProvider({
     id: 'credentials',
     name: 'Credentials',
      credentials: {
      identifier: { label: "Email or username", type: "text" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials:any):Promise<any>{
         await dbConnect();
         try {
          if (!credentials?.identifier || !credentials?.password) {
  throw new Error("Missing credentials");
}

              const user = await UserModel.findOne({
                $or:[
                    {email:credentials.identifier},
                    {username : credentials.identifier}
                ]
              })
             
              if(!user){
                throw new Error('No user found with this email')
              }
              if(!user.isVerified){
                throw new Error('Please verify your account before logging in')
              }

              const isPasswordCorrect = await bcrypt.compare(
                credentials.password,
                user.password
              )

              if (!isPasswordCorrect) {
  throw new Error("Incorrect password");
}

return {
  id: user._id.toString(),
  email: user.email,
  username: user.username,
  isVerified: user.isVerified,
  isAcceptingMessages: user.isAcceptingMessages,
};

            
            
         }catch (err: any) {
  console.error("Authorize error:", err);
  throw err; 
}

    }

    })
    ],
    callbacks:{
        async jwt({token,user}){
            if(user){
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token
        },
        async session({session,token}){
            if(token){
              session.user._id = token._id;
              session.user.isVerified = token.isVerified;
              session.user.isAcceptingMessages = token.isAcceptingMessages;
              session.user.username = token.username

            }
            return session
        }

    },
    session:{
      strategy:'jwt',
    },
    secret:process.env.NEXTAUTH_SECRET,
    pages:{
      signIn:'/sign-in'
    }
};