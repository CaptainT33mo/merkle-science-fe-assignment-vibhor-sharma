import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import EmojiPicker from "../emoji-picker";

describe("EmojiPicker", () => {
  const mockOnEmojiSelect = vi.fn();
  const mockOnClose = vi.fn();

  it("renders when open", () => {
    render(
      <EmojiPicker
        isOpen={true}
        onEmojiSelect={mockOnEmojiSelect}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("Smileys")).toBeInTheDocument();
    expect(screen.getByText("Gestures")).toBeInTheDocument();
    expect(screen.getByText("Animals")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(
      <EmojiPicker
        isOpen={false}
        onEmojiSelect={mockOnEmojiSelect}
        onClose={mockOnClose}
      />
    );

    expect(screen.queryByText("Smileys")).not.toBeInTheDocument();
  });

  it("calls onEmojiSelect when emoji is clicked", () => {
    render(
      <EmojiPicker
        isOpen={true}
        onEmojiSelect={mockOnEmojiSelect}
        onClose={mockOnClose}
      />
    );

    const emojiButton = screen.getByText("😀");
    fireEvent.click(emojiButton);

    expect(mockOnEmojiSelect).toHaveBeenCalledWith("😀");
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("changes category when tab is clicked", () => {
    render(
      <EmojiPicker
        isOpen={true}
        onEmojiSelect={mockOnEmojiSelect}
        onClose={mockOnClose}
      />
    );

    const gesturesTab = screen.getByText("Gestures");
    fireEvent.click(gesturesTab);

    // Should show gesture emojis
    expect(screen.getByText("👍")).toBeInTheDocument();
  });
});
