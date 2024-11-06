import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // Parse the request body as JSON
    const { name, email, password } = await req.json();

    // Check for missing fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user already exists in the database
    const existingUser = await prisma.participant.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user in the database
    const user = await prisma.participant.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Return the created user as a response
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    // Ensure error is logged in a valid format
    if (error instanceof Error) {
      console.error("User registration failed:", error.message);
    } else {
      console.error("User registration failed: Unknown error", error);
    }

    return NextResponse.json(
      { message: "User registration failed. Please try again later." },
      { status: 500 }
    );
  } finally {
    // Ensure Prisma Client disconnects after the request is done
    await prisma.$disconnect();
  }
}
