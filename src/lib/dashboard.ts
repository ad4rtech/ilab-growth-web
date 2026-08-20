const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export interface ContinueLearningCourse {
  id: string;
  title: string;
  category: string | null;
  instructor: string | null;
  thumbnailUrl: string | null;
}

export interface ContinueLearning {
  enrollmentId: string;
  progress: number;
  lastAccessedAt: string;
  course: ContinueLearningCourse;
}

export interface ActivityCourseItem {
  type: "course";
  lastActivityAt: string;
  enrollmentId: string;
  progress: number;
  course: {
    id: string;
    title: string;
    category: string | null;
    instructor: string | null;
    thumbnailUrl: string | null;
    lessonCount: number | null;
    durationLabel: string | null;
  };
}

export interface ActivityProductItem {
  type: "product";
  lastActivityAt: string;
  orderId: string;
  product: {
    id: string;
    title: string;
    category: string | null;
    productType: string | null;
    imageUrl: string | null;
  };
}

export type ActivityItem = ActivityCourseItem | ActivityProductItem;

export async function getContinueLearning(userId: string): Promise<ContinueLearning | null> {
  if (!userId) return null;
  try {
    const res = await fetch(`${API_URL}/dashboard/continue-learning?userId=${userId}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as ContinueLearning | null;
  } catch {
    return null;
  }
}

export async function getActivity(userId: string, limit = 4): Promise<ActivityItem[]> {
  if (!userId) return [];
  try {
    const res = await fetch(`${API_URL}/dashboard/activity?userId=${userId}&limit=${limit}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return (await res.json()) as ActivityItem[];
  } catch {
    return [];
  }
}
