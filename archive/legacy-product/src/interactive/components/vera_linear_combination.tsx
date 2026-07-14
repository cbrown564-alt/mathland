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

interface LinearCombinationProps {
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  isPreview?: boolean;
}

const LinearCombination: React.FC<LinearCombinationProps> = ({ 
  onComplete, 
  onProgress, 
  isPreview = false 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Base vectors
  const [vectorU, setVectorU] = useState<Vector>({ x: 80, y: 20, id: 'u', color: '#10B981', label: 'Vector u' });
  const [vectorV, setVectorV] = useState<Vector>({ x: 30, y: 80, id: 'v', color: '#3B82F6', label: 'Vector v' });
  
  // Scalar coefficients
  const [coeffA, setCoeffA] = useState(1.5);
  const [coeffB, setCoeffB] = useState(1.0);
  
  // Display options
  const [showGrid, setShowGrid] = useState(true);
  const [showComponents, setShowComponents] = useState(true);
  const [showSpan, setShowSpan] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  
  // Animation state
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  
  // Progress tracking
  const [progress, setProgress] = useState(0);
  const [exploredCombinations, setExploredCombinations] = useState<Set<string>>(new Set());

  const canvasWidth = 600;
  const canvasHeight = 400;
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;
  const scale = 2.5;

  // Calculate the linear combination
  const calculateLinearCombination = useCallback(() => {
    const scaledU = { x: vectorU.x * coeffA, y: vectorU.y * coeffA };
    const scaledV = { x: vectorV.x * coeffB, y: vectorV.y * coeffB };
    const result = { x: scaledU.x + scaledV.x, y: scaledU.y + scaledV.y };
    
    return { scaledU, scaledV, result };
  }, [vectorU, vectorV, coeffA, coeffB]);

  const { scaledU, scaledV, result } = calculateLinearCombination();

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
    
    // Axis labels
    ctx.fillStyle = LABEL;
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('x', canvasWidth - 20, centerY - 10);
    ctx.fillText('y', centerX + 10, 15);
  };

  const drawVector = (ctx: CanvasRenderingContext2D, vector: { x: number; y: number }, color: string, label: string, startX = centerX, startY = centerY, alpha = 1, dashed = false) => {
    const endX = startX + vector.x * scale;
    const endY = startY - vector.y * scale;
    
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    
    drawVectorArrow(ctx, startX, startY, endX, endY, color, 3, dashed ? [5, 5] : undefined);
    
    // Draw label
    ctx.fillStyle = color;
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText(label, endX + 10, endY - 5);
    
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  };

  const drawSpan = (ctx: CanvasRenderingContext2D) => {
    if (!showSpan) return;
    
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = '#8B5CF6';
    
    // Draw span region (simplified as a parallelogram)
    const spanPoints = [
      { x: centerX, y: centerY },
      { x: centerX + vectorU.x * scale * 3, y: centerY - vectorU.y * scale * 3 },
      { x: centerX + vectorV.x * scale * 3, y: centerY - vectorV.y * scale * 3 },
      { x: centerX + (vectorU.x + vectorV.x) * scale * 3, y: centerY - (vectorU.y + vectorV.y) * scale * 3 }
    ];
    
    ctx.beginPath();
    ctx.moveTo(spanPoints[0].x, spanPoints[0].y);
    for (let i = 1; i < spanPoints.length; i++) {
      ctx.lineTo(spanPoints[i].x, spanPoints[i].y);
    }
    ctx.closePath();
    ctx.fill();
    
    ctx.globalAlpha = 1;
  };

  const drawLinearCombination = (ctx: CanvasRenderingContext2D) => {
    // Draw span region first
    drawSpan(ctx);
    
    // Draw base vectors lightly
    drawVector(ctx, vectorU, vectorU.color, 'u', centerX, centerY, 0.4);
    drawVector(ctx, vectorV, vectorV.color, 'v', centerX, centerY, 0.4);
    
    // Draw scaled vectors
    drawVector(ctx, scaledU, vectorU.color, `${coeffA.toFixed(1)}u`, centerX, centerY, 0.7, true);
    drawVector(ctx, scaledV, vectorV.color, `${coeffB.toFixed(1)}v`, centerX, centerY, 0.7, true);
    
    // Draw construction process (tip-to-tail)
    const uEndX = centerX + scaledU.x * scale;
    const uEndY = centerY - scaledU.y * scale;
    drawVector(ctx, scaledV, vectorV.color, `${coeffB.toFixed(1)}v`, uEndX, uEndY, 0.5, true);
    
    // Draw result vector
    drawVector(ctx, result, '#DC2626', `${coeffA.toFixed(1)}u + ${coeffB.toFixed(1)}v`, centerX, centerY, 1);
    
    // Draw parallelogram if components are shown
    if (showComponents) {
      const vEndX = centerX + scaledV.x * scale;
      const vEndY = centerY - scaledV.y * scale;
      drawVector(ctx, scaledU, vectorU.color, `${coeffA.toFixed(1)}u`, vEndX, vEndY, 0.3, true);
      
      // Draw parallelogram outline
      ctx.strokeStyle = '#6B7280';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.globalAlpha = 0.5;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(uEndX, uEndY);
      ctx.lineTo(centerX + result.x * scale, centerY - result.y * scale);
      ctx.lineTo(vEndX, vEndY);
      ctx.closePath();
      ctx.stroke();
      
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
    }
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

    // Draw linear combination
    drawLinearCombination(ctx);

    // Draw information panel
    ctx.fillStyle = LABEL;
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText(`Linear Combination: ${coeffA.toFixed(1)}u + ${coeffB.toFixed(1)}v`, 20, 30);
    ctx.fillText(`Result: [${result.x.toFixed(1)}, ${result.y.toFixed(1)}]`, 20, 50);
    ctx.fillText(`Magnitude: ${Math.sqrt(result.x * result.x + result.y * result.y).toFixed(2)}`, 20, 70);
    
    // Show dependence/independence
    const determinant = vectorU.x * vectorV.y - vectorU.y * vectorV.x;
    const isIndependent = Math.abs(determinant) > 0.1;
    ctx.fillText(`Vectors are: ${isIndependent ? 'Independent' : 'Dependent'}`, 20, 90);
  // Drawing helpers close over precisely the state listed here.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vectorU, vectorV, coeffA, coeffB, showGrid, showComponents, showSpan, scaledU, scaledV, result]);

  // Animation functions
  const animateToTarget = useCallback((targetA: number, targetB: number) => {
    setIsAnimating(true);
    const startA = coeffA;
    const startB = coeffB;
    const duration = 2000 / animationSpeed;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const newA = startA + (targetA - startA) * progress;
      const newB = startB + (targetB - startB) * progress;
      
      setCoeffA(newA);
      setCoeffB(newB);
      setAnimationProgress(progress);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        setAnimationProgress(0);
      }
    };
    
    animate();
  }, [coeffA, coeffB, animationSpeed]);

  // Redraw when dependencies change
  useEffect(() => {
    draw();
  }, [draw]);

  // Progress tracking
  useEffect(() => {
    const combination = `${coeffA.toFixed(1)},${coeffB.toFixed(1)}`;
    setExploredCombinations(prev => new Set([...prev, combination]));
    
    const newProgress = Math.min(100, exploredCombinations.size * 5);
    setProgress(newProgress);
    onProgress?.(newProgress);
  }, [coeffA, coeffB, exploredCombinations.size, onProgress]);

  const resetCombination = () => {
    setCoeffA(1.5);
    setCoeffB(1.0);
    setVectorU({ x: 80, y: 20, id: 'u', color: '#10B981', label: 'Vector u' });
    setVectorV({ x: 30, y: 80, id: 'v', color: '#3B82F6', label: 'Vector v' });
    setExploredCombinations(new Set());
  };

  const presetCombinations = [
    { name: 'Zero Vector', a: 0, b: 0 },
    { name: 'Unit u', a: 1, b: 0 },
    { name: 'Unit v', a: 0, b: 1 },
    { name: 'Equal Parts', a: 1, b: 1 },
    { name: 'Opposite', a: 1, b: -1 },
    { name: 'Double u', a: 2, b: 0 },
    { name: 'Half v', a: 0, b: 0.5 },
    { name: 'Complex', a: 1.5, b: -0.8 }
  ];

  const dependentVectors = [
    { name: 'Parallel', uX: 60, uY: 40, vX: 90, vY: 60 },
    { name: 'Collinear', uX: 60, uY: 40, vX: -30, vY: -20 },
    { name: 'Zero v', uX: 80, uY: 20, vX: 0, vY: 0 }
  ];

  const independentVectors = [
    { name: 'Orthogonal', uX: 80, uY: 0, vX: 0, vY: 80 },
    { name: 'Standard', uX: 80, uY: 20, vX: 30, vY: 80 },
    { name: 'Acute Angle', uX: 80, uY: 20, vX: 60, vY: 60 }
  ];

  const applyVectorSet = (set: typeof independentVectors[0]) => {
    setVectorU(prev => ({ ...prev, x: set.uX, y: set.uY }));
    setVectorV(prev => ({ ...prev, x: set.vX, y: set.vY }));
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="border-2 border-emerald-400/30 bg-gradient-to-r from-white/[0.06] to-white/[0.02] border border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-emerald-800 flex items-center gap-2">
            🧭 Vera's Linear Combination Laboratory
          </CardTitle>
          <p className="text-emerald-700">
            Explore how vectors combine to span spaces and create new directions!
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Combination Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Coefficient Controls */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-emerald-700">
                  Coefficient a: {coeffA.toFixed(2)}
                </label>
                <Slider
                  value={[coeffA]}
                  onValueChange={(value) => setCoeffA(value[0])}
                  min={-3}
                  max={3}
                  step={0.1}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-700">
                  Coefficient b: {coeffB.toFixed(2)}
                </label>
                <Slider
                  value={[coeffB]}
                  onValueChange={(value) => setCoeffB(value[0])}
                  min={-3}
                  max={3}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Vector Controls */}
            <div className="space-y-4">
              <h4 className="font-medium text-white/70">Base Vectors</h4>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-emerald-700">Vector u</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-white/55">x: {vectorU.x.toFixed(0)}</label>
                    <Slider
                      value={[vectorU.x]}
                      onValueChange={(value) => setVectorU(prev => ({ ...prev, x: value[0] }))}
                      min={-100}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/55">y: {vectorU.y.toFixed(0)}</label>
                    <Slider
                      value={[vectorU.y]}
                      onValueChange={(value) => setVectorU(prev => ({ ...prev, y: value[0] }))}
                      min={-100}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-700">Vector v</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-white/55">x: {vectorV.x.toFixed(0)}</label>
                    <Slider
                      value={[vectorV.x]}
                      onValueChange={(value) => setVectorV(prev => ({ ...prev, x: value[0] }))}
                      min={-100}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/55">y: {vectorV.y.toFixed(0)}</label>
                    <Slider
                      value={[vectorV.y]}
                      onValueChange={(value) => setVectorV(prev => ({ ...prev, y: value[0] }))}
                      min={-100}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Display Options */}
            <div className="space-y-3">
              <h4 className="font-medium text-white/70">Display Options</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showComponents}
                    onChange={(e) => setShowComponents(e.target.checked)}
                    className="rounded border-white/10 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm">Show Parallelogram</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showSpan}
                    onChange={(e) => setShowSpan(e.target.checked)}
                    className="rounded border-white/10 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm">Show Span Region</span>
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

            {/* Animation Speed */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">
                Animation Speed: {animationSpeed.toFixed(1)}x
              </label>
              <Slider
                value={[animationSpeed]}
                onValueChange={(value) => setAnimationSpeed(value[0])}
                min={0.5}
                max={3}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                onClick={resetCombination}
                variant="outline"
                className="w-full"
              >
                Reset Combination
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
            <CardTitle className="text-lg font-semibold">Linear Combination Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                aria-label="Vera linear combination visualization"
                className="w-full h-auto border border-white/10 rounded-lg"
              />
              {isAnimating && (
                <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm">
                  Animating: {(animationProgress * 100).toFixed(0)}%
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preset Combinations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Preset Combinations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {presetCombinations.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                onClick={() => animateToTarget(preset.a, preset.b)}
                className="text-sm"
                disabled={isAnimating}
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vector Dependence Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Dependent Vectors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-white/55">
                Vectors that lie on the same line (linearly dependent)
              </p>
              <div className="grid grid-cols-1 gap-2">
                {dependentVectors.map((set) => (
                  <Button
                    key={set.name}
                    variant="outline"
                    onClick={() => applyVectorSet(set)}
                    className="text-sm"
                    size="sm"
                  >
                    {set.name}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Independent Vectors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-white/55">
                Vectors that span the entire 2D plane (linearly independent)
              </p>
              <div className="grid grid-cols-1 gap-2">
                {independentVectors.map((set) => (
                  <Button
                    key={set.name}
                    variant="outline"
                    onClick={() => applyVectorSet(set)}
                    className="text-sm"
                    size="sm"
                  >
                    {set.name}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Display */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Mathematical Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-white/70">Linear Combination</h4>
              <div className="text-sm space-y-1">
                <p>Formula: {coeffA.toFixed(2)}u + {coeffB.toFixed(2)}v</p>
                <p>Result: [{result.x.toFixed(2)}, {result.y.toFixed(2)}]</p>
                <p>Magnitude: {Math.sqrt(result.x * result.x + result.y * result.y).toFixed(2)}</p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-white/70">Vector Properties</h4>
              <div className="text-sm space-y-1">
                <p>u = [{vectorU.x.toFixed(0)}, {vectorU.y.toFixed(0)}]</p>
                <p>v = [{vectorV.x.toFixed(0)}, {vectorV.y.toFixed(0)}]</p>
                <p>Determinant: {(vectorU.x * vectorV.y - vectorU.y * vectorV.x).toFixed(2)}</p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-white/70">Linear Independence</h4>
              <div className="text-sm space-y-1">
                {Math.abs(vectorU.x * vectorV.y - vectorU.y * vectorV.x) > 0.1 ? (
                  <>
                    <p className="text-green-600">✓ Linearly Independent</p>
                    <p>Vectors span R²</p>
                  </>
                ) : (
                  <>
                    <p className="text-red-600">✗ Linearly Dependent</p>
                    <p>Vectors are collinear</p>
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
              {exploredCombinations.size} combinations explored
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LinearCombination;
