import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(
  req: Request,
  context: { params: Promise<{ email: string }> } 
) {
  try {
    await dbConnect();

    const { otp } = await req.json();
    const params = await context.params;   
    const email = params.email;

    console.log("Server received email:", email);

    if (!email) {
      return new Response(
        JSON.stringify({ success: false, message: "Email not provided" }),
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );
    }
     console.log(user.verifyCode);
     console.log(otp)
    if (user.verifyCode.toString() !== otp.toString().trim()) {
      return new Response(
        JSON.stringify({ success: false, message: "Incorrect OTP" }),
        { status: 400 }
      );
    }

    if (Date.now() > user.verifyCodeExpiry.getTime()) {
      return new Response(
        JSON.stringify({ success: false, message: "OTP expired" }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "OTP verified successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to verify OTP" }),
      { status: 500 }
    );
  }
}
