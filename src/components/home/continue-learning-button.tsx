"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

interface ContinueLearningButtonProps {
  userId: string;
  courseId: string;
  className?: string;
  children?: React.ReactNode;
}

export function ContinueLearningButton({ userId, courseId, className, children }: ContinueLearningButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      await fetch(`${API_URL}/dashboard/touch-enrollment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, courseId }),
      });
    } catch {
      // Non-blocking — navigation proceeds even if the touch call fails.
    } finally {
      router.push(`/courses/${courseId}`);
    }
  }

  return (
    <Button onClick={handleClick} disabled={loading} className={className}>
      {loading ? "Loading..." : (children ?? "Continue Learning")}
    </Button>
  );
}