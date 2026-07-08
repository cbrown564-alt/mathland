import { cn } from './utils';

describe('cn utility function', () => {
  it('should merge tailwind classes correctly', () => {
    const result = cn('bg-red-500', 'text-white');
    expect(result).toEqual(expect.stringContaining('bg-red-500'));
    expect(result).toEqual(expect.stringContaining('text-white'));
  });

  it('should handle conflicting classes correctly', () => {
    // tailwind-merge should resolve conflicting classes
    const result = cn('bg-red-500', 'bg-blue-500');
    expect(result).toBe('bg-blue-500');
  });

  it('should handle conditional classes', () => {
    const showConditional = true;
    const hideClass = false;
    const result = cn('base-class', showConditional && 'conditional-class', hideClass && 'hidden-class');
    expect(result).toEqual(expect.stringContaining('base-class'));
    expect(result).toEqual(expect.stringContaining('conditional-class'));
    expect(result).not.toEqual(expect.stringContaining('hidden-class'));
  });

  it('should handle undefined and null values', () => {
    const result = cn('base-class', undefined, null, 'valid-class');
    expect(result).toEqual(expect.stringContaining('base-class'));
    expect(result).toEqual(expect.stringContaining('valid-class'));
  });

  it('should handle arrays of classes', () => {
    const result = cn(['class1', 'class2'], 'class3');
    expect(result).toEqual(expect.stringContaining('class1'));
    expect(result).toEqual(expect.stringContaining('class2'));
    expect(result).toEqual(expect.stringContaining('class3'));
  });
}); 