"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { parse } from "cookie";

interface Quiz {
  id: number;
  title: string;
  description: string;
}

const QuizList = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch("/participants/api/view-quiz");
        if (response.ok) {
          const data = await response.json();
          setQuizzes(data.quizzes);
        } else {
          setError("Failed to fetch quizzes. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        setError("Error fetching quizzes. Please try again.");
      }
    };

    fetchQuizzes();
  }, []);

  const handleAttemptQuiz = async (quizId: number) => {
    const cookies = document.cookie;
    const parsedCookies = parse(cookies);
    const participantId = parsedCookies.participantId;

    if (!participantId) {
      setError("No participant ID found. Please log in first.");
      return;
    }

    try {
      const response = await fetch(
        `/participants/api/quiz/${quizId}/attempt-quiz`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ participantId }),
        }
      );

      if (response.ok) {
        const { attempt } = await response.json();
        console.log("Attempt started:", attempt);
        router.push(`/participant/quiz/${quizId}/questions`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "You have already attempted this quiz.");
      }
    } catch (error) {
      console.error("Error attempting quiz:", error);
      setError("There was an error starting the quiz. Please try again.");
    }
  };

  return (
    <div>
      {error && <div className="error-message">{error}</div>}{" "}
      {/* Display error message here */}
      {quizzes.map((quiz) => (
        <Card key={quiz.id} className="m-4">
          <CardContent className="mt-3">
            <h2>{quiz.title}</h2>
            <p>{quiz.description}</p>
            <Button onClick={() => handleAttemptQuiz(quiz.id)}>
              Attempt Quiz
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuizList;
