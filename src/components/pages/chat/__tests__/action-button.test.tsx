import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderComponent, resetMocks } from "@/test/utils";
import ActionButton from "../action-button";

describe("ActionButton", () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    resetMocks();
    vi.clearAllMocks();
  });

  it("renders button with correct props", () => {
    renderComponent(
      <ActionButton
        onClick={mockOnClick}
        title="Test Button"
        ariaLabel="Test button for testing"
        hoverColor="blue"
      >
        Click me
      </ActionButton>
    );

    const button = screen.getByRole("button", {
      name: /test button for testing/i
    });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("title", "Test Button");
    expect(button).toHaveAttribute("aria-label", "Test button for testing");
    expect(button).toHaveTextContent("Click me");
  });

  it("calls onClick when clicked", () => {
    renderComponent(
      <ActionButton
        onClick={mockOnClick}
        title="Test Button"
        ariaLabel="Test button for testing"
      >
        Click me
      </ActionButton>
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("applies default blue hover color classes", () => {
    renderComponent(
      <ActionButton
        onClick={mockOnClick}
        title="Test Button"
        ariaLabel="Test button for testing"
      >
        Click me
      </ActionButton>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "hover:text-blue-600",
      "hover:bg-blue-50",
      "focus:ring-blue-500"
    );
  });

  it("applies green hover color classes", () => {
    renderComponent(
      <ActionButton
        onClick={mockOnClick}
        title="Test Button"
        ariaLabel="Test button for testing"
        hoverColor="green"
      >
        Click me
      </ActionButton>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "hover:text-green-600",
      "hover:bg-green-50",
      "focus:ring-green-500"
    );
  });

  it("applies red hover color classes", () => {
    renderComponent(
      <ActionButton
        onClick={mockOnClick}
        title="Test Button"
        ariaLabel="Test button for testing"
        hoverColor="red"
      >
        Click me
      </ActionButton>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "hover:text-red-600",
      "hover:bg-red-50",
      "focus:ring-red-500"
    );
  });

  it("applies purple hover color classes", () => {
    renderComponent(
      <ActionButton
        onClick={mockOnClick}
        title="Test Button"
        ariaLabel="Test button for testing"
        hoverColor="purple"
      >
        Click me
      </ActionButton>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "hover:text-purple-600",
      "hover:bg-purple-50",
      "focus:ring-purple-500"
    );
  });

  it("applies custom className", () => {
    renderComponent(
      <ActionButton
        onClick={mockOnClick}
        title="Test Button"
        ariaLabel="Test button for testing"
        className="custom-class"
      >
        Click me
      </ActionButton>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("applies base button classes", () => {
    renderComponent(
      <ActionButton
        onClick={mockOnClick}
        title="Test Button"
        ariaLabel="Test button for testing"
      >
        Click me
      </ActionButton>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "p-2",
      "text-white",
      "md:text-gray-500",
      "rounded-full",
      "transition-colors",
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-offset-2"
    );
  });

  it("renders children correctly", () => {
    renderComponent(
      <ActionButton
        onClick={mockOnClick}
        title="Test Button"
        ariaLabel="Test button for testing"
      >
        <span data-testid="child-element">Child Content</span>
      </ActionButton>
    );

    expect(screen.getByTestId("child-element")).toBeInTheDocument();
    expect(screen.getByText("Child Content")).toBeInTheDocument();
  });

  it("handles multiple clicks", () => {
    renderComponent(
      <ActionButton
        onClick={mockOnClick}
        title="Test Button"
        ariaLabel="Test button for testing"
      >
        Click me
      </ActionButton>
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(3);
  });

  it("handles invalid hover color gracefully", () => {
    renderComponent(
      <ActionButton
        onClick={mockOnClick}
        title="Test Button"
        ariaLabel="Test button for testing"
        hoverColor={"invalid" as "green" | "red" | "blue" | "purple"}
      >
        Click me
      </ActionButton>
    );

    const button = screen.getByRole("button");
    // Should fall back to default blue classes
    expect(button).toHaveClass(
      "hover:text-blue-600",
      "hover:bg-blue-50",
      "focus:ring-blue-500"
    );
  });

  it("combines custom className with default classes", () => {
    renderComponent(
      <ActionButton
        onClick={mockOnClick}
        title="Test Button"
        ariaLabel="Test button for testing"
        className="custom-class another-class"
      >
        Click me
      </ActionButton>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "custom-class",
      "another-class",
      "p-2",
      "text-white"
    );
  });
});
