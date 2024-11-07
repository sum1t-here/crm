"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useEffect, useState } from "react";

const RecentQuizMarks = () => {
  const [recentMarks, setRecentMarks] = useState<any>(null); // State to store the recent quiz marks
  const [loading, setLoading] = useState<boolean>(true); // State for loading indicator
  const [error, setError] = useState<string | null>(null); // State to store errors

  useEffect(() => {
    const fetchRecentMarks = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("You are not authenticated.");
          return;
        }
        // Make a request to the API to fetch recent quiz marks
        const response = await fetch(`/participants/api/quiz-result`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (response.ok) {
          // Set the response data to the state
          setRecentMarks(result);
        } else {
          setError(result.message || "Unknown error");
        }
      } catch (error) {
        setError("An error occurred while fetching recent quiz marks.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentMarks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center space-x-2">
        <div className="w-8 h-8 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
        <span>Loading active quizzes...</span>
      </div>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (recentMarks) {
    return (
      <Card>
        <CardHeader>Recent Quiz Marks</CardHeader>
        <CardContent>Quiz Name: {recentMarks.quizName}</CardContent>
        <CardContent>Score: {recentMarks.score}</CardContent>
        <CardFooter>
          Attempt Date: {new Date(recentMarks.attemptDate).toLocaleString()}
        </CardFooter>
      </Card>
    );
  }

  return <p>No recent quiz attempts found.</p>;
};

export default RecentQuizMarks;
