import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderComponent, mockGlobalStore, resetMocks } from "@/test/utils";
import Header from "../header";

// Mock the MerkleLogo component
vi.mock("../images/MerkleLogo", () => ({
  default: ({ className }: { className?: string }) => (
    <div data-testid="merkle-logo" className={className}>
      MerkleLogo
    </div>
  )
}));

describe("Header", () => {
  beforeEach(() => {
    resetMocks();
  });

  it("renders the header with logo and title", () => {
    renderComponent(<Header />);

    expect(screen.getByText("Tracker Chat")).toBeInTheDocument();
    // The logo is rendered as an SVG, so we check for its presence by looking for the SVG element
    expect(document.querySelector("svg")).toBeInTheDocument();
  });

  it("displays the menu button on mobile", () => {
    renderComponent(<Header />);

    const menuButton = screen.getByRole("button");
    expect(menuButton).toBeInTheDocument();
    expect(menuButton).toHaveClass("md:hidden");
  });

  it("calls setIsSidebarOpen when menu button is clicked", () => {
    renderComponent(<Header />);

    const menuButton = screen.getByRole("button");
    fireEvent.click(menuButton);

    expect(mockGlobalStore.setIsSidebarOpen).toHaveBeenCalledWith(true);
  });

  it("toggles sidebar state when menu button is clicked", () => {
    mockGlobalStore.isSidebarOpen = true;
    renderComponent(<Header />);

    const menuButton = screen.getByRole("button");
    fireEvent.click(menuButton);

    expect(mockGlobalStore.setIsSidebarOpen).toHaveBeenCalledWith(false);
  });

  it("applies correct CSS classes to logo", () => {
    renderComponent(<Header />);

    // Find the logo SVG (the second SVG, not the menu icon)
    const svgs = document.querySelectorAll("svg");
    const logo = svgs[1]; // The logo is the second SVG
    expect(logo).toHaveClass("h-4", "md:h-6", "w-auto");
  });

  it("has correct layout structure", () => {
    renderComponent(<Header />);

    // Find the main header div by looking for the specific class combination
    const header = document.querySelector(
      ".px-4.md\\:px-2.py-3.flex.items-center.justify-between.md\\:justify-start"
    );
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass(
      "px-4",
      "md:px-2",
      "py-3",
      "flex",
      "items-center",
      "justify-between",
      "md:justify-start"
    );
  });

  it('displays "Tracker Chat" text with correct styling', () => {
    renderComponent(<Header />);

    const title = screen.getByText("Tracker Chat");
    expect(title).toHaveClass("font-medium", "text-[11px]", "text-white");
  });
});
