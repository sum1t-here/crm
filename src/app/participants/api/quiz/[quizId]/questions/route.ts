import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { quizId: string } }
) {
  const quizId = parseInt(params.quizId, 10);

  if (isNaN(quizId)) {
    return NextResponse.json({ error: "Invalid quiz ID" }, { status: 400 });
  }

  try {
    const questions = await prisma.question.findMany({
      where: { quizId },
      select: {
        id: true,
        text: true,
        options: true,
        correctAnswer: true,
      },
    });

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}
