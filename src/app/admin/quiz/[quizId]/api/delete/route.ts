import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(
  req: NextRequest,
  { params }: { params: { quizId: string } }
) {
  try {
    const quizId = parseInt(await params.quizId, 10);
    console.log(quizId);

    if (isNaN(quizId)) {
      return NextResponse.json(
        { message: "Quiz ID is missing or invalid" },
        { status: 400 }
      );
    }

    await prisma.question.deleteMany({
      where: {
        quizId: quizId,
      },
    });

    await prisma.quiz.delete({
      where: {
        id: quizId,
      },
    });

    return NextResponse.json(
      { message: "Quiz deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return NextResponse.json(
      { message: "Error deleting quiz", error },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
