import { useState, useRef } from "react";
import { streamOpenAIResponse } from "@/lib/openAi";
import { useGlobalStore } from "@/store";
import { useNavigate } from "@tanstack/react-router";
import { Send, Paperclip, X, Square } from "lucide-react";
import type { RichTextEditorRef } from "@/components/common/rich-text-editor";
import RichTextEditor from "@/components/common/rich-text-editor";
import ChatMessages from "./chat-messages";
import { Button } from "@/components/ui/button";

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

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [editorContent, setEditorContent] = useState("");
  const { apiKey } = useGlobalStore();
  const editorRef = useRef<RichTextEditorRef>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const dummyStreamTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const navigate = useNavigate();

  const stopStreaming = () => {
    // Abort API request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Clear dummy stream timeout if it exists
    if (dummyStreamTimeoutRef.current) {
      clearTimeout(dummyStreamTimeoutRef.current);
      dummyStreamTimeoutRef.current = null;
    }

    // Mark streaming as complete
    setMessages((prev) => {
      const updated = prev.map((msg) =>
        msg.isStreaming ? { ...msg, isStreaming: false } : msg
      );
      return updated;
    });
    setIsLoading(false);
  };

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

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      // Start streaming response
      try {
        streamOpenAIResponse({
          apiKey: apiKey.trim() || "invalid", // Use "invalid" if empty to trigger dummy response
          message: text,
          onChunk: (chunk) => {
            console.log("Received chunk:", chunk);
            setMessages((prev) => {
              const updated = prev.map((msg) =>
                msg.isStreaming ? { ...msg, text: msg.text + chunk } : msg
              );
              console.log("Updated messages state:", updated);
              return updated;
            });
          },
          onComplete: () => {
            console.log("Streaming completed");
            setMessages((prev) => {
              const updated = prev.map((msg) =>
                msg.isStreaming ? { ...msg, isStreaming: false } : msg
              );
              console.log("Final messages state:", updated);
              return updated;
            });
            setIsLoading(false);
            abortControllerRef.current = null;
          },
          abortSignal: abortControllerRef.current.signal,
          onDummyStreamStart: (timeoutId: NodeJS.Timeout) => {
            dummyStreamTimeoutRef.current = timeoutId;
          }
        });
      } catch (error) {
        console.error("Error in streamOpenAIResponse:", error);
        // Fallback: provide a basic response
        setMessages((prev) =>
          prev.map((msg) =>
            msg.isStreaming
              ? {
                  ...msg,
                  text: "I apologize, but I'm currently unable to provide a response. Please try again later.",
                  isStreaming: false
                }
              : msg
          )
        );
        setIsLoading(false);
        abortControllerRef.current = null;
      }
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

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      // Start streaming response
      try {
        streamOpenAIResponse({
          apiKey: apiKey.trim() || "invalid", // Use "invalid" if empty to trigger dummy response
          message: userMessage.text,
          onChunk: (chunk) => {
            console.log("Received chunk (regenerate):", chunk);
            setMessages((prev) => {
              const updated = prev.map((msg) =>
                msg.isStreaming ? { ...msg, text: msg.text + chunk } : msg
              );
              console.log("Updated messages state (regenerate):", updated);
              return updated;
            });
          },
          onComplete: () => {
            console.log("Streaming completed (regenerate)");
            setMessages((prev) => {
              const updated = prev.map((msg) =>
                msg.isStreaming ? { ...msg, isStreaming: false } : msg
              );
              console.log("Final messages state (regenerate):", updated);
              return updated;
            });
            setIsLoading(false);
            abortControllerRef.current = null;
          },
          abortSignal: abortControllerRef.current.signal,
          onDummyStreamStart: (timeoutId: NodeJS.Timeout) => {
            dummyStreamTimeoutRef.current = timeoutId;
          }
        });
      } catch (error) {
        console.error("Error in streamOpenAIResponse (regenerate):", error);
        // Fallback: provide a basic response
        setMessages((prev) =>
          prev.map((msg) =>
            msg.isStreaming
              ? {
                  ...msg,
                  text: "I apologize, but I'm currently unable to provide a response. Please try again later.",
                  isStreaming: false
                }
              : msg
          )
        );
        setIsLoading(false);
        abortControllerRef.current = null;
      }
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
      <div className="flex-1 flex flex-col h-full md:px-2">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-4 backdrop-blur-3xl bg-white/20 rounded-[20px] md:rounded-md mb-1 md:mb-0 md:mx-0 mx-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl text-white text-center max-w-4xl font-medium">
              Ask anything about blockchain, cryptocurrency
            </h1>
          </div>
        ) : (
          <ChatMessages messages={messages} onRegenerate={handleRegenerate} />
        )}

        <div className="p-0 md:pb-2 md:pt-1 ">
          <div className="rich-editor md:rounded-md bg-white p-0">
            <RichTextEditor
              ref={editorRef}
              isLoading={isLoading}
              onContentChange={setEditorContent}
              onEnterPress={handleSend}
            />

            <div className="flex items-center justify-between p-3 md:p-3 bg-black/5 border-t">
              <div className="flex items-center space-x-2">
                <Button
                  className="pointer"
                  variant="outline"
                  onClick={triggerFileInput}
                  disabled={isLoading}
                >
                  <Paperclip className="h-4 w-4 md:h-5 md:w-5" />
                </Button>

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
                  <Button
                    onClick={stopStreaming}
                    variant="primary"
                    className="bg-brand-primary/20"
                    title="Stop response"
                  >
                    <Square className="h-4 w-4 fill-brand-primary stroke-brand-primary" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSend}
                    className={`${
                      editorContent.trim()
                        ? "bg-brand-primary hover:bg-blue-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!editorContent.trim()}
                  >
                    Send <Send className="h-4 w-4 ml-1 fill-white" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
