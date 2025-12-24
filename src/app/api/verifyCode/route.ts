import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User";


export async function POST(request:Request){
      await dbConnect();
    try {
        const {username,code} =await request.json()
        const decodeComponent = decodeURIComponent(username)

        const user = await UserModel.findOne({
            username : decodeComponent
        })
        if(!user){
            return Response.json({
                success : false,
                message : "user not found"
            },{
                status: 401
            })
        }

        const checkCode = user.verifyCode == code
        console.log(user.verifyCode)
        console.log(code)
        console.log(checkCode)
        const isCodeExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(!checkCode){
            return Response.json({
                success : false,
                message : "Enter the correct verifycode"
            },{
                status: 402
            })
        }else if(!isCodeExpired){
             return Response.json({
                success : false,
                message : "Code timeline is expired"
            },{
                status: 403
            })
        }else{
            user.isVerified = true
            await user.save()
            return Response.json({
                success : true,
                message : "User verified successfully"
            },{
                status: 200
            })
        }
       
       
    } catch (error) {
        console.error('Error while verifying the user',error)
        return Response.json({
                success : false,
                message : "Error while verifying the user"
            },{
                status: 500
            })
    }
}