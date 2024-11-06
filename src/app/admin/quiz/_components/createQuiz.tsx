"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CreateQuizForm = ({
  handleQuizCreated,
}: {
  handleQuizCreated: () => void;
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/admin/quiz/api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Quiz created successfully:", data);

        // Notify the parent component that the quiz is created
        handleQuizCreated();
      } else {
        console.error("Failed to create quiz:", await response.text());
      }
    } catch (error) {
      console.error("Error creating quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-4">
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Quiz Title"
            required
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Quiz Description"
          />
          <div>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Quiz"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateQuizForm;
