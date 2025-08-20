import { Edit3, Info } from "lucide-react";

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
}

export const ChatMessages = ({ messages }: ChatMessagesProps) => {
  const formatContent = (text: string) => {
    // Simple markdown-like formatting
    const sections = text.split("\n\n");
    return sections.map((section, index) => {
      if (section.startsWith("# ")) {
        return (
          <h2
            key={index}
            className="text-xl font-bold text-white mb-3 border-b border-white/20 pb-2"
          >
            {section.substring(2)}
          </h2>
        );
      }
      if (section.startsWith("## ")) {
        return (
          <h3 key={index} className="text-lg font-semibold text-white mb-2">
            {section.substring(3)}
          </h3>
        );
      }
      if (section.startsWith("• ")) {
        return (
          <ul
            key={index}
            className="list-disc list-inside text-white/90 mb-3 space-y-1"
          >
            {section.split("\n").map((item, itemIndex) => (
              <li key={itemIndex}>{item.substring(2)}</li>
            ))}
          </ul>
        );
      }
      return (
        <p key={index} className="text-white/90 mb-3 leading-relaxed">
          {section}
        </p>
      );
    });
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-3 md:space-y-4 p-3 md:p-6">
      {messages.map((message) => (
        <div key={message.id} className="flex flex-col space-y-2 md:space-y-3">
          {message.isUser && (
            <div className="flex justify-end">
              <div className="chat-message-user relative max-w-[85%] md:max-w-xs">
                <p className="text-sm">{message.text}</p>
                <button className="absolute top-2 right-2 text-blue-700 opacity-60 hover:opacity-100">
                  <Edit3 className="h-3 w-3" />
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
                <div className="prose prose-sm max-w-none text-gray-900">
                  {formatContent(message.text)}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
