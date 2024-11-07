"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface Question {
  id: number;
  quizId: number;
  text: string;
  options: string[]; // Assuming it's an array of options for multiple choice questions
  correctAnswer: string;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  questions: Question[];
}

export default function StartQuiz() {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(1800); // 30 minutes timer
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [loading, setLoading] = useState(true); // Track loading state
  const router = useRouter();
  const params = useParams();
  const quizId = params.quizId;

  interface DecodedToken {
    id: number;
    email: string;
  }

  useEffect(() => {
    if (!quizId) return; // Guard clause if quizId is missing

    const fetchQuizDetails = async () => {
      setLoading(true); // Set loading to true before fetching
      const response = await fetch(`/participants/api/quiz/${quizId}`);
      if (!response.ok) {
        // Handle error if the response is not OK
        console.error("Failed to fetch quiz details");
        setLoading(false);
        return;
      }
      const data = await response.json();
      setQuiz(data);
      setLoading(false); // Set loading to false after fetching
    };

    fetchQuizDetails();
  }, [quizId]);

  useEffect(() => {
    // Timer logic: Start counting down after quiz starts
    if (quizStarted && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(interval); // Clear interval when time is up or when quiz ends
    }
    if (timeLeft <= 0) {
      alert("Time's up!");
      handleSubmitQuiz(); // Automatically submit quiz when time's up
    }
  }, [quizStarted, timeLeft]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[questionIndex] = answer;
    setUserAnswers(updatedAnswers);
  };

  const handleSubmitQuiz = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not authenticated.");
        return;
      }

      // Decode the JWT token to extract user information (e.g., user ID)
      const decodedToken = jwtDecode<DecodedToken>(token); // Decode without verification (if you don't need verification)
      if (!decodedToken || !decodedToken.id) {
        alert("Invalid or expired token.");
        return;
      }

      const participantId = decodedToken.id; // Extract the user ID from the decoded token

      // Prepare the request payload with quizId, userAnswers, and userId
      const response = await fetch(`/participants/api/quiz/${quizId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quizId,
          userAnswers,
          participantId,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Quiz submitted successfully:", result);
        router.push("/participants/dashboard/performance");
      } else {
        const error = await response.json();
        console.error("Failed to submit quiz:", error.message || error);
        alert(`Failed to submit quiz: ${error.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert(`An error occurred: ${error || "Unknown error"}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center space-x-2 min-h-32">
        <div className="w-8 h-8 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
        <span>Loading questions...</span>
      </div>
    );
  }

  if (!quiz) {
    return <div>Quiz not found</div>;
  }

  return (
    <div>
      <h1>{quiz.title}</h1>
      <p>{quiz.description}</p>

      {/* Timer Display */}
      <div className="text-xl">
        Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}
      </div>

      {/* Quiz Questions */}
      {quiz.questions &&
      Array.isArray(quiz.questions) &&
      quiz.questions.length > 0 ? (
        quiz.questions.map((question, index) => (
          <div key={question.id} className="mt-4">
            <p>{question.text}</p>

            {/* Render options if available */}
            {question.options && Array.isArray(question.options) && (
              <div>
                {question.options.map((option, optIndex) => (
                  <div key={optIndex}>
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      onChange={() => handleAnswerChange(index, option)}
                    />
                    <label>{option}</label>
                  </div>
                ))}
              </div>
            )}

            {/* If no options, allow text input for open-ended questions */}
            {!question.options && (
              <input
                type="text"
                value={userAnswers[index] || ""}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                placeholder="Your answer"
              />
            )}
          </div>
        ))
      ) : (
        <p>No questions available</p>
      )}

      {/* Start Button */}
      {!quizStarted && (
        <Button onClick={handleStartQuiz} className="mt-4">
          Start Quiz
        </Button>
      )}

      {/* Submit Button */}
      {quizStarted && (
        <Button onClick={handleSubmitQuiz} className="mt-4">
          Submit Quiz
        </Button>
      )}
    </div>
  );
}
