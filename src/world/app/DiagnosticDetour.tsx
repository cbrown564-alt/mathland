import { useState } from "react";
import { DetourId } from "../types/world";

interface DetourDefinition {
  label: string;
  title: string;
  explanation: string;
  worked: [string, string, string];
  fields: Array<{ label: string; expected: number }>;
}

const definitions: Record<DetourId, DetourDefinition> = {
  "vector-components": { label: "vector components", title: "Read the endpoint as two signed moves.", explanation: "A vector endpoint [x, y] records the horizontal move first and vertical move second.", worked: ["3 right", "4 up", "[3, 4]"], fields: [{ label: "x component of an endpoint 2 left and 5 up", expected: -2 }, { label: "y component of that endpoint", expected: 5 }] },
  "signed-arithmetic": { label: "signed arithmetic", title: "Preserve each sign, then find the net.", explanation: "Treat each matched pair as a signed contribution before adding.", worked: ["−2 × 5 = −10", "4 × 3 = +12", "net = +2"], fields: [{ label: "First contribution: −2 × 5", expected: -10 }, { label: "Net: −10 + 12", expected: 2 }] },
  "angle-cosine": { label: "angle and cosine", title: "Separate length from direction agreement.", explanation: "Cosine records directional agreement. Multiplying it by a vector length turns that agreement into a signed projected length.", worked: ["cos 60° = 0.5", "|F| = 6", "projection = 3"], fields: [{ label: "cosine of 60 degrees", expected: 0.5 }, { label: "projection of a length 6 vector at 60 degrees", expected: 3 }] },
  "weighted-sums": { label: "weights and units", title: "Keep every weight beside its matched value.", explanation: "A weight is unitless. Weight times return is still a return; adding matched contributions preserves that unit.", worked: ["0.8 × 0.05 = 0.04", "0.2 × −0.02 = −0.004", "net = 0.036"], fields: [{ label: "First weighted contribution", expected: 0.04 }, { label: "Net one-period return", expected: 0.036 }] },
};

const parsesAs = (value: string, expected: number) => value.trim() !== "" && Number.isFinite(Number(value)) && Math.abs(Number(value) - expected) < 0.0001;

interface DiagnosticDetourProps { id: DetourId; prompt: string; onFinish: () => void }

export const DiagnosticDetour = ({ id, prompt, onFinish }: DiagnosticDetourProps) => {
  const definition = definitions[id];
  const [answers, setAnswers] = useState(() => definition.fields.map(() => ""));
  const ready = definition.fields.every((field, index) => parsesAs(answers[index], field.expected));
  return <section className="world-section world-detour" aria-labelledby="detour-title"><div className="world-route-ribbon"><span>Your original move</span><strong>{prompt}</strong><small>Your horizon and entries are preserved.</small></div><div className="world-detour-card"><p className="world-local-label">Diagnostic detour · {definition.label}</p><h1 id="detour-title">{definition.title}</h1><p>{definition.explanation}</p><div className="world-detour-visual"><div><span>first move</span><strong>{definition.worked[0]}</strong></div><i>→</i><div><span>next move</span><strong>{definition.worked[1]}</strong></div><i>→</i><div className="is-result"><strong>{definition.worked[2]}</strong><small>return-ready pattern</small></div></div><div className="world-detour-work"><div className="world-detour-check">{definition.fields.map((field, index) => <label key={field.label}>{field.label}<input value={answers[index]} onChange={(event) => setAnswers((current) => current.map((value, itemIndex) => itemIndex === index ? event.target.value : value))} inputMode="decimal" /></label>)}</div><p className="world-unlock-note">{ready ? "Repair demonstrated. Return to the exact blocked move." : "Complete both fields; blank entries never count as zero."}</p><button className="world-primary-action" disabled={!ready} onClick={onFinish}>Return to my exact move <span aria-hidden="true">↩</span></button></div></div></section>;
};
