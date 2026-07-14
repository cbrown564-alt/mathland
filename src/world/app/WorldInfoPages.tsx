import { ReactNode } from "react";
import { Link } from "react-router-dom";
import "./world.css";

interface WorldInfoPageProps {
  title: string;
  lede: string;
  children: ReactNode;
}

const WorldInfoPage = ({ title, lede, children }: WorldInfoPageProps) => <div className="world-root world-info-root">
  <header className="world-info-header"><Link className="world-wordmark" to="/" aria-label="Return to Mathland"><i aria-hidden="true">∴</i><span>MATHLAND<small>OPEN MATHEMATICAL WORLD</small></span></Link><Link to="/">Return to the world</Link></header>
  <main className="world-info-page"><p className="world-local-label">Mathland</p><h1>{title}</h1><p className="world-lede">{lede}</p>{children}</main>
</div>;

export const PrivacyPage = () => <WorldInfoPage title="Privacy follows the learning evidence." lede="Mathland launches without accounts, advertising, profiling, or automatic cloud sync.">
  <section><h2>What stays on this device</h2><p>Your active horizon, exact resume point, diagnostic detours, retrieval date, and descriptive evidence are stored in local browser storage. Written explanations and calculation attempts are not sent anywhere by default.</p></section>
  <section><h2>Optional product diagnostics</h2><p>Diagnostics are off by default. If you opt in, Mathland may send a small allow-listed event such as a horizon change, support level, or detour transition when a deployment has configured a diagnostics endpoint. Answers, free text, persistent user identifiers, and page-view-as-mastery events are excluded. Operational logs are retained for no more than 30 days.</p></section>
  <section><h2>Control and portability</h2><p>Open <strong>Data</strong> in the Mathland header to export a readable JSON copy, restore it in another browser, change diagnostics consent, or delete the journey. Deleting creates an empty local journey; it does not depend on a support request.</p></section>
  <section><h2>Accounts and age boundary</h2><p>No account is required or offered in this release. The product is designed for adults. Any future account or cloud-sync system requires a separate privacy review, explicit consent and deletion contract, and a migration that preserves anonymous use.</p></section>
</WorldInfoPage>;

export const SupportPage = () => <WorldInfoPage title="Recover the journey before losing the goal." lede="Most support paths are local, reversible, and preserve the learner’s mathematical work.">
  <section><h2>If a view will not open</h2><p>Reload Mathland first. The last meaningful action is stored after each transition. If the issue continues, use Data to download the journey before deleting local state.</p></section>
  <section><h2>If a domain is blocking the mathematics</h2><p>Use the stated defer or equivalent-context path. Domain deferral does not erase work and does not create transfer evidence.</p></section>
  <section><h2>If assistive technology cannot complete a move</h2><p>Every essential drag action has keyboard and exact numeric alternatives. Report the current move, browser, assistive technology, and blocked control—but do not include calculation answers or personal information.</p></section>
  <section><h2>Contact</h2><p>Email <a href="mailto:hello@mathland.com">hello@mathland.com</a>. Include the current move and browser version. Journey exports are readable and may contain learning evidence, so attach one only if you choose to share it.</p></section>
</WorldInfoPage>;

export const NotFoundPage = () => <WorldInfoPage title="That route is outside the current world." lede="No journey data was changed.">
  <section><h2>Return safely</h2><p>The production Atlas currently opens one validated region around dot product, normalisation, and projection. Return to Mathland to resume the exact saved move.</p><Link className="world-primary-action world-inline-link" to="/">Return to Mathland</Link></section>
</WorldInfoPage>;
