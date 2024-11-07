import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { quizId: string } }
) {
  const { quizId } = params;

  console.log("Quiz ID:", quizId);

  if (!quizId) {
    return NextResponse.json(
      { message: "Quiz ID is required" },
      { status: 400 }
    );
  }

  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: Number(quizId) },
      include: { questions: true },
    });

    if (!quiz) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }

    console.log("Fetched quiz:", quiz);
    return NextResponse.json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle POST request to submit quiz
export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const { quizId, userAnswers, participantId } = await req.json();

    if (!quizId || !userAnswers || !participantId) {
      console.log("Missing parameters:", quizId, userAnswers, participantId);
      return NextResponse.json(
        { message: "Quiz ID, answers, and participant ID are required" },
        { status: 400 }
      );
    }

    // Find quiz with associated questions
    const quiz = await prisma.quiz.findUnique({
      where: { id: parseInt(quizId) },
      include: { questions: true },
    });

    if (!quiz) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }

    // Calculate score
    let score = 0;
    quiz.questions.forEach((question, index) => {
      const userAnswer = userAnswers[index];
      if (userAnswer === question.correctAnswer) {
        score += 1;
      }
    });

    // Create attempt record in the database
    const attempt = await prisma.attempt.create({
      data: {
        participantId: participantId,
        quizId: parseInt(quizId),
        score: score,
      },
    });

    return NextResponse.json({
      message: "Quiz submitted successfully",
      score: score,
      attemptId: attempt.id,
    });
  } catch (error) {
    console.error("Error processing the quiz submission:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
