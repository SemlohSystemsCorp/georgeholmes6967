import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { Logo } from "@/components/ui/logo";

afterEach(cleanup);

describe("Logo", () => {
  it("renders chatterbox text", () => {
    render(<Logo />);
    expect(screen.getByText("chatterbox")).toBeInTheDocument();
  });

  it("renders as a link by default", () => {
    render(<Logo />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/");
  });

  it("renders as span when linkTo is empty", () => {
    render(<Logo linkTo="" />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("chatterbox")).toBeInTheDocument();
  });
});
