"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React, { useEffect, useState } from "react";

const ParticipantData: React.FC = () => {
  const [latestQuizScores, setLatestQuizScores] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/admin/api/participants");
      const data = await response.json();
      setLatestQuizScores(data);
    };

    fetchData();
  }, []);

  return (
    <Card className="mt-5">
      <CardHeader>Latest Quiz Scores</CardHeader>
      <CardContent>
        {latestQuizScores.length > 0 ? (
          <ul>
            {latestQuizScores.map((score, index) => (
              <li key={index}>
                {score.participant}: {score.score}
              </li>
            ))}
          </ul>
        ) : (
          <p>No attempts recorded for the latest quiz.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ParticipantData;
