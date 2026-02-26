import React from "react";
import { screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Navbar from "../components/Navbar";
import { renderWithProviders } from "./test-utils";

// Mock matchMedia for components that use it (like scroll hooks if any)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe("Navbar Component", () => {
  it("renders correctly with localized links", () => {
    renderWithProviders(<Navbar />);
    
    // Check if main links exist (using translation keys or expected text)
    expect(screen.getByText(/Accueil|Home/i)).toBeInTheDocument();
    expect(screen.getByText(/À propos|About/i)).toBeInTheDocument();
    expect(screen.getByText(/Contact/i)).toBeInTheDocument();
  });

  it("contains the donate button", () => {
    renderWithProviders(<Navbar />);
    const donateButtons = screen.getAllByText(/Faire un Don|Donate/i);
    expect(donateButtons.length).toBeGreaterThan(0);
  });
});
