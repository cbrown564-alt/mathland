import { JourneyStep } from "../types/world";

export const stepNames: Record<JourneyStep, string> = {
  entry: "Choose a horizon",
  observatory: "Notice",
  studio: "Construct",
  practice: "Calculate & explain",
  transfer: "Transfer",
  atlas: "Orient",
  retrieval: "Retrieve",
};
