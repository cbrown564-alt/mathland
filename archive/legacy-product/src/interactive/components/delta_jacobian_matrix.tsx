import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Slider } from '@/core/components/ui/slider';
import { Badge } from '@/core/components/ui/badge';

interface JacobianMatrixProps {
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  isPreview?: boolean;
}

const JacobianMatrixExplorer: React.FC<JacobianMatrixProps> = ({ 
  onComplete, 
  onProgress, 
  isPreview = false 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Function selection
  const [funcType, setFuncType] = useState<'linear' | 'quadratic' | 'polar' | 'custom'>('linear');
  
  // Point for evaluation
  const [pointX, setPointX] = useState(1);
  const [pointY, setPointY] = useState(1);
  
  // Visualization options
  const [showOriginalGrid, setShowOriginalGrid] = useState(true);
  const [showTransformedGrid, setShowTransformedGrid] = useState(true);
  const [showLinearApprox, setShowLinearApprox] = useState(false);
  const [animateTransformation, setAnimateTransformation] = useState(false);
  
  // Animation state
  const [animationT, setAnimationT] = useState(0);
  
  // Progress tracking
  const [exploredFunctions, setExploredFunctions] = useState<Set<string>>(new Set());
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([false, false, false, false]);

  const canvasWidth = 800;
  const canvasHeight = 600;
  const leftWidth = canvasWidth / 2;
  const rightWidth = canvasWidth / 2;
  const margin = 40;

  // Vector function definitions
  const evaluateFunction = useCallback((x: number, y: number): [number, number] => {
    switch (funcType) {
      case 'linear':
        return [2*x + y, x - y];
      case 'quadratic':
        return [x*x - y*y, 2*x*y];
      case 'polar':
        return [x*Math.cos(y), x*Math.sin(y)];
      case 'custom':
        return [x*x + y, x - y*y];
      default:
        return [x, y];
    }
  }, [funcType]);

  // Jacobian matrix calculation
  const calculateJacobian = useCallback((x: number, y: number): number[][] => {
    const h = 0.001;
    
    // Numerical partial derivatives
    const [f1_x_plus, f2_x_plus] = evaluateFunction(x + h, y);
    const [f1_x_minus, f2_x_minus] = evaluateFunction(x - h, y);
    const [f1_y_plus, f2_y_plus] = evaluateFunction(x, y + h);
    const [f1_y_minus, f2_y_minus] = evaluateFunction(x, y - h);
    
    const df1_dx = (f1_x_plus - f1_x_minus) / (2 * h);
    const df1_dy = (f1_y_plus - f1_y_minus) / (2 * h);
    const df2_dx = (f2_x_plus - f2_x_minus) / (2 * h);
    const df2_dy = (f2_y_plus - f2_y_minus) / (2 * h);
    
    return [
      [df1_dx, df1_dy],
      [df2_dx, df2_dy]
    ];
  }, [evaluateFunction]);

  // Analytical Jacobian for comparison
  const getAnalyticalJacobian = useCallback((x: number, y: number): number[][] => {
    switch (funcType) {
      case 'linear':
        return [[2, 1], [1, -1]];
      case 'quadratic':
        return [[2*x, -2*y], [2*y, 2*x]];
      case 'polar':
        return [[Math.cos(y), -x*Math.sin(y)], [Math.sin(y), x*Math.cos(y)]];
      case 'custom':
        return [[2*x, 1], [1, -2*y]];
      default:
        return [[1, 0], [0, 1]];
    }
  }, [funcType]);

  // Jacobian determinant
  const calculateDeterminant = useCallback((matrix: number[][]): number => {
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  }, []);

  // Linear approximation using Jacobian
  const linearApproximation = useCallback((x0: number, y0: number, dx: number, dy: number): [number, number] => {
    const [f0_x, f0_y] = evaluateFunction(x0, y0);
    const J = getAnalyticalJacobian(x0, y0);
    
    const df_x = J[0][0] * dx + J[0][1] * dy;
    const df_y = J[1][0] * dx + J[1][1] * dy;
    
    return [f0_x + df_x, f0_y + df_y];
  }, [evaluateFunction, getAnalyticalJacobian]);

  // Coordinate transformation
  const screenToMath = useCallback((screenX: number, screenY: number, isRight: boolean = false): [number, number] => {
    const plotWidth = (isRight ? rightWidth : leftWidth) - 2 * margin;
    const plotHeight = canvasHeight - 2 * margin;
    const xOffset = isRight ? leftWidth : 0;
    
    const x = ((screenX - xOffset - margin) / plotWidth) * 4 - 2; // [-2, 2] range
    const y = (1 - (screenY - margin) / plotHeight) * 4 - 2; // [-2, 2] range
    
    return [x, y];
  }, []);

  const mathToScreen = useCallback((x: number, y: number, isRight: boolean = false): [number, number] => {
    const plotWidth = (isRight ? rightWidth : leftWidth) - 2 * margin;
    const plotHeight = canvasHeight - 2 * margin;
    const xOffset = isRight ? leftWidth : 0;
    
    const screenX = xOffset + margin + ((x + 2) / 4) * plotWidth;
    const screenY = margin + (1 - (y + 2) / 4) * plotHeight;
    
    return [screenX, screenY];
  }, []);

  // Drawing functions
  const drawGrid = useCallback((ctx: CanvasRenderingContext2D, isRight: boolean, transform: boolean = false) => {
    ctx.strokeStyle = 'rgba(107, 114, 128, 0.3)';
    ctx.lineWidth = 1;

    // Grid lines
    for (let i = -2; i <= 2; i += 0.5) {
      for (let j = -2; j <= 2; j += 0.5) {
        if (Math.abs(i) < 0.01 || Math.abs(j) < 0.01) continue; // Skip axes
        
        let x1 = i, y1 = j - 0.25;
        let x2 = i, y2 = j + 0.25;
        let x3 = i - 0.25, y3 = j;
        let x4 = i + 0.25, y4 = j;

        if (transform && isRight) {
          [x1, y1] = evaluateFunction(x1, y1);
          [x2, y2] = evaluateFunction(x2, y2);
          [x3, y3] = evaluateFunction(x3, y3);
          [x4, y4] = evaluateFunction(x4, y4);
        }

        const [screen1X, screen1Y] = mathToScreen(x1, y1, isRight);
        const [screen2X, screen2Y] = mathToScreen(x2, y2, isRight);
        const [screen3X, screen3Y] = mathToScreen(x3, y3, isRight);
        const [screen4X, screen4Y] = mathToScreen(x4, y4, isRight);

        ctx.beginPath();
        ctx.moveTo(screen1X, screen1Y);
        ctx.lineTo(screen2X, screen2Y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(screen3X, screen3Y);
        ctx.lineTo(screen4X, screen4Y);
        ctx.stroke();
      }
    }
  }, [evaluateFunction, mathToScreen]);

  const drawAxes = useCallback((ctx: CanvasRenderingContext2D, isRight: boolean) => {
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 2;

    const [xAxisStart] = mathToScreen(-2, 0, isRight);
    const [xAxisEnd] = mathToScreen(2, 0, isRight);
    const [, yAxisStart] = mathToScreen(0, -2, isRight);
    const [, yAxisEnd] = mathToScreen(0, 2, isRight);
    const [originX, originY] = mathToScreen(0, 0, isRight);

    // X-axis
    ctx.beginPath();
    ctx.moveTo(xAxisStart, originY);
    ctx.lineTo(xAxisEnd, originY);
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(originX, yAxisStart);
    ctx.lineTo(originX, yAxisEnd);
    ctx.stroke();

    // Labels
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText(isRight ? "F(x,y)" : "Input (x,y)", originX + 5, yAxisStart - 10);
  }, [mathToScreen]);

  const drawTransformationGrid = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!showTransformedGrid) return;

    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;

    // Draw transformed grid lines
    const gridStep = 0.2;
    for (let i = -2; i <= 2; i += gridStep) {
      ctx.beginPath();
      for (let j = -2; j <= 2; j += 0.05) {
        const [fx, fy] = evaluateFunction(i, j);
        const [screenX, screenY] = mathToScreen(fx, fy, true);
        
        if (j === -2) {
          ctx.moveTo(screenX, screenY);
        } else {
          ctx.lineTo(screenX, screenY);
        }
      }
      ctx.stroke();

      ctx.beginPath();
      for (let j = -2; j <= 2; j += 0.05) {
        const [fx, fy] = evaluateFunction(j, i);
        const [screenX, screenY] = mathToScreen(fx, fy, true);
        
        if (j === -2) {
          ctx.moveTo(screenX, screenY);
        } else {
          ctx.lineTo(screenX, screenY);
        }
      }
      ctx.stroke();
    }
  }, [showTransformedGrid, evaluateFunction, mathToScreen]);

  const drawLinearApproximation = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!showLinearApprox) return;

    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    // Draw linear approximation grid
    const step = 0.3;
    for (let i = -1; i <= 1; i += step) {
      ctx.beginPath();
      for (let j = -1; j <= 1; j += 0.05) {
        const dx = i - pointX;
        const dy = j - pointY;
        const [fx, fy] = linearApproximation(pointX, pointY, dx, dy);
        const [screenX, screenY] = mathToScreen(fx, fy, true);
        
        if (j === -1) {
          ctx.moveTo(screenX, screenY);
        } else {
          ctx.lineTo(screenX, screenY);
        }
      }
      ctx.stroke();

      ctx.beginPath();
      for (let j = -1; j <= 1; j += 0.05) {
        const dx = j - pointX;
        const dy = i - pointY;
        const [fx, fy] = linearApproximation(pointX, pointY, dx, dy);
        const [screenX, screenY] = mathToScreen(fx, fy, true);
        
        if (j === -1) {
          ctx.moveTo(screenX, screenY);
        } else {
          ctx.lineTo(screenX, screenY);
        }
      }
      ctx.stroke();
    }

    ctx.setLineDash([]);
  }, [showLinearApprox, pointX, pointY, linearApproximation, mathToScreen]);

  const drawPoint = useCallback((ctx: CanvasRenderingContext2D) => {
    // Original point
    const [screenX, screenY] = mathToScreen(pointX, pointY, false);
    ctx.fillStyle = '#7C3AED';
    ctx.beginPath();
    ctx.arc(screenX, screenY, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Transformed point
    const [fx, fy] = evaluateFunction(pointX, pointY);
    const [transformedX, transformedY] = mathToScreen(fx, fy, true);
    ctx.fillStyle = '#059669';
    ctx.beginPath();
    ctx.arc(transformedX, transformedY, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#7C3AED';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText(`(${pointX.toFixed(1)}, ${pointY.toFixed(1)})`, screenX + 10, screenY - 10);
    
    ctx.fillStyle = '#059669';
    ctx.fillText(`F(${pointX.toFixed(1)}, ${pointY.toFixed(1)})`, transformedX + 10, transformedY - 10);
  }, [pointX, pointY, evaluateFunction, mathToScreen]);

  const drawJacobianInfo = useCallback((ctx: CanvasRenderingContext2D) => {
    const J = getAnalyticalJacobian(pointX, pointY);
    const det = calculateDeterminant(J);

    ctx.fillStyle = '#1F2937';
    ctx.font = '14px Inter, sans-serif';

    // Title
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.fillText('Dr. Delta\'s Jacobian Analysis', 20, 30);
    
    ctx.font = '14px Inter, sans-serif';
    
    // Point info
    ctx.fillText(`Point: (${pointX.toFixed(2)}, ${pointY.toFixed(2)})`, 20, 55);
    const [fx, fy] = evaluateFunction(pointX, pointY);
    ctx.fillText(`F(x,y): (${fx.toFixed(2)}, ${fy.toFixed(2)})`, 20, 75);

    // Jacobian matrix
    ctx.fillText('Jacobian Matrix J:', 20, 105);
    ctx.font = '12px Monaco, monospace';
    ctx.fillText(`┌                    ┐`, 20, 125);
    ctx.fillText(`│ ${J[0][0].toFixed(3)}  ${J[0][1].toFixed(3)} │`, 20, 145);
    ctx.fillText(`│ ${J[1][0].toFixed(3)}  ${J[1][1].toFixed(3)} │`, 20, 165);
    ctx.fillText(`└                    ┘`, 20, 185);

    ctx.font = '14px Inter, sans-serif';
    ctx.fillText(`Determinant: ${det.toFixed(3)}`, 20, 210);
    
    // Interpretation
    if (Math.abs(det) > 0.1) {
      ctx.fillStyle = '#059669';
      ctx.fillText('✓ Locally invertible', 20, 235);
    } else if (Math.abs(det) < 0.01) {
      ctx.fillStyle = '#DC2626';
      ctx.fillText('⚠ Near singular', 20, 235);
    } else {
      ctx.fillStyle = '#F59E0B';
      ctx.fillText('△ Small determinant', 20, 235);
    }

    ctx.fillStyle = '#6B7280';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText(`Area scaling: ${Math.abs(det).toFixed(3)}×`, 20, 255);
  }, [pointX, pointY, getAnalyticalJacobian, calculateDeterminant, evaluateFunction]);

  // Main drawing function
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw dividing line
    ctx.strokeStyle = '#D1D5DB';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(leftWidth, 0);
    ctx.lineTo(leftWidth, canvasHeight);
    ctx.stroke();

    // Draw left side (input space)
    if (showOriginalGrid) {
      drawGrid(ctx, false);
    }
    drawAxes(ctx, false);

    // Draw right side (output space)
    if (showOriginalGrid) {
      drawGrid(ctx, true);
    }
    drawAxes(ctx, true);
    drawTransformationGrid(ctx);
    drawLinearApproximation(ctx);

    // Draw points
    drawPoint(ctx);

    // Draw info panel
    drawJacobianInfo(ctx);

    // Labels
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = 'bold 18px Inter, sans-serif';
    ctx.fillText('Input Space', margin, canvasHeight - 20);
    ctx.fillText('Output Space F(x,y)', leftWidth + margin, canvasHeight - 20);
  }, [showOriginalGrid, drawGrid, drawAxes, drawTransformationGrid, drawLinearApproximation, drawPoint, drawJacobianInfo]);

  // Animation
  useEffect(() => {
    if (!animateTransformation) return;

    const interval = setInterval(() => {
      setAnimationT(prev => (prev + 0.02) % (2 * Math.PI));
      setPointX(Math.cos(animationT));
      setPointY(Math.sin(animationT));
    }, 50);

    return () => clearInterval(interval);
  }, [animateTransformation, animationT]);

  // Redraw when state changes
  useEffect(() => {
    draw();
  }, [draw]);

  // Mouse interaction
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvasWidth / rect.width;
    const scaleY = canvasHeight / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    // Only handle clicks on left side (input space)
    if (x < leftWidth) {
      const [mathX, mathY] = screenToMath(x, y, false);
      setPointX(Math.max(-2, Math.min(2, mathX)));
      setPointY(Math.max(-2, Math.min(2, mathY)));
      
      // Track progress
      const newExplored = new Set(exploredFunctions);
      newExplored.add(funcType);
      setExploredFunctions(newExplored);
    }
  };

  // Step completion tracking
  const checkStepCompletion = useCallback(() => {
    const newCompletedSteps = [...completedSteps];
    const J = getAnalyticalJacobian(pointX, pointY);
    const det = calculateDeterminant(J);
    
    // Step 1: Explore different function types
    if (exploredFunctions.size >= 2) newCompletedSteps[0] = true;
    
    // Step 2: Find high determinant
    if (Math.abs(det) > 2) newCompletedSteps[1] = true;
    
    // Step 3: Find low determinant  
    if (Math.abs(det) < 0.5 && Math.abs(det) > 0.01) newCompletedSteps[2] = true;
    
    // Step 4: Use linear approximation
    if (showLinearApprox) newCompletedSteps[3] = true;
    
    setCompletedSteps(newCompletedSteps);
    
    const completedCount = newCompletedSteps.filter(Boolean).length;
    if (onProgress) {
      onProgress(completedCount / 4);
    }
    
    if (completedCount === 4 && onComplete) {
      onComplete();
    }
  }, [exploredFunctions.size, pointX, pointY, getAnalyticalJacobian, calculateDeterminant, showLinearApprox, completedSteps, onProgress, onComplete]);

  useEffect(() => {
    checkStepCompletion();
  }, [checkStepCompletion]);

  const functionExamples = [
    { type: 'linear', name: 'Linear Transform', formula: 'F(x,y) = (2x+y, x-y)' },
    { type: 'quadratic', name: 'Quadratic', formula: 'F(x,y) = (x²-y², 2xy)' },
    { type: 'polar', name: 'Polar Coords', formula: 'F(x,y) = (x cos y, x sin y)' },
    { type: 'custom', name: 'Mixed Terms', formula: 'F(x,y) = (x²+y, x-y²)' }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-white/[0.06] to-white/[0.02] border border-white/10 border-indigo-400/30">
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl font-bold text-indigo-200 flex items-center gap-2">
            🧮 Dr. Delta's Jacobian Matrix Laboratory
          </CardTitle>
          <p className="text-indigo-700 text-lg">
            Explore how the Jacobian matrix organizes all partial derivatives for vector-valued functions!
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Controls */}
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-indigo-700">Function Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Function Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Vector Function F(x,y)</label>
              <div className="space-y-2">
                {functionExamples.map((func) => (
                  <Button
                    key={func.type}
                    size="sm"
                    variant={funcType === func.type ? "default" : "outline"}
                    onClick={() => setFuncType(func.type)}
                    className="w-full justify-start text-xs"
                  >
                    <div className="text-left">
                      <div className="font-semibold">{func.name}</div>
                      <div className="text-xs opacity-70">{func.formula}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Point Controls */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Evaluation Point: ({pointX.toFixed(2)}, {pointY.toFixed(2)})
              </label>
              <div className="space-y-3">
                <div>
                  <label className="text-xs">x-coordinate</label>
                  <Slider
                    value={[pointX]}
                    onValueChange={([value]) => setPointX(value)}
                    min={-2}
                    max={2}
                    step={0.1}
                  />
                </div>
                <div>
                  <label className="text-xs">y-coordinate</label>
                  <Slider
                    value={[pointY]}
                    onValueChange={([value]) => setPointY(value)}
                    min={-2}
                    max={2}
                    step={0.1}
                  />
                </div>
              </div>
            </div>

            {/* Display Options */}
            <div className="space-y-3">
              <h4 className="font-medium">Visualization Options</h4>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showOriginalGrid}
                  onChange={(e) => setShowOriginalGrid(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Show Grid</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showTransformedGrid}
                  onChange={(e) => setShowTransformedGrid(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Show Transformation</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showLinearApprox}
                  onChange={(e) => setShowLinearApprox(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Linear Approximation</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={animateTransformation}
                  onChange={(e) => setAnimateTransformation(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Animate Point</span>
              </label>
            </div>

            {/* Preset Points */}
            <div className="space-y-2">
              <h4 className="font-medium">Interesting Points</h4>
              {[
                { name: 'Origin', x: 0, y: 0 },
                { name: 'Unit Circle', x: 1, y: 0 },
                { name: 'Diagonal', x: 1, y: 1 },
                { name: 'Symmetric', x: -1, y: 1 }
              ].map((preset) => (
                <Button
                  key={preset.name}
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setPointX(preset.x);
                    setPointY(preset.y);
                  }}
                  className="w-full justify-start"
                >
                  {preset.name} ({preset.x}, {preset.y})
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Visualization */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-indigo-700">Jacobian Matrix Visualization</CardTitle>
            <p className="text-sm text-white/55">
              Click on the left panel to move the evaluation point. Watch how the transformation changes!
            </p>
          </CardHeader>
          <CardContent>
            <canvas
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              aria-label="Delta interactive Jacobian matrix visualization"
              onClick={handleCanvasClick}
              className="border rounded-lg cursor-crosshair bg-white/[0.04]"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </CardContent>
        </Card>

        {/* Analysis Panel */}
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-indigo-700">Mathematical Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Jacobian */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Current Jacobian</h4>
              <div className="space-y-1 text-sm font-mono">
                {(() => {
                  const J = getAnalyticalJacobian(pointX, pointY);
                  const det = calculateDeterminant(J);
                  return (
                    <>
                      <div>J₁₁ = {J[0][0].toFixed(3)}</div>
                      <div>J₁₂ = {J[0][1].toFixed(3)}</div>
                      <div>J₂₁ = {J[1][0].toFixed(3)}</div>
                      <div>J₂₂ = {J[1][1].toFixed(3)}</div>
                      <div className="pt-2 border-t">
                        det(J) = {det.toFixed(3)}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Key Insights */}
            <div className="bg-purple-50 p-3 rounded-lg">
              <h4 className="font-medium text-purple-200 mb-2">Dr. Delta's Insights</h4>
              <div className="space-y-2 text-sm text-purple-700">
                <div>📊 Jacobian organizes all partial derivatives</div>
                <div>📏 Linear approximation: F(x+h) ≈ F(x) + J(x)h</div>
                <div>📐 Determinant measures area scaling</div>
                <div>🔄 Non-zero det → locally invertible</div>
              </div>
            </div>

            {/* Progress Tracking */}
            <div className="bg-green-50 p-3 rounded-lg">
              <h4 className="font-medium text-emerald-200 mb-2">Exploration Progress</h4>
              <div className="space-y-2">
                {[
                  'Explore different functions',
                  'Find high determinant (>2)',
                  'Find low determinant (<0.5)',
                  'Use linear approximation'
                ].map((step, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className={`w-4 h-4 rounded-full ${completedSteps[index] ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className={`text-sm ${completedSteps[index] ? 'text-emerald-300/90' : 'text-white/55'}`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Formula */}
            <div className="bg-indigo-50 p-3 rounded-lg">
              <h4 className="font-medium text-indigo-200 mb-2">Jacobian Matrix</h4>
              <div className="text-center">
                <div className="text-sm font-mono text-indigo-700">
                  <div>J = [∂fᵢ/∂xⱼ]</div>
                  <div className="mt-2 text-xs">
                    ┌ ∂f₁/∂x  ∂f₁/∂y ┐<br/>
                    └ ∂f₂/∂x  ∂f₂/∂y ┘
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="bg-yellow-50 border-yellow-400/30">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">How to Use This Tool</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
                <li><strong>Click on the left panel</strong> to move the evaluation point</li>
                <li><strong>Try different functions</strong> to see how Jacobians change</li>
                <li><strong>Watch the determinant</strong> to understand area scaling</li>
                <li><strong>Enable linear approximation</strong> to see Jacobian-based predictions</li>
                <li><strong>Explore singularities</strong> where the determinant approaches zero</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JacobianMatrixExplorer;