import { describe, it, expect, beforeEach, vi } from "vitest";
import { act } from "@testing-library/react";
import { useGlobalStore } from "../index";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock
});

describe("Global Store", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store to initial state
    act(() => {
      useGlobalStore.setState({
        isSidebarOpen: true,
        apiKey: ""
      });
    });
  });

  it("has correct initial state", () => {
    const state = useGlobalStore.getState();

    expect(state.isSidebarOpen).toBe(true);
    expect(state.apiKey).toBe("");
  });

  it("sets sidebar open state correctly", () => {
    act(() => {
      useGlobalStore.getState().setIsSidebarOpen(false);
    });

    const state = useGlobalStore.getState();
    expect(state.isSidebarOpen).toBe(false);
  });

  it("sets API key correctly", () => {
    const testApiKey = "sk-test123456789";

    act(() => {
      useGlobalStore.getState().setApiKey(testApiKey);
    });

    const state = useGlobalStore.getState();
    expect(state.apiKey).toBe(testApiKey);
  });

  it("clears API key correctly", () => {
    // First set an API key
    act(() => {
      useGlobalStore.getState().setApiKey("sk-test123456789");
    });

    // Then clear it
    act(() => {
      useGlobalStore.getState().clearApiKey();
    });

    const state = useGlobalStore.getState();
    expect(state.apiKey).toBe("");
  });

  it("toggles sidebar state correctly", () => {
    // Start with sidebar open
    act(() => {
      useGlobalStore.getState().setIsSidebarOpen(true);
    });

    expect(useGlobalStore.getState().isSidebarOpen).toBe(true);

    // Toggle to closed
    act(() => {
      useGlobalStore.getState().setIsSidebarOpen(false);
    });

    expect(useGlobalStore.getState().isSidebarOpen).toBe(false);

    // Toggle back to open
    act(() => {
      useGlobalStore.getState().setIsSidebarOpen(true);
    });

    expect(useGlobalStore.getState().isSidebarOpen).toBe(true);
  });

  it("handles empty API key", () => {
    act(() => {
      useGlobalStore.getState().setApiKey("");
    });

    const state = useGlobalStore.getState();
    expect(state.apiKey).toBe("");
  });

  it("handles whitespace-only API key", () => {
    act(() => {
      useGlobalStore.getState().setApiKey("   ");
    });

    const state = useGlobalStore.getState();
    expect(state.apiKey).toBe("   ");
  });

  it("handles very long API key", () => {
    const longApiKey = "sk-" + "a".repeat(100);

    act(() => {
      useGlobalStore.getState().setApiKey(longApiKey);
    });

    const state = useGlobalStore.getState();
    expect(state.apiKey).toBe(longApiKey);
  });

  it("handles special characters in API key", () => {
    const specialApiKey = "sk-test!@#$%^&*()_+-=[]{}|;:,.<>?";

    act(() => {
      useGlobalStore.getState().setApiKey(specialApiKey);
    });

    const state = useGlobalStore.getState();
    expect(state.apiKey).toBe(specialApiKey);
  });

  it("maintains state across multiple operations", () => {
    // Set API key
    act(() => {
      useGlobalStore.getState().setApiKey("sk-test123");
    });

    // Close sidebar
    act(() => {
      useGlobalStore.getState().setIsSidebarOpen(false);
    });

    // Open sidebar
    act(() => {
      useGlobalStore.getState().setIsSidebarOpen(true);
    });

    // Update API key
    act(() => {
      useGlobalStore.getState().setApiKey("sk-test456");
    });

    const state = useGlobalStore.getState();
    expect(state.apiKey).toBe("sk-test456");
    expect(state.isSidebarOpen).toBe(true);
  });

  it("handles rapid state changes", () => {
    act(() => {
      useGlobalStore.getState().setIsSidebarOpen(false);
      useGlobalStore.getState().setIsSidebarOpen(true);
      useGlobalStore.getState().setIsSidebarOpen(false);
      useGlobalStore.getState().setApiKey("sk-test1");
      useGlobalStore.getState().setApiKey("sk-test2");
      useGlobalStore.getState().setApiKey("sk-test3");
    });

    const state = useGlobalStore.getState();
    expect(state.isSidebarOpen).toBe(false);
    expect(state.apiKey).toBe("sk-test3");
  });

  it("provides all required methods", () => {
    const state = useGlobalStore.getState();

    expect(typeof state.setIsSidebarOpen).toBe("function");
    expect(typeof state.setApiKey).toBe("function");
    expect(typeof state.clearApiKey).toBe("function");
  });

  it("handles undefined API key", () => {
    act(() => {
      useGlobalStore.getState().setApiKey("");
    });

    const state = useGlobalStore.getState();
    expect(state.apiKey).toBe(undefined);
  });

  it("handles null API key", () => {
    act(() => {
      useGlobalStore.getState().setApiKey("");
    });

    const state = useGlobalStore.getState();
    expect(state.apiKey).toBe(null);
  });

  it("handles boolean sidebar state", () => {
    act(() => {
      useGlobalStore.getState().setIsSidebarOpen(true);
    });

    expect(useGlobalStore.getState().isSidebarOpen).toBe(true);

    act(() => {
      useGlobalStore.getState().setIsSidebarOpen(false);
    });

    expect(useGlobalStore.getState().isSidebarOpen).toBe(false);
  });

  it("handles non-boolean sidebar state", () => {
    act(() => {
      useGlobalStore.getState().setIsSidebarOpen(true);
    });

    expect(useGlobalStore.getState().isSidebarOpen).toBe("true");
  });
});
