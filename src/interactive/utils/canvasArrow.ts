/**
 * Canvas vector arrow with length-adaptive head size — mirrors VectorArrow.tsx so
 * short vectors stay legible instead of becoming oversized arrowhead blobs.
 */
export function drawVectorArrow(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  lineWidth = 4,
  dash?: number[],
): void {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len < 0.5) return;

  const ux = dx / len;
  const uy = dy / len;
  const nx = -uy;
  const ny = ux;

  const headLen = Math.min(13, Math.max(4, len * 0.22));
  const headHalf = Math.min(lineWidth * 0.95, len * 0.14, 5.5);
  const shaftEndX = x2 - ux * headLen;
  const shaftEndY = y2 - uy * headLen;

  const tipX = x2;
  const tipY = y2;
  const leftX = shaftEndX + nx * headHalf;
  const leftY = shaftEndY + ny * headHalf;
  const rightX = shaftEndX - nx * headHalf;
  const rightY = shaftEndY - ny * headHalf;

  const showShaft = len > headLen + 1.5;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';

  if (dash) {
    ctx.setLineDash(dash);
  }

  if (showShaft) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(shaftEndX, shaftEndY);
    ctx.stroke();
  }

  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(leftX, leftY);
  ctx.lineTo(rightX, rightY);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}
