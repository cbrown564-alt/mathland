import { interactiveDemos, getDemosByCharacter, getDemoById, getReadyDemos } from './demo_registry';
import { characters } from '@/utils/characterData';

/**
 * Path A7 guard: demo_registry.ts is the single source of truth for the
 * interactive component catalog. These tests lock down its invariants so a
 * contradictory hardcoded count (e.g. the old "23") can't silently reappear.
 */
describe('interactive demo registry (Path A7 single source of truth)', () => {
  const characterIds = new Set(characters.map((c) => c.id));

  it('has the expected number of demos', () => {
    expect(interactiveDemos.length).toBe(28);
  });

  it('every demo references a real character', () => {
    for (const demo of interactiveDemos) {
      expect(characterIds.has(demo.characterId)).toBe(true);
    }
  });

  it('every demo has a unique id', () => {
    const ids = interactiveDemos.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('helpers stay consistent with the full list', () => {
    expect(getDemoById(interactiveDemos[0].id)).toBe(interactiveDemos[0]);
    // Sum of per-character slices equals the whole.
    const summed = characters.reduce(
      (n, c) => n + getDemosByCharacter(c.id).length,
      0,
    );
    expect(summed).toBe(interactiveDemos.length);
  });

  it('ready demos are a non-empty subset', () => {
    const ready = getReadyDemos();
    expect(ready.length).toBeGreaterThan(0);
    expect(ready.length).toBeLessThanOrEqual(interactiveDemos.length);
  });
});
