import {
  Info,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Copy,
  Check
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import ActionButton from "./action-button";
import EditIcon from "@/components/icons/edit";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isSearching?: boolean;
  isStreaming?: boolean;
}

interface ChatMessagesProps {
  messages: Message[];
  onRegenerate?: (messageId: string) => void;
}

// MarkdownRenderer component with optimized re-rendering
const MarkdownRenderer = ({ content }: { content: string }) => {
  console.log("MarkdownRenderer received content:", content);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown.configure({
        html: true,
        tightLists: true,
        bulletListMarker: "-",
        linkify: false,
        breaks: false,
        transformPastedText: false,
        transformCopiedText: false
      })
    ],
    content: content || "",
    editable: false
  });

  // Update editor content when content prop changes
  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      console.log(
        "Updating editor content from:",
        editor.getHTML(),
        "to:",
        content
      );
      editor.commands.setContent(content || "");
    }
  }, [editor, content]);

  if (!editor) {
    // Fallback for when editor is not ready
    return (
      <div className="prose-custom">
        <pre className="whitespace-pre-wrap">{content}</pre>
      </div>
    );
  }

  return (
    <div className="prose-custom">
      <EditorContent editor={editor} />
    </div>
  );
};

export default function ChatMessages({
  messages,
  onRegenerate
}: ChatMessagesProps) {
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageIdRef = useRef<string>("");

  // Auto-scroll when new messages are added
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.id !== lastMessageIdRef.current) {
      console.log("New message detected, scrolling to bottom");
      lastMessageIdRef.current = lastMessage.id;

      // For new messages, always scroll to bottom
      const container = messagesContainerRef.current;
      if (container) {
        setTimeout(() => {
          container.scrollTop = container.scrollHeight;
        }, 50); // Small delay to ensure content is rendered
      }
    }
  }, [messages]);

  // Auto-scroll when streaming content updates
  useEffect(() => {
    const streamingMessage = messages.find((msg) => msg.isStreaming);
    if (streamingMessage) {
      console.log("Streaming message detected, checking scroll position");

      // Check if user is at bottom and scroll if needed
      const container = messagesContainerRef.current;
      if (container) {
        const { scrollTop, scrollHeight, clientHeight } = container;
        const threshold = 10; // 10px threshold to consider "at bottom"
        const atBottom = scrollHeight - scrollTop - clientHeight < threshold;

        console.log("Streaming scroll check:", {
          scrollTop,
          scrollHeight,
          clientHeight,
          atBottom
        });

        if (atBottom) {
          console.log("User at bottom during streaming, scrolling to bottom");
          // Use requestAnimationFrame for smooth scrolling
          requestAnimationFrame(() => {
            container.scrollTop = container.scrollHeight;
          });
        } else {
          console.log("User not at bottom during streaming, not scrolling");
        }
      }
    }
  }, [messages]);

  // Force scroll to bottom on initial render if there are messages
  useEffect(() => {
    if (messages.length > 0) {
      const container = messagesContainerRef.current;
      if (container) {
        setTimeout(() => {
          container.scrollTop = container.scrollHeight;
        }, 100);
      }
    }
  }, []);

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopiedMessageId(messageId);
        setTimeout(() => setCopiedMessageId(null), 2000);
      } catch (fallbackErr) {
        console.error("Fallback copy failed: ", fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleThumbsUp = (messageId: string) => {
    // TODO: Implement thumbs up functionality
    console.log("Thumbs up for message:", messageId);
  };

  const handleThumbsDown = (messageId: string) => {
    // TODO: Implement thumbs down functionality
    console.log("Thumbs down for message:", messageId);
  };

  const handleRefresh = (messageId: string) => {
    if (onRegenerate) {
      onRegenerate(messageId);
    }
  };

  return (
    <div
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto space-y-3 md:space-y-4 p-3 md:p-6 h-[calc(100%)] bg-white/10 backdrop-blur-3xl md:backdrop-blur-0 md:bg-white rounded-[20px] md:rounded-md mb-1 md:mb-0 md:mx-0 mx-1"
    >
      {messages.map((message) => (
        <div key={message.id} className="flex flex-col space-y-2 md:space-y-3">
          {message.isUser && (
            <div className="flex justify-end">
              <div className="bg-blue-100 text-blue-900 rounded-2xl rounded-tr-none px-4 py-3 ml-auto break-words relative max-w-[85%] md:max-w-xs">
                <p className="text-sm">{message.text}</p>
                <button className="text-blue-700 opacity-60 hover:opacity-100">
                  <EditIcon className="h-4 w-4 text-brand-primary" />
                </button>
              </div>
              <div className="merkle-gradient rounded-full w-6 h-6 text-white flex items-center justify-center text-xs border border-white/30 shrink-0 ml-2 md:shadow-none shadow-md">
                S
              </div>
            </div>
          )}

          {message.isSearching && (
            <div className="flex items-center space-x-3 text-white/70 px-2 animate-pulse">
              <Info className="h-4 w-4 text-blue-300 flex-shrink-0" />
              <span className="text-sm">
                Searching for <span className="text-white">{message.text}</span>
              </span>
            </div>
          )}

          {!message.isUser && !message.isSearching && (
            <div className="flex justify-start">
              <div className="merkle-gradient rounded-full w-6 h-6 text-white flex items-center justify-center text-xs border border-white shrink-0 mr-2">
                T
              </div>
              <div className="md:bg-white text-gray-900 rounded-2xl px-2 py-4 mr-auto max-w-[95%] md:max-w-2xl">
                <div className="prose prose-sm max-w-none !text-white md:text-gray-900 md:bg-white">
                  <MarkdownRenderer content={message.text} />
                </div>

                {/* Action Buttons */}
                <div className="action-buttons flex items-center space-x-2 mt-3 pt-3 border-t border-gray-200">
                  <ActionButton
                    onClick={() => handleThumbsUp(message.id)}
                    title="Thumbs up"
                    ariaLabel="Rate this response positively"
                    hoverColor="green"
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </ActionButton>
                  <ActionButton
                    onClick={() => handleThumbsDown(message.id)}
                    title="Thumbs down"
                    ariaLabel="Rate this response negatively"
                    hoverColor="red"
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </ActionButton>
                  <ActionButton
                    onClick={() => handleRefresh(message.id)}
                    title="Regenerate"
                    ariaLabel="Regenerate this response"
                    hoverColor="blue"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </ActionButton>
                  <ActionButton
                    onClick={() => copyToClipboard(message.text, message.id)}
                    title="Copy to clipboard"
                    ariaLabel="Copy response to clipboard"
                    hoverColor="purple"
                  >
                    {copiedMessageId === message.id ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </ActionButton>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
