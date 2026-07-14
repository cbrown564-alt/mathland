import { fireEvent, render, screen } from "@testing-library/react";
import { NormalisationSection, ProjectionStudio } from "./AdjacentStudios";
import { DiagnosticDetour } from "./DiagnosticDetour";

describe("connected neighbouring Studios", () => {
  test("requires an actual unit-vector construction before recording AI normalisation", () => {
    const onRecord = jest.fn();
    render(<NormalisationSection events={[]} onRecord={onRecord} onDetour={jest.fn()} onContinue={jest.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Check normalisation" }));
    expect(onRecord).not.toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText("Normalised x component"), { target: { value: "0.6" } });
    fireEvent.change(screen.getByLabelText("Normalised y component"), { target: { value: "0.8" } });
    fireEvent.click(screen.getByLabelText(/Magnitude, so/));
    fireEvent.click(screen.getByRole("button", { name: "Check normalisation" }));
    expect(onRecord).toHaveBeenCalledWith(expect.stringContaining("distinguished raw dot product"));
  });

  test("constructs a projection from the current signed length", () => {
    const onRecord = jest.fn();
    render(<ProjectionStudio events={[]} onRecord={onRecord} onDetour={jest.fn()} onAtlas={jest.fn()} />);
    fireEvent.change(screen.getByLabelText("Projection signed length"), { target: { value: "3" } });
    fireEvent.change(screen.getByLabelText("Projection x component"), { target: { value: "3" } });
    fireEvent.change(screen.getByLabelText("Projection y component"), { target: { value: "0" } });
    fireEvent.click(screen.getByRole("button", { name: "Check projection" }));
    expect(onRecord).toHaveBeenCalledWith(expect.stringContaining("Projected [3, 4]"));
  });

  test("never treats blank detour fields as zero", () => {
    render(<DiagnosticDetour id="signed-arithmetic" prompt="Preserve the signs" onFinish={jest.fn()} />);
    expect(screen.getByRole("button", { name: /Return to my exact move/ })).toBeDisabled();
    expect(screen.getByText(/blank entries never count as zero/i)).toBeInTheDocument();
  });
});
