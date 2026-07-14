import { ChangeEvent, forwardRef, useState } from "react";
import { parseWorldExport, serialiseWorldExport } from "../evidence/evidenceStore";
import { AnalyticsConsent, readAnalyticsConsent, writeAnalyticsConsent } from "../operations/analytics";
import { WorldSnapshot } from "../types/world";

interface JourneyDataDialogProps {
  snapshot: WorldSnapshot;
  onRestore: (snapshot: WorldSnapshot) => void;
  onDelete: () => void;
}

export const JourneyDataDialog = forwardRef<HTMLDialogElement, JourneyDataDialogProps>(
  ({ snapshot, onRestore, onDelete }, ref) => {
    const [consent, setConsent] = useState<AnalyticsConsent>(() => readAnalyticsConsent(window.localStorage));
    const [status, setStatus] = useState("");

    const download = () => {
      const blob = new Blob([serialiseWorldExport(snapshot)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `mathland-journey-${new Date().toISOString().slice(0, 10)}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
      setStatus("A portable copy of this journey was downloaded.");
    };

    const restore = async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      try {
        const restored = parseWorldExport(await file.text());
        onRestore(restored);
        setStatus("Journey restored. Your current view now matches the imported resume point.");
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "That journey could not be restored.");
      } finally {
        event.target.value = "";
      }
    };

    const updateConsent = (next: AnalyticsConsent) => {
      writeAnalyticsConsent(window.localStorage, next);
      setConsent(next);
      setStatus(next === "granted"
        ? "Anonymous product diagnostics are enabled. Answers and written reasoning are never included."
        : "Anonymous product diagnostics are off.");
    };

    const deleteJourney = () => {
      if (!window.confirm("Delete this journey, its evidence, and its resume point from this browser?")) return;
      onDelete();
      setStatus("Journey data deleted. Mathland is ready for a fresh start.");
    };

    return <dialog ref={ref} className="world-horizon-dialog world-data-dialog" aria-labelledby="data-dialog-title">
      <form method="dialog">
        <div>
          <p className="world-local-label">Privacy & portability</p>
          <h2 id="data-dialog-title">Your journey is local and under your control.</h2>
          <p>{snapshot.evidence.length} evidence {snapshot.evidence.length === 1 ? "event" : "events"} and the exact resume point are stored in this browser. There is no Mathland account or automatic cloud sync.</p>
        </div>
        <section aria-labelledby="portable-data-title">
          <h3 id="portable-data-title">Move or back up this journey</h3>
          <p>Download a readable JSON copy, then restore it in another browser. Imports replace the current local journey only after validation.</p>
          <div className="world-button-pair">
            <button className="world-secondary-action" type="button" onClick={download}>Download journey data</button>
            <label className="world-file-action">Restore journey file<input type="file" accept="application/json,.json" onChange={restore} /></label>
          </div>
        </section>
        <section aria-labelledby="diagnostics-title">
          <h3 id="diagnostics-title">Anonymous product diagnostics</h3>
          <p>Optional diagnostics contain named product transitions such as “detour started” and the support level used. They never contain answers, explanations, evidence detail, account identifiers, or page-view mastery claims.</p>
          <label className="world-consent-control"><input type="checkbox" checked={consent === "granted"} onChange={(event) => updateConsent(event.target.checked ? "granted" : "denied")} /> Share minimised product diagnostics</label>
        </section>
        <section className="world-delete-zone" aria-labelledby="delete-title">
          <h3 id="delete-title">Delete local journey</h3>
          <p>This removes evidence and the resume point from this browser and starts a fresh anonymous journey.</p>
          <button type="button" onClick={deleteJourney}>Delete journey data</button>
        </section>
        {status && <p className="world-feedback" role="status">{status}</p>}
        <div className="world-dialog-footer"><a href="/privacy">Read the privacy summary</a><button className="world-primary-action" type="submit">Done</button></div>
      </form>
    </dialog>;
  },
);

JourneyDataDialog.displayName = "JourneyDataDialog";
