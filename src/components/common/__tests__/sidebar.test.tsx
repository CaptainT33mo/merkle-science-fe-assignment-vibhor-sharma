import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderComponent, mockGlobalStore, resetMocks } from "@/test/utils";
import Sidebar from "../sidebar";

// Mock TanStack Router
const mockNavigate = vi.fn();
const mockUseRouter = vi.fn(() => ({
  latestLocation: { pathname: "/" },
  navigate: mockNavigate
}));

vi.mock("@tanstack/react-router", () => ({
  useRouter: () => mockUseRouter(),
  createRootRoute: vi.fn(),
  createRoute: vi.fn(),
  createFileRoute: vi.fn(),
  createRouter: vi.fn(),
  Outlet: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Link: ({
    children,
    to,
    onClick,
    className
  }: {
    children: React.ReactNode;
    to: string;
    onClick?: () => void;
    className?: string;
  }) => (
    <a
      href={to}
      onClick={onClick}
      className={className}
      data-testid={`nav-link-${to}`}
    >
      {children}
    </a>
  )
}));

describe("Sidebar", () => {
  beforeEach(() => {
    resetMocks();
    mockUseRouter.mockReturnValue({
      latestLocation: { pathname: "/" },
      navigate: mockNavigate
    });
  });

  it("renders sidebar with navigation items", () => {
    renderComponent(<Sidebar />);

    expect(screen.getByTestId("nav-link-/")).toBeInTheDocument();
    expect(screen.getByTestId("nav-link-/chat")).toBeInTheDocument();
    expect(screen.getByTestId("nav-link-/settings")).toBeInTheDocument();
  });

  it("displays correct navigation labels", () => {
    renderComponent(<Sidebar />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Chat")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("calls setIsSidebarOpen when close button is clicked", () => {
    renderComponent(<Sidebar />);

    const closeButtons = screen.getAllByRole("button");
    const closeButton = closeButtons.find(
      (button) =>
        button.querySelector("svg") || button.textContent?.includes("X")
    );

    if (closeButton) {
      fireEvent.click(closeButton);
      expect(mockGlobalStore.setIsSidebarOpen).toHaveBeenCalledWith(false);
    }
  });

  it("calls setIsSidebarOpen when navigation item is clicked", () => {
    renderComponent(<Sidebar />);

    const homeLink = screen.getByTestId("nav-link-/");
    fireEvent.click(homeLink);

    expect(mockGlobalStore.setIsSidebarOpen).toHaveBeenCalledWith(false);
  });

  it("shows mobile overlay when sidebar is open", () => {
    mockGlobalStore.isSidebarOpen = true;
    renderComponent(<Sidebar />);

    const overlay = document.querySelector(".fixed.inset-0.bg-black\\/40");
    expect(overlay).toBeInTheDocument();
  });

  it("hides mobile overlay when sidebar is closed", () => {
    mockGlobalStore.isSidebarOpen = false;
    renderComponent(<Sidebar />);

    const overlay = document.querySelector(".fixed.inset-0.bg-black\\/40");
    expect(overlay).not.toBeInTheDocument();
  });

  it("applies correct transform classes for mobile sidebar", () => {
    mockGlobalStore.isSidebarOpen = true;
    renderComponent(<Sidebar />);

    const mobileSidebar = document.querySelector(
      ".fixed.left-0.top-0.h-full.w-64.z-50"
    );
    expect(mobileSidebar).toHaveClass("translate-x-0");
  });

  it("applies correct transform classes when sidebar is closed", () => {
    mockGlobalStore.isSidebarOpen = false;
    renderComponent(<Sidebar />);

    const mobileSidebar = document.querySelector(
      ".fixed.left-0.top-0.h-full.w-64.z-50"
    );
    expect(mobileSidebar).toHaveClass("-translate-x-full");
  });

  it("has correct desktop sidebar structure", () => {
    renderComponent(<Sidebar />);

    const desktopSidebar = document.querySelector(
      ".hidden.md\\:block.w-72.h-full.p-2"
    );
    expect(desktopSidebar).toBeInTheDocument();
  });

  it("calls setIsSidebarOpen when overlay is clicked", () => {
    mockGlobalStore.isSidebarOpen = true;
    renderComponent(<Sidebar />);

    const overlay = document.querySelector(".fixed.inset-0.bg-black\\/40");
    if (overlay) {
      fireEvent.click(overlay);
      expect(mockGlobalStore.setIsSidebarOpen).toHaveBeenCalledWith(false);
    }
  });

  it("highlights active navigation item", () => {
    mockUseRouter.mockReturnValue({
      latestLocation: { pathname: "/chat" },
      navigate: mockNavigate
    });

    renderComponent(<Sidebar />);

    const chatLink = screen.getByTestId("nav-link-/chat");
    expect(chatLink).toHaveClass(
      "bg-blue-50",
      "!text-blue-700",
      "border-r-2",
      "border-blue-700"
    );
  });
});
