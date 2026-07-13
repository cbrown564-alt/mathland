# Hierarchy, rhythm, and pacing in Mathland experiences

**Status:** active implementation reference  
**Evidence source:** the dot-product vertical-slice revisions completed in July 2026  
**Scope:** applying the existing Mathland design direction to Atlas, Studio, Observatory, transfer, detour, and retrieval surfaces

This guide records what changed during the visual revision of **One operation, three worlds**, why those changes improved the experience, and how to apply the same principles elsewhere. It is a companion to the [Mathland design system](../../DESIGN.md), not a new visual strategy. Product doctrine and experience architecture remain authoritative.

The central lesson is simple:

> A learning sequence should change visual mode when the learner changes cognitive mode.

Hierarchy, rhythm, and pacing are therefore part of the teaching design. They are not a finishing layer applied after the mathematical work is complete.

## What was wrong

The initial revision contained the right learning actions but presented too many of them with the same visual grammar:

- a large heading introduced each step;
- theory appeared in another panel;
- every activity became a similarly sized bordered card;
- controls, help, and continuation actions sat at nearly identical visual weights;
- local spacing was improvised instead of derived from shared grid lines and relational gaps;
- large interaction targets were allowed to dominate the visual object;
- supporting media occupied space without a sufficiently clear internal hierarchy.

The result was technically complete but tiring to scan. A learner had to repeatedly reconstruct what mattered, what kind of thinking was expected, and where to act. Repeated cards did not create progression; they made every moment feel equivalent.

## What changed

### 1. The learning sequence became a sequence of visual modes

The calculation page now moves through five distinct modes:

1. **See** — a compact worked example exposes every contribution.
2. **Complete** — a paired faded example asks for one missing result.
3. **Work** — the independent calculation becomes the dominant full-width workbench.
4. **Translate** — geometry-to-components work uses a quieter, open surface.
5. **Explain** — reasoning receives a distinct writing-oriented surface with more vertical breathing room.

The DOM order remains the learning order. The visual composition changes because the learner's responsibility changes.

### 2. Theory became a reference strip, not another destination

The formal definitions were reduced from a large nested panel to a compact reference band. Its heading, explanation, formulas, and optional derivation share stable grid lines and remain visually subordinate to the learner's work.

**Rationale:** theory should be available at the point of use without delaying the first meaningful action or competing with it for prominence.

### 3. The independent attempt became the dominant surface

The independent calculation now spans the full content width. The prompt and mathematical expression occupy the left column; matched-product inputs and the check action occupy the right. Their vertical centres align.

**Rationale:** the largest surface should belong to the most consequential learner action, not to explanatory copy or page chrome.

### 4. Related preparation was paired

The worked and faded examples share one horizontal beat. They remain distinct but read as demonstration followed immediately by completion.

**Rationale:** spatial adjacency communicates pedagogical relationship. It reduces scroll distance and makes the fading of support visible rather than merely stated.

### 5. Reflection received slower spacing

The explanation form deliberately uses more space between:

- reasoning criteria and the choice group;
- the choice group and writing prompt;
- prompt and textarea;
- textarea and the check action;
- the completed form and page-level continuation.

**Rationale:** calculating and explaining have different tempos. Dense numeric controls support rapid comparison; writing needs enough separation to let the learner read, compose, and review without the form feeling compressed.

### 6. Alignment was measured, not eyeballed

The revision established shared outer edges, internal insets, and gutters, then inspected actual browser geometry. A CSS specificity error had caused an absolutely positioned step number to consume a grid cell, shifting the prompt right and wrapping the form below. The page looked “off” because its underlying placement was off.

**Rationale:** visual QA must inspect layout geometry and the cascade, not rely exclusively on screenshots. Small selector conflicts can undo an otherwise sound composition.

### 7. Interaction size was separated from visual weight

Vector handles retain large pointer and keyboard targets while becoming visually transparent until hover or focus. Arrowheads use fixed plot-space units rather than scaling with stroke width. Vector strokes became thinner and arrow tips terminate at the mathematical endpoint.

**Rationale:** accessibility targets should be generous, but the visible instrument should remain mathematically precise. Hit area and rendered mark do not need to be the same size.

### 8. Specialist media became a composed teaching intervention

Vera's intervention was reorganised into:

- a full-width guide introduction;
- a distinct audio region;
- a larger geometric projection figure;
- an optional transcript rather than permanently expanded prose.

Vera now uses a baked ElevenLabs clip generated with her registered voice. The API key remains outside browser code, audio does not autoplay, and the transcript and live diagram preserve the complete non-audio path.

**Rationale:** media earns space by teaching a mathematical way of seeing. Its controls, transcript, and visual explanation need their own hierarchy rather than being compressed into a generic card.

## Composition rules

### Give each page one dominant responsibility

Identify the most important learner action before laying out the page. That action receives the strongest combination of scale, position, contrast, and space. Supporting material should not accidentally become louder because it contains more prose.

Examples:

- Observatory: the phenomenon is dominant; the handoff to action is immediate.
- Studio instrument: the changing mathematical object is dominant.
- Practice: the independent attempt is dominant.
- Transfer: the new case and the learner's translation work share dominance.
- Atlas: route orientation and next meaningful territory dominate, not decorative geography.
- Retrieval: the memory attempt dominates after minimal domain orientation.

### Match composition to cognitive mode

Do not express an entire page as a homogeneous card stack. Use the smallest set of compositions that communicates real changes in activity:

- **reference strip** for definitions, assumptions, or compact theory;
- **paired beat** for worked-to-faded support;
- **workbench** for a consequential construction or calculation;
- **split comparison** for source/target, case/work, or representation/interpretation;
- **open reflection surface** for explanation;
- **route map** only when relationships and direction are the actual content.

Variation must explain the learning structure. Alternating layouts for decoration is not pacing.

### Keep orientation compact

Routine task orientation should not consume more than roughly one third of a 768px-tall Studio viewport. A representation, example, or actionable control should be visible in the initial view.

Large display typography is reserved for a genuine Observatory opening or first-run welcome. Practice, transfer, retrieval, and routine Studio transitions use task-scale headings.

### Use one alignment system per page

Establish and preserve:

- one main content edge;
- one opposite content edge;
- a consistent wide-screen gutter between paired regions;
- one internal inset for dominant work surfaces;
- intentional exceptions only where open space creates hierarchy.

Current vertical-slice reference values:

| Relationship | Reference value |
| --- | ---: |
| Narrow-screen outer edge | 16px |
| Narrow-screen workbench inset | 24px |
| Wide-screen paired-region gutter | approximately 22–24px |
| Compact control gap | 8–12px |
| Related group gap | 16–20px |
| Major learning-beat gap | approximately 22–24px |
| Page-level transition gap | approximately 40–48px |

These are relational anchors, not a mandate to hardcode identical values everywhere. The important rule is that tighter gaps mean stronger relationship and larger gaps mark a change of mode.

### Align by meaning, not merely by bounding box

For a two-column workbench:

- align the prompt and work areas by their visual centres when both are compact;
- align at the top when one side can expand through feedback or recovery;
- keep labels and fields on consistent baselines;
- keep step markers out of layout flow;
- prevent decorative text from affecting grid placement;
- set `min-width: 0` on grid children that contain prose or controls.

### Group controls before spacing them

Controls that perform one local task should live in an explicit action group. Do not rely on incidental inline layout or element margins to separate adjacent buttons and help links.

Use tighter spacing within a control group and a larger gap before feedback, reflection, or navigation. Page-level continuation must never look like another answer control.

### Let completion change state, not geometry

Completion may change colour, copy, or evidence state. It should not cause a large layout jump. Reserve stable space for likely feedback where practical, and preserve learner inputs through errors and detours.

## Responsive pacing

Responsive design is structural, not a smaller desktop composition.

On narrow screens:

- preserve DOM and learning order;
- collapse paired and split regions into one column;
- use one shared outer edge;
- preserve the workbench's internal inset;
- keep related controls grouped;
- allow formulas and labels to wrap without forcing horizontal scroll;
- avoid shrinking touch targets to preserve a desktop silhouette;
- keep the first meaningful object or action reasonably close to the opening.

On wide screens:

- use additional width to reveal relationships, not to inflate headings;
- pair consecutive support states when their relationship matters;
- keep long-form explanation at readable line lengths;
- avoid empty columns created by accidental grid placement;
- inspect 768px-tall laptop views, not only large desktop screenshots.

## Common failure modes

Reject these during review:

- one bordered card after another with no change in learning mode;
- a theory panel larger or louder than the work it supports;
- every step receiving the same heading scale and padding;
- step numbers or decorative labels participating in the grid unexpectedly;
- large accessible hit targets obscuring the mathematical mark;
- generic browser speech when a registered specialist voice is part of the product language;
- permanently expanded transcripts crowding the diagram or control they support;
- help links touching primary actions or appearing as equal alternatives;
- textarea labels, fields, and submission actions with only default element margins between them;
- paired columns with unrelated top edges, baselines, or internal insets;
- desktop layouts that merely squeeze at mobile widths;
- visual QA that checks screenshots without checking computed geometry and overflow.

## Page adaptation workflow

Use this sequence when revising another Mathland page.

### 1. Name the page's cognitive beats

Write a short verb for each meaningful learner mode: predict, inspect, construct, calculate, compare, translate, explain, retrieve, orient. Merge beats that do not warrant a distinct change of responsibility.

### 2. Choose the dominant beat

Decide which learner action owns the page. Give it the dominant surface before styling supporting content.

### 3. Map beats to compositions

Choose reference strip, pair, workbench, split view, reflection surface, or route map based on the relationship being taught. Do not start from a card component.

### 4. Establish grid lines and gap tiers

Mark outer edges, internal insets, column gutters, compact gaps, related-group gaps, and major transitions. Check that every exception communicates hierarchy.

### 5. Separate visual and interaction geometry

For plots and direct manipulation, inspect stroke, marker, handle, label, focus, and hit-area geometry independently.

### 6. Collapse structurally

Define narrow-screen order and grouping explicitly. Verify at 320, 390, 768, and a representative wide viewport.

### 7. Inspect the live browser

Review both screenshots and measured geometry:

- bounding boxes and shared edges;
- prompt/work centre or top alignment;
- actual gaps between semantic groups;
- scroll width versus viewport width;
- object visibility in the first viewport;
- focus and hover states;
- feedback and completed states;
- long labels, wrapped prose, and empty inputs.

### 8. Add regression checks

Protect structural contracts where they matter. Useful browser assertions include:

- prompt left of work area on wide screens;
- aligned visual centres or top edges;
- no horizontal document overflow;
- controls and labels remaining inside their parent region;
- dominant object visible within the target viewport;
- narrow-screen regions sharing the intended outer edge.

## Review checklist

Before handing off a revised page, answer:

### Hierarchy

- Can a learner identify the primary action in under two seconds?
- Is the largest surface the most consequential action?
- Is theory available without becoming the destination?
- Are page-level and local actions visually distinct?

### Rhythm

- Do related items use tighter gaps than unrelated stages?
- Does each change in composition correspond to a change in cognitive mode?
- Are controls grouped deliberately?
- Does writing have more breathing room than compact calculation?

### Alignment

- Do major regions share stable outer edges?
- Are paired regions aligned by top or visual centre intentionally?
- Do fields share baselines and consistent heights?
- Are step markers and decoration removed from layout flow?
- Have computed positions been inspected after CSS cascade changes?

### Pacing

- Is meaningful learner work visible soon enough?
- Does support visibly fade rather than repeat the same container?
- Is the independent attempt given sufficient prominence?
- Does continuation sit far enough away from the local task?

### Responsive and accessible behaviour

- Does the learning order survive the single-column collapse?
- Are hit areas generous without visually overwhelming the object?
- Is focus visible and readable?
- Do labels wrap inside their regions?
- Is there no horizontal overflow from 320px upward?
- Do audio, diagrams, transcripts, and non-media paths remain equivalent in meaning?

## What this document does not decide

This guide does not define a universal page template, a new lesson schema, or a mandate to restyle the legacy application wholesale. Each future page still begins from a learner capability and an observable action. These principles should be applied territory by territory, with browser review and learner evidence, inside the accepted Atlas/Studio/Observatory architecture.
