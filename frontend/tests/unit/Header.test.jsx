import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "../../src/components/Header";
import { vi } from "vitest";

// ✅ Mock the hook file (IMPORTANT)
vi.mock("../../src/hooks/useAuth", () => ({
  default: () => ({
    auth: { user: null },
    logout: vi.fn(),
  }),
}));

describe("Header Component", () => {
  test("renders CollabSphere logo", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText(/CollabSphere/i)).toBeInTheDocument();
  });
});
