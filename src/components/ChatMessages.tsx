import {
  Info,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Copy,
  Check,
  Edit2
} from "lucide-react";
import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";

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

export const ChatMessages = ({ messages, onRegenerate }: ChatMessagesProps) => {
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

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

  const MarkdownRenderer = ({ content }: { content: string }) => {
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

  return (
    <div className="flex-1 overflow-y-auto space-y-3 md:space-y-4 p-3 md:p-6 h-[calc(100%)]">
      {messages.map((message) => (
        <div key={message.id} className="flex flex-col space-y-2 md:space-y-3">
          {message.isUser && (
            <div className="flex justify-end">
              <div className="chat-message-user relative max-w-[85%] md:max-w-xs">
                <p className="text-sm">{message.text}</p>
                <button className="text-blue-700 opacity-60 hover:opacity-100">
                  <Edit2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}

          {message.isSearching && (
            <div className="flex items-center space-x-3 text-white/70 px-2">
              <Info className="h-4 w-4 text-blue-300 flex-shrink-0" />
              <span className="text-sm">
                Searching for <span className="text-white">{message.text}</span>
              </span>
            </div>
          )}

          {!message.isUser && !message.isSearching && (
            <div className="flex justify-start">
              <div className="chat-message-ai max-w-[95%] md:max-w-2xl">
                <div className="flex items-center space-x-2 mb-3">
                  <Info className="h-4 w-4 text-blue-600" />
                  {message.isStreaming && (
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                      <div
                        className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  )}
                </div>
                <div className="prose prose-sm max-w-none text-gray-900 bg-white">
                  <MarkdownRenderer content={message.text} />
                </div>

                {/* Action Buttons */}
                <div className="action-buttons flex items-center justify-end space-x-2 mt-3 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => handleThumbsUp(message.id)}
                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    title="Thumbs up"
                    aria-label="Rate this response positively"
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleThumbsDown(message.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    title="Thumbs down"
                    aria-label="Rate this response negatively"
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleRefresh(message.id)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    title="Regenerate"
                    aria-label="Regenerate this response"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => copyToClipboard(message.text, message.id)}
                    className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    title="Copy to clipboard"
                    aria-label="Copy response to clipboard"
                  >
                    {copiedMessageId === message.id ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
