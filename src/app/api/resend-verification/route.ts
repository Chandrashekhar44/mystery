import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import  sendVerificationEmail  from "@/helpers/sendVerificationEmail";

export async function POST(req: NextRequest) {
  try {
    const { identifier } = await req.json();

    await dbConnect();

    const user = await UserModel.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { success: false, message: "User already verified" },
        { status: 400 }
      );
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    user.verifyCode = verifyCode;
    user.verifyCodeExpiry = new Date(Date.now() + 60 * 60 * 1000);

    await user.save();

    const emailResponse = await sendVerificationEmail(
      user.email,
      verifyCode
    );

    if (!emailResponse.status) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send verification email",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verification email sent",
      username: user.username
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
