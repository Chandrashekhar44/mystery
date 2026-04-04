import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import sendVerificationEmail from "@/helpers/sendVerificationEmail";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields required" },
        { status: 400 }
      );
    }

    const existingUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUsername) {
      return NextResponse.json(
        { success: false, message: "Username already taken" },
        { status: 400 }
      );
    }

    let user = await UserModel.findOne({ email });

    const hashedPassword = await bcrypt.hash(password, 10);

    const verifyCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const verifyCodeExpiry = new Date(Date.now() + 60 * 60 * 1000);

    if (user) {
      if (user.isVerified) {
        return NextResponse.json(
          { success: false, message: "Email already registered" },
          { status: 400 }
        );
      }

      user.username = username;
      user.password = hashedPassword;
      user.verifyCode = verifyCode;
      user.verifyCodeExpiry = verifyCodeExpiry;

      await user.save();
    } else {
      user = await UserModel.create({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });
    }

    const emailResponse = await sendVerificationEmail(
      email,
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

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}
