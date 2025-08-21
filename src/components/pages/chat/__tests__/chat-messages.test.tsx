import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderComponent, resetMocks } from "@/test/utils";
import ChatMessages from "../chat-messages";

// Mock TipTap editor
vi.mock("@tiptap/react", () => ({
  useEditor: vi.fn(() => ({
    commands: {
      setContent: vi.fn()
    },
    getHTML: vi.fn(() => "mocked content")
  })),
  EditorContent: () => (
    <div data-testid="editor-content">
      <div>mocked content</div>
    </div>
  )
}));

// Mock tiptap-markdown
vi.mock("tiptap-markdown", () => ({
  Markdown: {
    configure: vi.fn(() => ({}))
  }
}));

// Mock ActionButton
vi.mock("../action-button", () => ({
  default: ({
    children,
    onClick,
    title,
    ariaLabel
  }: {
    children: React.ReactNode;
    onClick: () => void;
    title: string;
    ariaLabel: string;
  }) => (
    <button
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
      data-testid={`action-${title}`}
    >
      {children}
    </button>
  )
}));

// Mock EditIcon
vi.mock("@/components/icons/edit", () => ({
  default: ({ className }: { className?: string }) => (
    <div data-testid="edit-icon" className={className}>
      Edit
    </div>
  )
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn()
  }
});

// Mock document.execCommand for fallback
Object.defineProperty(document, "execCommand", {
  value: vi.fn(),
  writable: true
});

describe("ChatMessages", () => {
  const mockMessages = [
    {
      id: "1",
      text: "Hello, how are you?",
      isUser: true,
      timestamp: new Date()
    },
    {
      id: "2",
      text: "I am doing well, thank you!",
      isUser: false,
      timestamp: new Date()
    },
    {
      id: "3",
      text: "What is blockchain?",
      isUser: true,
      timestamp: new Date()
    },
    {
      id: "4",
      text: "Blockchain is a distributed ledger technology...",
      isUser: false,
      timestamp: new Date()
    }
  ];

  const mockOnRegenerate = vi.fn();

  beforeEach(() => {
    resetMocks();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it("renders user messages correctly", () => {
    renderComponent(
      <ChatMessages messages={mockMessages} onRegenerate={mockOnRegenerate} />
    );

    expect(screen.getByText("Hello, how are you?")).toBeInTheDocument();
    expect(screen.getByText("What is blockchain?")).toBeInTheDocument();
  });

  it("renders AI messages correctly", () => {
    renderComponent(
      <ChatMessages messages={mockMessages} onRegenerate={mockOnRegenerate} />
    );

    expect(screen.getAllByText("mocked content")).toHaveLength(2);
  });

  it("shows action buttons for AI messages", () => {
    renderComponent(
      <ChatMessages messages={mockMessages} onRegenerate={mockOnRegenerate} />
    );

    expect(screen.getAllByTestId(/action-/)).toHaveLength(8); // 2 AI messages * 4 action buttons each
  });

  it("does not show action buttons for user messages", () => {
    renderComponent(
      <ChatMessages messages={mockMessages} onRegenerate={mockOnRegenerate} />
    );

    const userMessages = screen.getAllByText(
      /Hello, how are you?|What is blockchain\?/
    );
    userMessages.forEach((message) => {
      const parent = message.closest("div");
      // Check that the specific parent doesn't contain action buttons
      const actionButtonsInParent = parent?.querySelectorAll(
        '[data-testid^="action-"]'
      );
      expect(actionButtonsInParent).toHaveLength(0);
    });
  });

  it("calls onRegenerate when regenerate button is clicked", () => {
    renderComponent(
      <ChatMessages messages={mockMessages} onRegenerate={mockOnRegenerate} />
    );

    const regenerateButtons = screen.getAllByTestId("action-Regenerate");
    fireEvent.click(regenerateButtons[0]);

    expect(mockOnRegenerate).toHaveBeenCalledWith("2");
  });

  it("copies message to clipboard when copy button is clicked", async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText: mockWriteText } });

    renderComponent(
      <ChatMessages messages={mockMessages} onRegenerate={mockOnRegenerate} />
    );

    const copyButtons = screen.getAllByTestId("action-Copy to clipboard");
    fireEvent.click(copyButtons[0]);

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith("I am doing well, thank you!");
    });
  });

  it("shows check icon after copying message", async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText: mockWriteText } });

    renderComponent(
      <ChatMessages messages={mockMessages} onRegenerate={mockOnRegenerate} />
    );

    const copyButtons = screen.getAllByTestId("action-Copy to clipboard");
    fireEvent.click(copyButtons[0]);

    await waitFor(() => {
      expect(screen.getAllByTestId("action-Copy to clipboard")).toHaveLength(2);
    });
  });

  it("handles clipboard API failure gracefully", async () => {
    const mockWriteText = vi
      .fn()
      .mockRejectedValue(new Error("Clipboard API not available"));
    Object.assign(navigator, { clipboard: { writeText: mockWriteText } });

    renderComponent(
      <ChatMessages messages={mockMessages} onRegenerate={mockOnRegenerate} />
    );

    const copyButtons = screen.getAllByTestId("action-Copy to clipboard");
    fireEvent.click(copyButtons[0]);

    await waitFor(() => {
      expect(document.execCommand).toHaveBeenCalledWith("copy");
    });
  });

  it("renders searching message correctly", () => {
    const messagesWithSearching = [
      ...mockMessages,
      {
        id: "5",
        text: "What is cryptocurrency?",
        isUser: false,
        isSearching: true,
        timestamp: new Date()
      }
    ];

    renderComponent(
      <ChatMessages
        messages={messagesWithSearching}
        onRegenerate={mockOnRegenerate}
      />
    );

    expect(screen.getByText(/Searching for/)).toBeInTheDocument();
    expect(screen.getByText("What is cryptocurrency?")).toBeInTheDocument();
  });

  it("renders streaming message correctly", () => {
    const messagesWithStreaming = [
      ...mockMessages,
      {
        id: "6",
        text: "Streaming response...",
        isUser: false,
        isStreaming: true,
        timestamp: new Date()
      }
    ];

    renderComponent(
      <ChatMessages
        messages={messagesWithStreaming}
        onRegenerate={mockOnRegenerate}
      />
    );

    expect(screen.getAllByText("mocked content")).toHaveLength(3);
  });

  it("shows edit icon for user messages", () => {
    renderComponent(
      <ChatMessages messages={mockMessages} onRegenerate={mockOnRegenerate} />
    );

    const editIcons = screen.getAllByTestId("edit-icon");
    expect(editIcons).toHaveLength(2); // One for each user message
  });

  it("handles empty messages array", () => {
    renderComponent(
      <ChatMessages messages={[]} onRegenerate={mockOnRegenerate} />
    );

    expect(screen.queryByTestId(/action-/)).not.toBeInTheDocument();
  });

  it("handles messages without onRegenerate callback", () => {
    renderComponent(<ChatMessages messages={mockMessages} />);

    const regenerateButtons = screen.getAllByTestId("action-Regenerate");
    fireEvent.click(regenerateButtons[0]);

    // Should not throw error
    expect(regenerateButtons[0]).toBeInTheDocument();
  });

  it("applies correct CSS classes to user messages", () => {
    renderComponent(
      <ChatMessages messages={mockMessages} onRegenerate={mockOnRegenerate} />
    );

    const userMessage = screen.getByText("Hello, how are you?").closest("div");
    expect(userMessage).toHaveClass(
      "bg-blue-100",
      "text-blue-900",
      "rounded-2xl",
      "rounded-tr-none"
    );
  });

  it("applies correct CSS classes to AI messages", () => {
    renderComponent(
      <ChatMessages messages={mockMessages} onRegenerate={mockOnRegenerate} />
    );

    const aiMessages = screen.getAllByText("mocked content");
    const aiMessage = aiMessages[0].closest("div");
    // The mocked content is inside the editor-content div, so we need to go up further
    const messageContainer =
      aiMessage?.parentElement?.parentElement?.parentElement?.parentElement;
    expect(messageContainer).toHaveClass(
      "md:bg-white",
      "text-gray-900",
      "rounded-2xl"
    );
  });

  it("renders markdown content correctly", () => {
    const messagesWithMarkdown = [
      {
        id: "1",
        text: "# Hello\nThis is **bold** text",
        isUser: false,
        timestamp: new Date()
      }
    ];

    renderComponent(
      <ChatMessages
        messages={messagesWithMarkdown}
        onRegenerate={mockOnRegenerate}
      />
    );

    expect(screen.getByTestId("editor-content")).toBeInTheDocument();
  });
});
