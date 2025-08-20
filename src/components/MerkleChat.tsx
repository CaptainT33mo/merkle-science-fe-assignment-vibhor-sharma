import { useState, useRef } from "react";
import { ChatMessages } from "./ChatMessages";
import { RichTextEditor } from "./RichTextEditor";
import type { RichTextEditorRef } from "./RichTextEditor";
import { streamOpenAIResponse } from "@/lib/openAi";
import { useGlobalStore } from "@/store";
import { useNavigate } from "@tanstack/react-router";
import { Send, Paperclip, Square, X } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isSearching?: boolean;
  isStreaming?: boolean;
}

interface AttachedFile {
  name: string;
  type: string;
  size: number;
}

export const MerkleChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [editorContent, setEditorContent] = useState("");
  const { apiKey } = useGlobalStore();
  const editorRef = useRef<RichTextEditorRef>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const handleSendMessage = async (text: string) => {
    if (!apiKey.trim()) {
      navigate({ to: "/settings" });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date()
    };

    const searchingMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: text,
      isUser: false,
      isSearching: true,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage, searchingMessage]);
    setIsLoading(true);

    // Clear editor content and attached file
    if (editorRef.current) {
      editorRef.current.clearContent();
    }
    setAttachedFile(null);
    setEditorContent("");

    // Remove searching message and add streaming response
    setTimeout(() => {
      setMessages((prev) => {
        const filtered = prev.filter((msg) => !msg.isSearching);
        const aiMessage: Message = {
          id: (Date.now() + 2).toString(),
          text: "",
          isUser: false,
          isStreaming: true,
          timestamp: new Date()
        };
        return [...filtered, aiMessage];
      });

      // Start streaming response
      streamOpenAIResponse({
        apiKey,
        message: text,
        onChunk: (chunk) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.isStreaming ? { ...msg, text: msg.text + chunk } : msg
            )
          );
        },
        onComplete: () => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.isStreaming ? { ...msg, isStreaming: false } : msg
            )
          );
          setIsLoading(false);
        }
      });
    }, 1000);
  };

  const handleRegenerate = async (messageId: string) => {
    // Find the AI message to regenerate
    const aiMessage = messages.find((msg) => msg.id === messageId);
    if (!aiMessage || aiMessage.isUser) return;

    // Find the user message that preceded this AI message
    const messageIndex = messages.findIndex((msg) => msg.id === messageId);
    const userMessage = messages[messageIndex - 1];
    if (!userMessage || !userMessage.isUser) return;

    // Remove the current AI message and regenerate
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));

    // Add searching message
    const searchingMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: userMessage.text,
      isUser: false,
      isSearching: true,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, searchingMessage]);
    setIsLoading(true);

    // Remove searching message and add streaming response
    setTimeout(() => {
      setMessages((prev) => {
        const filtered = prev.filter((msg) => !msg.isSearching);
        const aiMessage: Message = {
          id: (Date.now() + 2).toString(),
          text: "",
          isUser: false,
          isStreaming: true,
          timestamp: new Date()
        };
        return [...filtered, aiMessage];
      });

      // Start streaming response
      streamOpenAIResponse({
        apiKey,
        message: userMessage.text,
        onChunk: (chunk) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.isStreaming ? { ...msg, text: msg.text + chunk } : msg
            )
          );
        },
        onComplete: () => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.isStreaming ? { ...msg, isStreaming: false } : msg
            )
          );
          setIsLoading(false);
        }
      });
    }, 1000);
  };

  const handleSend = () => {
    if (editorContent.trim() && !isLoading) {
      const markdownContent =
        editorRef.current?.getMarkdownContent() || editorContent;
      handleSendMessage(markdownContent);
    }
  };

  const handleFileAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAttachedFile({
        name: file.name,
        type: file.type,
        size: file.size
      });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="merkle-gradient flex-1 flex flex-col h-full">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-4">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-white text-center max-w-4xl">
              Ask anything about blockchain, cryptocurrency
            </h1>
          </div>
        ) : (
          <ChatMessages messages={messages} onRegenerate={handleRegenerate} />
        )}

        <div className="p-3 md:p-6 pt-0">
          <div className="rich-editor p-0">
            <RichTextEditor
              ref={editorRef}
              isLoading={isLoading}
              onContentChange={setEditorContent}
              onEnterPress={handleSend}
            />

            <div className="flex items-center justify-between p-3 md:p-4 pt-0">
              <div className="flex items-center space-x-2">
                <button
                  className="attachment-button"
                  onClick={triggerFileInput}
                  disabled={isLoading}
                >
                  <Paperclip className="h-4 w-4 md:h-5 md:w-5" />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileAttachment}
                  accept="*/*"
                />

                {attachedFile && (
                  <div className="flex items-center space-x-2">
                    <div className="bg-gray-100 rounded px-2 py-1 text-xs text-gray-600 flex items-center space-x-1">
                      <span className="max-w-[100px] truncate">
                        {attachedFile.name}
                      </span>
                      <span className="text-gray-400">
                        ({attachedFile.type})
                      </span>
                      <button
                        className="text-gray-400 hover:text-gray-600"
                        onClick={() => setAttachedFile(null)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                {isLoading ? (
                  <button className="send-button bg-gray-400 cursor-not-allowed">
                    <Square className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSend}
                    className={`send-button ${
                      editorContent.trim()
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!editorContent.trim()}
                  >
                    Send <Send className="h-4 w-4 ml-2 fill-white" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
