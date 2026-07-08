/**
 * SVG vector arrow with a head size that scales to shaft length so short vectors
 * (e.g. during coupled-visual interpolation) stay legible instead of becoming
 * oversized arrowhead blobs.
 */
export interface VectorArrowProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  filter?: string;
}

export function VectorArrow({
  x1,
  y1,
  x2,
  y2,
  color,
  strokeWidth = 4,
  strokeDasharray,
  filter,
}: VectorArrowProps) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len < 0.5) return null;

  const ux = dx / len;
  const uy = dy / len;
  const nx = -uy;
  const ny = ux;

  const headLen = Math.min(13, Math.max(4, len * 0.22));
  const headHalf = Math.min(strokeWidth * 0.95, len * 0.14, 5.5);
  const shaftEndX = x2 - ux * headLen;
  const shaftEndY = y2 - uy * headLen;

  const tipX = x2;
  const tipY = y2;
  const leftX = shaftEndX + nx * headHalf;
  const leftY = shaftEndY + ny * headHalf;
  const rightX = shaftEndX - nx * headHalf;
  const rightY = shaftEndY - ny * headHalf;

  const showShaft = len > headLen + 1.5;

  return (
    <g filter={filter}>
      {showShaft && (
        <line
          x1={x1}
          y1={y1}
          x2={shaftEndX}
          y2={shaftEndY}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
        />
      )}
      <path
        d={`M ${tipX} ${tipY} L ${leftX} ${leftY} L ${rightX} ${rightY} Z`}
        fill={color}
      />
    </g>
  );
}
