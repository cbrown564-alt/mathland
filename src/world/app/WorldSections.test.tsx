import { fireEvent, render, screen } from "@testing-library/react";
import { ObservatorySection, PracticeSection, RetrievalSection, TourSection, TransferSection, VeraIntervention } from "./WorldSections";

describe("revised world learning contracts", () => {
  test("the first-run tour is skippable and completes only after all six moves", () => {
    const onComplete = jest.fn();
    const onSkip = jest.fn();
    render(<TourSection onComplete={onComplete} onSkip={onSkip} />);
    expect(screen.getByText(/move 1 of 6/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Skip tour/ }));
    expect(onSkip).toHaveBeenCalled();
  });

  test("the tour completes after demonstrating all six moves", () => {
    const onComplete = jest.fn();
    render(<TourSection onComplete={onComplete} onSkip={jest.fn()} />);
    const actions = [
      /predict the sign/i, /Move force to a right angle/i, /Check 6/i,
      /Show one focused cue/i, /Record this tour move/i,
    ];
    actions.forEach((name) => {
      fireEvent.click(screen.getByRole("button", { name }));
      fireEvent.click(screen.getByRole("button", { name: /Continue tour/ }));
    });
    fireEvent.click(screen.getByRole("button", { name: /Finish the tour/ }));
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  test("wrong calculation preserves work and begins progressive teaching", () => {
    const onRecord = jest.fn();
    render(<PracticeSection events={[]} onRecord={onRecord} onDetour={jest.fn()} onContinue={jest.fn()} />);
    fireEvent.change(screen.getByLabelText("First matched product"), { target: { value: "8" } });
    fireEvent.change(screen.getByLabelText("Second matched product"), { target: { value: "-3" } });
    fireEvent.change(screen.getByLabelText("Net dot product"), { target: { value: "5" } });
    fireEvent.click(screen.getByRole("button", { name: "Check all three values" }));
    expect(screen.getByDisplayValue("8")).toBeInTheDocument();
    expect(screen.getByText(/Teaching step 1 of 6/)).toBeInTheDocument();
    expect(onRecord).toHaveBeenCalledWith("attempted", expect.stringContaining("8, -3, 5"), "none");
  });

  test("records the recovery support level that was actually shown", () => {
    const onRecord = jest.fn();
    render(<PracticeSection events={[]} onRecord={onRecord} onDetour={jest.fn()} onContinue={jest.fn()} />);
    fireEvent.change(screen.getByLabelText("First matched product"), { target: { value: "8" } });
    fireEvent.change(screen.getByLabelText("Second matched product"), { target: { value: "-3" } });
    fireEvent.change(screen.getByLabelText("Net dot product"), { target: { value: "5" } });
    fireEvent.click(screen.getByRole("button", { name: "Check all three values" }));
    fireEvent.change(screen.getByLabelText("First matched product"), { target: { value: "-8" } });
    fireEvent.change(screen.getByLabelText("Net dot product"), { target: { value: "-11" } });
    fireEvent.click(screen.getByRole("button", { name: "Check all three values" }));
    expect(onRecord).toHaveBeenCalledWith("supported", expect.stringContaining("Calculation"), "observation");
  });

  test("Observatory requires noticing in all three systems before handoff", () => {
    const onContinue = jest.fn();
    render(<ObservatorySection predicted={false} onPredict={jest.fn()} onContinue={onContinue} />);
    const continueButton = screen.getByRole("button", { name: /Test the claim in the Studio/ });
    expect(continueButton).toBeDisabled();
    fireEvent.click(screen.getByLabelText(/Energy transferred/));
    fireEvent.click(screen.getByLabelText(/Direction similarity/));
    fireEvent.click(screen.getByLabelText(/Weighted realised return/));
    fireEvent.click(screen.getByRole("button", { name: "It becomes negative" }));
    expect(continueButton).toBeEnabled();
  });

  test("Vera uses her baked ElevenLabs voice with an accessible transcript", () => {
    const { container } = render(<VeraIntervention />);
    expect(screen.getByText(/Vera voice · ElevenLabs/)).toBeInTheDocument();
    expect(screen.getByText(/Read transcript/)).toBeInTheDocument();
    expect(container.querySelector("audio source")).toHaveAttribute("src", "/audio/world/vera-projection-lens.mp3");
  });

  test("finance can be deferred without recording transfer", () => {
    const onTransfer = jest.fn();
    const onDefer = jest.fn();
    render(<TransferSection events={[]} onTransfer={onTransfer} onDefer={onDefer} onDetour={jest.fn()} onContinue={jest.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /Defer finance/ }));
    expect(onDefer).toHaveBeenCalled();
    expect(onTransfer).not.toHaveBeenCalled();
  });

  test("retrieval preview does not record delayed evidence and supports substitution", () => {
    const onRecord = jest.fn();
    const onSubstitute = jest.fn();
    render(<RetrievalSection events={[]} dueAt={new Date(Date.now() + 86_400_000).toISOString()} onRecord={onRecord} onSubstitute={onSubstitute} onAtlas={jest.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /equivalent context/ }));
    expect(onSubstitute).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: /Start the memory attempt/ }));
    fireEvent.change(screen.getByLabelText("Weighted index"), { target: { value: "1.7" } });
    fireEvent.click(screen.getByRole("button", { name: "Check retrieval" }));
    expect(screen.getByText(/No delayed-retrieval evidence was recorded/)).toBeInTheDocument();
    expect(onRecord).not.toHaveBeenCalled();
  });
});
