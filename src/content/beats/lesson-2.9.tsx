import type { BeatLesson } from "./schema";

/**
 * Lesson 2.9 — Vera · Forest Mapping Capstone
 * Archetypes: couple → do (big) · bespoke escape hatch visual
 */

interface ForestMapState {
  visitor: [number, number];
  waterfall: [number, number];
  rest: [number, number];
  camera: [number, number];
  showTrails: boolean;
  showCamera: boolean;
  showFlow: boolean;
}

/** Bespoke capstone map — trails, camera points, visitor flow as vectors. */
function ForestMapVisual({ state }: { state: ForestMapState }) {
  const W = 460;
  const H = 380;
  const UNIT = 28;
  const CX = 80;
  const CY = H - 60;

  const toPx = (x: number, y: number) => ({ x: CX + x * UNIT, y: CY - y * UNIT });

  const visitor = toPx(state.visitor[0], state.visitor[1]);
  const waterfall = toPx(state.waterfall[0], state.waterfall[1]);
  const rest = toPx(state.rest[0], state.rest[1]);
  const camera = toPx(state.camera[0], state.camera[1]);

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full select-none" role="img" aria-label="National park mapping capstone">
        <defs>
          <marker id="fm-trail" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L7,3 L0,6 Z" fill="#a3e635" />
          </marker>
        </defs>
        <path d={`M 0 ${CY + 20} Q 120 ${CY - 40} 240 ${CY + 10} T ${W} ${CY - 30} L ${W} ${H} L 0 ${H} Z`} fill="rgba(34,197,94,0.08)" />
        <path d={`M 0 ${CY + 50} Q 200 ${CY + 20} 400 ${CY + 40} L ${W} ${H} L 0 ${H} Z`} fill="rgba(22,163,74,0.06)" />
        {[[140, 60], [200, 90], [320, 70], [380, 110], [100, 130]].map(([tx, ty], i) => (
          <circle key={i} cx={tx} cy={ty} r={4} fill="rgba(34,197,94,0.35)" />
        ))}
        {state.showTrails && (
          <g>
            <line x1={CX} y1={CY} x2={rest.x} y2={rest.y} stroke="#a3e635" strokeWidth={3} strokeDasharray="6 4" markerEnd="url(#fm-trail)" />
            <line x1={rest.x} y1={rest.y} x2={waterfall.x} y2={waterfall.y} stroke="#a3e635" strokeWidth={3} strokeDasharray="6 4" markerEnd="url(#fm-trail)" />
          </g>
        )}
        {state.showCamera && (
          <line x1={camera.x} y1={camera.y} x2={camera.x + 40} y2={camera.y - 30} stroke="#fbbf24" strokeWidth={2} strokeDasharray="4 3" />
        )}
        <circle cx={CX} cy={CY} r={6} fill="#f4623c" />
        <text x={CX - 4} y={CY + 22} fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="monospace">center</text>
        <circle cx={rest.x} cy={rest.y} r={5} fill="#5aa2e0" />
        <text x={rest.x - 14} y={rest.y - 10} fill="#5aa2e0" fontSize="10" fontFamily="monospace">rest</text>
        <circle cx={waterfall.x} cy={waterfall.y} r={5} fill="#5aa2e0" />
        <text x={waterfall.x - 8} y={waterfall.y - 10} fill="#5aa2e0" fontSize="10" fontFamily="monospace">falls</text>
        {state.showCamera && (
          <>
            <circle cx={camera.x} cy={camera.y} r={5} fill="#fbbf24" />
            <text x={camera.x - 16} y={camera.y + 18} fill="#fbbf24" fontSize="10" fontFamily="monospace">camera</text>
          </>
        )}
        {state.showFlow && (
          <circle cx={visitor.x} cy={visitor.y} r={8} fill="none" stroke="rgba(244,98,60,0.5)" strokeWidth={2} strokeDasharray="3 2" />
        )}
      </svg>
      <div className="mt-2 flex flex-wrap gap-2 px-1">
        {state.showTrails && (
          <span className="rounded-lg border border-lime-400/25 bg-lime-400/[0.06] px-2.5 py-1 font-mono text-xs text-lime-100/80">
            trail: 5 + 5 = 10 units (L₂)
          </span>
        )}
        {state.showCamera && (
          <span className="rounded-lg border border-amber-400/25 bg-amber-400/[0.06] px-2.5 py-1 font-mono text-xs text-amber-100/80">
            cameras: independent coverage
          </span>
        )}
      </div>
    </div>
  );
}

export const forestCapstoneLesson: BeatLesson<ForestMapState> = {
  meta: {
    id: "2.9",
    characterId: "vera",
    title: "Forest Mapping Capstone",
    oneLine: "Synthesize every vector tool into a real national-park mapping project.",
    objectives: [
      "Apply vector addition and scalar multiplication to design trail systems",
      "Use vector norms and dot products for distance calculations",
      "Implement linear combinations and independence for optimal resource placement",
      "Create coordinate systems using basis and dimension concepts",
    ],
  },
  visual: { render: (s) => <ForestMapVisual state={s} /> },
  beats: [
    {
      kind: "couple",
      id: "mission",
      eyebrow: "Vera · Capstone · Beat 1",
      title: "The ultimate mapping adventure",
      predict: {
        prompt: "You're designing a national park map. Which vector concept helps optimize wildlife camera placement?",
        options: [
          { label: "Linear independence", value: "indep" },
          { label: "The dot product alone", value: "dot" },
          { label: "Unit vectors only", value: "unit" },
        ],
        nudge: {
          indep: "You said independence — scroll and see how coverage vectors must not be redundant.",
          dot: "You said dot product — useful for similarity, but placement needs non-redundant directions.",
          unit: "You said unit vectors — length matters, but redundancy is the key camera question.",
        },
      },
      passages: [
        {
          id: "m1",
          eyebrow: "The project · 1",
          md: "Time for the ultimate vector adventure! I'm designing a comprehensive mapping system for a new national park using *every* concept we've mastered — addition for trail design, norms for distances, independence for camera networks, and basis theory for coordinate systems.",
          state: {
            visitor: [2, 3],
            waterfall: [6, 8],
            rest: [3, 4],
            camera: [4, 6],
            showTrails: true,
            showCamera: false,
            showFlow: false,
          },
        },
        {
          id: "m2",
          eyebrow: "2",
          md: "**Part A — Trails:** Design a path from the visitor center [0,0] to the waterfall [6,8] with a rest stop at [3,4]. Vector addition breaks the journey into legs. The L₂ norm gives total trail distance: 5 units + 5 units = 10 units.",
          state: {
            visitor: [2, 3],
            waterfall: [6, 8],
            rest: [3, 4],
            camera: [4, 6],
            showTrails: true,
            showCamera: false,
            showFlow: false,
          },
        },
        {
          id: "m3",
          eyebrow: "3",
          md: "**Part B — Cameras:** Place wildlife cameras using linear independence — each camera's coverage vector must add genuinely new information. Redundant cameras waste resources; independent placements maximize coverage of the park.",
          state: {
            visitor: [2, 3],
            waterfall: [6, 8],
            rest: [3, 4],
            camera: [5, 7],
            showTrails: false,
            showCamera: true,
            showFlow: false,
          },
        },
        {
          id: "m4",
          eyebrow: "4",
          md: "**Part C — Visitor flow:** Analyze movement patterns with basis theory. Choose a coordinate system aligned with main trails, express visitor paths as linear combinations, and optimize signage placement. This is where all our vector tools come together.",
          state: {
            visitor: [4, 5],
            waterfall: [6, 8],
            rest: [3, 4],
            camera: [5, 7],
            showTrails: true,
            showCamera: true,
            showFlow: true,
          },
        },
      ],
      check: {
        question: "In Part A, the trail from [0,0] to [3,4] to [6,8] has total L₂ distance of…",
        options: [
          "10 units — 5 units per leg",
          "14 units — straight-line distance",
          "18 units — sum of coordinates",
          "8 units — incorrect Pythagorean sum",
        ],
        correctAnswer: 0,
        explanation: "|[3,4]| = 5 and |[3,4]| from rest to waterfall = 5. Total trail distance: 5 + 5 = 10 units using the L₂ norm on each segment.",
      },
    },
    {
      kind: "do",
      id: "climax",
      eyebrow: "Beat 2 · Your turn",
      title: "Build the complete map",
      intro: "This is the full capstone in your hands. Use the vector playground to design trails, place coverage vectors, and explore how every Module 2 concept applies to real park mapping. Drag vectors, read magnitudes, and synthesize your mapping toolkit.",
      interactive: "vector_playground_explorer",
    },
  ],
  landing: {
    mantra: "Every vector concept becomes a practical tool in this ultimate mapping adventure!",
    recap: "Trails use addition and norms. Cameras need independence. Visitor flow uses basis coordinates. You built the whole map.",
  },
};
