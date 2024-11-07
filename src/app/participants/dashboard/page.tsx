/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import AdminLoading from "@/app/admin/loader";
import { useRouter } from "next/navigation";
import ActiveQuizzes from "../quiz/page";

interface DecodedToken {
  id: number;
  email: string;
}

export default function Dashboard() {
  const [userId, setUserId] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        setUserId(decodedToken.id);
        setUserEmail(decodedToken.email);

        setIsLoading(false);
      } catch (error) {
        console.error("Error decoding token:", error);
        setIsLoading(false);
        router.push("/participants/sign-in");
      }
    } else {
      setIsLoading(false);
      router.push("/participants/sign-in");
    }
  }, []);

  if (isLoading) {
    return (
      <div>
        <AdminLoading />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Welcome, {userEmail ?? "User"}!</h1>
      <p>User ID: {userId ?? "Not available"}</p>

      <h1 className="text-2xl font-bold mt-6">Active quizzes</h1>
      <ActiveQuizzes />
    </div>
  );
}
