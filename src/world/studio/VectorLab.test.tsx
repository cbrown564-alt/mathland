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
    fireEvent.click(screen.getByRole("button", { name: "Resisting" }));
    expect(screen.getAllByText(/Negative directional overlap/)).not.toHaveLength(0);
    expect(screen.getByLabelText("Fₓ")).toHaveValue(-3);
  });
});
