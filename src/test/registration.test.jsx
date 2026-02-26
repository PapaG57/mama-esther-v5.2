import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Registration from "../components/Registration";
import { renderWithProviders } from "./test-utils";
import { newsletterService } from "../api/services";
import { toast } from "react-toastify";

vi.mock("../api/services", () => ({
  newsletterService: {
    subscribe: vi.fn(),
  },
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

describe("Registration Component", () => {
  it("shows warning if human check is not checked", async () => {
    renderWithProviders(<Registration />);
    
    const emailInput = screen.getByPlaceholderText(/votre adresse email|your email address/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    
    const submitBtn = screen.getByRole("button");
    fireEvent.click(submitBtn);
    
    expect(toast.warning).toHaveBeenCalled();
  });

  it("calls newsletterService.subscribe when form is valid", async () => {
    newsletterService.subscribe.mockResolvedValue({ data: {} });
    renderWithProviders(<Registration />);
    
    const emailInput = screen.getByPlaceholderText(/votre adresse email|your email address/i);
    fireEvent.change(emailInput, { target: { value: "valid@example.com" } });
    
    const checkbox = screen.getByLabelText(/je suis un humain|i am a human/i);
    fireEvent.click(checkbox);
    
    const submitBtn = screen.getByRole("button");
    fireEvent.click(submitBtn);
    
    await waitFor(() => {
      expect(newsletterService.subscribe).toHaveBeenCalledWith("valid@example.com");
      expect(toast.success).toHaveBeenCalled();
    });
  });
});
