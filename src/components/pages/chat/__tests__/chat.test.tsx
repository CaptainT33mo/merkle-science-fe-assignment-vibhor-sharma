import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderComponent, mockGlobalStore, resetMocks } from "@/test/utils";
import Chat from "../chat";

// Mock dependencies
const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
  createRootRoute: vi.fn(),
  createRoute: vi.fn(),
  createFileRoute: vi.fn(),
  createRouter: vi.fn(),
  Outlet: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

const mockStreamOpenAIResponse = vi.fn();
vi.mock("@/lib/openAi", () => ({
  streamOpenAIResponse: mockStreamOpenAIResponse
}));

// Mock RichTextEditor
const mockRichTextEditorRef = {
  clearContent: vi.fn(),
  getMarkdownContent: vi.fn(() => "test markdown content")
};
vi.mock("@/components/common/rich-text-editor", () => ({
  default: vi
    .fn()
    .mockImplementation(({ onContentChange, onEnterPress, isLoading }) => {
      // Simulate content change
      setTimeout(() => onContentChange("test content"), 0);
      return (
        <div data-testid="rich-text-editor">
          <textarea
            data-testid="editor-input"
            onChange={(e) => onContentChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onEnterPress()}
            disabled={isLoading}
          />
        </div>
      );
    })
}));

// Mock ChatMessages
vi.mock("../chat-messages", () => ({
  default: ({
    messages,
    onRegenerate
  }: {
    messages: Array<{ id: string; text: string; isUser: boolean }>;
    onRegenerate?: (id: string) => void;
  }) => (
    <div data-testid="chat-messages">
      {messages.map((msg) => (
        <div key={msg.id} data-testid={`message-${msg.id}`}>
          {msg.text}
          {msg.isUser ? " (User)" : " (AI)"}
          {onRegenerate && !msg.isUser && (
            <button
              onClick={() => onRegenerate(msg.id)}
              data-testid={`regenerate-${msg.id}`}
            >
              Regenerate
            </button>
          )}
        </div>
      ))}
    </div>
  )
}));

describe("Chat", () => {
  beforeEach(() => {
    resetMocks();
    vi.clearAllMocks();
    mockGlobalStore.apiKey = "test-api-key";
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it("renders empty state when no messages", () => {
    renderComponent(<Chat />);

    expect(
      screen.getByText("Ask anything about blockchain, cryptocurrency")
    ).toBeInTheDocument();
  });

  it("renders chat messages when messages exist", async () => {
    renderComponent(<Chat />);

    // Add a message by typing and sending
    const editor = screen.getByTestId("editor-input");
    fireEvent.change(editor, { target: { value: "Hello" } });

    const sendButton = screen.getByText("Send");
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByTestId("chat-messages")).toBeInTheDocument();
    });
  });

  it("navigates to settings when no API key is provided", async () => {
    mockGlobalStore.apiKey = "";
    renderComponent(<Chat />);

    const editor = screen.getByTestId("editor-input");
    fireEvent.change(editor, { target: { value: "Hello" } });

    const sendButton = screen.getByText("Send");
    fireEvent.click(sendButton);

    expect(mockNavigate).toHaveBeenCalledWith({ to: "/settings" });
  });

  it("handles file attachment", () => {
    renderComponent(<Chat />);

    const fileInput =
      screen.getByTestId("file-input") ||
      document.querySelector('input[type="file"]');
    if (fileInput) {
      const file = new File(["test content"], "test.txt", {
        type: "text/plain"
      });
      fireEvent.change(fileInput, { target: { files: [file] } });

      expect(screen.getByText("test.txt")).toBeInTheDocument();
    }
  });

  it("removes attached file when X button is clicked", () => {
    renderComponent(<Chat />);

    const fileInput =
      screen.getByTestId("file-input") ||
      document.querySelector('input[type="file"]');
    if (fileInput) {
      const file = new File(["test content"], "test.txt", {
        type: "text/plain"
      });
      fireEvent.change(fileInput, { target: { files: [file] } });

      const removeButton = screen.getByRole("button", { name: /remove file/i });
      fireEvent.click(removeButton);

      expect(screen.queryByText("test.txt")).not.toBeInTheDocument();
    }
  });

  it("disables send button when loading", async () => {
    renderComponent(<Chat />);

    const editor = screen.getByTestId("editor-input");
    fireEvent.change(editor, { target: { value: "Hello" } });

    const sendButton = screen.getByText("Send");
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(sendButton).toBeDisabled();
    });
  });

  it("shows stop button when streaming", async () => {
    renderComponent(<Chat />);

    const editor = screen.getByTestId("editor-input");
    fireEvent.change(editor, { target: { value: "Hello" } });

    const sendButton = screen.getByText("Send");
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByTitle("Stop response")).toBeInTheDocument();
    });
  });

  it("calls streamOpenAIResponse when sending message", async () => {
    renderComponent(<Chat />);

    const editor = screen.getByTestId("editor-input");
    fireEvent.change(editor, { target: { value: "Hello" } });

    const sendButton = screen.getByText("Send");
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockStreamOpenAIResponse).toHaveBeenCalled();
    });
  });

  it("handles message regeneration", async () => {
    renderComponent(<Chat />);

    // First, send a message
    const editor = screen.getByTestId("editor-input");
    fireEvent.change(editor, { target: { value: "Hello" } });

    const sendButton = screen.getByText("Send");
    fireEvent.click(sendButton);

    await waitFor(() => {
      const regenerateButton = screen.getByTestId(/regenerate-/);
      fireEvent.click(regenerateButton);
    });

    expect(mockStreamOpenAIResponse).toHaveBeenCalledTimes(2);
  });

  it("clears editor content after sending message", async () => {
    renderComponent(<Chat />);

    const editor = screen.getByTestId("editor-input");
    fireEvent.change(editor, { target: { value: "Hello" } });

    const sendButton = screen.getByText("Send");
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockRichTextEditorRef.clearContent).toHaveBeenCalled();
    });
  });

  it("handles Enter key press to send message", async () => {
    renderComponent(<Chat />);

    const editor = screen.getByTestId("editor-input");
    fireEvent.change(editor, { target: { value: "Hello" } });
    fireEvent.keyDown(editor, { key: "Enter" });

    await waitFor(() => {
      expect(mockStreamOpenAIResponse).toHaveBeenCalled();
    });
  });

  it("does not send empty messages", () => {
    renderComponent(<Chat />);

    const sendButton = screen.getByText("Send");
    expect(sendButton).toBeDisabled();
  });

  it("handles streaming response chunks", async () => {
    mockStreamOpenAIResponse.mockImplementation(({ onChunk, onComplete }) => {
      setTimeout(() => onChunk("Hello"), 100);
      setTimeout(() => onChunk(" World"), 200);
      setTimeout(() => onComplete(), 300);
    });

    renderComponent(<Chat />);

    const editor = screen.getByTestId("editor-input");
    fireEvent.change(editor, { target: { value: "Test" } });

    const sendButton = screen.getByText("Send");
    fireEvent.click(sendButton);

    await waitFor(
      () => {
        expect(screen.getByText("Hello World (AI)")).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });
});
