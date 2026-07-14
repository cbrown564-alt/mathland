import {
  getCharacterColor,
  getCharacterGradient,
  getCharacterTheme,
  characterTheme,
} from './theme';

describe('theme helpers', () => {
  it('returns known character colors', () => {
    expect(getCharacterColor('vera')).toBe('from-red-600 to-orange-600');
    expect(characterTheme.vera.gradient).toContain('from-red-600');
  });

  it('falls back for unknown character ids', () => {
    expect(getCharacterColor('unknown')).toBe('from-gray-400 to-gray-600');
    expect(getCharacterTheme(undefined).id).toBe('ollie');
    expect(getCharacterTheme('missing-id').id).toBe('ollie');
  });

  it('returns gradient from theme lookup', () => {
    expect(getCharacterGradient('max')).toBe(characterTheme.max.gradient);
    expect(getCharacterGradient(undefined)).toBe(characterTheme.ollie.gradient);
  });
});
