"use client";

import { useState } from "react";

import QuizDashboard from "./QuizDashboard";
import CreateQuizForm from "./createQuiz";

const QuizManager: React.FC = () => {
  const [quizCreated, setQuizCreated] = useState<boolean>(false);

  const handleQuizCreated = () => {
    setQuizCreated(true); // Trigger a re-fetch in QuizDashboard
    setTimeout(() => setQuizCreated(false), 500); // Reset after a short delay to stop re-fetch loop
  };

  return (
    <div>
      <CreateQuizForm handleQuizCreated={handleQuizCreated} />
      <QuizDashboard quizCreated={quizCreated} />
    </div>
  );
};

export default QuizManager;
