import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { serialize } from "cookie";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.participant.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const participantId = user.id;
    const serializedCookie = serialize("participantId", String(participantId), {
      httpOnly: true,
      secure: false, // Use secure cookies in production
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
      sameSite: "none",
    });

    // Log the serialized cookie to inspect its content
    // console.log("Serialized Cookie:", serializedCookie);

    return NextResponse.json(
      { message: "Login successful", userId: user.id },
      {
        status: 200,
        headers: {
          "Set-Cookie": serializedCookie,
        },
      }
    );
  } catch (error) {
    console.error("Error in login API:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
