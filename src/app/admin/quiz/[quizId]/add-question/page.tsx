"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function AddQuestion() {
  const { quizId } = useParams();
  const router = useRouter();
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, ""]); // Add a new empty option
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index)); // Remove the option at index
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizId) return;

    setLoading(true);

    try {
      const response = await fetch(`/admin/quiz/${quizId}/api/add-question`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: questionText,
          options,
          correctAnswer,
        }),
      });

      if (response.ok) {
        console.log("Question added successfully");
        router.push(`/admin/quiz`);
      } else {
        console.error("Failed to add question:", await response.text());
      }
    } catch (error) {
      console.log(quizId);
      console.log(error);
      console.error("Error adding question:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div>
            <Label>Questions Text:</Label>
            <Input
              type="text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Options :</Label>
            {options.map((option, index) => (
              <div key={index} className="flex gap-3 mt-2">
                <Input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  required
                />
                <Button
                  className="bg-destructive"
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              className="bg-green-500 mt-3"
              type="button"
              onClick={handleAddOption}
            >
              Add Option
            </Button>
          </div>
          <div>
            <Label>Correct Answer:</Label>
            <Input
              type="text"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              required
            />
          </div>
          <Button className="mt-2" type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Question"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
