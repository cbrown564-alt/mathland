import { fireEvent, render, screen } from "@testing-library/react";
import { VectorLab } from "./VectorLab";

describe("accessible vector Studio", () => {
  test("supports a complete keyboard alternative to drag", () => {
    const onConstructed = jest.fn();
    render(<VectorLab onConstructed={onConstructed} />);
    const handle = screen.getByRole("slider", { name: "Force vector tip" });
    handle.focus();
    fireEvent.keyDown(handle, { key: "ArrowLeft", shiftKey: true });
    expect(handle).toHaveAttribute("aria-valuetext", "Force F is 2 horizontally and 2 vertically");
    fireEvent.keyDown(handle, { key: "ArrowLeft", shiftKey: true });
    fireEvent.keyDown(handle, { key: "ArrowLeft", shiftKey: true });
    expect(screen.getAllByText(/No directional overlap/)).not.toHaveLength(0);
    expect(onConstructed).toHaveBeenCalledWith("Constructed perpendicular vectors");
  });

  test("offers explicit numeric and preset controls", () => {
    render(<VectorLab onConstructed={jest.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /Maximum resistance/ }));
    expect(screen.getAllByText(/Negative directional overlap/)).not.toHaveLength(0);
    expect(screen.getByLabelText("Fₓ")).toHaveValue(-4);
  });

  test("pins a comparison and supports undo and reset", () => {
    render(<VectorLab onConstructed={jest.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Pin comparison" }));
    fireEvent.click(screen.getByRole("button", { name: /Sideways/ }));
    expect(screen.getByText(/Current change: -12 J/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Undo" }));
    expect(screen.getByLabelText("Fₓ")).toHaveValue(3);
    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByLabelText("Fᵧ")).toHaveValue(2);
  });
});
