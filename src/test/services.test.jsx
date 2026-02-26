import { describe, it, expect, vi, beforeEach } from "vitest";
import { donationService } from "../api/services";
import apiClient from "../api/client";

vi.mock("../api/client", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("Donation Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches total count correctly", async () => {
    const mockData = { data: { total: 5000 } };
    apiClient.get.mockResolvedValue(mockData);

    const result = await donationService.getCount();
    
    expect(apiClient.get).toHaveBeenCalledWith("/donations/count");
    expect(result.data.total).toBe(5000);
  });

  it("fetches annual data correctly", async () => {
    const mockData = { data: { total: 1200 } };
    apiClient.get.mockResolvedValue(mockData);

    const result = await donationService.getAnnual();
    
    expect(apiClient.get).toHaveBeenCalledWith("/donations/annee");
    expect(result.data.total).toBe(1200);
  });
});
