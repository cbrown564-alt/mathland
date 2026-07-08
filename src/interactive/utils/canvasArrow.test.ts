import { drawVectorArrow } from './canvasArrow';

function createMockCtx(): CanvasRenderingContext2D {
  return {
    save: jest.fn(),
    restore: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    closePath: jest.fn(),
    stroke: jest.fn(),
    fill: jest.fn(),
    setLineDash: jest.fn(),
    strokeStyle: '',
    fillStyle: '',
    lineWidth: 0,
    lineCap: 'butt',
  } as unknown as CanvasRenderingContext2D;
}

describe('drawVectorArrow', () => {
  it('returns early for negligible length', () => {
    const ctx = createMockCtx();
    drawVectorArrow(ctx, 0, 0, 0.2, 0.1, '#fff');
    expect(ctx.save).not.toHaveBeenCalled();
  });

  it('draws shaft and head for a long vector', () => {
    const ctx = createMockCtx();
    drawVectorArrow(ctx, 0, 0, 100, 0, '#f00', 4);
    expect(ctx.save).toHaveBeenCalled();
    expect(ctx.stroke).toHaveBeenCalled();
    expect(ctx.fill).toHaveBeenCalled();
    expect(ctx.restore).toHaveBeenCalled();
  });

  it('draws head only for a short vector', () => {
    const ctx = createMockCtx();
    drawVectorArrow(ctx, 0, 0, 3, 0, '#0f0', 4);
    expect(ctx.stroke).not.toHaveBeenCalled();
    expect(ctx.fill).toHaveBeenCalled();
  });

  it('applies dash pattern when provided', () => {
    const ctx = createMockCtx();
    drawVectorArrow(ctx, 0, 0, 100, 0, '#00f', 4, [6, 4]);
    expect(ctx.setLineDash).toHaveBeenCalledWith([6, 4]);
  });
});
