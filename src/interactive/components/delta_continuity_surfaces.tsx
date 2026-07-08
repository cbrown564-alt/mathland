import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Slider } from '@/core/components/ui/slider';
import { Badge } from '@/core/components/ui/badge';

interface ContinuitySurfacesProps {
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  isPreview?: boolean;
}

const DeltaContinuitySurfaces: React.FC<ContinuitySurfacesProps> = ({ 
  onComplete, 
  onProgress, 
  isPreview = false 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Function selection
  const [funcType, setFuncType] = useState<'continuous' | 'removable' | 'jump' | 'infinite' | 'composite'>('continuous');
  
  // View settings
  const [viewAngle, setViewAngle] = useState(45); // degrees
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showDiscontinuities, setShowDiscontinuities] = useState(true);
  const [show3D, setShow3D] = useState(true);
  const [showWireframe, setShowWireframe] = useState(false);
  
  // Point inspection
  const [inspectX, setInspectX] = useState(0);
  const [inspectY, setInspectY] = useState(0);
  
  // Animation
  const [animateRotation, setAnimateRotation] = useState(false);
  const [animationAngle, setAnimationAngle] = useState(0);
  
  // Progress tracking
  const [exploredFunctions, setExploredFunctions] = useState<Set<string>>(new Set());
  const [foundDiscontinuities, setFoundDiscontinuities] = useState<Set<string>>(new Set());
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([false, false, false, false]);

  const canvasWidth = 700;
  const canvasHeight = 500;

  // Function definitions
  const evaluateFunction = useCallback((x: number, y: number): number => {
    switch (funcType) {
      case 'continuous':
        return Math.sin(x) * Math.cos(y) + 0.5 * Math.sin(2 * x + y);
      case 'removable': {
        // f(x,y) = sin(x² + y²)/(x² + y²) with removable discontinuity at origin
        const r2 = x * x + y * y;
        if (r2 < 0.001) return 1; // Define limit value at origin
        return Math.sin(r2) / r2;
      }
      case 'jump':
        // Piecewise function with jump discontinuity
        if (x + y > 0) {
          return Math.exp(-x * x - y * y) + 1;
        } else {
          return Math.exp(-x * x - y * y) - 1;
        }
      case 'infinite': {
        // Function with vertical asymptote
        const denominator = (x * x + y * y - 1);
        if (Math.abs(denominator) < 0.1) return NaN; // Undefined near unit circle
        return 1 / denominator;
      }
      case 'composite': {
        // Composition of continuous functions
        const inner = x * x + y * y;
        return Math.exp(-inner) * Math.sin(5 * Math.sqrt(inner));
      }
      default:
        return 0;
    }
  }, [funcType]);

  // Check continuity at a point
  const checkContinuity = useCallback((x: number, y: number): 'continuous' | 'removable' | 'jump' | 'infinite' => {
    const funcValue = evaluateFunction(x, y);
    
    if (isNaN(funcValue) || !isFinite(funcValue)) return 'infinite';
    
    // Check limit from different directions
    const delta = 0.01;
    const directions = [
      [delta, 0], [-delta, 0], [0, delta], [0, -delta],
      [delta, delta], [-delta, -delta], [delta, -delta], [-delta, delta]
    ];
    
    const limitValues = directions.map(([dx, dy]) => {
      const val = evaluateFunction(x + dx, y + dy);
      return isFinite(val) ? val : NaN;
    }).filter(v => !isNaN(v));
    
    if (limitValues.length === 0) return 'infinite';
    
    const avgLimit = limitValues.reduce((a, b) => a + b, 0) / limitValues.length;
    const limitVariance = limitValues.reduce((sum, val) => sum + (val - avgLimit) ** 2, 0) / limitValues.length;
    
    if (limitVariance > 0.1) return 'jump';
    if (Math.abs(funcValue - avgLimit) > 0.1) return 'removable';
    return 'continuous';
  }, [evaluateFunction]);

  // 3D to 2D projection
  const project3D = useCallback((x: number, y: number, z: number): [number, number] => {
    const angle = animateRotation ? animationAngle : viewAngle * Math.PI / 180;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    
    // Rotate around y-axis
    const rotatedX = x * cosA - z * sinA;
    const rotatedZ = x * sinA + z * cosA;
    
    // Perspective projection
    const perspective = 1 / (1 + rotatedZ * 0.1);
    const scale = 80 * zoomLevel * perspective;
    
    const screenX = canvasWidth / 2 + rotatedX * scale;
    const screenY = canvasHeight / 2 - y * scale; // Flip Y for screen coordinates
    
    return [screenX, screenY];
  }, [viewAngle, zoomLevel, animateRotation, animationAngle]);

  // Draw 3D surface
  const drawSurface = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!show3D) return;

    const step = 0.2;
    const range = 2;
    
    // Create surface mesh
    for (let x = -range; x < range; x += step) {
      for (let y = -range; y < range; y += step) {
        const z1 = evaluateFunction(x, y);
        const z2 = evaluateFunction(x + step, y);
        const z3 = evaluateFunction(x, y + step);
        const z4 = evaluateFunction(x + step, y + step);
        
        if (!isFinite(z1) || !isFinite(z2) || !isFinite(z3) || !isFinite(z4)) continue;
        
        // Clamp z values for visualization
        const maxZ = 3;
        const clampedZ1 = Math.max(-maxZ, Math.min(maxZ, z1));
        const clampedZ2 = Math.max(-maxZ, Math.min(maxZ, z2));
        const clampedZ3 = Math.max(-maxZ, Math.min(maxZ, z3));
        const clampedZ4 = Math.max(-maxZ, Math.min(maxZ, z4));
        
        const [p1x, p1y] = project3D(x, y, clampedZ1);
        const [p2x, p2y] = project3D(x + step, y, clampedZ2);
        const [p3x, p3y] = project3D(x, y + step, clampedZ3);
        const [p4x, p4y] = project3D(x + step, y + step, clampedZ4);
        
        // Color based on height
        const avgZ = (clampedZ1 + clampedZ2 + clampedZ3 + clampedZ4) / 4;
        const normalizedZ = (avgZ + maxZ) / (2 * maxZ);
        const hue = 240 - normalizedZ * 240; // Blue to red
        
        if (showWireframe) {
          ctx.strokeStyle = `hsl(${hue}, 70%, 50%)`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p1x, p1y);
          ctx.lineTo(p2x, p2y);
          ctx.lineTo(p4x, p4y);
          ctx.lineTo(p3x, p3y);
          ctx.closePath();
          ctx.stroke();
        } else {
          ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
          ctx.beginPath();
          ctx.moveTo(p1x, p1y);
          ctx.lineTo(p2x, p2y);
          ctx.lineTo(p4x, p4y);
          ctx.lineTo(p3x, p3y);
          ctx.closePath();
          ctx.fill();
        }
      }
    }
  }, [show3D, showWireframe, evaluateFunction, project3D]);

  // Draw 2D contour plot
  const drawContours = useCallback((ctx: CanvasRenderingContext2D) => {
    if (show3D) return;

    const step = 4;
    const range = 2;
    const scale = 150;
    
    // Create image data for contour visualization
    const imageData = ctx.createImageData(canvasWidth, canvasHeight);
    const data = imageData.data;
    
    for (let i = 0; i < canvasWidth; i += step) {
      for (let j = 0; j < canvasHeight; j += step) {
        const x = ((i - canvasWidth / 2) / scale) * range;
        const y = ((canvasHeight / 2 - j) / scale) * range;
        
        const z = evaluateFunction(x, y);
        
        if (isFinite(z)) {
          const normalizedZ = Math.max(0, Math.min(1, (z + 3) / 6));
          const r = Math.floor(255 * (1 - normalizedZ));
          const g = Math.floor(255 * normalizedZ * (1 - normalizedZ) * 4);
          const b = Math.floor(255 * normalizedZ);
          
          // Fill small rectangle
          for (let di = 0; di < step && i + di < canvasWidth; di++) {
            for (let dj = 0; dj < step && j + dj < canvasHeight; dj++) {
              const pixelIndex = ((j + dj) * canvasWidth + (i + di)) * 4;
              data[pixelIndex] = r;
              data[pixelIndex + 1] = g;
              data[pixelIndex + 2] = b;
              data[pixelIndex + 3] = 255;
            }
          }
        }
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  }, [show3D, evaluateFunction]);

  // Highlight discontinuities
  const drawDiscontinuities = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!showDiscontinuities) return;

    const step = 0.1;
    const range = 2;
    
    for (let x = -range; x <= range; x += step) {
      for (let y = -range; y <= range; y += step) {
        const continuityType = checkContinuity(x, y);
        
        if (continuityType !== 'continuous') {
          let color, size;
          switch (continuityType) {
            case 'removable':
              color = '#F59E0B'; // Orange
              size = 4;
              break;
            case 'jump':
              color = '#EF4444'; // Red
              size = 6;
              break;
            case 'infinite':
              color = '#8B5CF6'; // Purple
              size = 8;
              break;
            default:
              continue;
          }
          
          if (show3D) {
            const z = evaluateFunction(x, y);
            const clampedZ = isFinite(z) ? Math.max(-3, Math.min(3, z)) : 0;
            const [screenX, screenY] = project3D(x, y, clampedZ);
            
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(screenX, screenY, size, 0, 2 * Math.PI);
            ctx.fill();
          } else {
            const scale = 150;
            const screenX = canvasWidth / 2 + x * scale;
            const screenY = canvasHeight / 2 - y * scale;
            
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(screenX, screenY, size, 0, 2 * Math.PI);
            ctx.fill();
          }
        }
      }
    }
  }, [showDiscontinuities, show3D, checkContinuity, evaluateFunction, project3D]);

  // Draw inspection point
  const drawInspectionPoint = useCallback((ctx: CanvasRenderingContext2D) => {
    const z = evaluateFunction(inspectX, inspectY);
    
    if (show3D) {
      const clampedZ = isFinite(z) ? Math.max(-3, Math.min(3, z)) : 0;
      const [screenX, screenY] = project3D(inspectX, inspectY, clampedZ);
      
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.arc(screenX, screenY, 8, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else {
      const scale = 150;
      const screenX = canvasWidth / 2 + inspectX * scale;
      const screenY = canvasHeight / 2 - inspectY * scale;
      
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.arc(screenX, screenY, 8, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, [inspectX, inspectY, show3D, evaluateFunction, project3D]);

  // Draw analysis info
  const drawAnalysis = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#1F2937';
    ctx.font = '14px Inter, sans-serif';

    // Title
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.fillText('Dr. Delta\'s Continuity Analysis', 20, 30);
    
    ctx.font = '14px Inter, sans-serif';
    
    // Function info
    const funcNames = {
      continuous: 'sin(x)cos(y) + 0.5sin(2x+y)',
      removable: 'sin(x²+y²)/(x²+y²)',
      jump: 'Piecewise function',
      infinite: '1/(x²+y²-1)',
      composite: 'e^(-r²)sin(5r)'
    };
    
    ctx.fillText(`Function: ${funcNames[funcType]}`, 20, 55);
    ctx.fillText(`Inspection: (${inspectX.toFixed(2)}, ${inspectY.toFixed(2)})`, 20, 75);

    // Continuity analysis at inspection point
    const funcValue = evaluateFunction(inspectX, inspectY);
    const continuityType = checkContinuity(inspectX, inspectY);
    
    ctx.fillText(`f(x,y) = ${isFinite(funcValue) ? funcValue.toFixed(3) : 'undefined'}`, 20, 95);
    
    // Continuity status
    switch (continuityType) {
      case 'continuous':
        ctx.fillStyle = '#059669';
        ctx.fillText('✓ Continuous at this point', 20, 115);
        break;
      case 'removable':
        ctx.fillStyle = '#F59E0B';
        ctx.fillText('⚠ Removable discontinuity', 20, 115);
        break;
      case 'jump':
        ctx.fillStyle = '#EF4444';
        ctx.fillText('✗ Jump discontinuity', 20, 115);
        break;
      case 'infinite':
        ctx.fillStyle = '#8B5CF6';
        ctx.fillText('∞ Infinite discontinuity', 20, 115);
        break;
    }
    
    ctx.fillStyle = '#6B7280';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText(`View: ${show3D ? '3D Surface' : '2D Contour'}`, 20, 140);
  }, [inspectX, inspectY, funcType, show3D, evaluateFunction, checkContinuity]);

  // Main drawing function
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw surface or contours
    if (show3D) {
      drawSurface(ctx);
    } else {
      drawContours(ctx);
    }
    
    // Draw discontinuities
    drawDiscontinuities(ctx);
    
    // Draw inspection point
    drawInspectionPoint(ctx);
    
    // Draw analysis
    drawAnalysis(ctx);
  }, [show3D, drawSurface, drawContours, drawDiscontinuities, drawInspectionPoint, drawAnalysis]);

  // Animation
  useEffect(() => {
    if (!animateRotation) return;

    const interval = setInterval(() => {
      setAnimationAngle(prev => (prev + 2) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, [animateRotation]);

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
    
    if (show3D) {
      // Simple approximation for 3D interaction
      const mathX = ((x - canvasWidth / 2) / 100) / zoomLevel;
      const mathY = ((canvasHeight / 2 - y) / 100) / zoomLevel;
      setInspectX(Math.max(-2, Math.min(2, mathX)));
      setInspectY(Math.max(-2, Math.min(2, mathY)));
    } else {
      // 2D contour interaction
      const scale = 150;
      const mathX = (x - canvasWidth / 2) / scale * 2;
      const mathY = (canvasHeight / 2 - y) / scale * 2;
      setInspectX(Math.max(-2, Math.min(2, mathX)));
      setInspectY(Math.max(-2, Math.min(2, mathY)));
    }
  };

  // Progress tracking
  const checkStepCompletion = useCallback(() => {
    const newCompletedSteps = [...completedSteps];
    const continuityType = checkContinuity(inspectX, inspectY);
    
    // Step 1: Explore different functions
    if (exploredFunctions.size >= 2) newCompletedSteps[0] = true;
    
    // Step 2: Find discontinuities
    if (continuityType !== 'continuous') {
      const newFound = new Set(foundDiscontinuities);
      newFound.add(continuityType);
      setFoundDiscontinuities(newFound);
      if (newFound.size >= 2) newCompletedSteps[1] = true;
    }
    
    // Step 3: Use both view modes
    // This is tracked when user toggles between 3D and 2D views
    
    // Step 4: Understand composition
    if (funcType === 'composite') newCompletedSteps[3] = true;
    
    setCompletedSteps(newCompletedSteps);
    
    const completedCount = newCompletedSteps.filter(Boolean).length;
    if (onProgress) {
      onProgress(completedCount / 4);
    }
    
    if (completedCount === 4 && onComplete) {
      onComplete();
    }
  }, [exploredFunctions.size, foundDiscontinuities, funcType, inspectX, inspectY, checkContinuity, completedSteps, onProgress, onComplete]);

  useEffect(() => {
    checkStepCompletion();
  }, [checkStepCompletion]);

  const functionExamples = [
    { type: 'continuous', name: 'Smooth Surface', formula: 'sin(x)cos(y) + 0.5sin(2x+y)' },
    { type: 'removable', name: 'Removable Disc.', formula: 'sin(r²)/r²' },
    { type: 'jump', name: 'Jump Disc.', formula: 'Piecewise function' },
    { type: 'infinite', name: 'Infinite Disc.', formula: '1/(x²+y²-1)' },
    { type: 'composite', name: 'Composition', formula: 'e^(-r²)sin(5r)' }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-indigo-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl font-bold text-indigo-800 flex items-center gap-2">
            🏔️ Dr. Delta's Continuity & Surfaces Explorer
          </CardTitle>
          <p className="text-indigo-700 text-lg">
            Visualize continuity as smooth mathematical surfaces! Discover discontinuities and their geometric meaning.
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Controls */}
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-indigo-700">Surface Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Function Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Function Type</label>
              <div className="space-y-2">
                {functionExamples.map((func) => (
                  <Button
                    key={func.type}
                    size="sm"
                    variant={funcType === func.type ? "default" : "outline"}
                    onClick={() => {
                      setFuncType(func.type);
                      const newExplored = new Set(exploredFunctions);
                      newExplored.add(func.type);
                      setExploredFunctions(newExplored);
                    }}
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

            {/* View Controls */}
            <div>
              <label className="block text-sm font-medium mb-2">Visualization Mode</label>
              <div className="space-y-2">
                <Button
                  size="sm"
                  variant={show3D ? "default" : "outline"}
                  onClick={() => {
                    setShow3D(true);
                    if (!show3D) {
                      const newCompleted = [...completedSteps];
                      newCompleted[2] = true;
                      setCompletedSteps(newCompleted);
                    }
                  }}
                  className="w-full"
                >
                  3D Surface View
                </Button>
                <Button
                  size="sm"
                  variant={!show3D ? "default" : "outline"}
                  onClick={() => {
                    setShow3D(false);
                    if (show3D) {
                      const newCompleted = [...completedSteps];
                      newCompleted[2] = true;
                      setCompletedSteps(newCompleted);
                    }
                  }}
                  className="w-full"
                >
                  2D Contour Plot
                </Button>
              </div>
            </div>

            {/* 3D Controls */}
            {show3D && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    View Angle: {viewAngle}°
                  </label>
                  <Slider
                    value={[viewAngle]}
                    onValueChange={([value]) => setViewAngle(value)}
                    min={0}
                    max={360}
                    step={5}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Zoom: {zoomLevel.toFixed(1)}×
                  </label>
                  <Slider
                    value={[zoomLevel]}
                    onValueChange={([value]) => setZoomLevel(value)}
                    min={0.5}
                    max={3}
                    step={0.1}
                  />
                </div>
              </div>
            )}

            {/* Display Options */}
            <div className="space-y-3">
              <h4 className="font-medium">Display Options</h4>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showDiscontinuities}
                  onChange={(e) => setShowDiscontinuities(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Highlight Discontinuities</span>
              </label>
              
              {show3D && (
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showWireframe}
                    onChange={(e) => setShowWireframe(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Wireframe Mode</span>
                </label>
              )}
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={animateRotation}
                  onChange={(e) => setAnimateRotation(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Auto Rotate (3D)</span>
              </label>
            </div>

            {/* Quick Presets */}
            <div className="space-y-2">
              <h4 className="font-medium">Quick Examples</h4>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setFuncType('removable');
                  setInspectX(0);
                  setInspectY(0);
                  setShow3D(true);
                }}
                className="w-full justify-start"
              >
                Removable at Origin
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setFuncType('infinite');
                  setInspectX(1);
                  setInspectY(0);
                  setShow3D(true);
                }}
                className="w-full justify-start"
              >
                Infinite on Unit Circle
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Visualization */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-indigo-700">
              {show3D ? '3D Surface' : '2D Contour'} Visualization
            </CardTitle>
            <p className="text-sm text-gray-600">
              Click to inspect points for continuity. Look for smooth vs broken surface regions.
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
            <CardTitle className="text-lg font-semibold text-indigo-700">Continuity Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Analysis */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Point Analysis</h4>
              <div className="space-y-1 text-sm">
                <div>Point: ({inspectX.toFixed(2)}, {inspectY.toFixed(2)})</div>
                <div className="font-mono">
                  f(x,y) = {(() => {
                    const val = evaluateFunction(inspectX, inspectY);
                    return isFinite(val) ? val.toFixed(3) : 'undefined';
                  })()}
                </div>
                <div>
                  Status: {(() => {
                    const type = checkContinuity(inspectX, inspectY);
                    const colors = {
                      continuous: 'text-green-600',
                      removable: 'text-orange-600',
                      jump: 'text-red-600',
                      infinite: 'text-purple-600'
                    };
                    return (
                      <span className={colors[type] || 'text-gray-600'}>
                        {type}
                      </span>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="bg-purple-50 p-3 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-2">Discontinuity Types</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span>Removable (fixable)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Jump (sudden change)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span>Infinite (vertical asymptote)</span>
                </div>
              </div>
            </div>

            {/* Progress Tracking */}
            <div className="bg-green-50 p-3 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Exploration Progress</h4>
              <div className="space-y-2">
                {[
                  'Try different functions',
                  'Find discontinuity types',
                  'Use both view modes',
                  'Explore compositions'
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

            {/* Key Insights */}
            <div className="bg-indigo-50 p-3 rounded-lg">
              <h4 className="font-medium text-indigo-800 mb-2">Dr. Delta's Insights</h4>
              <div className="space-y-2 text-sm text-indigo-700">
                <div>🏔️ Continuous = smooth surface</div>
                <div>🕳️ Discontinuous = holes/jumps</div>
                <div>🔧 Removable = can be "fixed"</div>
                <div>🧩 Composition preserves continuity</div>
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
                <li><strong>Click anywhere</strong> to inspect that point for continuity</li>
                <li><strong>Try different functions</strong> to see various surface types</li>
                <li><strong>Toggle 3D/2D views</strong> for different perspectives</li>
                <li><strong>Look for highlighted points</strong> showing discontinuities</li>
                <li><strong>Use rotation controls</strong> to examine 3D surfaces from all angles</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeltaContinuitySurfaces;