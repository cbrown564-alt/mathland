import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Slider } from '@/core/components/ui/slider';
import { Badge } from '@/core/components/ui/badge';

interface DirectionalDerivativeProps {
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  isPreview?: boolean;
}

const DirectionalDerivativeExplorer: React.FC<DirectionalDerivativeProps> = ({ 
  onComplete, 
  onProgress, 
  isPreview = false 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Function parameters
  const [funcType, setFuncType] = useState<'hills' | 'saddle' | 'bowl' | 'ridge'>('hills');
  
  // Point position
  const [pointX, setPointX] = useState(0.5);
  const [pointY, setPointY] = useState(0.5);
  
  // Direction selection
  const [directionAngle, setDirectionAngle] = useState(0); // in degrees
  const [directionMagnitude, setDirectionMagnitude] = useState(1);
  
  // Display options
  const [showGradient, setShowGradient] = useState(true);
  const [showAllDirections, setShowAllDirections] = useState(false);
  const [showContours, setShowContours] = useState(true);
  const [animateDirection, setAnimateDirection] = useState(false);
  
  // Progress tracking
  const [exploredAngles, setExploredAngles] = useState<Set<number>>(new Set());
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([false, false, false, false]);

  const canvasWidth = 700;
  const canvasHeight = 500;
  const margin = 60;
  const plotWidth = canvasWidth - 2 * margin;
  const plotHeight = canvasHeight - 2 * margin;

  // Function definitions based on lesson requirements
  const evaluateFunction = useCallback((x: number, y: number) => {
    switch (funcType) {
      case 'hills': {
        // Two hills for interesting directional derivatives
        const hill1 = 2 * Math.exp(-((x - 0.3) * (x - 0.3) + (y - 0.3) * (y - 0.3)) / 0.05);
        const hill2 = 1.5 * Math.exp(-((x - 0.7) * (x - 0.7) + (y - 0.7) * (y - 0.7)) / 0.03);
        return hill1 + hill2 + 0.5 * (x * x + y * y);
      }
      case 'saddle':
        return 2 * (x * x - y * y) + x * y;
      case 'bowl':
        return 2 * ((x - 0.5) * (x - 0.5) + (y - 0.5) * (y - 0.5)) + 0.3 * Math.sin(8 * x) * Math.cos(8 * y);
      case 'ridge':
        return 3 * Math.exp(-((x - 0.5) * (x - 0.5)) / 0.02) - (y - 0.5) * (y - 0.5);
      default:
        return 0;
    }
  }, [funcType]);

  // Calculate gradient using numerical differentiation
  const calculateGradient = useCallback((x: number, y: number) => {
    const h = 0.001;
    const fx = (evaluateFunction(x + h, y) - evaluateFunction(x - h, y)) / (2 * h);
    const fy = (evaluateFunction(x, y + h) - evaluateFunction(x, y - h)) / (2 * h);
    return { x: fx, y: fy };
  }, [evaluateFunction]);

  // Calculate directional derivative: D_u f = ∇f · û
  const calculateDirectionalDerivative = useCallback((x: number, y: number, angleInDegrees: number, magnitude: number = 1) => {
    const grad = calculateGradient(x, y);
    const angleInRadians = (angleInDegrees * Math.PI) / 180;
    const dirX = Math.cos(angleInRadians) * magnitude;
    const dirY = Math.sin(angleInRadians) * magnitude;
    
    // For unit vector (magnitude = 1), this is the standard directional derivative
    // For non-unit vectors, we normalize: D_v f = (∇f · v) / ||v||
    const dirMagnitude = Math.sqrt(dirX * dirX + dirY * dirY);
    const unitDirX = dirX / dirMagnitude;
    const unitDirY = dirY / dirMagnitude;
    
    return grad.x * unitDirX + grad.y * unitDirY;
  }, [calculateGradient]);

  // Convert between screen and mathematical coordinates
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
  const drawFunction = useCallback((ctx: CanvasRenderingContext2D) => {
    const imageData = ctx.createImageData(plotWidth, plotHeight);
    const data = imageData.data;

    // Find function range for color mapping
    let minZ = Infinity, maxZ = -Infinity;
    for (let i = 0; i < plotWidth; i++) {
      for (let j = 0; j < plotHeight; j++) {
        const x = i / plotWidth;
        const y = j / plotHeight;
        const z = evaluateFunction(x, y);
        minZ = Math.min(minZ, z);
        maxZ = Math.max(maxZ, z);
      }
    }

    // Create heatmap
    for (let i = 0; i < plotWidth; i++) {
      for (let j = 0; j < plotHeight; j++) {
        const x = i / plotWidth;
        const y = j / plotHeight;
        const z = evaluateFunction(x, y);
        const normalized = (z - minZ) / (maxZ - minZ);
        
        // Delta's precision blue color scheme
        const pixelIndex = ((plotHeight - 1 - j) * plotWidth + i) * 4;
        data[pixelIndex] = Math.floor(255 * (1 - normalized * 0.8));     // R
        data[pixelIndex + 1] = Math.floor(255 * (1 - normalized * 0.6)); // G
        data[pixelIndex + 2] = Math.floor(255 * (1 - normalized * 0.2)); // B
        data[pixelIndex + 3] = 255;                                       // A
      }
    }

    ctx.putImageData(imageData, margin, margin);
  }, [evaluateFunction]);

  const drawContours = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!showContours) return;

    ctx.strokeStyle = 'rgba(55, 65, 81, 0.6)';
    ctx.lineWidth = 1;

    // Draw contour lines
    const numContours = 12;
    const contourValues: number[] = [];
    
    // Calculate contour values
    let minZ = Infinity, maxZ = -Infinity;
    for (let x = 0; x <= 1; x += 0.05) {
      for (let y = 0; y <= 1; y += 0.05) {
        const z = evaluateFunction(x, y);
        minZ = Math.min(minZ, z);
        maxZ = Math.max(maxZ, z);
      }
    }
    
    for (let i = 1; i < numContours; i++) {
      contourValues.push(minZ + (i / numContours) * (maxZ - minZ));
    }

    // Simple contour drawing using marching squares concept
    contourValues.forEach(contourValue => {
      for (let i = 0; i < plotWidth - 10; i += 10) {
        for (let j = 0; j < plotHeight - 10; j += 10) {
          const x1 = i / plotWidth;
          const y1 = j / plotHeight;
          const x2 = (i + 10) / plotWidth;
          const y2 = (j + 10) / plotHeight;
          
          const z1 = evaluateFunction(x1, y1);
          const z2 = evaluateFunction(x2, y2);
          
          if ((z1 <= contourValue && z2 >= contourValue) || (z1 >= contourValue && z2 <= contourValue)) {
            const screen1 = mathToScreen(x1, y1);
            const screen2 = mathToScreen(x2, y2);
            
            ctx.beginPath();
            ctx.moveTo(screen1.x, screen1.y);
            ctx.lineTo(screen2.x, screen2.y);
            ctx.stroke();
          }
        }
      }
    });
  }, [showContours, evaluateFunction, mathToScreen]);

  const drawGradient = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!showGradient) return;

    const grad = calculateGradient(pointX, pointY);
    const gradMagnitude = Math.sqrt(grad.x * grad.x + grad.y * grad.y);
    
    if (gradMagnitude < 0.001) return;

    const screenPoint = mathToScreen(pointX, pointY);
    const scale = 80; // Scale factor for visibility
    const endX = pointX + (grad.x / gradMagnitude) * (scale / plotWidth);
    const endY = pointY + (grad.y / gradMagnitude) * (scale / plotHeight);
    const screenEnd = mathToScreen(endX, endY);

    // Draw gradient vector (red)
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(screenPoint.x, screenPoint.y);
    ctx.lineTo(screenEnd.x, screenEnd.y);
    ctx.stroke();

    // Arrow head
    const angle = Math.atan2(screenEnd.y - screenPoint.y, screenEnd.x - screenPoint.x);
    const arrowLength = 12;
    ctx.beginPath();
    ctx.moveTo(screenEnd.x, screenEnd.y);
    ctx.lineTo(
      screenEnd.x - arrowLength * Math.cos(angle - Math.PI / 6),
      screenEnd.y - arrowLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(screenEnd.x, screenEnd.y);
    ctx.lineTo(
      screenEnd.x - arrowLength * Math.cos(angle + Math.PI / 6),
      screenEnd.y - arrowLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();

    // Label
    ctx.fillStyle = '#DC2626';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.fillText('∇f', screenEnd.x + 5, screenEnd.y - 5);
  }, [showGradient, pointX, pointY, calculateGradient, mathToScreen]);

  const drawDirectionalVector = useCallback((ctx: CanvasRenderingContext2D) => {
    const screenPoint = mathToScreen(pointX, pointY);
    const angleInRadians = (directionAngle * Math.PI) / 180;
    const scale = 60;
    
    const endX = pointX + Math.cos(angleInRadians) * (scale / plotWidth);
    const endY = pointY + Math.sin(angleInRadians) * (scale / plotHeight);
    const screenEnd = mathToScreen(endX, endY);

    // Draw direction vector (blue)
    ctx.strokeStyle = '#2563EB';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(screenPoint.x, screenPoint.y);
    ctx.lineTo(screenEnd.x, screenEnd.y);
    ctx.stroke();

    // Arrow head
    const angle = Math.atan2(screenEnd.y - screenPoint.y, screenEnd.x - screenPoint.x);
    const arrowLength = 10;
    ctx.beginPath();
    ctx.moveTo(screenEnd.x, screenEnd.y);
    ctx.lineTo(
      screenEnd.x - arrowLength * Math.cos(angle - Math.PI / 6),
      screenEnd.y - arrowLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(screenEnd.x, screenEnd.y);
    ctx.lineTo(
      screenEnd.x - arrowLength * Math.cos(angle + Math.PI / 6),
      screenEnd.y - arrowLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();

    // Label
    ctx.fillStyle = '#2563EB';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.fillText('û', screenEnd.x + 5, screenEnd.y - 5);
  }, [pointX, pointY, directionAngle, mathToScreen]);

  const drawAllDirections = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!showAllDirections) return;

    const screenPoint = mathToScreen(pointX, pointY);
    const numDirections = 8;
    const scale = 40;

    for (let i = 0; i < numDirections; i++) {
      const angle = (i * 360) / numDirections;
      const dirDeriv = calculateDirectionalDerivative(pointX, pointY, angle);
      const angleInRadians = (angle * Math.PI) / 180;
      
      // Scale by directional derivative value
      const length = Math.abs(dirDeriv) * scale;
      const endX = pointX + Math.cos(angleInRadians) * (length / plotWidth);
      const endY = pointY + Math.sin(angleInRadians) * (length / plotHeight);
      const screenEnd = mathToScreen(endX, endY);

      // Color based on sign
      ctx.strokeStyle = dirDeriv >= 0 ? '#059669' : '#DC2626';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 3]);
      
      ctx.beginPath();
      ctx.moveTo(screenPoint.x, screenPoint.y);
      ctx.lineTo(screenEnd.x, screenEnd.y);
      ctx.stroke();
    }
    
    ctx.setLineDash([]); // Reset line dash
  }, [showAllDirections, pointX, pointY, calculateDirectionalDerivative, mathToScreen]);

  const drawPoint = useCallback((ctx: CanvasRenderingContext2D) => {
    const screenPoint = mathToScreen(pointX, pointY);
    
    // Draw point
    ctx.fillStyle = '#7C3AED';
    ctx.beginPath();
    ctx.arc(screenPoint.x, screenPoint.y, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    // White border
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [pointX, pointY, mathToScreen]);

  const drawAxes = useCallback((ctx: CanvasRenderingContext2D) => {
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
    ctx.fillStyle = '#374151';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText('x', margin + plotWidth + 10, margin + plotHeight + 5);
    ctx.fillText('y', margin - 15, margin - 10);
  }, []);

  const drawInstructions = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#374151';
    ctx.font = '12px Inter, sans-serif';
    
    const directionalDeriv = calculateDirectionalDerivative(pointX, pointY, directionAngle);
    const grad = calculateGradient(pointX, pointY);
    const gradMagnitude = Math.sqrt(grad.x * grad.x + grad.y * grad.y);

    ctx.fillText(`Point: (${pointX.toFixed(2)}, ${pointY.toFixed(2)})`, 20, 20);
    ctx.fillText(`Direction: ${directionAngle}°`, 20, 40);
    ctx.fillText(`D_û f = ${directionalDeriv.toFixed(3)}`, 20, 60);
    ctx.fillText(`|∇f| = ${gradMagnitude.toFixed(3)}`, 20, 80);
    
    if (Math.abs(directionalDeriv - gradMagnitude) < 0.01) {
      ctx.fillStyle = '#059669';
      ctx.fillText('✓ Maximum directional derivative!', 20, 100);
    } else if (Math.abs(directionalDeriv + gradMagnitude) < 0.01) {
      ctx.fillStyle = '#DC2626';
      ctx.fillText('✓ Minimum directional derivative!', 20, 100);
    } else if (Math.abs(directionalDeriv) < 0.01) {
      ctx.fillStyle = '#7C3AED';
      ctx.fillText('✓ Zero directional derivative!', 20, 100);
    }
  }, [pointX, pointY, directionAngle, calculateDirectionalDerivative, calculateGradient]);

  // Main drawing function
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw function as heatmap
    drawFunction(ctx);
    
    // Draw contours
    drawContours(ctx);
    
    // Draw axes
    drawAxes(ctx);
    
    // Draw all directional derivatives if enabled
    drawAllDirections(ctx);
    
    // Draw gradient vector
    drawGradient(ctx);
    
    // Draw current direction vector
    drawDirectionalVector(ctx);
    
    // Draw point
    drawPoint(ctx);
    
    // Draw instructions and values
    drawInstructions(ctx);
  }, [drawFunction, drawContours, drawAxes, drawAllDirections, drawGradient, drawDirectionalVector, drawPoint, drawInstructions]);

  // Animation for direction exploration
  useEffect(() => {
    if (!animateDirection) return;

    const interval = setInterval(() => {
      setDirectionAngle(prev => (prev + 5) % 360);
    }, 100);

    return () => clearInterval(interval);
  }, [animateDirection]);

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
    
    const mathCoords = screenToMath(x, y);
    setPointX(mathCoords.x);
    setPointY(mathCoords.y);
    
    // Track progress
    const newExploredAngles = new Set(exploredAngles);
    newExploredAngles.add(Math.round(directionAngle / 45) * 45);
    setExploredAngles(newExploredAngles);
    
    if (newExploredAngles.size >= 4 && onProgress) {
      onProgress(0.7);
    }
  };

  // Step completion tracking
  const checkStepCompletion = useCallback(() => {
    const newCompletedSteps = [...completedSteps];
    
    // Step 1: Explore different functions
    if (exploredAngles.size >= 2) newCompletedSteps[0] = true;
    
    // Step 2: Find maximum directional derivative
    const grad = calculateGradient(pointX, pointY);
    const gradMagnitude = Math.sqrt(grad.x * grad.x + grad.y * grad.y);
    const currentDirDeriv = calculateDirectionalDerivative(pointX, pointY, directionAngle);
    if (Math.abs(currentDirDeriv - gradMagnitude) < 0.05) newCompletedSteps[1] = true;
    
    // Step 3: Find minimum directional derivative
    if (Math.abs(currentDirDeriv + gradMagnitude) < 0.05) newCompletedSteps[2] = true;
    
    // Step 4: Find zero directional derivative
    if (Math.abs(currentDirDeriv) < 0.02) newCompletedSteps[3] = true;
    
    setCompletedSteps(newCompletedSteps);
    
    const completedCount = newCompletedSteps.filter(Boolean).length;
    if (onProgress) {
      onProgress(completedCount / 4);
    }
    
    if (completedCount === 4 && onComplete) {
      onComplete();
    }
  }, [exploredAngles.size, pointX, pointY, directionAngle, calculateGradient, calculateDirectionalDerivative, completedSteps, onProgress, onComplete]);

  useEffect(() => {
    checkStepCompletion();
  }, [checkStepCompletion]);

  const presetScenarios = [
    { name: 'Twin Hills', type: 'hills' as const, x: 0.5, y: 0.5, angle: 45 },
    { name: 'Saddle Point', type: 'saddle' as const, x: 0.5, y: 0.5, angle: 0 },
    { name: 'Rippled Bowl', type: 'bowl' as const, x: 0.3, y: 0.7, angle: 90 },
    { name: 'Mountain Ridge', type: 'ridge' as const, x: 0.5, y: 0.3, angle: 270 }
  ];

  const loadPreset = (preset: typeof presetScenarios[0]) => {
    setFuncType(preset.type);
    setPointX(preset.x);
    setPointY(preset.y);
    setDirectionAngle(preset.angle);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-indigo-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl font-bold text-indigo-800 flex items-center gap-2">
            📐 Dr. Delta's Directional Derivative Laboratory
          </CardTitle>
          <p className="text-indigo-700 text-lg">
            Explore how functions change in any direction you choose! Discover the relationship D_û f = ∇f · û
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Controls */}
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-indigo-700">Direction Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Direction Angle */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Direction Angle: {directionAngle}°
              </label>
              <Slider
                value={[directionAngle]}
                onValueChange={([value]) => setDirectionAngle(value)}
                min={0}
                max={360}
                step={5}
                className="mb-2"
              />
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setDirectionAngle(0)}
                >
                  East (0°)
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setDirectionAngle(90)}
                >
                  North (90°)
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setDirectionAngle(180)}
                >
                  West (180°)
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setDirectionAngle(270)}
                >
                  South (270°)
                </Button>
              </div>
            </div>

            {/* Function Type */}
            <div>
              <label className="block text-sm font-medium mb-2">Function Type</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { type: 'hills', name: 'Twin Hills' },
                  { type: 'saddle', name: 'Saddle Point' },
                  { type: 'bowl', name: 'Rippled Bowl' },
                  { type: 'ridge', name: 'Mountain Ridge' }
                ].map((func) => (
                  <Button
                    key={func.type}
                    size="sm"
                    variant={funcType === func.type ? "default" : "outline"}
                    onClick={() => setFuncType(func.type)}
                    className="justify-start"
                  >
                    {func.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Display Options */}
            <div className="space-y-3">
              <h4 className="font-medium">Display Options</h4>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showGradient}
                  onChange={(e) => setShowGradient(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Show Gradient ∇f</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showContours}
                  onChange={(e) => setShowContours(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Show Contours</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showAllDirections}
                  onChange={(e) => setShowAllDirections(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Show All Directions</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={animateDirection}
                  onChange={(e) => setAnimateDirection(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Animate Direction</span>
              </label>
            </div>

            {/* Preset Scenarios */}
            <div className="space-y-2">
              <h4 className="font-medium">Preset Scenarios</h4>
              {presetScenarios.map((preset, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant="outline"
                  onClick={() => loadPreset(preset)}
                  className="w-full justify-start"
                >
                  {preset.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Visualization */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-indigo-700">Directional Derivative Visualization</CardTitle>
            <p className="text-sm text-gray-600">
              Click to move the purple point. Adjust the direction to explore D_û f = ∇f · û
            </p>
          </CardHeader>
          <CardContent>
            <canvas
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              onClick={handleCanvasClick}
              className="border rounded-lg cursor-crosshair bg-white"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </CardContent>
        </Card>

        {/* Analysis Panel */}
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-indigo-700">Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Values */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Current Values</h4>
              <div className="space-y-1 text-sm">
                <div>Point: ({pointX.toFixed(2)}, {pointY.toFixed(2)})</div>
                <div>Direction: {directionAngle}°</div>
                <div className="font-mono">
                  D_û f = {calculateDirectionalDerivative(pointX, pointY, directionAngle).toFixed(3)}
                </div>
                <div className="font-mono">
                  |∇f| = {Math.sqrt(calculateGradient(pointX, pointY).x ** 2 + calculateGradient(pointX, pointY).y ** 2).toFixed(3)}
                </div>
              </div>
            </div>

            {/* Key Insights */}
            <div className="bg-purple-50 p-3 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-2">Dr. Delta's Insights</h4>
              <div className="space-y-2 text-sm text-purple-700">
                <div>🎯 Maximum D_û f occurs in gradient direction</div>
                <div>📉 Minimum D_û f occurs opposite to gradient</div>
                <div>⚡ Zero D_û f occurs perpendicular to gradient</div>
                <div>📐 Formula: D_û f = ∇f · û</div>
              </div>
            </div>

            {/* Progress Tracking */}
            <div className="bg-green-50 p-3 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Exploration Progress</h4>
              <div className="space-y-2">
                {[
                  'Explore different directions',
                  'Find maximum directional derivative',
                  'Find minimum directional derivative', 
                  'Find zero directional derivative'
                ].map((step, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className={`w-4 h-4 rounded-full ${completedSteps[index] ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className={`text-sm ${completedSteps[index] ? 'text-green-700' : 'text-gray-600'}`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mathematical Formula */}
            <div className="bg-indigo-50 p-3 rounded-lg">
              <h4 className="font-medium text-indigo-800 mb-2">Key Formula</h4>
              <div className="text-center">
                <div className="text-lg font-mono text-indigo-700">
                  D_û f = ∇f · û
                </div>
                <div className="text-xs text-indigo-600 mt-1">
                  Directional derivative equals gradient dot product with unit direction vector
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">How to Use This Tool</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
                <li><strong>Click on the plot</strong> to move the evaluation point</li>
                <li><strong>Adjust the direction slider</strong> to explore different directions</li>
                <li><strong>Watch the values</strong> to see how D_û f changes with direction</li>
                <li><strong>Try different functions</strong> to see various landscapes</li>
                <li><strong>Find special directions</strong> where D_û f is maximum, minimum, or zero</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DirectionalDerivativeExplorer;