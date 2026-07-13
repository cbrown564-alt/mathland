import { componentExpression, dot, magnitude, normalise, projectionVector, readDotProduct } from "./dotProduct";

describe("dot-product mathematical model", () => {
  test("calculates component and n-dimensional dot products", () => {
    expect(dot([3, 2], [4, -1])).toBe(10);
    expect(dot([0.5, 0.3, 0.2], [4, -1, 2])).toBeCloseTo(2.1);
    expect(componentExpression([3, 2], [4, -1])).toBe("(3 × 4) + (2 × -1) = 10");
  });

  test("rejects dimensions that do not match", () => {
    expect(() => dot([1, 2], [1])).toThrow("same dimension");
  });

  test("connects sign, angle and projection", () => {
    const positive = readDotProduct([4, 0], [3, 2]);
    const zero = readDotProduct([4, 0], [0, 3]);
    const negative = readDotProduct([4, 0], [-3, 2]);
    expect(positive.relation).toBe("same-direction");
    expect(positive.projectionOfBOntoA).toBe(3);
    expect(zero.relation).toBe("perpendicular");
    expect(zero.angleDegrees).toBeCloseTo(90);
    expect(negative.relation).toBe("opposed");
    expect(negative.angleDegrees).toBeGreaterThan(90);
  });

  test("keeps the zero-vector geometry explicitly undefined", () => {
    const reading = readDotProduct([0, 0], [3, 2]);
    expect(reading.cosine).toBeNull();
    expect(reading.angleDegrees).toBeNull();
    expect(reading.projectionOfBOntoA).toBeNull();
    expect(magnitude([3, 4])).toBe(5);
  });

  test("normalises non-zero vectors and rejects a zero direction", () => {
    expect(normalise([3, 4])).toEqual([0.6, 0.8]);
    expect(normalise([0, 0])).toBeNull();
  });

  test("returns the live projection vector", () => {
    expect(projectionVector([3, 2], [4, 0])).toEqual([3, 0]);
    expect(projectionVector([-3, 2], [4, 0])).toEqual([-3, 0]);
    expect(projectionVector([3, 2], [0, 0])).toBeNull();
  });
});
