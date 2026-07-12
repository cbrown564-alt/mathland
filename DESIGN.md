---
name: Mathland
description: A welcoming mathematical workshop for adults learning through consequential systems.
colors:
  action-mint: "#61e6b0"
  action-mint-deep: "#062c20"
  consequence-coral: "#ff7657"
  reasoning-gold: "#f1c75b"
  world-ground: "#07110f"
  studio-panel: "#0d1a17"
  primary-ink: "#eef4ec"
  secondary-ink: "#a7b3aa"
  quiet-line: "#cfe8d729"
typography:
  display:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(2.25rem, 5vw, 4.5rem)"
    fontWeight: 500
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(1.75rem, 3vw, 2.75rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.5
  data:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.45
  label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: "0.02em"
rounded:
  control: "2px"
  container: "12px"
  plot: "16px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  section: "64px"
components:
  button-primary:
    backgroundColor: "{colors.action-mint}"
    textColor: "{colors.world-ground}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "12px 18px"
    height: "48px"
  button-secondary:
    backgroundColor: "{colors.world-ground}"
    textColor: "{colors.action-mint}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "12px 18px"
    height: "48px"
  field:
    backgroundColor: "{colors.studio-panel}"
    textColor: "{colors.primary-ink}"
    typography: "{typography.data}"
    rounded: "{rounded.control}"
    padding: "10px 12px"
    height: "44px"
  horizon-chip:
    backgroundColor: "{colors.studio-panel}"
    textColor: "{colors.action-mint}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "8px 12px"
---

# Design System: Mathland

## 1. Overview

**Creative North Star: "The Instrumented Workshop"**

Mathland should feel like entering a beautifully maintained mathematical workshop at night: calm enough for concentration, alive with instruments, and organised around the object being investigated. The current deep green ground, mint action color, coral contrast, gold reasoning state, serif voice, and monospaced measurements create a distinctive foundation worth preserving. The next iteration moves that foundation away from editorial theatre and toward earned familiarity.

The representation and learner work own the largest share of every Studio screen. Orientation is compact and stable. Writing expands when a definition, derivation, theorem, worked proof, or domain explanation needs room; it does not become a huge headline simply because a new step began. Observatory moments may open the scale briefly, but they hand the learner to a dense, responsive instrument within one meaningful action.

Characters and media should make the workshop feel inhabited by serious guides. Their presence is functional: a guide points, demonstrates, compares, asks, or narrates a line of reasoning. Illustration, audio, video, and motion never compete with the mathematical state and never become the only way to access it.

**Key Characteristics:**

- Dark, high-contrast working surfaces with restrained, semantic color.
- Mathematical objects, data, and controls above editorial copy in the hierarchy.
- Compact persistent orientation: active horizon, current move, Atlas, and help.
- Familiar controls with unusually specific feedback and recovery states.
- Rare moments of spectacle, followed immediately by learner action.
- Field specialists and media used as teaching instruments, not decoration.

## 2. Colors

The palette is a dark technical landscape with three high-chroma signals; their scarcity keeps state changes legible and gives the mathematical object visual authority.

### Primary

- **Action Mint:** The primary action, current selection, active vector, focus-adjacent state, and positive evidence color. It must not wash across inactive surfaces.
- **Deep Action Mint:** Ink or tonal support when Action Mint becomes a background.

### Secondary

- **Consequence Coral:** Opposition, negative contribution, the second vector, and domain contrast. It is not a generic decorative accent.

### Tertiary

- **Reasoning Gold:** Focus outlines, cues, intermediate reasoning, and recoverable warning states. Gold means “look here and think,” not failure.

### Neutral

- **World Ground:** The persistent environmental background.
- **Studio Panel:** The working surface for controls, models, and supporting explanations.
- **Primary Ink:** Essential text and mathematical marks.
- **Secondary Ink:** Secondary prose, labels, and quiet metadata; never use it below 4.5:1 contrast for normal text.
- **Quiet Line:** Structural separation only. Prefer spacing and tonal layers when a border does not carry information.

### Named Rules

**The Three Signals Rule.** Mint means action or established state, coral means opposition or contrast, and gold means attention or reasoning. Never swap these roles between screens.

**The Ten Percent Rule.** High-chroma colors should occupy no more than roughly ten percent of an ordinary Studio screen. The Observatory may briefly exceed this when the color encodes the phenomenon.

**The No Red Failure Rule.** An incorrect attempt is not an emergency. Use gold to direct attention and reserve coral for a mathematically meaningful negative or opposing quantity unless an actual destructive/system error occurs.

## 3. Typography

**Display Font:** Newsreader (with Georgia fallback)  
**Body Font:** Newsreader (with Georgia fallback)  
**Label/Mono Font:** JetBrains Mono (with the platform monospace fallback)

**Character:** Newsreader gives mathematical explanation a humane, scholarly voice. JetBrains Mono makes labels, values, equations, and instrument state precise. The pairing remains, but its proportions change: the serif no longer turns every transition into an editorial spread, and the mono no longer shrinks essential instructions into technical marginalia.

### Hierarchy

- **Display** (500, fluid 2.25–4.5rem, 1.02): Rare Observatory opening or first-run welcome only. Maximum two lines, balanced wrapping, never used as routine step navigation.
- **Headline** (500, fluid 1.75–2.75rem, 1.08): Studio and Atlas task orientation. It should leave the mathematical object visible above the fold at common laptop sizes.
- **Title** (500, 1.35rem, 1.2): Panels, worked steps, guide interventions, and local decisions.
- **Body** (400, 1.125rem, 1.5): Explanation and domain framing, capped at 65–75 characters per line.
- **Data** (500, 0.875rem, 1.45): Equations, vector components, table values, live readouts, and concise symbolic feedback.
- **Label** (500, 0.75rem, 0.02em): Controls and short metadata. Sentence case is the default; uppercase is reserved for genuinely stable instrument labels, never used as a repeated section eyebrow.

### Named Rules

**The Object Above the Fold Rule.** On a 768px-tall Studio viewport, task orientation plus framing may consume no more than one third of the initial view. The working representation must be visible without a scroll.

**The Rare Display Rule.** No routine Studio, practice, transfer, Atlas, retrieval, or detour heading exceeds 4.5rem. If a large word crowds the task, the word gets smaller—not the task.

**The No Eyebrow Scaffold Rule.** Do not place tiny uppercase tracked labels above every heading. Use the stable progress/navigation system for location and reserve local labels for content that truly needs a category or status.

## 4. Elevation

Mathland is flat and layered by tone. Borders define plots, fields, and genuine interactive boundaries; panels use Studio Panel against World Ground. Shadows are stateful and rare: a current Atlas node or actively manipulated instrument may glow softly, but ordinary cards and buttons stay flat. Never pair a decorative wide shadow with a one-pixel border.

### Shadow Vocabulary

- **Active signal** (`0 0 22px rgba(97, 230, 176, 0.30)`): A small glow around the current mathematical node or active state only.
- **Focused workspace** (`0 24px 56px rgba(0, 0, 0, 0.24)`): Optional separation for a singular large Studio instrument on wide screens, with no decorative border-shadow pairing.

### Named Rules

**The Flat-by-Default Rule.** Surfaces are flat at rest. Elevation appears only when it clarifies focus, overlap, or current state.

**The One Working Surface Rule.** A Studio may have one dominant instrument container. Do not nest a grid of cards inside another card to manufacture hierarchy.

## 5. Components

Components use familiar web affordances and complete states. Default, hover, focus, active, disabled, loading, error, and supported-success behavior are designed together. Motion lasts 150–250ms, conveys state, and has a reduced-motion equivalent.

### Buttons

- **Shape:** Compact and precise with slightly softened corners (2px); pills are reserved for persistent chips and filters.
- **Primary:** Action Mint on World Ground ink, 48px minimum height, one clear forward action per local task.
- **Hover / Focus:** A small tonal shift on hover; a 3px Reasoning Gold focus outline with 4px offset. No bouncing or wide ambient shadow.
- **Secondary:** Transparent or World Ground with Action Mint text and a clear boundary. It must not visually compete with the primary action.
- **Disabled:** Explain the unmet condition adjacent to the control. Opacity alone is insufficient when the learner may not understand why progress is unavailable.

### Chips

- **Style:** Persistent horizon and evidence chips may use a full pill because they are compact status/control hybrids, not content containers.
- **State:** The active horizon is always named in plain language. Selecting it opens an edit route; it never silently changes from a domain switch.

### Cards / Containers

- **Corner Style:** Gently curved working containers (12px) and plots (16px). Avoid asymmetric 32px shapes and oversized decorative rounding.
- **Background:** World Ground for the environment and Studio Panel for the active working layer.
- **Shadow Strategy:** Flat by default; follow the elevation vocabulary for current state only.
- **Border:** Quiet Line for real boundaries. No colored side-stripe callouts.
- **Internal Padding:** 16–24px for panels; up to 40px only when the panel contains sustained reading or a singular worked object.

### Inputs / Fields

- **Style:** 44px minimum height, Primary Ink on Studio Panel, 2px corners, a visible Quiet Line boundary, and persistent labels.
- **Focus:** Reasoning Gold outline; never remove the native affordance without a stronger replacement.
- **Error / Disabled:** Preserve the attempted value. Point to the first meaningful divergence, show its consequence, and present a specific next action. Disabled states name the requirement that unlocks them.

### Navigation

- **Style:** A compact sticky header contains the Mathland mark, active horizon, Atlas access, and predictable help. A learner chooses the horizon once per journey; the header keeps it visible without replaying selection.
- **Progress:** Show the current mathematical move and nearby route, not a numbered editorial chapter rail. On narrow screens, expose the current move and a labelled journey control rather than a horizontally scrolling six-step strip.
- **State:** Atlas and help preserve Studio state and return focus to the exact originating control or prompt.

### Studio Instrument

The signature component couples one manipulable mathematical representation with exact controls, live readouts, component working, contextual meaning, reset/undo, and readable state. Pointer, touch, keyboard, and numeric entry change the same model. Important relationships update together so the learner can compare geometric, symbolic, and contextual consequences without translating between disconnected panels.

### Learning Feedback

Feedback occupies the location of the attempted reasoning and never clears it. The first response says what the learner’s action produced; the second localises the mismatch; progressive controls offer a cue, a comparison, a worked step, or a focused detour. Correctness is a state transition, not a green congratulation banner.

### Guide Intervention

A guide intervention includes a restrained portrait or identifying mark, the guide’s name and professional role, one precise observation or question, and an optional tool, illustration, audio clip, or short video. Media never autoplay. Captions/transcripts and a complete text-plus-interactive path are mandatory. Guide interventions appear inside the current task flow, not as floating mascot bubbles.

### Transfer Orientation

Before a domain switch, a compact orientation panel answers four questions: why this domain is appearing, what structure stays fixed, which nouns/units are new, and which assumptions simplify the case. The learner may inspect a worked domain example, open a glossary, choose a mathematically equivalent alternate context, or defer without being trapped. Evidence distinguishes independent, cued, worked, deferred, and substituted transfer.

## 6. Do's and Don'ts

### Do:

- **Do** put the mathematical representation, working, and feedback above the fold in every Studio.
- **Do** preserve Action Mint, Consequence Coral, and Reasoning Gold as stable semantic signals.
- **Do** choose the horizon once per journey, show it compactly in the header, and provide a deliberate edit route.
- **Do** let wrong answers branch into observation, cue, comparison, worked step, detour, and fresh retry while preserving the learner’s work.
- **Do** separate domain orientation from the mathematical transfer or retrieval attempt.
- **Do** include definitions, derivations, theorems, sustained explanations, and worked reasoning whenever they are the strongest medium.
- **Do** use guides, illustration, audio, and video only when they add a way of seeing or reasoning that the existing modalities cannot.
- **Do** test every essential interaction at 320, 360, 768, and 1440 CSS pixels with keyboard, touch, zoom, reduced motion, and a readable alternative.

### Don't:

- **Don't** create “editorial spectacle that crowds out work” with oversized words, poster pacing, or a new full-viewport introduction for every step.
- **Don't** rely on “novelty without orientation”; tour unfamiliar patterns and keep help, horizon, current move, and return paths stable.
- **Don't** ship “underpowered interaction theatre” that merely animates an explanation or produces a number without supporting comparison, exact calculation, reasoning, and revision.
- **Don't** build “punitive correctness gates” that repeat “not yet,” erase work, or block progress without a diagnostic next move.
- **Don't** make “surprise domain switches”; frame finance and climate language before using them to assess transfer or retrieval.
- **Don't** accept “active-learning shallowness”; interaction does not replace mathematical depth, formalism, proof, or careful prose.
- **Don't** use “silent or decorative media”; characters and media must teach, remain controllable, and have complete accessible alternatives.
- **Don't** use colored side-stripe borders, gradient text, decorative glass cards, decorative grid backgrounds, 32px container radii, or border-plus-wide-shadow ghost cards.
- **Don't** place tiny uppercase tracked eyebrows or numbered section markers above every block. Location belongs to the navigation system, not repeated typographic scaffolding.
