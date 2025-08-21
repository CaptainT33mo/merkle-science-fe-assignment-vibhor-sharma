import { describe, it, expect, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderComponent, mockGlobalStore, resetMocks } from "@/test/utils";
import ApiKeySettings from "../api-key-settings";

describe("ApiKeySettings", () => {
  beforeEach(() => {
    resetMocks();
  });

  it("renders the API key settings form", () => {
    renderComponent(<ApiKeySettings />);

    expect(screen.getByText("OpenAI API Configuration")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("sk-...")).toBeInTheDocument();
    expect(screen.getByText("Save Key")).toBeInTheDocument();
  });

  it("displays the description text", () => {
    renderComponent(<ApiKeySettings />);

    expect(
      screen.getByText(/Enter your OpenAI API key to enable AI responses/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Your key is stored locally in your browser/)
    ).toBeInTheDocument();
  });

  it("shows password input by default", () => {
    renderComponent(<ApiKeySettings />);

    const input = screen.getByPlaceholderText("sk-...");
    expect(input).toHaveAttribute("type", "password");
  });

  it("toggles password visibility when eye icon is clicked", () => {
    renderComponent(<ApiKeySettings />);

    const input = screen.getByPlaceholderText("sk-...");
    const buttons = screen.getAllByRole("button");
    const toggleButton = buttons[0]; // First button is the toggle button

    expect(input).toHaveAttribute("type", "password");

    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute("type", "text");

    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute("type", "password");
  });

  it("updates input value when typing", () => {
    renderComponent(<ApiKeySettings />);

    const input = screen.getByPlaceholderText("sk-...");
    fireEvent.change(input, { target: { value: "sk-test123" } });

    expect(input).toHaveValue("sk-test123");
  });

  it("calls setApiKey when Save Key button is clicked", () => {
    renderComponent(<ApiKeySettings />);

    const input = screen.getByPlaceholderText("sk-...");
    const saveButton = screen.getByText("Save Key");

    fireEvent.change(input, { target: { value: "sk-test123" } });
    fireEvent.click(saveButton);

    expect(mockGlobalStore.setApiKey).toHaveBeenCalledWith("sk-test123");
  });

  it("disables Save Key button when input is empty", () => {
    mockGlobalStore.apiKey = "";
    renderComponent(<ApiKeySettings />);

    const input = screen.getByPlaceholderText("sk-...");
    fireEvent.change(input, { target: { value: "" } });

    const saveButton = screen.getByText("Save Key");
    expect(saveButton).toBeDisabled();
  });

  it("enables Save Key button when input has value", () => {
    renderComponent(<ApiKeySettings />);

    const input = screen.getByPlaceholderText("sk-...");
    const saveButton = screen.getByText("Save Key");

    fireEvent.change(input, { target: { value: "sk-test123" } });

    expect(saveButton).not.toBeDisabled();
  });

  it("shows Clear button when API key exists", () => {
    mockGlobalStore.apiKey = "sk-existing-key";
    renderComponent(<ApiKeySettings />);

    expect(screen.getByText("Clear")).toBeInTheDocument();
  });

  it("hides Clear button when no API key exists", () => {
    mockGlobalStore.apiKey = "";
    renderComponent(<ApiKeySettings />);

    expect(screen.queryByText("Clear")).not.toBeInTheDocument();
  });

  it("calls clearApiKey when Clear button is clicked", () => {
    mockGlobalStore.apiKey = "sk-existing-key";
    renderComponent(<ApiKeySettings />);

    const clearButton = screen.getByText("Clear");
    fireEvent.click(clearButton);

    expect(mockGlobalStore.clearApiKey).toHaveBeenCalled();
  });

  it("shows success message when API key is saved", () => {
    mockGlobalStore.apiKey = "sk-saved-key";
    renderComponent(<ApiKeySettings />);

    expect(
      screen.getByText("✅ API key is saved and ready to use")
    ).toBeInTheDocument();
  });

  it("hides success message when no API key is saved", () => {
    mockGlobalStore.apiKey = "";
    renderComponent(<ApiKeySettings />);

    expect(
      screen.queryByText("✅ API key is saved and ready to use")
    ).not.toBeInTheDocument();
  });

  it("syncs input value with store value on mount", () => {
    mockGlobalStore.apiKey = "sk-synced-key";
    renderComponent(<ApiKeySettings />);

    const input = screen.getByPlaceholderText("sk-...");
    expect(input).toHaveValue("sk-synced-key");
  });

  it("handles empty input value correctly", () => {
    renderComponent(<ApiKeySettings />);

    const input = screen.getByPlaceholderText("sk-...");
    fireEvent.change(input, { target: { value: "" } });

    const saveButton = screen.getByText("Save Key");
    expect(saveButton).toBeDisabled();
  });

  it("handles whitespace-only input correctly", () => {
    renderComponent(<ApiKeySettings />);

    const input = screen.getByPlaceholderText("sk-...");
    fireEvent.change(input, { target: { value: "   " } });

    const saveButton = screen.getByText("Save Key");
    expect(saveButton).toBeDisabled();
  });
});
