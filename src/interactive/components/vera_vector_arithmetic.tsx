import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Slider } from '@/core/components/ui/slider';
import { Badge } from '@/core/components/ui/badge';
import { drawVectorArrow } from '@/interactive/utils/canvasArrow';
import { AXIS, BACKGROUND, GRID, LABEL } from '@/interactive/utils/canvasTheme';

interface Vector {
  x: number;
  y: number;
  id: string;
  color: string;
  label: string;
}

interface VectorArithmeticProps {
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  isPreview?: boolean;
}

const VectorArithmetic: React.FC<VectorArithmeticProps> = ({ 
  onComplete, 
  onProgress, 
  isPreview = false 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [vectorA, setVectorA] = useState<Vector>({ x: 60, y: -40, id: 'A', color: '#10B981', label: 'Vector A' });
  const [vectorB, setVectorB] = useState<Vector>({ x: 80, y: 60, id: 'B', color: '#3B82F6', label: 'Vector B' });
  const [scalarA, setScalarA] = useState(1);
  const [scalarB, setScalarB] = useState(1);
  const [operation, setOperation] = useState<'add' | 'subtract' | 'dot'>('add');
  const [showComponents, setShowComponents] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [progress, setProgress] = useState(0);

  const canvasWidth = 600;
  const canvasHeight = 400;
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;
  const scale = 3;

  // Calculate scaled vectors
  const scaledA = { x: vectorA.x * scalarA, y: vectorA.y * scalarA };
  const scaledB = { x: vectorB.x * scalarB, y: vectorB.y * scalarB };

  // Calculate result based on operation
  const calculateResult = useCallback(() => {
    switch (operation) {
      case 'add':
        return {
          x: scaledA.x + scaledB.x,
          y: scaledA.y + scaledB.y,
          magnitude: Math.sqrt(Math.pow(scaledA.x + scaledB.x, 2) + Math.pow(scaledA.y + scaledB.y, 2)),
          isScalar: false
        };
      case 'subtract':
        return {
          x: scaledA.x - scaledB.x,
          y: scaledA.y - scaledB.y,
          magnitude: Math.sqrt(Math.pow(scaledA.x - scaledB.x, 2) + Math.pow(scaledA.y - scaledB.y, 2)),
          isScalar: false
        };
      case 'dot': {
        const dotProduct = scaledA.x * scaledB.x + scaledA.y * scaledB.y;
        return {
          x: dotProduct,
          y: 0,
          magnitude: Math.abs(dotProduct),
          isScalar: true
        };
      }
      default:
        return { x: 0, y: 0, magnitude: 0, isScalar: false };
    }
  }, [scaledA, scaledB, operation]);

  const result = calculateResult();

  // Drawing functions
  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    if (!showGrid) return;
    
    ctx.strokeStyle = GRID;
    ctx.lineWidth = 1;
    
    // Draw grid lines
    for (let i = 0; i <= canvasWidth; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvasHeight);
      ctx.stroke();
    }
    
    for (let i = 0; i <= canvasHeight; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvasWidth, i);
      ctx.stroke();
    }
  };

  const drawAxes = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = AXIS;
    ctx.lineWidth = 2;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvasWidth, centerY);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvasHeight);
    ctx.stroke();
    
    // Origin point
    ctx.fillStyle = AXIS;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 3, 0, 2 * Math.PI);
    ctx.fill();
  };

  const drawVector = (ctx: CanvasRenderingContext2D, vector: { x: number; y: number }, color: string, label: string, startX = centerX, startY = centerY, alpha = 1) => {
    const endX = startX + vector.x * scale;
    const endY = startY - vector.y * scale;
    
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    
    drawVectorArrow(ctx, startX, startY, endX, endY, color, 3);
    
    // Draw label
    ctx.fillStyle = color;
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText(label, endX + 10, endY - 5);
    
    // Draw components if enabled
    if (showComponents && alpha === 1) {
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      
      // X component
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, startY);
      ctx.stroke();
      
      // Y component
      ctx.beginPath();
      ctx.moveTo(endX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      
      ctx.setLineDash([]);
    }
    
    ctx.globalAlpha = 1;
  };

  const drawVectorAddition = (ctx: CanvasRenderingContext2D) => {
    // Draw original vectors
    drawVector(ctx, scaledA, vectorA.color, `${scalarA}A`, centerX, centerY, 0.7);
    drawVector(ctx, scaledB, vectorB.color, `${scalarB}B`, centerX, centerY, 0.7);
    
    // Draw parallelogram method
    const aEndX = centerX + scaledA.x * scale;
    const aEndY = centerY - scaledA.y * scale;
    const bEndX = centerX + scaledB.x * scale;
    const bEndY = centerY - scaledB.y * scale;
    
    // Draw B from end of A (tip-to-tail)
    drawVector(ctx, scaledB, vectorB.color, `${scalarB}B`, aEndX, aEndY, 0.5);
    
    // Draw A from end of B (tip-to-tail)
    drawVector(ctx, scaledA, vectorA.color, `${scalarA}A`, bEndX, bEndY, 0.5);
    
    // Draw result vector
    drawVector(ctx, result, '#DC2626', `${scalarA}A + ${scalarB}B`);
  };

  const drawVectorSubtraction = (ctx: CanvasRenderingContext2D) => {
    // Draw original vectors
    drawVector(ctx, scaledA, vectorA.color, `${scalarA}A`, centerX, centerY, 0.7);
    drawVector(ctx, scaledB, vectorB.color, `${scalarB}B`, centerX, centerY, 0.7);
    
    // Draw -B vector
    const negB = { x: -scaledB.x, y: -scaledB.y };
    drawVector(ctx, negB, '#F59E0B', `-${scalarB}B`, centerX, centerY, 0.5);
    
    // Draw result vector
    drawVector(ctx, result, '#DC2626', `${scalarA}A - ${scalarB}B`);
  };

  const drawDotProduct = (ctx: CanvasRenderingContext2D) => {
    // Draw original vectors
    drawVector(ctx, scaledA, vectorA.color, `${scalarA}A`, centerX, centerY);
    drawVector(ctx, scaledB, vectorB.color, `${scalarB}B`, centerX, centerY);
    
    // Draw projection of B onto A
    const magnitudeA = Math.sqrt(scaledA.x * scaledA.x + scaledA.y * scaledA.y);
    const unitA = { x: scaledA.x / magnitudeA, y: scaledA.y / magnitudeA };
    const projectionLength = (scaledB.x * scaledA.x + scaledB.y * scaledA.y) / magnitudeA;
    const projection = { x: projectionLength * unitA.x, y: projectionLength * unitA.y };
    
    drawVector(ctx, projection, '#8B5CF6', 'proj', centerX, centerY);
    
    // Draw angle arc
    const angle = Math.acos(result.x / (Math.sqrt(scaledA.x * scaledA.x + scaledA.y * scaledA.y) * Math.sqrt(scaledB.x * scaledB.x + scaledB.y * scaledB.y)));
    ctx.strokeStyle = '#6B7280';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, -Math.atan2(scaledA.y, scaledA.x), -Math.atan2(scaledB.y, scaledB.x));
    ctx.stroke();
    
    // Display dot product value
    ctx.fillStyle = LABEL;
    ctx.font = '16px Inter, sans-serif';
    ctx.fillText(`A · B = ${result.x.toFixed(2)}`, 20, 30);
    ctx.fillText(`|A| = ${Math.sqrt(scaledA.x * scaledA.x + scaledA.y * scaledA.y).toFixed(2)}`, 20, 50);
    ctx.fillText(`|B| = ${Math.sqrt(scaledB.x * scaledB.x + scaledB.y * scaledB.y).toFixed(2)}`, 20, 70);
    ctx.fillText(`θ = ${(angle * 180 / Math.PI).toFixed(1)}°`, 20, 90);
  };

  // Main drawing function
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = BACKGROUND;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw grid and axes
    drawGrid(ctx);
    drawAxes(ctx);

    // Draw based on operation
    switch (operation) {
      case 'add':
        drawVectorAddition(ctx);
        break;
      case 'subtract':
        drawVectorSubtraction(ctx);
        break;
      case 'dot':
        drawDotProduct(ctx);
        break;
    }
  }, [vectorA, vectorB, scalarA, scalarB, operation, showComponents, showGrid, scaledA, scaledB, result]);

  // Redraw when dependencies change
  useEffect(() => {
    draw();
  }, [draw]);

  // Progress tracking
  useEffect(() => {
    const newProgress = Math.min(100, (Math.abs(scalarA) + Math.abs(scalarB)) * 10);
    setProgress(newProgress);
    onProgress?.(newProgress);
  }, [scalarA, scalarB, onProgress]);

  const resetVectors = () => {
    setVectorA({ x: 60, y: -40, id: 'A', color: '#10B981', label: 'Vector A' });
    setVectorB({ x: 80, y: 60, id: 'B', color: '#3B82F6', label: 'Vector B' });
    setScalarA(1);
    setScalarB(1);
    setOperation('add');
  };

  const presetExamples = [
    { name: 'Perpendicular', aX: 60, aY: 0, bX: 0, bY: 60, sA: 1, sB: 1, op: 'dot' as const },
    { name: 'Parallel', aX: 60, aY: 40, bX: 90, bY: 60, sA: 1, sB: 1, op: 'add' as const },
    { name: 'Opposite', aX: 60, aY: 40, bX: -60, bY: -40, sA: 1, sB: 1, op: 'add' as const },
    { name: 'Unit Vectors', aX: 60, aY: 0, bX: 0, bY: 60, sA: 1, sB: 1, op: 'add' as const }
  ];

  const applyPreset = (preset: typeof presetExamples[0]) => {
    setVectorA(prev => ({ ...prev, x: preset.aX, y: preset.aY }));
    setVectorB(prev => ({ ...prev, x: preset.bX, y: preset.bY }));
    setScalarA(preset.sA);
    setScalarB(preset.sB);
    setOperation(preset.op);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="border-2 border-emerald-400/30 bg-gradient-to-r from-white/[0.06] to-white/[0.02] border border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-emerald-800 flex items-center gap-2">
            🧭 Vera's Vector Arithmetic Adventure
          </CardTitle>
          <p className="text-emerald-700">
            Explore vector addition, subtraction, and dot products with interactive manipulation!
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Vector Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Operation Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Operation</label>
              <div className="flex flex-wrap gap-2">
                {(['add', 'subtract', 'dot'] as const).map((op) => (
                  <Button
                    key={op}
                    variant={operation === op ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setOperation(op)}
                    className={operation === op ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                  >
                    {op === 'add' ? 'A + B' : op === 'subtract' ? 'A - B' : 'A · B'}
                  </Button>
                ))}
              </div>
            </div>

            {/* Vector A Controls */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-emerald-700">Vector A</label>
              <div className="space-y-2">
                <label className="text-xs text-white/55">X Component: {vectorA.x.toFixed(1)}</label>
                <Slider
                  value={[vectorA.x]}
                  onValueChange={(value) => setVectorA(prev => ({ ...prev, x: value[0] }))}
                  min={-100}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <label className="text-xs text-white/55">Y Component: {vectorA.y.toFixed(1)}</label>
                <Slider
                  value={[vectorA.y]}
                  onValueChange={(value) => setVectorA(prev => ({ ...prev, y: value[0] }))}
                  min={-100}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <label className="text-xs text-white/55">Scalar Multiple: {scalarA.toFixed(1)}</label>
                <Slider
                  value={[scalarA]}
                  onValueChange={(value) => setScalarA(value[0])}
                  min={-3}
                  max={3}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Vector B Controls */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-blue-700">Vector B</label>
              <div className="space-y-2">
                <label className="text-xs text-white/55">X Component: {vectorB.x.toFixed(1)}</label>
                <Slider
                  value={[vectorB.x]}
                  onValueChange={(value) => setVectorB(prev => ({ ...prev, x: value[0] }))}
                  min={-100}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <label className="text-xs text-white/55">Y Component: {vectorB.y.toFixed(1)}</label>
                <Slider
                  value={[vectorB.y]}
                  onValueChange={(value) => setVectorB(prev => ({ ...prev, y: value[0] }))}
                  min={-100}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <label className="text-xs text-white/55">Scalar Multiple: {scalarB.toFixed(1)}</label>
                <Slider
                  value={[scalarB]}
                  onValueChange={(value) => setScalarB(value[0])}
                  min={-3}
                  max={3}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Visual Options */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-white/70">Display Options</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showComponents}
                    onChange={(e) => setShowComponents(e.target.checked)}
                    className="rounded border-white/10 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm">Show Components</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    className="rounded border-white/10 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm">Show Grid</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                onClick={resetVectors}
                variant="outline"
                className="w-full"
              >
                Reset Vectors
              </Button>
              <Button
                onClick={onComplete}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={progress < 50}
              >
                Complete Activity
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Visualization */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Vector Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                aria-label="Vera vector arithmetic visualization"
                className="w-full h-auto border border-white/10 rounded-lg"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preset Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Preset Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {presetExamples.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                onClick={() => applyPreset(preset)}
                className="text-sm"
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results Display */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-emerald-700">Vector A</h4>
              <div className="text-sm space-y-1">
                <p>Components: [{scaledA.x.toFixed(1)}, {scaledA.y.toFixed(1)}]</p>
                <p>Magnitude: {Math.sqrt(scaledA.x * scaledA.x + scaledA.y * scaledA.y).toFixed(2)}</p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-blue-700">Vector B</h4>
              <div className="text-sm space-y-1">
                <p>Components: [{scaledB.x.toFixed(1)}, {scaledB.y.toFixed(1)}]</p>
                <p>Magnitude: {Math.sqrt(scaledB.x * scaledB.x + scaledB.y * scaledB.y).toFixed(2)}</p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-red-700">Result</h4>
              <div className="text-sm space-y-1">
                {result.isScalar ? (
                  <p>Dot Product: {result.x.toFixed(2)}</p>
                ) : (
                  <>
                    <p>Components: [{result.x.toFixed(1)}, {result.y.toFixed(1)}]</p>
                    <p>Magnitude: {result.magnitude.toFixed(2)}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Indicator */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <Badge variant="outline" className="text-emerald-700">
              {progress.toFixed(0)}% Complete
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VectorArithmetic;