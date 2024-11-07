import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface Quiz {
  id: number;
  title: string;
  description: string;
}

export default function ActiveQuizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchActiveQuizzes = async () => {
      try {
        const response = await fetch("/participants/api/active-quiz");
        const data = await response.json();
        setQuizzes(data); // Set the fetched quizzes
      } catch (error) {
        console.error("Error fetching active quizzes:", error);
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };

    fetchActiveQuizzes();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center space-x-2">
        <div className="w-8 h-8 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
        <span>Loading active quizzes...</span>
      </div>
    );
  }

  return (
    <Card>
      <div className="space-y-4">
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <Card key={quiz.id} className="w-full">
              <CardHeader>
                <CardTitle>{quiz.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{quiz.description}</p>
                <Link href={`/participants/quiz/${quiz.id}`}>
                  <Button className="mt-4">Start Quiz</Button>
                </Link>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>No active quizzes available.</p>
        )}
      </div>
    </Card>
  );
}
