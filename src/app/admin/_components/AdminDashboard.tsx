"use client";

import { useEffect, useState } from "react";
import { fetchAdminData } from "./adminData";
import AdminLoading from "../loader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ParticipantData from "./ParticipantsData";

interface AdminData {
  quizCount: number;
  participantCount: number;
  users: number;
  maxMarks: number;
  avgMarks: number;
  minMarks: number;
}

export function AdminDashboard() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const adminData = await fetchAdminData();
        setData(adminData);
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <AdminLoading />;
    }

    if (data) {
      return (
        <div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>Active Quiz</CardHeader>
              <CardContent>{data.quizCount}</CardContent>
            </Card>
            <Card>
              <CardHeader>Participants</CardHeader>
              <CardContent>{data.participantCount}</CardContent>
            </Card>
            <Card>
              <CardHeader>Total Users</CardHeader>
              <CardContent>{data.users}</CardContent>
            </Card>
            <Card>
              <CardHeader>Max Marks</CardHeader>
              <CardContent>{data.maxMarks}</CardContent>
            </Card>
            <Card>
              <CardHeader>Avg Marks</CardHeader>
              <CardContent>{data.avgMarks.toFixed(2)}</CardContent>
            </Card>
            <Card>
              <CardHeader>Min Marks</CardHeader>
              <CardContent>{data.minMarks}</CardContent>
            </Card>
          </div>
          <div>
            <ParticipantData />
          </div>
        </div>
      );
    }

    return <div>No data available.</div>;
  };

  return <div>{renderContent()}</div>;
}
