// src/components/blog/blog-content.tsx
// Content is authored as plain text (no Markdown/HTML), so we just turn
// blank-line-separated blocks into <p> tags and preserve single line breaks
// within each block. No dangerouslySetInnerHTML — nothing to sanitize.

interface BlogContentProps {
  content: string;
}

export function BlogContent({ content }: BlogContentProps) {
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="prose-blog space-y-5 text-[17px] leading-relaxed text-gray-700">
      {paragraphs.map((block, i) => (
        <p key={i}>
          {block.split("\n").map((line, j, arr) => (
            <span key={j}>
              {line}
              {j < arr.length - 1 && <br />}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}