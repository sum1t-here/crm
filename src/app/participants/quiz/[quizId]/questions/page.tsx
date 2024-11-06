"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Question {
  id: number;
  text: string;
  options: { id: number; text: string }[];
}

const QuizQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const { quizId } = useParams();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `/participants/api/quiz/${quizId}/questions`
        );
        if (response.ok) {
          const data = await response.json();
          setQuestions(data.questions);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [quizId]);

  return (
    <div>
      {questions.map((question) => (
        <div key={question.id}>
          <h3>{question.text}</h3>
          {question.options.map((option) => (
            <div key={option.id}>
              <label>
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.id}
                />
                {option.text}
              </label>
            </div>
          ))}
        </div>
      ))}
      <button type="submit">Submit Quiz</button>
    </div>
  );
};

export default QuizQuestions;
