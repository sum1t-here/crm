import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: { quizId: string } }
) {
  const { participantId } = await request.json();
  const quizId = parseInt(params.quizId, 10);

  if (isNaN(quizId) || !participantId) {
    return NextResponse.json(
      { error: "Invalid quiz ID or participant ID" },
      { status: 400 }
    );
  }

  try {
    const existingAttempt = await prisma.attempt.findFirst({
      where: {
        quizId,
        participantId,
      },
    });

    if (existingAttempt) {
      return NextResponse.json(
        { error: "Participant has already attempted this quiz" },
        { status: 400 }
      );
    }

    // Create new attempt
    const attempt = await prisma.attempt.create({
      data: {
        quizId,
        participantId,
        score: 0, // Initialize score
      },
    });

    // Fetch questions for the quiz
    const questions = await prisma.question.findMany({
      where: {
        quizId,
      },
    });

    return NextResponse.json({ attempt, questions });
  } catch (error) {
    console.error("Error starting quiz attempt:", error);
    return NextResponse.json(
      { error: "Failed to start attempt" },
      { status: 500 }
    );
  }
}
