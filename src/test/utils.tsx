import { render } from "@testing-library/react";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "../routeTree.gen";
import { vi } from "vitest";

// Mock the global store
export const mockGlobalStore = {
  isSidebarOpen: false,
  apiKey: "test-api-key",
  setIsSidebarOpen: vi.fn(),
  setApiKey: vi.fn(),
  clearApiKey: vi.fn()
};

// Mock the useGlobalStore hook
vi.mock("@/store", () => ({
  useGlobalStore: () => mockGlobalStore
}));

// Mock the router
const router = createRouter({ routeTree });

// Custom render function with router provider
export const renderWithRouter = () => {
  return render(<RouterProvider router={router} />);
};

// Custom render function without router (for components that don't need routing)
export const renderComponent = (component: React.ReactElement) => {
  return render(component);
};

// Reset all mocks before each test
export const resetMocks = () => {
  vi.clearAllMocks();
  mockGlobalStore.isSidebarOpen = false;
  mockGlobalStore.apiKey = "test-api-key";
};
