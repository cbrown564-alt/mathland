import { Component, ErrorInfo, ReactNode } from "react";
import { reportOperationalError } from "./monitoring";

interface Props { children: ReactNode }
interface State { failed: boolean }

export class WorldErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    reportOperationalError(error, `react:${(info.componentStack ?? "unknown").slice(0, 60)}`);
  }

  render(): ReactNode {
    if (!this.state.failed) return this.props.children;
    return <main className="world-system-fallback">
      <p>Mathland kept your saved journey, but this view could not be opened.</p>
      <h1>Return to the last stable move.</h1>
      <div>
        <button type="button" onClick={() => window.location.assign("/")}>Reload Mathland</button>
        <a href="/support">Open support</a>
      </div>
    </main>;
  }
}
