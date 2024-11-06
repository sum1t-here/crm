"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AdminLoading from "../../loader";

interface Quiz {
  id: number;
  title: string;
  description: string;
}

const QuizDashboard: React.FC<{ quizCreated: boolean }> = ({ quizCreated }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<{
    [key: number]: boolean;
  }>({});
  const router = useRouter();

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const response = await fetch("/admin/quiz/api/quizData");
        if (response.ok) {
          const data = await response.json();
          setQuizzes(data);
        } else {
          console.error("Failed to fetch quizzes");
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [quizCreated]); // Re-fetch when quizCreated changes

  // Navigate to the add-question page for a specific quiz
  const handleAddQuestion = (quizId: number) => {
    router.push(`/admin/quiz/${quizId}/add-question`);
  };

  // View quiz
  const handleViewQuiz = (quizId: number) => {
    router.push(`/admin/quiz/${quizId}/view`);
  };

  // Delete quiz
  const handleDeleteQuiz = async (quizId: number) => {
    setDeleteLoading((prev) => ({ ...prev, [quizId]: true }));
    try {
      const response = await fetch(`/admin/quiz/${quizId}/api/delete`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete quiz: ${errorText}`);
      }

      console.log("Quiz deleted successfully");

      setQuizzes((prevQuizzes) =>
        prevQuizzes.filter((quiz) => quiz.id !== quizId)
      );
    } catch (error) {
      console.error("Error deleting quiz:", error);
    } finally {
      setDeleteLoading((prev) => ({ ...prev, [quizId]: false }));
    }
  };

  return (
    <div>
      {loading ? (
        <div>
          <AdminLoading />
        </div>
      ) : (
        <Card className="mt-5">
          <h1 className="ml-3 mt-2">Active Quizzes</h1>

          <ul>
            {quizzes.map((quiz) => (
              <li key={quiz.id} className="quiz-item">
                <Card className="m-7">
                  <CardContent>
                    <div className="m-2">
                      <h2 className="text-2xl">{quiz.title}</h2>
                      <p className="text-xl">{quiz.description}</p>
                      <div className="flex">
                        <div className="actions flex gap-3 mt-3">
                          <Button
                            className="bg-green-700 hover:bg-green-600 text-white"
                            onClick={() => handleAddQuestion(quiz.id)}
                          >
                            Add Question
                          </Button>
                          <Button
                            className="bg-blue-700 hover:bg-blue-600 text-white"
                            onClick={() => handleViewQuiz(quiz.id)}
                          >
                            View Quiz
                          </Button>
                          <Button
                            className="bg-red-700 hover:bg-red-600 text-white"
                            onClick={() => handleDeleteQuiz(quiz.id)}
                            disabled={deleteLoading[quiz.id]}
                          >
                            {deleteLoading[quiz.id]
                              ? "Deleting..."
                              : "Delete Quiz"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};

export default QuizDashboard;
