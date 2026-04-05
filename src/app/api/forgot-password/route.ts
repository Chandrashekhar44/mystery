import sendVerificationEmail from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { email } = await req.json();

    if (!email) {
      return Response.json(
        {
          message: "Enter valid email",
          success: false,
        },
        {
          status: 400,
        }
      );
    }

    const userEmail = await UserModel.findOne({
      email
    });

    if (!userEmail) {
      return Response.json(
        {
          message: "Email not found",
          success: false,
        },
        {
          status: 404,
        }
      );
    }else{
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        await UserModel.findOneAndUpdate(
    { email },
    {
        verifyCode: code,
        verifyCodeExpiry: Date.now() + 15*60*1000 
    },{
      new :true
    }

    
);
  const cleanEmail = email.trim().toLowerCase();



    const emailResponse = await sendVerificationEmail(
      cleanEmail,
      code
    );

    }

    return Response.json(
      {
        message: "User with email found successfully",
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error while finding user", error);

    return Response.json(
      {
        message: "Error while finding user",
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}
