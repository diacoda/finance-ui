import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DatesPage from "../../src/pages/DatesPage";
import axios from "../../src/api/axiosInstance";

// --- Mock axios ---
vi.mock("../../src/api/axiosInstance");

// --- Mock window.alert ---
beforeAll(() => {
  window.alert = vi.fn(); // vitest equivalent of jest.fn()
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("DatesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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
    axios.get.mockResolvedValueOnce({ data: [] });
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
    });
  });

  test("requests summary for selected date", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
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
    });
  });

  test("deletes a summary", async () => {
    axios.get.mockResolvedValueOnce({ data: ["2025-09-01"] });
    axios.delete.mockResolvedValueOnce({ data: { deleted: 1, date: "2025-09-01" } });

    render(
      <MemoryRouter>
        <DatesPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Summary 2025-09-01")).toBeInTheDocument();
    });

    // Mock confirm dialog
    window.confirm = vi.fn().mockReturnValue(true);

    const deleteButton = screen.getByTitle("Delete Summary");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        "/accounts/summaries?asOf=2025-09-01"
      );
    });
  });
});
