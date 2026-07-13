export type Vector2 = readonly [number, number];

export interface DotProductReading {
  dot: number;
  magnitudeA: number;
  magnitudeB: number;
  cosine: number | null;
  angleDegrees: number | null;
  projectionOfBOntoA: number | null;
  relation: "same-direction" | "perpendicular" | "opposed";
}

export const dot = (a: readonly number[], b: readonly number[]): number => {
  if (a.length !== b.length) throw new Error("Vectors must have the same dimension");
  return a.reduce((sum, value, index) => sum + value * b[index], 0);
};

export const magnitude = (vector: readonly number[]): number =>
  Math.sqrt(dot(vector, vector));

export const normalise = (vector: readonly number[]): number[] | null => {
  const length = magnitude(vector);
  return length === 0 ? null : vector.map((value) => value / length);
};

export const projectionVector = (vector: Vector2, onto: Vector2): Vector2 | null => {
  const denominator = dot(onto, onto);
  if (denominator === 0) return null;
  const scale = dot(vector, onto) / denominator;
  const component = (value: number) => Object.is(value, -0) ? 0 : value;
  return [component(onto[0] * scale), component(onto[1] * scale)];
};

export const clampComponent = (value: number, limit = 5): number =>
  Math.max(-limit, Math.min(limit, Number.isFinite(value) ? value : 0));

export const readDotProduct = (a: Vector2, b: Vector2): DotProductReading => {
  const product = dot(a, b);
  const magnitudeA = magnitude(a);
  const magnitudeB = magnitude(b);
  const denominator = magnitudeA * magnitudeB;
  const cosine = denominator === 0 ? null : Math.max(-1, Math.min(1, product / denominator));
  const relation = Math.abs(product) < 1e-9
    ? "perpendicular"
    : product > 0
      ? "same-direction"
      : "opposed";

  return {
    dot: product,
    magnitudeA,
    magnitudeB,
    cosine,
    angleDegrees: cosine === null ? null : Math.acos(cosine) * 180 / Math.PI,
    projectionOfBOntoA: magnitudeA === 0 ? null : product / magnitudeA,
    relation,
  };
};

export const componentExpression = (a: Vector2, b: Vector2): string =>
  `(${a[0]} × ${b[0]}) + (${a[1]} × ${b[1]}) = ${dot(a, b)}`;

export const relationCopy = (reading: DotProductReading): string => {
  if (reading.relation === "perpendicular") return "No directional overlap: the dot product is zero.";
  if (reading.relation === "same-direction") return "Positive directional overlap: one vector helps along the other.";
  return "Negative directional overlap: one vector acts against the other.";
};
