"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminLoading from "@/app/admin/loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

interface Option {
  id: number;
  text: string;
}

interface Question {
  id: number;
  text: string;
  options: Option[];
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  questions: Question[];
}

export default function QuizView() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`/admin/quiz/${quizId}/api/view`);
        if (!response.ok) {
          throw new Error("Failed to fetch quiz");
        }
        const data: Quiz = await response.json();
        setQuiz(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  if (loading)
    return (
      <div>
        <AdminLoading />
      </div>
    );
  if (error) return <div>{error}</div>;

  return (
    <Card className="m-5">
      <CardTitle className="m-3">{quiz?.title}</CardTitle>
      <CardDescription className="m-4">{quiz?.description}</CardDescription>
      <ul>
        {quiz?.questions.map((question) => (
          <CardContent key={question.id}>
            <p>{question.text}</p>
            <ul>
              {question.options.map((option) => (
                <li key={`${question.id}-${option.id ?? Math.random()}`}>
                  {option.text}
                </li>
              ))}
            </ul>
          </CardContent>
        ))}
      </ul>
    </Card>
  );
}
