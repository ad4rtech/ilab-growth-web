// src/app/blog/[slug]/not-found.tsx
import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogPostNotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center bg-[#FCEEE0] px-6 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white">
        <FileQuestion className="h-8 w-8 text-orange-500" />
      </div>

      <h1
        className="mt-6 text-3xl font-bold text-gray-900 md:text-4xl"
        style={{ fontFamily: "var(--font-ubuntu)" }}
      >
        We couldn't find that article
      </h1>

      <p className="mt-3 max-w-md text-gray-600">
        It may have been unpublished, moved, or the link might be incorrect.
        Head back to the blog to find what you're looking for.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/blog">Back to Blog</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    </main>
  );
}