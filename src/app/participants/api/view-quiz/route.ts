// File: /app/api/quizzes/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const quizzes = await prisma.quiz.findMany({
      select: {
        id: true,
        title: true,
        description: true,
      },
    });

    return NextResponse.json({ quizzes });
  } catch (error) {
    console.error("Error fetching active quizzes:", error);
    return NextResponse.json(
      { error: "Failed to fetch active quizzes" },
      { status: 500 }
    );
  }
}
