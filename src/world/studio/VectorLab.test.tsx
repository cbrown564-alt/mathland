import { fireEvent, render, screen } from "@testing-library/react";
import { VectorLab } from "./VectorLab";

describe("accessible vector Studio", () => {
  test("supports a complete keyboard alternative to drag", () => {
    const onConstructed = jest.fn();
    render(<VectorLab onConstructed={onConstructed} />);
    const handle = screen.getByRole("button", { name: /F vector tip, 3 horizontally and 2 vertically/ });
    handle.focus();
    fireEvent.keyDown(handle, { key: "ArrowLeft", shiftKey: true });
    expect(handle).toHaveAttribute("aria-label", "F vector tip, 2 horizontally and 2 vertically");
    fireEvent.keyDown(handle, { key: "ArrowLeft", shiftKey: true });
    fireEvent.keyDown(handle, { key: "ArrowLeft", shiftKey: true });
    expect(screen.getAllByText(/No directional overlap/)).not.toHaveLength(0);
    expect(onConstructed).toHaveBeenCalledWith("Constructed perpendicular vectors in engineering");
  });

  test("models both 2D handles as buttons with explicit keyboard instructions", () => {
    const { container } = render(<VectorLab onConstructed={jest.fn()} />);
    expect(screen.getByRole("button", { name: /s vector tip/ })).toHaveAttribute("aria-describedby", "vector-control-instructions");
    expect(screen.getByRole("button", { name: /F vector tip/ })).toHaveAttribute("aria-describedby", "vector-control-instructions");
    expect(screen.queryByRole("slider")).not.toBeInTheDocument();
    container.querySelectorAll("marker").forEach((marker) => {
      expect(marker).toHaveAttribute("markerUnits", "userSpaceOnUse");
      expect(marker).toHaveAttribute("refX", "10");
      expect(marker).toHaveAttribute("markerWidth", "14");
      expect(marker).toHaveAttribute("markerHeight", "14");
    });
  });

  test("offers explicit numeric and preset controls", () => {
    render(<VectorLab onConstructed={jest.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /Maximum opposition/ }));
    expect(screen.getAllByText(/Negative directional overlap/)).not.toHaveLength(0);
    expect((screen.getByLabelText("F x component") as HTMLInputElement).valueAsNumber).toBeLessThan(0);
  });

  test("pins a comparison and supports undo and reset", () => {
    render(<VectorLab onConstructed={jest.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Pin comparison" }));
    fireEvent.click(screen.getByRole("button", { name: /Perpendicular/ }));
    expect(screen.getByText(/Current change: -12/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Undo" }));
    expect(screen.getByLabelText("F x component")).toHaveValue(3);
    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByLabelText("F y component")).toHaveValue(2);
  });
});
