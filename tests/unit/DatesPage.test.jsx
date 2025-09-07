// tests/pages/DatesPage.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DatesPage from "../../src/pages/DatesPage";
import { vi } from "vitest";

// --- Mock axios properly ---
vi.mock("../../src/api/axiosInstance", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

import axios from "../../src/api/axiosInstance";

// --- Mock window.alert ---
beforeAll(() => {
  window.alert = vi.fn();
  window.confirm = vi.fn().mockReturnValue(true);
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("DatesPage", () => {
  test("renders fetched dates", async () => {
    axios.get.mockResolvedValueOnce({
      data: ["2025-09-01", "2025-08-30"],
    });

    render(
      <MemoryRouter>
        <DatesPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Summary 2025-09-01")).toBeInTheDocument();
      expect(screen.getByText("Summary 2025-08-30")).toBeInTheDocument();
    });
  });

  test("requests today's summary", async () => {
    axios.get
      .mockResolvedValueOnce({ data: [] }) // initial fetch
      .mockResolvedValueOnce({ data: ["2025-09-01"] }); // after post refresh

    axios.post.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <DatesPage />
      </MemoryRouter>
    );

    const button = screen.getByText("Request Today’s Market Data");
    fireEvent.click(button);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("/accounts/summaries");
      expect(window.alert).toHaveBeenCalledWith("Today's market data requested!");
      expect(screen.getByText("Summary 2025-09-01")).toBeInTheDocument();
    });
  });

  test("requests summary for selected date", async () => {
    axios.get
      .mockResolvedValueOnce({ data: [] }) // initial fetch
      .mockResolvedValueOnce({ data: ["2025-09-01"] }); // after post refresh

    axios.post.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <DatesPage />
      </MemoryRouter>
    );

    const input = screen.getByLabelText(/select date/i);
    fireEvent.change(input, { target: { value: "2025-09-01" } });

    const button = screen.getByText("Request for Date");
    fireEvent.click(button);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "/accounts/summaries?asOf=2025-09-01"
      );
      expect(window.alert).toHaveBeenCalledWith(
        "Market data requested for 2025-09-01!"
      );
      expect(screen.getByText("Summary 2025-09-01")).toBeInTheDocument();
    });
  });

  test("deletes a summary", async () => {
    axios.get
      .mockResolvedValueOnce({ data: ["2025-09-01"] }) // initial fetch
      .mockResolvedValueOnce({ data: [] }); // after delete refresh

    axios.delete.mockResolvedValueOnce({
      data: { deleted: 1, date: "2025-09-01" },
    });

    render(
      <MemoryRouter>
        <DatesPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Summary 2025-09-01")).toBeInTheDocument();
    });

    const deleteButton = screen.getByTitle("Delete Summary");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        "/accounts/summaries?asOf=2025-09-01"
      );
      expect(window.alert).toHaveBeenCalledWith(
        "Deleted 1 summaries for 2025-09-01"
      );
      expect(
        screen.queryByText("Summary 2025-09-01")
      ).not.toBeInTheDocument();
    });
  });
});
