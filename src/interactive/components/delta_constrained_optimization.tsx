import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Slider } from '@/core/components/ui/slider';
import { Badge } from '@/core/components/ui/badge';

interface ConstrainedOptimizationProps {
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  isPreview?: boolean;
}

interface Point {
  x: number;
  y: number;
}

interface OptimizationResult {
  criticalPoints: Point[];
  objectiveValue: number;
  lagrangeMultiplier: number;
  constraintSatisfied: boolean;
  optimizationType: 'maximum' | 'minimum' | 'saddle';
}

const ConstrainedOptimization: React.FC<ConstrainedOptimizationProps> = ({ 
  onComplete, 
  onProgress, 
  isPreview = false 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Problem parameters
  const [problemType, setProblemType] = useState<'quadratic' | 'economic' | 'engineering' | 'custom'>('quadratic');
  const [constraintType, setConstraintType] = useState<'linear' | 'circle' | 'ellipse' | 'custom'>('circle');
  
  // Function parameters for f(x,y) = ax² + by² + cxy + dx + ey + f
  const [objA, setObjA] = useState(1);
  const [objB, setObjB] = useState(1);
  const [objC, setObjC] = useState(0);
  const [objD, setObjD] = useState(0);
  const [objE, setObjE] = useState(0);
  const [objF, setObjF] = useState(0);
  
  // Constraint parameters for g(x,y) = ax + by + c = 0 or x² + y² = r²
  const [constraintA, setConstraintA] = useState(0);
  const [constraintB, setConstraintB] = useState(0);
  const [constraintC, setConstraintC] = useState(1);
  const [constraintR, setConstraintR] = useState(2);
  
  // Visualization options
  const [showObjectiveContours, setShowObjectiveContours] = useState(true);
  const [showConstraintCurve, setShowConstraintCurve] = useState(true);
  const [showGradients, setShowGradients] = useState(true);
  const [showOptimalPoint, setShowOptimalPoint] = useState(true);
  const [showLagrangePath, setShowLagrangePath] = useState(false);
  
  // Analysis state
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  
  // Progress tracking
  const [progress, setProgress] = useState(0);
  const [solvedProblems, setSolvedProblems] = useState<Set<string>>(new Set());

  const canvasWidth = 600;
  const canvasHeight = 400;
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;
  const scale = 60;

  // Evaluate objective function
  const evaluateObjective = useCallback((x: number, y: number): number => {
    return objA * x * x + objB * y * y + objC * x * y + objD * x + objE * y + objF;
  }, [objA, objB, objC, objD, objE, objF]);

  // Evaluate constraint function
  const evaluateConstraint = useCallback((x: number, y: number): number => {
    switch (constraintType) {
      case 'linear':
        return constraintA * x + constraintB * y + constraintC;
      case 'circle':
        return x * x + y * y - constraintR * constraintR;
      case 'ellipse':
        return x * x / (constraintR * constraintR) + y * y / (constraintR * constraintR * 0.5) - 1;
      default:
        return x * x + y * y - constraintR * constraintR;
    }
  }, [constraintType, constraintA, constraintB, constraintC, constraintR]);

  // Calculate gradient of objective function
  const objectiveGradient = useCallback((x: number, y: number): [number, number] => {
    const fx = 2 * objA * x + objC * y + objD;
    const fy = 2 * objB * y + objC * x + objE;
    return [fx, fy];
  }, [objA, objB, objC, objD, objE]);

  // Calculate gradient of constraint function
  const constraintGradient = useCallback((x: number, y: number): [number, number] => {
    switch (constraintType) {
      case 'linear':
        return [constraintA, constraintB];
      case 'circle':
        return [2 * x, 2 * y];
      case 'ellipse':
        return [2 * x / (constraintR * constraintR), 2 * y / (constraintR * constraintR * 0.5)];
      default:
        return [2 * x, 2 * y];
    }
  }, [constraintType, constraintA, constraintB, constraintR]);

  // Solve constrained optimization using Lagrange multipliers
  const solveConstrainedOptimization = useCallback(() => {
    setIsAnalyzing(true);
    
    // For circular constraint x² + y² = r², solve:
    // ∇f = λ∇g
    // (2ax + cy + d, 2by + cx + e) = λ(2x, 2y)
    // x² + y² = r²
    
    let solutions: Point[] = [];
    
    if (constraintType === 'circle') {
      // Parametric approach: x = r*cos(θ), y = r*sin(θ)
      const numSamples = 100;
      const bestPoints: { point: Point; value: number; type: 'maximum' | 'minimum' }[] = [];
      
      for (let i = 0; i < numSamples; i++) {
        const theta = (2 * Math.PI * i) / numSamples;
        const x = constraintR * Math.cos(theta);
        const y = constraintR * Math.sin(theta);
        const value = evaluateObjective(x, y);
        
        bestPoints.push({ point: { x, y }, value, type: 'minimum' });
      }
      
      // Find actual optimum
      bestPoints.sort((a, b) => a.value - b.value);
      const minimum = bestPoints[0];
      const maximum = bestPoints[bestPoints.length - 1];
      
      // Calculate Lagrange multiplier at optimum
      const [fx, fy] = objectiveGradient(minimum.point.x, minimum.point.y);
      const [gx, gy] = constraintGradient(minimum.point.x, minimum.point.y);
      const lambda = (fx * gx + fy * gy) / (gx * gx + gy * gy);
      
      solutions = [minimum.point, maximum.point];
      
      setOptimizationResult({
        criticalPoints: solutions,
        objectiveValue: minimum.value,
        lagrangeMultiplier: lambda,
        constraintSatisfied: true,
        optimizationType: 'minimum'
      });
    } else if (constraintType === 'linear' && constraintA !== 0 && constraintB !== 0) {
      // Linear constraint: ax + by + c = 0 -> y = -(ax + c)/b
      // Substitute into objective and find critical points
      const effectiveA = objA;
      const effectiveB = objB * (constraintA / constraintB) * (constraintA / constraintB) + 
                         objC * (constraintA / constraintB);
      const effectiveC = objD - objE * (constraintA / constraintB) - 
                         2 * objB * constraintC * (constraintA / constraintB) / constraintB;
      
      if (Math.abs(effectiveB) > 1e-10) {
        const xOpt = -effectiveC / (2 * effectiveB);
        const yOpt = -(constraintA * xOpt + constraintC) / constraintB;
        
        solutions = [{ x: xOpt, y: yOpt }];
        
        const [fx, fy] = objectiveGradient(xOpt, yOpt);
        const [gx, gy] = constraintGradient(xOpt, yOpt);
        const lambda = fx / gx;
        
        setOptimizationResult({
          criticalPoints: solutions,
          objectiveValue: evaluateObjective(xOpt, yOpt),
          lagrangeMultiplier: lambda,
          constraintSatisfied: Math.abs(evaluateConstraint(xOpt, yOpt)) < 1e-10,
          optimizationType: effectiveB > 0 ? 'minimum' : 'maximum'
        });
      }
    }
    
    setIsAnalyzing(false);
  }, [constraintType, constraintR, constraintA, constraintB, constraintC, evaluateObjective, evaluateConstraint, objectiveGradient, constraintGradient]);

  // Drawing functions
  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    
    for (let i = -5; i <= 5; i++) {
      // Vertical lines
      ctx.beginPath();
      ctx.moveTo(centerX + i * scale / 2, 0);
      ctx.lineTo(centerX + i * scale / 2, canvasHeight);
      ctx.stroke();
      
      // Horizontal lines
      ctx.beginPath();
      ctx.moveTo(0, centerY + i * scale / 2);
      ctx.lineTo(canvasWidth, centerY + i * scale / 2);
      ctx.stroke();
    }
  };

  const drawAxes = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#374151';
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
    ctx.fillStyle = '#374151';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 3, 0, 2 * Math.PI);
    ctx.fill();
    
    // Labels
    ctx.fillStyle = '#6B7280';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('x', canvasWidth - 20, centerY - 10);
    ctx.fillText('y', centerX + 10, 15);
  };

  const drawObjectiveContours = (ctx: CanvasRenderingContext2D) => {
    if (!showObjectiveContours) return;
    
    const contourLevels = [-4, -2, 0, 2, 4, 6, 8, 10];
    const colors = ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899'];
    
    contourLevels.forEach((level, index) => {
      ctx.strokeStyle = colors[index % colors.length];
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.6;
      
      // Draw contour lines using marching squares-like approach
      const resolution = 100;
      const stepX = canvasWidth / resolution;
      const stepY = canvasHeight / resolution;
      
      for (let i = 0; i < resolution - 1; i++) {
        for (let j = 0; j < resolution - 1; j++) {
          const x1 = (i * stepX - centerX) / scale;
          const y1 = (centerY - j * stepY) / scale;
          const x2 = ((i + 1) * stepX - centerX) / scale;
          const y2 = (centerY - (j + 1) * stepY) / scale;
          
          const f11 = evaluateObjective(x1, y1);
          const f12 = evaluateObjective(x1, y2);
          const f21 = evaluateObjective(x2, y1);
          const f22 = evaluateObjective(x2, y2);
          
          // Check if contour level crosses this cell
          const minVal = Math.min(f11, f12, f21, f22);
          const maxVal = Math.max(f11, f12, f21, f22);
          
          if (minVal <= level && level <= maxVal) {
            // Draw approximation - this is simplified
            ctx.beginPath();
            ctx.arc(centerX + (x1 + x2) / 2 * scale, centerY - (y1 + y2) / 2 * scale, 1, 0, 2 * Math.PI);
            ctx.stroke();
          }
        }
      }
    });
    
    ctx.globalAlpha = 1.0;
  };

  const drawConstraintCurve = (ctx: CanvasRenderingContext2D) => {
    if (!showConstraintCurve) return;
    
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.8;
    
    if (constraintType === 'circle') {
      ctx.beginPath();
      ctx.arc(centerX, centerY, constraintR * scale, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (constraintType === 'ellipse') {
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(constraintR * scale, constraintR * scale * 0.7);
      ctx.beginPath();
      ctx.arc(0, 0, 1, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.restore();
    } else if (constraintType === 'linear') {
      // Draw line ax + by + c = 0
      if (Math.abs(constraintB) > 1e-10) {
        const xRange = 6;
        const x1 = -xRange;
        const y1 = -(constraintA * x1 + constraintC) / constraintB;
        const x2 = xRange;
        const y2 = -(constraintA * x2 + constraintC) / constraintB;
        
        ctx.beginPath();
        ctx.moveTo(centerX + x1 * scale, centerY - y1 * scale);
        ctx.lineTo(centerX + x2 * scale, centerY - y2 * scale);
        ctx.stroke();
      }
    }
    
    ctx.globalAlpha = 1.0;
  };

  const drawGradients = (ctx: CanvasRenderingContext2D) => {
    if (!showGradients || !optimizationResult) return;
    
    optimizationResult.criticalPoints.forEach(point => {
      const [fx, fy] = objectiveGradient(point.x, point.y);
      const [gx, gy] = constraintGradient(point.x, point.y);
      
      const x = centerX + point.x * scale;
      const y = centerY - point.y * scale;
      
      // Draw objective gradient
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + fx * scale * 0.3, y - fy * scale * 0.3);
      ctx.stroke();
      
      // Draw constraint gradient
      ctx.strokeStyle = '#DC2626';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + gx * scale * 0.3, y - gy * scale * 0.3);
      ctx.stroke();
      
      // Draw gradient labels
      ctx.fillStyle = '#3B82F6';
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText('∇f', x + fx * scale * 0.3 + 5, y - fy * scale * 0.3);
      
      ctx.fillStyle = '#DC2626';
      ctx.fillText('∇g', x + gx * scale * 0.3 + 5, y - gy * scale * 0.3);
    });
  };

  const drawOptimalPoint = (ctx: CanvasRenderingContext2D) => {
    if (!showOptimalPoint || !optimizationResult) return;
    
    optimizationResult.criticalPoints.forEach((point, index) => {
      const x = centerX + point.x * scale;
      const y = centerY - point.y * scale;
      
      // Draw point
      ctx.fillStyle = index === 0 ? '#059669' : '#DC2626';
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw outline
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.stroke();
      
      // Label
      ctx.fillStyle = '#1F2937';
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText(
        index === 0 ? 'Min' : 'Max',
        x + 10,
        y - 5
      );
    });
  };

  const drawAnalysisInfo = (ctx: CanvasRenderingContext2D) => {
    if (!optimizationResult) return;
    
    ctx.fillStyle = '#1F2937';
    ctx.font = '14px Inter, sans-serif';
    
    let yPos = 30;
    const lineHeight = 20;
    
    ctx.fillText('Lagrange Multiplier Analysis', 20, yPos);
    yPos += lineHeight;
    
    ctx.fillText(`λ = ${optimizationResult.lagrangeMultiplier.toFixed(3)}`, 20, yPos);
    yPos += lineHeight;
    
    ctx.fillText(`Objective Value: ${optimizationResult.objectiveValue.toFixed(3)}`, 20, yPos);
    yPos += lineHeight;
    
    ctx.fillText(`Type: ${optimizationResult.optimizationType}`, 20, yPos);
    yPos += lineHeight;
    
    ctx.fillText(
      `Constraint: ${optimizationResult.constraintSatisfied ? '✓ Satisfied' : '✗ Violated'}`,
      20,
      yPos
    );
  };

  // Main drawing function
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw grid and axes
    drawGrid(ctx);
    drawAxes(ctx);

    // Draw objective contours
    drawObjectiveContours(ctx);

    // Draw constraint curve
    drawConstraintCurve(ctx);

    // Draw gradients
    drawGradients(ctx);

    // Draw optimal point
    drawOptimalPoint(ctx);

    // Draw analysis info
    drawAnalysisInfo(ctx);
  }, [optimizationResult, showObjectiveContours, showConstraintCurve, showGradients, showOptimalPoint, constraintType, constraintR, constraintA, constraintB, constraintC, evaluateObjective, objectiveGradient, constraintGradient]);

  // Redraw when dependencies change
  useEffect(() => {
    draw();
  }, [draw]);

  // Solve optimization when parameters change
  useEffect(() => {
    solveConstrainedOptimization();
  }, [solveConstrainedOptimization]);

  // Progress tracking
  useEffect(() => {
    const problemKey = `${problemType}-${constraintType}-${objA}-${objB}-${constraintR}`;
    setSolvedProblems(prev => new Set([...prev, problemKey]));
    
    const newProgress = Math.min(100, solvedProblems.size * 6);
    setProgress(newProgress);
    onProgress?.(newProgress);
  }, [problemType, constraintType, objA, objB, constraintR, solvedProblems.size, onProgress]);

  const resetOptimization = () => {
    setSolvedProblems(new Set());
    setSelectedPoint(null);
    setOptimizationResult(null);
  };

  const problemPresets = [
    { name: 'Basic Circle', type: 'quadratic' as const, constraint: 'circle' as const, objA: 1, objB: 1, r: 2 },
    { name: 'Stretched Ellipse', type: 'quadratic' as const, constraint: 'ellipse' as const, objA: 2, objB: 1, r: 1.5 },
    { name: 'Saddle Point', type: 'quadratic' as const, constraint: 'circle' as const, objA: 1, objB: -1, r: 2 },
    { name: 'Linear Constraint', type: 'quadratic' as const, constraint: 'linear' as const, objA: 1, objB: 1, r: 2 },
    { name: 'Economic Model', type: 'economic' as const, constraint: 'linear' as const, objA: 2, objB: 1, r: 1.5 },
    { name: 'Engineering Design', type: 'engineering' as const, constraint: 'circle' as const, objA: 1, objB: 2, r: 1.8 }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-blue-800 flex items-center gap-2">
            🎯 Delta's Constrained Optimization Lab
          </CardTitle>
          <p className="text-blue-700">
            Master Lagrange multipliers and solve optimization problems with constraints! Find optimal solutions while respecting real-world limitations.
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Problem Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Problem Type */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">Problem Type</h4>
              <div className="grid grid-cols-2 gap-2">
                {(['quadratic', 'economic', 'engineering', 'custom'] as const).map((type) => (
                  <Button
                    key={type}
                    variant={problemType === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setProblemType(type)}
                    className={problemType === type ? 'bg-blue-600 hover:bg-blue-700' : ''}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Constraint Type */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">Constraint Type</h4>
              <div className="grid grid-cols-2 gap-2">
                {(['circle', 'ellipse', 'linear', 'custom'] as const).map((type) => (
                  <Button
                    key={type}
                    variant={constraintType === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setConstraintType(type)}
                    className={constraintType === type ? 'bg-blue-600 hover:bg-blue-700' : ''}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Objective Function Parameters */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">Objective Function f(x,y)</h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-blue-700">x² coeff: {objA.toFixed(1)}</label>
                  <Slider
                    value={[objA]}
                    onValueChange={(value) => setObjA(value[0])}
                    min={-3}
                    max={3}
                    step={0.1}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-blue-700">y² coeff: {objB.toFixed(1)}</label>
                  <Slider
                    value={[objB]}
                    onValueChange={(value) => setObjB(value[0])}
                    min={-3}
                    max={3}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-700">xy coeff: {objC.toFixed(1)}</label>
                <Slider
                  value={[objC]}
                  onValueChange={(value) => setObjC(value[0])}
                  min={-2}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Constraint Parameters */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">Constraint Parameters</h4>
              
              {constraintType === 'circle' || constraintType === 'ellipse' ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-blue-700">Radius: {constraintR.toFixed(1)}</label>
                  <Slider
                    value={[constraintR]}
                    onValueChange={(value) => setConstraintR(value[0])}
                    min={0.5}
                    max={4}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-blue-700">a: {constraintA.toFixed(1)}</label>
                    <Slider
                      value={[constraintA]}
                      onValueChange={(value) => setConstraintA(value[0])}
                      min={-2}
                      max={2}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-blue-700">b: {constraintB.toFixed(1)}</label>
                    <Slider
                      value={[constraintB]}
                      onValueChange={(value) => setConstraintB(value[0])}
                      min={-2}
                      max={2}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Display Options */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">Display Options</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showObjectiveContours}
                    onChange={(e) => setShowObjectiveContours(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">Show Objective Contours</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showConstraintCurve}
                    onChange={(e) => setShowConstraintCurve(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">Show Constraint Curve</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showGradients}
                    onChange={(e) => setShowGradients(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">Show Gradients</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showOptimalPoint}
                    onChange={(e) => setShowOptimalPoint(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">Show Optimal Points</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                onClick={solveConstrainedOptimization}
                variant="outline"
                className="w-full"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? 'Solving...' : 'Solve Optimization'}
              </Button>
              <Button
                onClick={resetOptimization}
                variant="outline"
                className="w-full"
              >
                Reset Problem
              </Button>
              <Button
                onClick={onComplete}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={progress < 50}
              >
                Complete Lab
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Visualization */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Constrained Optimization Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                className="w-full h-auto border border-gray-200 rounded-lg"
              />
              {isAnalyzing && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-blue-700 font-medium">Solving...</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Problem Presets */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Problem Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {problemPresets.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                onClick={() => {
                  setProblemType(preset.type);
                  setConstraintType(preset.constraint);
                  setObjA(preset.objA);
                  setObjB(preset.objB);
                  setConstraintR(preset.r);
                }}
                className="text-sm"
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {optimizationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Optimization Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">Lagrange Multiplier</h4>
                <div className="text-lg font-mono text-blue-600">
                  λ = {optimizationResult.lagrangeMultiplier.toFixed(4)}
                </div>
                <p className="text-sm text-gray-600">
                  Measures constraint's marginal impact on objective
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">Optimal Value</h4>
                <div className="text-lg font-mono text-green-600">
                  f* = {optimizationResult.objectiveValue.toFixed(4)}
                </div>
                <p className="text-sm text-gray-600">
                  {optimizationResult.optimizationType === 'minimum' ? 'Minimum' : 'Maximum'} value achieved
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">Constraint Status</h4>
                <div className={`text-lg font-mono ${optimizationResult.constraintSatisfied ? 'text-green-600' : 'text-red-600'}`}>
                  {optimizationResult.constraintSatisfied ? '✓ Satisfied' : '✗ Violated'}
                </div>
                <p className="text-sm text-gray-600">
                  Constraint equation satisfied at optimum
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
              {solvedProblems.size} problems solved
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConstrainedOptimization;