/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const latestQuiz = await prisma.quiz.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });

  let latestQuizScores: any[] = [];

  if (latestQuiz) {
    latestQuizScores = await prisma.attempt.findMany({
      where: {
        quizId: latestQuiz.id,
      },
      select: {
        participant: {
          select: {
            name: true,
            email: true,
          },
        },
        score: true,
      },
    });
  }

  const displayScores = latestQuizScores.map((attempt) => ({
    participant: attempt.participant.name ?? "No data to preview",
    score: attempt.score ?? 0,
  }));

  return NextResponse.json(displayScores);
}
