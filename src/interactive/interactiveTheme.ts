/**
 * Dark immersive theme tokens for interactive components.
 * Matches lesson-stage: warm near-black ground, white/10 borders, frosted surfaces.
 */
export const IX = {
  root: "interactive-panel w-full text-white/90",
  card: "rounded-lg border border-white/10 bg-white/[0.04]",
  cardHeader: "text-white/90",
  cardTitle: "text-xl font-bold text-white/90",
  title: "text-xl font-bold text-white/90",
  subtitle: "text-white/55",
  heading: "font-semibold text-white/90",
  label: "text-[11px] uppercase tracking-wider text-white/50",
  muted: "text-white/55",
  hint: "text-white/40 italic",
  value: "text-white/90",
  canvasWrap: "rounded-lg border border-white/10 bg-white/[0.03] overflow-hidden",
  panel: "rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur p-2",
  readout: "rounded-lg border border-white/10 bg-white/[0.04] p-3",
  surface: "bg-white/[0.04]",
  surfaceMuted: "bg-white/[0.03]",
  border: "border-white/10",
  gradientCard: "border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02]",
  gradientHero: "border-0 shadow-lg bg-gradient-to-br from-white/[0.06] to-white/[0.02]",
  gradientRow: "border border-white/10 bg-gradient-to-r from-white/[0.06] to-white/[0.02]",
  btnSelected: "border-white/20 bg-white/[0.08] text-white/90",
  btnIdle: "border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/[0.07]",
  tabList: "bg-white/5 border border-white/10",
} as const;

/** Canvas / SVG draw colors for dark immersive plots */
export const IX_COLORS = {
  grid: "rgba(255,255,255,0.08)",
  axes: "rgba(255,255,255,0.25)",
  labels: "rgba(255,255,255,0.5)",
  canvasBg: "rgba(255,255,255,0.02)",
} as const;
