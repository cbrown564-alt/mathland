export interface PlotViewport {
  width: number;
  height: number;
  gridSize: number;
}

export interface PlotCoords {
  width: number;
  height: number;
  gridSize: number;
  unit: number;
  mathToSvg: (x: number, y: number) => { x: number; y: number };
  svgToMath: (svgX: number, svgY: number) => { x: number; y: number };
  scalePointer: (clientX: number, clientY: number, rect: DOMRect) => { x: number; y: number };
  axisLabels: number[];
  snapToGrid: (val: number) => number;
  clamp: (x: number, y: number) => { x: number; y: number };
}

/** Uniform px-per-unit mapping so grids and circles are not stretched. */
export function createPlotCoords(viewport: PlotViewport): PlotCoords {
  const { width, height, gridSize } = viewport;
  const unit = Math.min(width, height) / (2 * gridSize);

  const mathToSvg = (x: number, y: number) => ({
    x: width / 2 + x * unit,
    y: height / 2 - y * unit,
  });

  const svgToMath = (svgX: number, svgY: number) => ({
    x: (svgX - width / 2) / unit,
    y: -(svgY - height / 2) / unit,
  });

  const scalePointer = (clientX: number, clientY: number, rect: DOMRect) => ({
    x: (clientX - rect.left) * (width / rect.width),
    y: (clientY - rect.top) * (height / rect.height),
  });

  const axisLabels = Array.from({ length: 2 * gridSize + 1 }, (_, i) => i - gridSize);
  const snapToGrid = (val: number) => Math.round(val * 2) / 2;
  const clamp = (x: number, y: number) => ({
    x: Math.max(-gridSize, Math.min(gridSize, x)),
    y: Math.max(-gridSize, Math.min(gridSize, y)),
  });

  return {
    width,
    height,
    gridSize,
    unit,
    mathToSvg,
    svgToMath,
    scalePointer,
    axisLabels,
    snapToGrid,
    clamp,
  };
}

export const NARRATIVE_PLOT = { width: 560, height: 420, gridSize: 5 } as const;
export const FOREST_PLOT = { width: 560, height: 420, gridSize: 10 } as const;
