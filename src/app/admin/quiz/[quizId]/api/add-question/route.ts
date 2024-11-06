import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(
  req: NextRequest,
  { params }: { params: { quizId: string } }
) {
  const { text, options, correctAnswer } = await req.json();

  if (!text || !options || !correctAnswer) {
    return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
  }
  const quizId = parseInt(await params.quizId, 10);

  try {
    const question = await prisma.question.create({
      data: {
        text,
        options,
        correctAnswer,
        quizId,
      },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to add question" },
      { status: 500 }
    );
  }
}
