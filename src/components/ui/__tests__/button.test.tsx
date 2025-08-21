import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderComponent, resetMocks } from "@/test/utils";
import { Button } from "../button";

describe("Button", () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    resetMocks();
    vi.clearAllMocks();
  });

  it("renders button with default props", () => {
    renderComponent(<Button onClick={mockOnClick}>Click me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Click me");
  });

  it("calls onClick when clicked", () => {
    renderComponent(<Button onClick={mockOnClick}>Click me</Button>);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("applies primary variant classes", () => {
    renderComponent(
      <Button variant="primary" onClick={mockOnClick}>
        Primary Button
      </Button>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "bg-brand-primary",
      "text-white",
      "shadow-xs",
      "hover:bg-brand-primary/90"
    );
  });

  it("applies destructive variant classes", () => {
    renderComponent(
      <Button variant="destructive" onClick={mockOnClick}>
        Destructive Button
      </Button>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "bg-destructive",
      "text-white",
      "shadow-xs",
      "hover:bg-destructive/90"
    );
  });

  it("applies outline variant classes", () => {
    renderComponent(
      <Button variant="outline" onClick={mockOnClick}>
        Outline Button
      </Button>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "border",
      "bg-background",
      "shadow-xs",
      "hover:bg-accent",
      "hover:text-accent-foreground"
    );
  });

  it("applies secondary variant classes", () => {
    renderComponent(
      <Button variant="secondary" onClick={mockOnClick}>
        Secondary Button
      </Button>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "bg-secondary",
      "text-secondary-foreground",
      "shadow-xs",
      "hover:bg-secondary/80"
    );
  });

  it("applies ghost variant classes", () => {
    renderComponent(
      <Button variant="ghost" onClick={mockOnClick}>
        Ghost Button
      </Button>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "hover:bg-accent",
      "hover:text-accent-foreground"
    );
  });

  it("applies link variant classes", () => {
    renderComponent(
      <Button variant="link" onClick={mockOnClick}>
        Link Button
      </Button>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "text-primary",
      "underline-offset-4",
      "hover:underline"
    );
  });

  it("applies small size classes", () => {
    renderComponent(
      <Button size="sm" onClick={mockOnClick}>
        Small Button
      </Button>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("h-8", "rounded-md", "gap-1.5", "px-3");
  });

  it("applies large size classes", () => {
    renderComponent(
      <Button size="lg" onClick={mockOnClick}>
        Large Button
      </Button>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("h-10", "rounded-md", "px-6");
  });

  it("applies icon size classes", () => {
    renderComponent(
      <Button size="icon" onClick={mockOnClick}>
        Icon Button
      </Button>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("size-9");
  });

  it("applies custom className", () => {
    renderComponent(
      <Button className="custom-class" onClick={mockOnClick}>
        Custom Button
      </Button>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("applies disabled state correctly", () => {
    renderComponent(
      <Button disabled onClick={mockOnClick}>
        Disabled Button
      </Button>
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass(
      "disabled:pointer-events-none",
      "disabled:opacity-50"
    );
  });

  it("does not call onClick when disabled", () => {
    renderComponent(
      <Button disabled onClick={mockOnClick}>
        Disabled Button
      </Button>
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it("renders as child component when asChild is true", () => {
    renderComponent(
      <Button asChild onClick={mockOnClick}>
        <a href="/test">Link Button</a>
      </Button>
    );

    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/test");
    expect(link).toHaveTextContent("Link Button");
  });

  it("renders with SVG icon", () => {
    renderComponent(
      <Button onClick={mockOnClick}>
        <svg data-testid="icon" />
        Button with Icon
      </Button>
    );

    const button = screen.getByRole("button");
    const icon = screen.getByTestId("icon");

    expect(button).toContainElement(icon);
    expect(button).toHaveClass(
      "[&_svg]:pointer-events-none",
      "[&_svg]:shrink-0"
    );
  });

  it("applies focus-visible classes", () => {
    renderComponent(<Button onClick={mockOnClick}>Focusable Button</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "focus-visible:border-ring",
      "focus-visible:ring-ring/50",
      "focus-visible:ring-[3px]"
    );
  });

  it("handles aria-invalid attribute", () => {
    renderComponent(
      <Button aria-invalid="true" onClick={mockOnClick}>
        Invalid Button
      </Button>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-invalid", "true");
    expect(button).toHaveClass(
      "aria-invalid:ring-destructive/20",
      "aria-invalid:border-destructive"
    );
  });

  it("combines multiple variants and sizes", () => {
    renderComponent(
      <Button variant="primary" size="lg" onClick={mockOnClick}>
        Large Primary Button
      </Button>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "bg-brand-primary",
      "text-white",
      "h-10",
      "rounded-md",
      "px-6"
    );
  });

  it("handles multiple clicks", () => {
    renderComponent(<Button onClick={mockOnClick}>Click me</Button>);

    const button = screen.getByRole("button");
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(3);
  });

  it("passes through additional props", () => {
    renderComponent(
      <Button
        onClick={mockOnClick}
        data-testid="custom-button"
        aria-label="Custom button"
        title="Button tooltip"
      >
        Custom Props Button
      </Button>
    );

    const button = screen.getByTestId("custom-button");
    expect(button).toHaveAttribute("aria-label", "Custom button");
    expect(button).toHaveAttribute("title", "Button tooltip");
  });
});
