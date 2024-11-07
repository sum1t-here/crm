// app/api/quiz/active/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const activeQuizzes = await prisma.quiz.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(activeQuizzes);
  } catch (error) {
    console.error("Error fetching active quizzes:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
