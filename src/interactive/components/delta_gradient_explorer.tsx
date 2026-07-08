import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Slider } from '@/core/components/ui/slider';
import { Badge } from '@/core/components/ui/badge';

interface GradientExplorerProps {
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  isPreview?: boolean;
}

const GradientExplorer: React.FC<GradientExplorerProps> = ({ 
  onComplete, 
  onProgress, 
  isPreview = false 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Function parameters
  const [funcA, setFuncA] = useState(1);
  const [funcB, setFuncB] = useState(1);
  const [funcC, setFuncC] = useState(0.5);
  const [funcType, setFuncType] = useState<'quadratic' | 'saddle' | 'bowl' | 'peaks'>('bowl');
  
  // Exploration point
  const [pointX, setPointX] = useState(0.5);
  const [pointY, setPointY] = useState(0.3);
  
  // Display options
  const [showContours, setShowContours] = useState(true);
  const [showGradient, setShowGradient] = useState(true);
  const [showGradientField, setShowGradientField] = useState(false);
  const [showDirectionalDerivatives, setShowDirectionalDerivatives] = useState(false);
  const [contourDensity, setContourDensity] = useState(8);
  
  // Directional derivative exploration
  const [direction, setDirection] = useState(0); // Angle in radians
  const [showMaxGradient, setShowMaxGradient] = useState(true);
  
  // Animation and interaction
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [exploredPoints, setExploredPoints] = useState<Set<string>>(new Set());

  const canvasWidth = 600;
  const canvasHeight = 400;
  const margin = 50;
  const plotWidth = canvasWidth - 2 * margin;
  const plotHeight = canvasHeight - 2 * margin;

  // Function definitions
  const evaluateFunction = useCallback((x: number, y: number) => {
    switch (funcType) {
      case 'quadratic':
        return funcA * (x * x + y * y) + funcB * x * y + funcC;
      case 'saddle':
        return funcA * (x * x - y * y) + funcB * x * y + funcC;
      case 'bowl':
        return funcA * ((x - 0.3) * (x - 0.3) + (y - 0.2) * (y - 0.2)) + funcB * Math.sin(3 * x) * Math.cos(3 * y) + funcC;
      case 'peaks': {
        const peak1 = Math.exp(-((x - 0.3) * (x - 0.3) + (y - 0.7) * (y - 0.7)) / 0.1);
        const peak2 = Math.exp(-((x - 0.7) * (x - 0.7) + (y - 0.3) * (y - 0.3)) / 0.1);
        return funcA * (peak1 + peak2) + funcB * (x * x + y * y) + funcC;
      }
      default:
        return 0;
    }
  }, [funcA, funcB, funcC, funcType]);

  // Calculate gradient at a point
  const calculateGradient = useCallback((x: number, y: number) => {
    const h = 0.001; // Small step for numerical differentiation
    const fx = (evaluateFunction(x + h, y) - evaluateFunction(x - h, y)) / (2 * h);
    const fy = (evaluateFunction(x, y + h) - evaluateFunction(x, y - h)) / (2 * h);
    return { x: fx, y: fy };
  }, [evaluateFunction]);

  // Calculate directional derivative
  const calculateDirectionalDerivative = useCallback((x: number, y: number, angle: number) => {
    const grad = calculateGradient(x, y);
    const dirX = Math.cos(angle);
    const dirY = Math.sin(angle);
    return grad.x * dirX + grad.y * dirY;
  }, [calculateGradient]);

  // Convert coordinates
  const screenToMath = useCallback((screenX: number, screenY: number) => {
    const x = (screenX - margin) / plotWidth;
    const y = 1 - (screenY - margin) / plotHeight;
    return { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) };
  }, []);

  const mathToScreen = useCallback((x: number, y: number) => {
    return {
      x: margin + x * plotWidth,
      y: margin + (1 - y) * plotHeight
    };
  }, []);

  // Drawing functions
  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    
    // Grid lines
    for (let i = 0; i <= 10; i++) {
      const x = margin + (i / 10) * plotWidth;
      const y = margin + (i / 10) * plotHeight;
      
      // Vertical lines
      ctx.beginPath();
      ctx.moveTo(x, margin);
      ctx.lineTo(x, margin + plotHeight);
      ctx.stroke();
      
      // Horizontal lines
      ctx.beginPath();
      ctx.moveTo(margin, y);
      ctx.lineTo(margin + plotWidth, y);
      ctx.stroke();
    }
  };

  const drawAxes = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(margin, margin + plotHeight);
    ctx.lineTo(margin + plotWidth, margin + plotHeight);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, margin + plotHeight);
    ctx.stroke();
    
    // Labels
    ctx.fillStyle = '#6B7280';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('x', margin + plotWidth - 15, margin + plotHeight + 20);
    ctx.fillText('y', margin - 20, margin + 15);
    
    // Tick marks and values
    for (let i = 0; i <= 10; i += 2) {
      const value = i / 10;
      const x = margin + (i / 10) * plotWidth;
      const y = margin + plotHeight - (i / 10) * plotHeight;
      
      // X-axis ticks
      ctx.fillText(value.toFixed(1), x - 8, margin + plotHeight + 15);
      
      // Y-axis ticks
      ctx.fillText(value.toFixed(1), margin - 25, y + 4);
    }
  };

  const drawContours = (ctx: CanvasRenderingContext2D) => {
    if (!showContours) return;
    
    const resolution = 100;
    const levels = contourDensity;
    
    // Find function range for contour levels
    let minVal = Infinity, maxVal = -Infinity;
    for (let i = 0; i <= resolution; i++) {
      for (let j = 0; j <= resolution; j++) {
        const x = i / resolution;
        const y = j / resolution;
        const val = evaluateFunction(x, y);
        minVal = Math.min(minVal, val);
        maxVal = Math.max(maxVal, val);
      }
    }
    
    // Draw contour lines
    for (let level = 0; level < levels; level++) {
      const contourValue = minVal + (level / (levels - 1)) * (maxVal - minVal);
      const color = `hsl(${240 + level * 120 / levels}, 70%, ${50 + level * 30 / levels}%)`;
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      
      // Simple contour drawing using marching squares (simplified)
      for (let i = 0; i < resolution - 1; i++) {
        for (let j = 0; j < resolution - 1; j++) {
          const x1 = i / resolution, y1 = j / resolution;
          const x2 = (i + 1) / resolution, y2 = (j + 1) / resolution;
          
          const v1 = evaluateFunction(x1, y1);
          const v2 = evaluateFunction(x2, y1);
          const v3 = evaluateFunction(x2, y2);
          const v4 = evaluateFunction(x1, y2);
          
          // Check for contour crossing and draw line segments
          const crossings = [];
          if ((v1 - contourValue) * (v2 - contourValue) < 0) {
            const t = (contourValue - v1) / (v2 - v1);
            crossings.push({ x: x1 + t * (x2 - x1), y: y1 });
          }
          if ((v2 - contourValue) * (v3 - contourValue) < 0) {
            const t = (contourValue - v2) / (v3 - v2);
            crossings.push({ x: x2, y: y1 + t * (y2 - y1) });
          }
          if ((v3 - contourValue) * (v4 - contourValue) < 0) {
            const t = (contourValue - v3) / (v4 - v3);
            crossings.push({ x: x2 - t * (x2 - x1), y: y2 });
          }
          if ((v4 - contourValue) * (v1 - contourValue) < 0) {
            const t = (contourValue - v4) / (v1 - v4);
            crossings.push({ x: x1, y: y2 - t * (y2 - y1) });
          }
          
          if (crossings.length >= 2) {
            const screen1 = mathToScreen(crossings[0].x, crossings[0].y);
            const screen2 = mathToScreen(crossings[1].x, crossings[1].y);
            
            ctx.beginPath();
            ctx.moveTo(screen1.x, screen1.y);
            ctx.lineTo(screen2.x, screen2.y);
            ctx.stroke();
          }
        }
      }
    }
  };

  const drawGradientField = (ctx: CanvasRenderingContext2D) => {
    if (!showGradientField) return;
    
    const step = 0.1;
    const scale = 20;
    
    ctx.strokeStyle = '#8B5CF6';
    ctx.lineWidth = 1;
    
    for (let x = 0; x <= 1; x += step) {
      for (let y = 0; y <= 1; y += step) {
        const grad = calculateGradient(x, y);
        const magnitude = Math.sqrt(grad.x * grad.x + grad.y * grad.y);
        
        if (magnitude > 0.01) {
          const startScreen = mathToScreen(x, y);
          const endScreen = mathToScreen(
            x + grad.x * scale / plotWidth,
            y + grad.y * scale / plotHeight
          );
          
          // Draw arrow
          ctx.beginPath();
          ctx.moveTo(startScreen.x, startScreen.y);
          ctx.lineTo(endScreen.x, endScreen.y);
          ctx.stroke();
          
          // Arrowhead
          const angle = Math.atan2(endScreen.y - startScreen.y, endScreen.x - startScreen.x);
          const arrowLength = 5;
          ctx.beginPath();
          ctx.moveTo(endScreen.x, endScreen.y);
          ctx.lineTo(
            endScreen.x - arrowLength * Math.cos(angle - Math.PI / 6),
            endScreen.y - arrowLength * Math.sin(angle - Math.PI / 6)
          );
          ctx.moveTo(endScreen.x, endScreen.y);
          ctx.lineTo(
            endScreen.x - arrowLength * Math.cos(angle + Math.PI / 6),
            endScreen.y - arrowLength * Math.sin(angle + Math.PI / 6)
          );
          ctx.stroke();
        }
      }
    }
  };

  const drawPoint = (ctx: CanvasRenderingContext2D) => {
    const screen = mathToScreen(pointX, pointY);
    const grad = calculateGradient(pointX, pointY);
    const gradMagnitude = Math.sqrt(grad.x * grad.x + grad.y * grad.y);
    
    // Draw point
    ctx.fillStyle = '#DC2626';
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, 6, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw gradient vector if enabled
    if (showGradient && gradMagnitude > 0.001) {
      const scale = 100;
      const gradEnd = mathToScreen(
        pointX + grad.x * scale / plotWidth,
        pointY + grad.y * scale / plotHeight
      );
      
      ctx.strokeStyle = '#DC2626';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(screen.x, screen.y);
      ctx.lineTo(gradEnd.x, gradEnd.y);
      ctx.stroke();
      
      // Arrowhead
      const angle = Math.atan2(gradEnd.y - screen.y, gradEnd.x - screen.x);
      const arrowLength = 8;
      ctx.beginPath();
      ctx.moveTo(gradEnd.x, gradEnd.y);
      ctx.lineTo(
        gradEnd.x - arrowLength * Math.cos(angle - Math.PI / 6),
        gradEnd.y - arrowLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        gradEnd.x - arrowLength * Math.cos(angle + Math.PI / 6),
        gradEnd.y - arrowLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();
      
      // Label
      ctx.fillStyle = '#DC2626';
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText('∇f', gradEnd.x + 10, gradEnd.y - 5);
    }
    
    // Draw directional derivatives if enabled
    if (showDirectionalDerivatives) {
      const angles = [0, Math.PI/4, Math.PI/2, 3*Math.PI/4, Math.PI, 5*Math.PI/4, 3*Math.PI/2, 7*Math.PI/4];
      const scale = 50;
      
      angles.forEach((angle, index) => {
        const dirDeriv = calculateDirectionalDerivative(pointX, pointY, angle);
        const length = Math.abs(dirDeriv) * scale;
        const endX = pointX + Math.cos(angle) * length / plotWidth;
        const endY = pointY + Math.sin(angle) * length / plotHeight;
        const screenEnd = mathToScreen(endX, endY);
        
        ctx.strokeStyle = dirDeriv > 0 ? '#059669' : '#DC2626';
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        
        ctx.beginPath();
        ctx.moveTo(screen.x, screen.y);
        ctx.lineTo(screenEnd.x, screenEnd.y);
        ctx.stroke();
        
        ctx.setLineDash([]);
      });
    }
    
    // Draw selected direction
    if (showDirectionalDerivatives) {
      const dirDeriv = calculateDirectionalDerivative(pointX, pointY, direction);
      const scale = 80;
      const endX = pointX + Math.cos(direction) * scale / plotWidth;
      const endY = pointY + Math.sin(direction) * scale / plotHeight;
      const screenEnd = mathToScreen(endX, endY);
      
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 4;
      
      ctx.beginPath();
      ctx.moveTo(screen.x, screen.y);
      ctx.lineTo(screenEnd.x, screenEnd.y);
      ctx.stroke();
      
      // Label
      ctx.fillStyle = '#F59E0B';
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText(`D_u f = ${dirDeriv.toFixed(3)}`, screenEnd.x + 10, screenEnd.y);
    }
  };

  // Main drawing function
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw layers
    drawGrid(ctx);
    drawAxes(ctx);
    drawContours(ctx);
    drawGradientField(ctx);
    drawPoint(ctx);

    // Information panel
    const fValue = evaluateFunction(pointX, pointY);
    const grad = calculateGradient(pointX, pointY);
    const gradMagnitude = Math.sqrt(grad.x * grad.x + grad.y * grad.y);
    
    ctx.fillStyle = '#1F2937';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText(`Point: (${pointX.toFixed(3)}, ${pointY.toFixed(3)})`, 20, 25);
    ctx.fillText(`f(x,y) = ${fValue.toFixed(3)}`, 20, 45);
    ctx.fillText(`∇f = [${grad.x.toFixed(3)}, ${grad.y.toFixed(3)}]`, 20, 65);
    ctx.fillText(`|∇f| = ${gradMagnitude.toFixed(3)}`, 20, 85);
    
    if (showDirectionalDerivatives) {
      const dirDeriv = calculateDirectionalDerivative(pointX, pointY, direction);
      const angle = direction * 180 / Math.PI;
      ctx.fillText(`Directional derivative (${angle.toFixed(0)}°): ${dirDeriv.toFixed(3)}`, 20, 105);
      ctx.fillText(`Max directional derivative: ${gradMagnitude.toFixed(3)}`, 20, 125);
    }
  }, [pointX, pointY, funcType, funcA, funcB, funcC, showContours, showGradient, showGradientField, showDirectionalDerivatives, direction, contourDensity, evaluateFunction, calculateGradient, calculateDirectionalDerivative]);

  // Mouse interaction
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvasWidth / rect.width;
    const scaleY = canvasHeight / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    const mathCoords = screenToMath(x, y);
    if (mathCoords.x >= 0 && mathCoords.x <= 1 && mathCoords.y >= 0 && mathCoords.y <= 1) {
      setPointX(mathCoords.x);
      setPointY(mathCoords.y);
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvasWidth / rect.width;
    const scaleY = canvasHeight / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    const mathCoords = screenToMath(x, y);
    if (mathCoords.x >= 0 && mathCoords.x <= 1 && mathCoords.y >= 0 && mathCoords.y <= 1) {
      setPointX(mathCoords.x);
      setPointY(mathCoords.y);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Redraw when dependencies change
  useEffect(() => {
    draw();
  }, [draw]);

  // Progress tracking
  useEffect(() => {
    const pointKey = `${pointX.toFixed(2)},${pointY.toFixed(2)}`;
    setExploredPoints(prev => new Set([...prev, pointKey]));
    
    const newProgress = Math.min(100, exploredPoints.size * 2);
    setProgress(newProgress);
    onProgress?.(newProgress);
  }, [pointX, pointY, exploredPoints.size, onProgress]);

  const resetExploration = () => {
    setPointX(0.5);
    setPointY(0.3);
    setDirection(0);
    setExploredPoints(new Set());
  };

  const functionPresets = [
    { name: 'Paraboloid', type: 'bowl' as const, a: 1, b: 0.2, c: 0 },
    { name: 'Saddle Point', type: 'saddle' as const, a: 1, b: 0, c: 0 },
    { name: 'Two Peaks', type: 'peaks' as const, a: 2, b: -0.5, c: 0 },
    { name: 'Quadratic', type: 'quadratic' as const, a: 0.8, b: 0.3, c: 0.1 }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-indigo-800 flex items-center gap-2">
            🎯 Delta's Gradient Direction Laboratory
          </CardTitle>
          <p className="text-indigo-700">
            Explore directional derivatives and discover how gradients point in the direction of steepest ascent!
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Exploration Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Function Selection */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">Function Type</h4>
              <div className="grid grid-cols-1 gap-2">
                {(['bowl', 'saddle', 'peaks', 'quadratic'] as const).map((type) => (
                  <Button
                    key={type}
                    variant={funcType === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFuncType(type)}
                    className={funcType === type ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Function Parameters */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">Function Parameters</h4>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-700">Parameter A: {funcA.toFixed(2)}</label>
                <Slider
                  value={[funcA]}
                  onValueChange={(value) => setFuncA(value[0])}
                  min={-2}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-700">Parameter B: {funcB.toFixed(2)}</label>
                <Slider
                  value={[funcB]}
                  onValueChange={(value) => setFuncB(value[0])}
                  min={-2}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-700">Parameter C: {funcC.toFixed(2)}</label>
                <Slider
                  value={[funcC]}
                  onValueChange={(value) => setFuncC(value[0])}
                  min={-1}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Point Position */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">Exploration Point</h4>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-indigo-700">X Position: {pointX.toFixed(3)}</label>
                <Slider
                  value={[pointX]}
                  onValueChange={(value) => setPointX(value[0])}
                  min={0}
                  max={1}
                  step={0.01}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-indigo-700">Y Position: {pointY.toFixed(3)}</label>
                <Slider
                  value={[pointY]}
                  onValueChange={(value) => setPointY(value[0])}
                  min={0}
                  max={1}
                  step={0.01}
                  className="w-full"
                />
              </div>
            </div>

            {/* Directional Derivative */}
            {showDirectionalDerivatives && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-amber-700">Direction: {(direction * 180 / Math.PI).toFixed(0)}°</label>
                <Slider
                  value={[direction]}
                  onValueChange={(value) => setDirection(value[0])}
                  min={0}
                  max={2 * Math.PI}
                  step={Math.PI / 12}
                  className="w-full"
                />
              </div>
            )}

            {/* Display Options */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">Display Options</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showContours}
                    onChange={(e) => setShowContours(e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm">Show Contour Lines</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showGradient}
                    onChange={(e) => setShowGradient(e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm">Show Gradient Vector</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showGradientField}
                    onChange={(e) => setShowGradientField(e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm">Show Gradient Field</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showDirectionalDerivatives}
                    onChange={(e) => setShowDirectionalDerivatives(e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm">Show Directional Derivatives</span>
                </label>
              </div>
            </div>

            {/* Contour Density */}
            {showContours && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Contour Density: {contourDensity}</label>
                <Slider
                  value={[contourDensity]}
                  onValueChange={(value) => setContourDensity(value[0])}
                  min={4}
                  max={16}
                  step={1}
                  className="w-full"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                onClick={resetExploration}
                variant="outline"
                className="w-full"
              >
                Reset Exploration
              </Button>
              <Button
                onClick={onComplete}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
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
            <CardTitle className="text-lg font-semibold">Function Landscape & Gradient Field</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                className="w-full h-auto border border-gray-200 rounded-lg cursor-crosshair"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
              <p className="text-sm text-gray-600 mt-2">
                Click and drag on the plot to move the exploration point
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Function Presets */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Function Presets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {functionPresets.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                onClick={() => {
                  setFuncType(preset.type);
                  setFuncA(preset.a);
                  setFuncB(preset.b);
                  setFuncC(preset.c);
                }}
                className="text-sm"
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mathematical Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Gradient Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Function Value</h4>
              <div className="text-sm space-y-1">
                <p>Point: ({pointX.toFixed(3)}, {pointY.toFixed(3)})</p>
                <p>f(x,y) = {evaluateFunction(pointX, pointY).toFixed(3)}</p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Gradient Vector</h4>
              <div className="text-sm space-y-1">
                {(() => {
                  const grad = calculateGradient(pointX, pointY);
                  const magnitude = Math.sqrt(grad.x * grad.x + grad.y * grad.y);
                  return (
                    <>
                      <p>∇f = [{grad.x.toFixed(3)}, {grad.y.toFixed(3)}]</p>
                      <p>|∇f| = {magnitude.toFixed(3)}</p>
                      <p className="text-indigo-600">Points in direction of steepest ascent</p>
                    </>
                  );
                })()}
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Directional Derivatives</h4>
              <div className="text-sm space-y-1">
                {showDirectionalDerivatives ? (
                  (() => {
                    const dirDeriv = calculateDirectionalDerivative(pointX, pointY, direction);
                    const maxDeriv = Math.sqrt(calculateGradient(pointX, pointY).x ** 2 + calculateGradient(pointX, pointY).y ** 2);
                    return (
                      <>
                        <p>Direction: {(direction * 180 / Math.PI).toFixed(0)}°</p>
                        <p>D_u f = {dirDeriv.toFixed(3)}</p>
                        <p>Max D_u f = {maxDeriv.toFixed(3)}</p>
                      </>
                    );
                  })()
                ) : (
                  <p className="text-gray-500">Enable directional derivatives to see analysis</p>
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
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <Badge variant="outline" className="text-indigo-700">
              {exploredPoints.size} points explored
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GradientExplorer;