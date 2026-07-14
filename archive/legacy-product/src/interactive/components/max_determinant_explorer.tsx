import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Slider } from '@/core/components/ui/slider';
import { Badge } from '@/core/components/ui/badge';
import { drawVectorArrow } from '@/interactive/utils/canvasArrow';
import { AXIS, BACKGROUND, GRID, LABEL } from '@/interactive/utils/canvasTheme';

interface DeterminantExplorerProps {
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  isPreview?: boolean;
}

const DeterminantExplorer: React.FC<DeterminantExplorerProps> = ({ 
  onComplete, 
  onProgress, 
  isPreview = false 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Matrix elements
  const [matrixA, setMatrixA] = useState(1.5);
  const [matrixB, setMatrixB] = useState(0.5);
  const [matrixC, setMatrixC] = useState(-0.8);
  const [matrixD, setMatrixD] = useState(1.2);
  
  // Display options
  const [showGrid, setShowGrid] = useState(true);
  const [showOriginalShape, setShowOriginalShape] = useState(true);
  const [showParallelogram, setShowParallelogram] = useState(true);
  const [showUnitSquare, setShowUnitSquare] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  
  // Shape selection
  const [selectedShape, setSelectedShape] = useState<'square' | 'triangle' | 'circle' | 'custom'>('square');
  
  // Animation state
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  
  // Progress tracking
  const [progress, setProgress] = useState(0);
  const [exploredMatrices, setExploredMatrices] = useState<Set<string>>(new Set());

  const canvasWidth = 600;
  const canvasHeight = 400;
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;
  const scale = 80;

  // Calculate determinant and properties
  const determinant = matrixA * matrixD - matrixB * matrixC;
  const isInvertible = Math.abs(determinant) > 0.001;
  const preservesOrientation = determinant > 0;
  const absoluteDeterminant = Math.abs(determinant);

  // Transform point using matrix
  const transformPoint = useCallback((x: number, y: number) => {
    return {
      x: matrixA * x + matrixB * y,
      y: matrixC * x + matrixD * y
    };
  }, [matrixA, matrixB, matrixC, matrixD]);

  // Drawing functions
  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    if (!showGrid) return;
    
    ctx.strokeStyle = GRID;
    ctx.lineWidth = 1;
    
    // Draw grid lines
    for (let i = -10; i <= 10; i++) {
      // Vertical lines
      ctx.beginPath();
      ctx.moveTo(centerX + i * scale / 4, 0);
      ctx.lineTo(centerX + i * scale / 4, canvasHeight);
      ctx.stroke();
      
      // Horizontal lines
      ctx.beginPath();
      ctx.moveTo(0, centerY + i * scale / 4);
      ctx.lineTo(canvasWidth, centerY + i * scale / 4);
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
    
    // Origin
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

  const drawVector = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, label: string) => {
    const endX = centerX + x * scale;
    const endY = centerY - y * scale;
    
    drawVectorArrow(ctx, centerX, centerY, endX, endY, color, 3);
    
    // Draw label
    ctx.fillStyle = color;
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText(label, endX + 10, endY - 5);
  };

  const drawUnitSquareTransformation = (ctx: CanvasRenderingContext2D) => {
    // Original unit square
    if (showUnitSquare || showOriginalShape) {
      ctx.strokeStyle = '#94A3B8';
      ctx.fillStyle = 'rgba(148, 163, 184, 0.2)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      
      ctx.beginPath();
      ctx.rect(centerX, centerY, scale, -scale);
      ctx.fill();
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Label
      ctx.fillStyle = '#64748B';
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText('Unit Square', centerX + 5, centerY - 5);
    }
    
    // Transformed unit square (parallelogram)
    const corners = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 }
    ];
    
    const transformedCorners = corners.map(corner => {
      const transformed = transformPoint(corner.x, corner.y);
      return {
        x: centerX + transformed.x * scale,
        y: centerY - transformed.y * scale
      };
    });
    
    // Draw transformed square (parallelogram)
    ctx.strokeStyle = preservesOrientation ? '#3B82F6' : '#EF4444';
    ctx.fillStyle = preservesOrientation ? 'rgba(59, 130, 246, 0.3)' : 'rgba(239, 68, 68, 0.3)';
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    ctx.moveTo(transformedCorners[0].x, transformedCorners[0].y);
    for (let i = 1; i < transformedCorners.length; i++) {
      ctx.lineTo(transformedCorners[i].x, transformedCorners[i].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Area label
    ctx.fillStyle = preservesOrientation ? '#1E40AF' : '#DC2626';
    ctx.font = '14px Inter, sans-serif';
    const centerOfParallelogram = {
      x: (transformedCorners[0].x + transformedCorners[2].x) / 2,
      y: (transformedCorners[0].y + transformedCorners[2].y) / 2
    };
    ctx.fillText(`Area: ${absoluteDeterminant.toFixed(2)}`, centerOfParallelogram.x - 30, centerOfParallelogram.y);
  };

  const drawCustomShape = (ctx: CanvasRenderingContext2D) => {
    let originalPoints: {x: number, y: number}[] = [];
    
    switch (selectedShape) {
      case 'triangle':
        originalPoints = [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 0.5, y: 1 }
        ];
        break;
      case 'circle':
        // Approximate circle with many points
        for (let i = 0; i < 16; i++) {
          const angle = (i / 16) * 2 * Math.PI;
          originalPoints.push({
            x: 0.5 + 0.5 * Math.cos(angle),
            y: 0.5 + 0.5 * Math.sin(angle)
          });
        }
        break;
      case 'custom':
        originalPoints = [
          { x: 0.2, y: 0.2 },
          { x: 0.8, y: 0.3 },
          { x: 0.9, y: 0.7 },
          { x: 0.6, y: 0.9 },
          { x: 0.1, y: 0.8 }
        ];
        break;
      default:
        return; // Square is handled separately
    }
    
    // Draw original shape
    if (showOriginalShape) {
      ctx.strokeStyle = '#94A3B8';
      ctx.fillStyle = 'rgba(148, 163, 184, 0.2)';
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      
      ctx.beginPath();
      originalPoints.forEach((point, index) => {
        const x = centerX + point.x * scale;
        const y = centerY - point.y * scale;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    // Draw transformed shape
    const transformedPoints = originalPoints.map(point => {
      const transformed = transformPoint(point.x, point.y);
      return {
        x: centerX + transformed.x * scale,
        y: centerY - transformed.y * scale
      };
    });
    
    ctx.strokeStyle = preservesOrientation ? '#3B82F6' : '#EF4444';
    ctx.fillStyle = preservesOrientation ? 'rgba(59, 130, 246, 0.4)' : 'rgba(239, 68, 68, 0.4)';
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    transformedPoints.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  const drawColumnVectors = (ctx: CanvasRenderingContext2D) => {
    // Draw basis vectors
    drawVector(ctx, matrixA, matrixC, '#10B981', `[${matrixA.toFixed(1)}, ${matrixC.toFixed(1)}]`);
    drawVector(ctx, matrixB, matrixD, '#F59E0B', `[${matrixB.toFixed(1)}, ${matrixD.toFixed(1)}]`);
    
    // Show parallelogram formed by basis vectors
    if (showParallelogram) {
      ctx.strokeStyle = '#8B5CF6';
      ctx.fillStyle = 'rgba(139, 92, 246, 0.1)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 4]);
      
      const col1End = { x: centerX + matrixA * scale, y: centerY - matrixC * scale };
      const col2End = { x: centerX + matrixB * scale, y: centerY - matrixD * scale };
      const opposite = { x: centerX + (matrixA + matrixB) * scale, y: centerY - (matrixC + matrixD) * scale };
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(col1End.x, col1End.y);
      ctx.lineTo(opposite.x, opposite.y);
      ctx.lineTo(col2End.x, col2End.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      ctx.setLineDash([]);
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

    // Draw transformations based on selected shape
    if (selectedShape === 'square' || showUnitSquare) {
      drawUnitSquareTransformation(ctx);
    }
    
    if (selectedShape !== 'square') {
      drawCustomShape(ctx);
    }
    
    // Draw column vectors
    drawColumnVectors(ctx);

    // Draw information panel
    ctx.fillStyle = LABEL;
    ctx.font = '16px Inter, sans-serif';
    ctx.fillText(`Matrix: [${matrixA.toFixed(2)} ${matrixB.toFixed(2)}]`, 20, 30);
    ctx.fillText(`        [${matrixC.toFixed(2)} ${matrixD.toFixed(2)}]`, 20, 50);
    ctx.fillText(`Determinant: ${determinant.toFixed(3)}`, 20, 80);
    ctx.fillText(`Area Scale: ${absoluteDeterminant.toFixed(2)}x`, 20, 100);
    
    // Status indicators
    ctx.font = '14px Inter, sans-serif';
    ctx.fillStyle = isInvertible ? '#059669' : '#DC2626';
    ctx.fillText(isInvertible ? '✓ Invertible' : '✗ Singular', 20, 125);
    
    ctx.fillStyle = preservesOrientation ? '#059669' : '#DC2626';
    ctx.fillText(preservesOrientation ? '✓ Preserves Orientation' : '✗ Flips Orientation', 20, 145);
    
    // Special cases
    if (Math.abs(determinant) < 0.001) {
      ctx.fillStyle = '#DC2626';
      ctx.fillText('⚠ Collapses to Line/Point', 20, 165);
    } else if (Math.abs(determinant - 1) < 0.001) {
      ctx.fillStyle = '#059669';
      ctx.fillText('⭐ Area Preserving', 20, 165);
    }
  }, [matrixA, matrixB, matrixC, matrixD, selectedShape, showGrid, showOriginalShape, showParallelogram, showUnitSquare, determinant, absoluteDeterminant, isInvertible, preservesOrientation]);

  // Animation functions
  const animateToMatrix = useCallback((targetA: number, targetB: number, targetC: number, targetD: number) => {
    setIsAnimating(true);
    const startA = matrixA, startB = matrixB, startC = matrixC, startD = matrixD;
    const duration = 2000 / animationSpeed;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const easedProgress = easeInOut(progress);
      
      setMatrixA(startA + (targetA - startA) * easedProgress);
      setMatrixB(startB + (targetB - startB) * easedProgress);
      setMatrixC(startC + (targetC - startC) * easedProgress);
      setMatrixD(startD + (targetD - startD) * easedProgress);
      setAnimationProgress(progress);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        setAnimationProgress(0);
      }
    };
    
    animate();
  }, [matrixA, matrixB, matrixC, matrixD, animationSpeed]);

  // Redraw when dependencies change
  useEffect(() => {
    draw();
  }, [draw]);

  // Progress tracking
  useEffect(() => {
    const matrixKey = `${matrixA.toFixed(1)},${matrixB.toFixed(1)},${matrixC.toFixed(1)},${matrixD.toFixed(1)}`;
    setExploredMatrices(prev => new Set([...prev, matrixKey]));
    
    const newProgress = Math.min(100, exploredMatrices.size * 3);
    setProgress(newProgress);
    onProgress?.(newProgress);
  }, [matrixA, matrixB, matrixC, matrixD, exploredMatrices.size, onProgress]);

  const resetMatrix = () => {
    setMatrixA(1);
    setMatrixB(0);
    setMatrixC(0);
    setMatrixD(1);
    setExploredMatrices(new Set());
  };

  const specialMatrices = [
    { name: 'Identity', a: 1, b: 0, c: 0, d: 1 },
    { name: 'Scaling', a: 2, b: 0, c: 0, d: 1.5 },
    { name: 'Rotation 45°', a: 0.707, b: -0.707, c: 0.707, d: 0.707 },
    { name: 'Shear', a: 1, b: 0.5, c: 0, d: 1 },
    { name: 'Reflection X', a: 1, b: 0, c: 0, d: -1 },
    { name: 'Reflection Y', a: -1, b: 0, c: 0, d: 1 },
    { name: 'Singular', a: 1, b: 2, c: 0.5, d: 1 },
    { name: 'Inversion', a: -0.5, b: 0, c: 0, d: -0.5 }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="border-2 border-blue-400/30 bg-gradient-to-r from-white/[0.06] to-white/[0.02] border border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-blue-800 flex items-center gap-2">
            📐 Max's Determinant Detective Agency
          </CardTitle>
          <p className="text-blue-700">
            Investigate how matrices transform shapes and discover the geometric meaning of determinants!
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Matrix Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Matrix Element Controls */}
            <div className="space-y-4">
              <h4 className="font-medium text-white/70">Matrix Elements</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-emerald-300/90">a: {matrixA.toFixed(2)}</label>
                  <Slider
                    value={[matrixA]}
                    onValueChange={(value) => setMatrixA(value[0])}
                    min={-3}
                    max={3}
                    step={0.1}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-amber-700">b: {matrixB.toFixed(2)}</label>
                  <Slider
                    value={[matrixB]}
                    onValueChange={(value) => setMatrixB(value[0])}
                    min={-3}
                    max={3}
                    step={0.1}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-emerald-300/90">c: {matrixC.toFixed(2)}</label>
                  <Slider
                    value={[matrixC]}
                    onValueChange={(value) => setMatrixC(value[0])}
                    min={-3}
                    max={3}
                    step={0.1}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-amber-700">d: {matrixD.toFixed(2)}</label>
                  <Slider
                    value={[matrixD]}
                    onValueChange={(value) => setMatrixD(value[0])}
                    min={-3}
                    max={3}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="bg-white/[0.03] p-3 rounded-lg">
                <p className="text-sm text-white/70 text-center">
                  Matrix: [{matrixA.toFixed(2)} {matrixB.toFixed(2)}]
                </p>
                <p className="text-sm text-white/70 text-center">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[{matrixC.toFixed(2)} {matrixD.toFixed(2)}]
                </p>
              </div>
            </div>

            {/* Shape Selection */}
            <div className="space-y-3">
              <h4 className="font-medium text-white/70">Shape to Transform</h4>
              <div className="grid grid-cols-2 gap-2">
                {(['square', 'triangle', 'circle', 'custom'] as const).map((shape) => (
                  <Button
                    key={shape}
                    variant={selectedShape === shape ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedShape(shape)}
                    className={selectedShape === shape ? 'bg-blue-600 hover:bg-blue-700' : ''}
                  >
                    {shape.charAt(0).toUpperCase() + shape.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Display Options */}
            <div className="space-y-3">
              <h4 className="font-medium text-white/70">Display Options</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showOriginalShape}
                    onChange={(e) => setShowOriginalShape(e.target.checked)}
                    className="rounded border-white/10 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">Show Original Shape</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showParallelogram}
                    onChange={(e) => setShowParallelogram(e.target.checked)}
                    className="rounded border-white/10 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">Show Basis Parallelogram</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showUnitSquare}
                    onChange={(e) => setShowUnitSquare(e.target.checked)}
                    className="rounded border-white/10 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">Show Unit Square</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    className="rounded border-white/10 text-blue-600 focus:ring-blue-500"
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
                onClick={resetMatrix}
                variant="outline"
                className="w-full"
              >
                Reset to Identity
              </Button>
              <Button
                onClick={onComplete}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={progress < 50}
              >
                Complete Investigation
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Visualization */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Geometric Transformation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                aria-label="Max determinant geometric transformation visualization"
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

      {/* Special Matrices */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Special Matrix Transformations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {specialMatrices.map((matrix) => (
              <Button
                key={matrix.name}
                variant="outline"
                onClick={() => animateToMatrix(matrix.a, matrix.b, matrix.c, matrix.d)}
                className="text-sm"
                disabled={isAnimating}
              >
                {matrix.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Determinant Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Determinant Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-white/70">Calculation</h4>
              <div className="text-sm space-y-1">
                <p>det(A) = ad - bc</p>
                <p>= ({matrixA.toFixed(2)})({matrixD.toFixed(2)}) - ({matrixB.toFixed(2)})({matrixC.toFixed(2)})</p>
                <p className="font-semibold">= {determinant.toFixed(3)}</p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-white/70">Geometric Meaning</h4>
              <div className="text-sm space-y-1">
                <p>Area scaling factor: {absoluteDeterminant.toFixed(2)}x</p>
                <p className={isInvertible ? 'text-green-600' : 'text-red-600'}>
                  {isInvertible ? '✓ Preserves 2D structure' : '✗ Collapses to line/point'}
                </p>
                <p className={preservesOrientation ? 'text-green-600' : 'text-red-600'}>
                  {preservesOrientation ? '✓ Preserves orientation' : '✗ Flips orientation'}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-white/70">Special Properties</h4>
              <div className="text-sm space-y-1">
                {Math.abs(determinant) < 0.001 && (
                  <p className="text-red-600">⚠ Singular matrix (non-invertible)</p>
                )}
                {Math.abs(determinant - 1) < 0.001 && (
                  <p className="text-green-600">⭐ Area preserving transformation</p>
                )}
                {Math.abs(determinant + 1) < 0.001 && (
                  <p className="text-blue-600">🔄 Area preserving with reflection</p>
                )}
                {Math.abs(determinant) > 1 && (
                  <p className="text-purple-600">📈 Area expanding transformation</p>
                )}
                {Math.abs(determinant) < 1 && Math.abs(determinant) > 0.001 && (
                  <p className="text-orange-600">📉 Area contracting transformation</p>
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
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <Badge variant="outline" className="text-blue-700">
              {exploredMatrices.size} matrices explored
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeterminantExplorer;