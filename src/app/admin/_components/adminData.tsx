"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function fetchAdminData() {
  const quizCount = await prisma.quiz.count();
  const participantCount = await prisma.participant.count({
    where: {
      attempts: {
        some: {
          score: {
            gte: 1,
          },
        },
      },
    },
  });

  const users = await prisma.participant.count();

  const maxMarksResults = await prisma.attempt.groupBy({
    by: ["quizId"],
    _max: {
      score: true,
    },
  });

  const maxMarks = maxMarksResults.reduce((max, result) => {
    const score = result._max.score ?? 0;
    return Math.max(max, score);
  }, 0);

  const allScores = await prisma.attempt.findMany({
    select: {
      score: true,
    },
  });

  const totalScore = allScores.reduce(
    (sum, attempt) => sum + (attempt.score ?? 0),
    0
  );
  const avgMarks = allScores.length > 0 ? totalScore / allScores.length : 0;

  const minMarks =
    allScores.length > 0 ? Math.min(...allScores.map((a) => a.score ?? 0)) : 0;

  return {
    quizCount,
    participantCount,
    maxMarks,
    avgMarks,
    minMarks,
    users,
  };
}
