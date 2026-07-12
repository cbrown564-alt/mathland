# Building Mathland experiences

This guide applies to new work under the accepted product doctrine. It does not authorise incremental improvement of the legacy shell.

Read, in order:

1. [Product doctrine](../PRODUCT_DOCTRINE.md)
2. [Experience architecture](../EXPERIENCE_ARCHITECTURE.md)
3. [Content strategy](../CONTENT_STRATEGY.md)
4. [First vertical slice](../FIRST_VERTICAL_SLICE.md)

## Start from a learner capability

Before building a surface, write:

- the consequential case or question;
- the mathematical capability the learner should demonstrate;
- the action that produces evidence of understanding;
- the prerequisite gaps that may block that action;
- the transfer task;
- the later retrieval prompt.

Do not start from a page template, module slot, character, or existing component.

## Choose the product responsibility

### Atlas work

Atlas components must improve orientation, relationships, route choice, evidence state, or return from a detour. They must not become decorative maps or card catalogues.

### Studio work

Studio components must support a meaningful mathematical move and feedback loop. A control that merely animates an explanation is not enough.

### Observatory work

Observatory components must reveal a phenomenon that materially benefits from staged visual treatment and must hand off to learner work quickly.

## Interaction requirements

- Couple controls, changing representations, and explanations spatially.
- Give every drag interaction keyboard and explicit-control alternatives.
- Preserve visible focus and native reading order.
- Use adequate touch targets and test at 320, 360, 768, and 1440 CSS pixels.
- Honour reduced motion and never make motion the only information channel.
- Expose textual equivalents for essential canvas or SVG meaning.
- Make feedback mathematical, specific, and actionable.
- Define evidence events in domain terms such as `predicted`, `constructed`, `explained`, `transferred`, and `retrieved`.
- Do not record a page view as mastery evidence.

## Case and tone requirements

- Use adult language and real constraints.
- State assumptions and simplifications.
- Keep units and domain interpretation accurate.
- Distinguish analogy from model and model from reality.
- Let characters contribute tools and questions, not generic praise.
- Avoid points, streak theatre, childish badges, and forced narrative.

## Reuse policy

Existing code in `src/interactive/`, `src/tier2/`, and the lesson renderers may be mined for mathematical logic or visual primitives. Reuse is appropriate only when it:

- fits the new interaction and evidence contract;
- is easier to make accessible than to replace;
- does not import legacy shell assumptions;
- preserves mathematical correctness;
- passes the same tests as new code.

Prefer extracting a small model or renderer over wrapping an entire legacy page.

## Prototype isolation

Until the first vertical slice is validated:

- place new product code under `src/world/`;
- expose it through an explicitly experimental route such as `/prototype/one-operation-three-worlds`;
- do not replace production routes or migrate lessons in bulk;
- keep its data model independent of the old eight-section and beat schemas;
- use adapters when reading legacy content or interactives.

The proposed namespace is documented in [../architecture/README.md](../architecture/README.md).

## Review checklist

Before calling a slice ready for learner research, verify:

1. Mathematical correctness, notation, units, and domain assumptions.
2. Learner action frequency and usefulness of feedback.
3. Fading support and independent performance.
4. Cross-domain or cross-representation transfer.
5. Atlas orientation and detour return.
6. Keyboard, touch, screen-reader, reduced-motion, zoom, and narrow-screen journeys.
7. Error, resume, and corrupt-local-state behaviour.
8. Performance on a representative mobile device.
9. Evidence events and their interpretation.
10. Adult tone and the character's genuine teaching contribution.

## Quality commands

Run the relevant repository checks before handoff:

```bash
npm run lint
npm run typecheck
npm run validate:content
npm run test
npm run build
```

Add focused tests for mathematical models, evidence transitions, keyboard operation, and the critical browser journey introduced by the work.
