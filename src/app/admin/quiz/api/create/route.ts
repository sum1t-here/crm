import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { title, description } = await req.json();

  const createdQuiz = await prisma.quiz.create({
    data: {
      title,
      description,
    },
  });

  return NextResponse.json(createdQuiz, { status: 201 });
}
