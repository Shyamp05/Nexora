import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Bot, Copy, Check } from 'lucide-react';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

// ============================================
// Minimal Markdown Parser — converts markdown
// content to JSX without external libraries
// ============================================

interface ParsedBlock {
  type: 'heading' | 'code' | 'blockquote' | 'bullet' | 'numbered' | 'paragraph';
  content: string;
  language?: string;
}

/** Tokenise raw markdown text into structural blocks */
function parseBlocks(text: string): ParsedBlock[] {
  const lines = text.split('\n');
  const blocks: ParsedBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.trim().startsWith('```')) {
      const language = line.trim().slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: 'code', content: codeLines.join('\n'), language });
      i++; // skip closing ```
      continue;
    }

    // Heading (## or ###)
    if (/^#{1,4}\s/.test(line.trim())) {
      blocks.push({ type: 'heading', content: line.trim() });
      i++;
      continue;
    }

    // Blockquote
    if (line.trim().startsWith('>')) {
      blocks.push({ type: 'blockquote', content: line.trim().slice(1).trim() });
      i++;
      continue;
    }

    // Bullet point (- or *)
    if (/^[\s]*[-*]\s/.test(line)) {
      blocks.push({ type: 'bullet', content: line.trim().replace(/^[-*]\s/, '') });
      i++;
      continue;
    }

    // Numbered list
    if (/^[\s]*\d+\.\s/.test(line)) {
      blocks.push({ type: 'numbered', content: line.trim().replace(/^\d+\.\s/, '') });
      i++;
      continue;
    }

    // Empty line — skip
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Regular paragraph
    blocks.push({ type: 'paragraph', content: line.trim() });
    i++;
  }

  return blocks;
}

/** Render inline markdown: **bold**, `code`, *italic* */
function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Pattern matches: **bold**, `inline-code`, *italic*
  const regex = /(\*\*(.+?)\*\*|`([^`]+)`|\*([^*]+)\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // Push text before this match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[2]) {
      // **bold**
      parts.push(
        <strong key={match.index} className="font-semibold text-white">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      // `inline code`
      parts.push(
        <code
          key={match.index}
          className="px-1.5 py-0.5 rounded bg-white/10 text-cyan-300 text-sm font-mono"
        >
          {match[3]}
        </code>
      );
    } else if (match[4]) {
      // *italic*
      parts.push(
        <em key={match.index} className="italic text-gray-200">
          {match[4]}
        </em>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

/** Renders a fenced code block with copy-to-clipboard */
function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden my-3 border border-white/5">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
        <span className="text-xs text-gray-400 font-mono">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      {/* Code */}
      <pre className="p-4 overflow-x-auto bg-[#0a0a0f]">
        <code className="text-sm font-mono text-gray-300 leading-relaxed whitespace-pre">
          {code}
        </code>
      </pre>
    </div>
  );
}

/** Renders parsed markdown blocks into JSX */
function MarkdownRenderer({ content }: { content: string }) {
  const blocks = useMemo(() => parseBlocks(content), [content]);

  return (
    <div className="space-y-2">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'heading': {
            const level = (block.content.match(/^#+/) || [''])[0].length;
            const text = block.content.replace(/^#+\s/, '');
            if (level <= 2) {
              return (
                <h2 key={idx} className="text-lg font-bold text-white mt-4 mb-1">
                  {renderInline(text)}
                </h2>
              );
            }
            return (
              <h3 key={idx} className="text-base font-semibold text-white mt-3 mb-1">
                {renderInline(text)}
              </h3>
            );
          }

          case 'code':
            return <CodeBlock key={idx} code={block.content} language={block.language} />;

          case 'blockquote':
            return (
              <div
                key={idx}
                className="border-l-2 border-indigo-500/50 pl-4 py-1 my-2 text-gray-300 italic bg-indigo-500/5 rounded-r-lg"
              >
                {renderInline(block.content)}
              </div>
            );

          case 'bullet':
            return (
              <div key={idx} className="flex items-start gap-2 ml-1">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                <span className="text-gray-300 leading-relaxed">{renderInline(block.content)}</span>
              </div>
            );

          case 'numbered':
            return (
              <div key={idx} className="flex items-start gap-2 ml-1">
                <span className="text-indigo-400 font-semibold text-sm mt-0.5 flex-shrink-0">
                  •
                </span>
                <span className="text-gray-300 leading-relaxed">{renderInline(block.content)}</span>
              </div>
            );

          case 'paragraph':
          default:
            return (
              <p key={idx} className="text-gray-300 leading-relaxed">
                {renderInline(block.content)}
              </p>
            );
        }
      })}
    </div>
  );
}

// ============================================
// MessageBubble Component
// ============================================

export default function MessageBubble({ role, content, timestamp, isStreaming }: MessageBubbleProps) {
  const isUser = role === 'user';

  const formattedTime = new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full gradient-primary flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Bot size={16} className="text-white" />
        </div>
      )}

      {/* Bubble */}
      <div className={`max-w-[85%] md:max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'gradient-primary text-white rounded-tr-md'
              : 'glass rounded-tl-md'
          }`}
        >
          {isUser ? (
            <p className="text-white leading-relaxed whitespace-pre-wrap">{content}</p>
          ) : (
            <div className="relative">
              <MarkdownRenderer content={content} />
              {isStreaming && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="inline-block w-[2px] h-[1em] bg-cyan-400 ml-0.5 align-text-bottom"
                />
              )}
            </div>
          )}
        </div>

        {/* Timestamp */}
        <p
          className={`text-[10px] text-gray-500 mt-1 px-1 ${
            isUser ? 'text-right' : 'text-left'
          }`}
        >
          {formattedTime}
        </p>
      </div>
    </motion.div>
  );
}
