"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Components } from 'react-markdown';

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  const components: Components = {
    // Headings
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold text-[hsl(144.9,80.4%,10%)] mt-8 mb-4 pb-2 border-b-2 border-[hsl(141,78.9%,85.1%)]">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold text-[hsl(144.9,80.4%,10%)] mt-8 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold text-[hsl(142.1,76.2%,36.3%)] mt-6 mb-3">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-semibold text-[hsl(142.1,76.2%,36.3%)] mt-4 mb-2">
        {children}
      </h4>
    ),

    // Paragraphs
    p: ({ children }) => (
      <p className="text-gray-700 leading-relaxed mb-4 text-lg">
        {children}
      </p>
    ),

    // Links
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-[hsl(142.1,76.2%,36.3%)] hover:text-[hsl(144.9,80.4%,10%)] underline decoration-2 underline-offset-2 transition-colors"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),

    // Lists
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside mb-4 space-y-2 ml-4">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="text-gray-700 leading-relaxed text-lg">
        {children}
      </li>
    ),

    // Blockquotes
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[hsl(142.1,76.2%,36.3%)] pl-4 py-2 my-4 bg-[hsl(141,78.9%,85.1%)] bg-opacity-30 italic">
        {children}
      </blockquote>
    ),

    // Code
    code: ({ className, children }) => {
      const isInline = !className;

      if (isInline) {
        return (
          <code className="bg-[hsl(141,78.9%,85.1%)] text-[hsl(144.9,80.4%,10%)] px-2 py-1 rounded text-sm font-mono">
            {children}
          </code>
        );
      }

      return (
        <code className={`${className} block bg-[hsl(144.9,80.4%,10%)] text-[hsl(140.6,84.2%,92.5%)] p-4 rounded-lg overflow-x-auto mb-4 text-sm font-mono`}>
          {children}
        </code>
      );
    },

    // Pre (code blocks)
    pre: ({ children }) => (
      <pre className="mb-4 overflow-x-auto">
        {children}
      </pre>
    ),

    // Horizontal Rule
    hr: () => (
      <hr className="my-8 border-t-2 border-[hsl(141,78.9%,85.1%)]" />
    ),

    // Strong/Bold
    strong: ({ children }) => (
      <strong className="font-bold text-[hsl(144.9,80.4%,10%)]">
        {children}
      </strong>
    ),

    // Emphasis/Italic
    em: ({ children }) => (
      <em className="italic text-gray-600">
        {children}
      </em>
    ),
  };

  return (
    <div className="prose prose-lg max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
