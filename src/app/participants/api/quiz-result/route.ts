import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken"; // Import the jsonwebtoken package

const prisma = new PrismaClient();

// Replace this with your secret key used for signing JWTs
const JWT_SECRET = process.env.JWT_SECRET || "";

export async function GET(req: NextRequest) {
  try {
    // Retrieve the token from the Authorization header
    const token = req.headers.get("Authorization");

    if (!token) {
      return NextResponse.json(
        { message: "Authorization token is required" },
        { status: 400 }
      );
    }

    // Extract the token (assuming 'Bearer token' format)
    const tokenValue = token.replace("Bearer ", "");

    // Decode and verify the JWT token
    const decodedToken: any = jwt.verify(tokenValue, JWT_SECRET);

    if (!decodedToken || !decodedToken.id) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const participantId = decodedToken.id;

    // Fetch the most recent attempt by the participant
    const recentAttempt = await prisma.attempt.findFirst({
      where: { participantId: participantId },
      orderBy: { createdAt: "desc" }, // Order by creation date to get the most recent attempt
      include: {
        quiz: {
          select: {
            id: true,
            title: true, // Assuming you want the quiz name
          },
        },
      },
    });

    if (!recentAttempt) {
      return NextResponse.json(
        { message: "No attempts found for this participant" },
        { status: 404 }
      );
    }

    // Return the most recent attempt's score along with quiz information
    return NextResponse.json({
      quizId: recentAttempt.quizId,
      quizName: recentAttempt.quiz.title,
      score: recentAttempt.score,
      attemptDate: recentAttempt.createdAt,
    });
  } catch (error) {
    console.error("Error fetching recent attempt:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
