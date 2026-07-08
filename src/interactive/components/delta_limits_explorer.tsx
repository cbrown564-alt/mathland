import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Slider } from '@/core/components/ui/slider';
import { Badge } from '@/core/components/ui/badge';

interface LimitsExplorerProps {
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  isPreview?: boolean;
}

const DeltaLimitsExplorer: React.FC<LimitsExplorerProps> = ({ 
  onComplete, 
  onProgress, 
  isPreview = false 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Function selection
  const [funcType, setFuncType] = useState<'continuous' | 'pathDependent' | 'removable' | 'polar'>('pathDependent');
  
  // Target point
  const [targetX, setTargetX] = useState(0);
  const [targetY, setTargetY] = useState(0);
  
  // Current approach point
  const [currentX, setCurrentX] = useState(0.5);
  const [currentY, setCurrentY] = useState(0.5);
  
  // Path settings
  const [pathType, setPathType] = useState<'linear' | 'parabolic' | 'circular' | 'custom'>('linear');
  const [pathParameter, setPathParameter] = useState(1); // slope for linear, curvature for others
  
  // Visualization options
  const [showAllPaths, setShowAllPaths] = useState(false);
  const [showContours, setShowContours] = useState(true);
  const [animateApproach, setAnimateApproach] = useState(false);
  const [showLimitValue, setShowLimitValue] = useState(true);
  
  // Animation state
  const [animationT, setAnimationT] = useState(0);
  
  // Progress tracking
  const [exploredPaths, setExploredPaths] = useState<Set<string>>(new Set());
  const [foundPathDependence, setFoundPathDependence] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([false, false, false, false]);

  const canvasWidth = 700;
  const canvasHeight = 500;
  const margin = 50;
  const plotWidth = canvasWidth - 2 * margin;
  const plotHeight = canvasHeight - 2 * margin;

  // Function definitions
  const evaluateFunction = useCallback((x: number, y: number): number => {
    // Avoid division by zero at origin
    if (Math.abs(x) < 0.001 && Math.abs(y) < 0.001) {
      return NaN;
    }

    switch (funcType) {
      case 'continuous':
        return Math.sin(x * y) / (x * x + y * y + 1);
      case 'pathDependent':
        // f(x,y) = xy/(x² + y²) - path dependent at origin
        if (Math.abs(x) < 0.001 && Math.abs(y) < 0.001) return NaN;
        return (x * y) / (x * x + y * y);
      case 'removable':
        // f(x,y) = (x² + y² - 1)/(x + y - 1) with removable discontinuity
        if (Math.abs(x + y - 1) < 0.001) return NaN;
        return (x * x + y * y - 1) / (x + y - 1);
      case 'polar': {
        // f(x,y) = x²y/(x² + y²)² 
        if (Math.abs(x) < 0.001 && Math.abs(y) < 0.001) return NaN;
        const r2 = x * x + y * y;
        return (x * x * y) / (r2 * r2);
      }
      default:
        return 0;
    }
  }, [funcType]);

  // Path generation
  const generatePath = useCallback((t: number): [number, number] => {
    const approachDistance = Math.max(0.01, 1 - t); // t goes from 0 to 1
    
    switch (pathType) {
      case 'linear':
        return [
          targetX + approachDistance * Math.cos(pathParameter),
          targetY + approachDistance * Math.sin(pathParameter)
        ];
      case 'parabolic': {
        const s = approachDistance;
        return [
          targetX + s,
          targetY + pathParameter * s * s
        ];
      }
      case 'circular': {
        const radius = approachDistance;
        const angle = pathParameter * t * 4 * Math.PI; // spiral in
        return [
          targetX + radius * Math.cos(angle),
          targetY + radius * Math.sin(angle)
        ];
      }
      case 'custom': {
        // Oscillating approach
        const dist = approachDistance;
        return [
          targetX + dist * Math.cos(pathParameter),
          targetY + dist * Math.sin(pathParameter + 10 * dist)
        ];
      }
      default:
        return [targetX, targetY];
    }
  }, [pathType, pathParameter, targetX, targetY]);

  // Calculate limit along specific path
  const calculatePathLimit = useCallback((pathType: string, param: number): number => {
    const samples = [];
    for (let i = 0.9; i < 0.999; i += 0.01) {
      const [x, y] = generatePathForLimit(i, pathType, param);
      const value = evaluateFunction(x, y);
      if (!isNaN(value) && isFinite(value)) {
        samples.push(value);
      }
    }
    return samples.length > 0 ? samples[samples.length - 1] : NaN;
  }, [evaluateFunction]);

  const generatePathForLimit = useCallback((t: number, type: string, param: number): [number, number] => {
    const approachDistance = Math.max(0.01, 1 - t);
    
    switch (type) {
      case 'linear':
        return [
          targetX + approachDistance * Math.cos(param),
          targetY + approachDistance * Math.sin(param)
        ];
      case 'parabolic': {
        const s = approachDistance;
        return [
          targetX + s,
          targetY + param * s * s
        ];
      }
      default:
        return [targetX, targetY];
    }
  }, [targetX, targetY]);

  // Coordinate transformation
  const screenToMath = useCallback((screenX: number, screenY: number): [number, number] => {
    const x = ((screenX - margin) / plotWidth) * 4 - 2; // [-2, 2] range
    const y = (1 - (screenY - margin) / plotHeight) * 4 - 2; // [-2, 2] range
    return [x, y];
  }, []);

  const mathToScreen = useCallback((x: number, y: number): [number, number] => {
    const screenX = margin + ((x + 2) / 4) * plotWidth;
    const screenY = margin + (1 - (y + 2) / 4) * plotHeight;
    return [screenX, screenY];
  }, []);

  // Drawing functions
  const drawContours = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!showContours) return;

    ctx.strokeStyle = 'rgba(107, 114, 128, 0.3)';
    ctx.lineWidth = 1;

    // Create contour map by sampling function values
    const contourLevels = [-2, -1, -0.5, -0.1, 0, 0.1, 0.5, 1, 2];
    
    contourLevels.forEach(level => {
      ctx.beginPath();
      
      for (let i = 0; i < plotWidth; i += 8) {
        for (let j = 0; j < plotHeight; j += 8) {
          const [x1, y1] = screenToMath(margin + i, margin + j);
          const [x2, y2] = screenToMath(margin + i + 8, margin + j);
          const [x3, y3] = screenToMath(margin + i, margin + j + 8);
          
          const f1 = evaluateFunction(x1, y1);
          const f2 = evaluateFunction(x2, y2);
          const f3 = evaluateFunction(x3, y3);
          
          if (!isNaN(f1) && !isNaN(f2) && !isNaN(f3)) {
            if ((f1 <= level && f2 >= level) || (f1 >= level && f2 <= level)) {
              ctx.moveTo(margin + i, margin + j);
              ctx.lineTo(margin + i + 8, margin + j);
            }
            if ((f1 <= level && f3 >= level) || (f1 >= level && f3 <= level)) {
              ctx.moveTo(margin + i, margin + j);
              ctx.lineTo(margin + i, margin + j + 8);
            }
          }
        }
      }
      
      ctx.stroke();
    });
  }, [showContours, evaluateFunction, screenToMath]);

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = 'rgba(156, 163, 175, 0.3)';
    ctx.lineWidth = 1;

    // Grid lines
    for (let i = -2; i <= 2; i += 0.5) {
      if (Math.abs(i) < 0.01) continue; // Skip axes
      
      const [screenX] = mathToScreen(i, 0);
      const [, screenY] = mathToScreen(0, i);
      
      // Vertical lines
      ctx.beginPath();
      ctx.moveTo(screenX, margin);
      ctx.lineTo(screenX, margin + plotHeight);
      ctx.stroke();
      
      // Horizontal lines
      ctx.beginPath();
      ctx.moveTo(margin, screenY);
      ctx.lineTo(margin + plotWidth, screenY);
      ctx.stroke();
    }
  }, [mathToScreen]);

  const drawAxes = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 2;

    const [originX, originY] = mathToScreen(0, 0);

    // X-axis
    ctx.beginPath();
    ctx.moveTo(margin, originY);
    ctx.lineTo(margin + plotWidth, originY);
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(originX, margin);
    ctx.lineTo(originX, margin + plotHeight);
    ctx.stroke();

    // Labels
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText('x', margin + plotWidth + 10, originY + 5);
    ctx.fillText('y', originX - 10, margin - 10);
  }, [mathToScreen]);

  const drawCurrentPath = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 3;
    ctx.setLineDash([]);

    ctx.beginPath();
    
    for (let t = 0; t <= 1; t += 0.02) {
      const [x, y] = generatePath(t);
      const [screenX, screenY] = mathToScreen(x, y);
      
      if (t === 0) {
        ctx.moveTo(screenX, screenY);
      } else {
        ctx.lineTo(screenX, screenY);
      }
    }
    
    ctx.stroke();

    // Draw direction arrow
    const [endX, endY] = generatePath(0.9);
    const [startX, startY] = generatePath(0.8);
    const [screenEndX, screenEndY] = mathToScreen(endX, endY);
    
    const angle = Math.atan2(endY - startY, endX - startX);
    const arrowLength = 15;
    
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(screenEndX, screenEndY);
    ctx.lineTo(
      screenEndX - arrowLength * Math.cos(angle - Math.PI / 6),
      screenEndY - arrowLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(screenEndX, screenEndY);
    ctx.lineTo(
      screenEndX - arrowLength * Math.cos(angle + Math.PI / 6),
      screenEndY - arrowLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
  }, [generatePath, mathToScreen]);

  const drawAllPaths = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!showAllPaths) return;

    const pathConfigs = [
      { type: 'linear', param: 0, color: '#EF4444' },
      { type: 'linear', param: Math.PI/2, color: '#F59E0B' },
      { type: 'linear', param: Math.PI/4, color: '#10B981' },
      { type: 'linear', param: 3*Math.PI/4, color: '#8B5CF6' },
      { type: 'parabolic', param: 1, color: '#EC4899' },
      { type: 'parabolic', param: -1, color: '#06B6D4' }
    ];

    pathConfigs.forEach(config => {
      ctx.strokeStyle = config.color;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      
      ctx.beginPath();
      
      for (let t = 0; t <= 0.95; t += 0.02) {
        const [x, y] = generatePathForLimit(t, config.type, config.param);
        const [screenX, screenY] = mathToScreen(x, y);
        
        if (t === 0) {
          ctx.moveTo(screenX, screenY);
        } else {
          ctx.lineTo(screenX, screenY);
        }
      }
      
      ctx.stroke();
    });

    ctx.setLineDash([]);
  }, [showAllPaths, generatePathForLimit, mathToScreen]);

  const drawTargetPoint = useCallback((ctx: CanvasRenderingContext2D) => {
    const [screenX, screenY] = mathToScreen(targetX, targetY);
    
    // Target point
    ctx.fillStyle = '#DC2626';
    ctx.beginPath();
    ctx.arc(screenX, screenY, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Label
    ctx.fillStyle = '#DC2626';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.fillText(`(${targetX.toFixed(1)}, ${targetY.toFixed(1)})`, screenX + 10, screenY - 10);
  }, [targetX, targetY, mathToScreen]);

  const drawCurrentPoint = useCallback((ctx: CanvasRenderingContext2D) => {
    const t = animateApproach ? animationT : 0.8;
    const [x, y] = generatePath(t);
    const [screenX, screenY] = mathToScreen(x, y);
    
    // Current point
    ctx.fillStyle = '#059669';
    ctx.beginPath();
    ctx.arc(screenX, screenY, 6, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Function value
    const value = evaluateFunction(x, y);
    if (!isNaN(value) && isFinite(value)) {
      ctx.fillStyle = '#059669';
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText(`f ≈ ${value.toFixed(3)}`, screenX + 8, screenY + 20);
    }
  }, [animateApproach, animationT, generatePath, mathToScreen, evaluateFunction]);

  const drawLimitAnalysis = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#1F2937';
    ctx.font = '14px Inter, sans-serif';

    // Title
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.fillText('Dr. Delta\'s Limit Analysis', 20, 30);
    
    ctx.font = '14px Inter, sans-serif';
    
    // Function info
    const funcNames = {
      continuous: 'sin(xy)/(x²+y²+1)',
      pathDependent: 'xy/(x²+y²)',
      removable: '(x²+y²-1)/(x+y-1)',
      polar: 'x²y/(x²+y²)²'
    };
    
    ctx.fillText(`Function: ${funcNames[funcType]}`, 20, 55);
    ctx.fillText(`Target: (${targetX.toFixed(1)}, ${targetY.toFixed(1)})`, 20, 75);

    // Path info
    const pathNames = {
      linear: `Linear (angle ${(pathParameter * 180 / Math.PI).toFixed(0)}°)`,
      parabolic: `Parabolic (k=${pathParameter.toFixed(1)})`,
      circular: `Spiral`,
      custom: 'Oscillating'
    };
    
    ctx.fillText(`Path: ${pathNames[pathType]}`, 20, 95);

    // Limit along current path
    const pathLimit = calculatePathLimit(pathType, pathParameter);
    if (!isNaN(pathLimit) && isFinite(pathLimit)) {
      ctx.fillText(`Path limit: ${pathLimit.toFixed(3)}`, 20, 115);
    } else {
      ctx.fillText('Path limit: undefined', 20, 115);
    }

    // Overall limit analysis
    ctx.fillStyle = '#6B7280';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('Try different paths to test limit existence!', 20, 140);
    
    if (funcType === 'pathDependent' && Math.abs(targetX) < 0.1 && Math.abs(targetY) < 0.1) {
      ctx.fillStyle = '#DC2626';
      ctx.fillText('⚠ Path-dependent: limit does not exist', 20, 160);
    } else if (funcType === 'continuous') {
      ctx.fillStyle = '#059669';
      ctx.fillText('✓ Limit exists and equals function value', 20, 160);
    }
  }, [funcType, targetX, targetY, pathType, pathParameter, calculatePathLimit]);

  // Main drawing function
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw background elements
    drawGrid(ctx);
    drawContours(ctx);
    drawAxes(ctx);
    
    // Draw paths
    drawAllPaths(ctx);
    drawCurrentPath(ctx);
    
    // Draw points
    drawTargetPoint(ctx);
    drawCurrentPoint(ctx);
    
    // Draw analysis
    drawLimitAnalysis(ctx);
  }, [drawGrid, drawContours, drawAxes, drawAllPaths, drawCurrentPath, drawTargetPoint, drawCurrentPoint, drawLimitAnalysis]);

  // Animation
  useEffect(() => {
    if (!animateApproach) return;

    const interval = setInterval(() => {
      setAnimationT(prev => (prev + 0.01) % 1);
    }, 50);

    return () => clearInterval(interval);
  }, [animateApproach]);

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
    
    const [mathX, mathY] = screenToMath(x, y);
    setTargetX(Math.max(-2, Math.min(2, mathX)));
    setTargetY(Math.max(-2, Math.min(2, mathY)));
  };

  // Progress tracking
  const checkStepCompletion = useCallback(() => {
    const newCompletedSteps = [...completedSteps];
    
    // Step 1: Try different functions
    if (exploredPaths.size >= 2) newCompletedSteps[0] = true;
    
    // Step 2: Find path dependence
    if (funcType === 'pathDependent' && Math.abs(targetX) < 0.1 && Math.abs(targetY) < 0.1) {
      newCompletedSteps[1] = true;
      setFoundPathDependence(true);
    }
    
    // Step 3: Test multiple paths
    if (showAllPaths) newCompletedSteps[2] = true;
    
    // Step 4: Understand continuous case
    if (funcType === 'continuous') newCompletedSteps[3] = true;
    
    setCompletedSteps(newCompletedSteps);
    
    const completedCount = newCompletedSteps.filter(Boolean).length;
    if (onProgress) {
      onProgress(completedCount / 4);
    }
    
    if (completedCount === 4 && onComplete) {
      onComplete();
    }
  }, [exploredPaths.size, funcType, targetX, targetY, showAllPaths, completedSteps, onProgress, onComplete]);

  useEffect(() => {
    checkStepCompletion();
  }, [checkStepCompletion]);

  const functionExamples = [
    { type: 'pathDependent', name: 'Path Dependent', formula: 'xy/(x²+y²)' },
    { type: 'continuous', name: 'Continuous', formula: 'sin(xy)/(x²+y²+1)' },
    { type: 'removable', name: 'Removable Disc.', formula: '(x²+y²-1)/(x+y-1)' },
    { type: 'polar', name: 'Polar Form', formula: 'x²y/(x²+y²)²' }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-white/[0.06] to-white/[0.02] border border-white/10 border-indigo-400/30">
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl font-bold text-indigo-200 flex items-center gap-2">
            🎯 Dr. Delta's Multivariable Limits Explorer
          </CardTitle>
          <p className="text-indigo-700 text-lg">
            Discover how limits work with multiple approach paths! Test path independence and limit existence.
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Controls */}
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-indigo-700">Limit Controls</CardTitle>
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
                      const newExplored = new Set(exploredPaths);
                      newExplored.add(func.type);
                      setExploredPaths(newExplored);
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

            {/* Path Type */}
            <div>
              <label className="block text-sm font-medium mb-2">Approach Path</label>
              <div className="space-y-2">
                {[
                  { type: 'linear', name: 'Straight Line' },
                  { type: 'parabolic', name: 'Parabolic' },
                  { type: 'circular', name: 'Spiral' },
                  { type: 'custom', name: 'Oscillating' }
                ].map((path) => (
                  <Button
                    key={path.type}
                    size="sm"
                    variant={pathType === path.type ? "default" : "outline"}
                      onClick={() => setPathType(path.type)}
                    className="w-full justify-start"
                  >
                    {path.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Path Parameter */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Path Parameter: {pathParameter.toFixed(2)}
              </label>
              <Slider
                value={[pathParameter]}
                onValueChange={([value]) => setPathParameter(value)}
                min={pathType === 'linear' ? 0 : -2}
                max={pathType === 'linear' ? 2 * Math.PI : 2}
                step={0.1}
              />
              <div className="text-xs text-white/55">
                {pathType === 'linear' ? 'Angle in radians' : 
                 pathType === 'parabolic' ? 'Curvature parameter' : 'Spiral tightness'}
              </div>
            </div>

            {/* Visualization Options */}
            <div className="space-y-3">
              <h4 className="font-medium">Display Options</h4>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showContours}
                  onChange={(e) => setShowContours(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Show Function Contours</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showAllPaths}
                  onChange={(e) => setShowAllPaths(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Show Multiple Paths</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={animateApproach}
                  onChange={(e) => setAnimateApproach(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Animate Approach</span>
              </label>
            </div>

            {/* Quick Setups */}
            <div className="space-y-2">
              <h4 className="font-medium">Quick Setups</h4>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setFuncType('pathDependent');
                  setTargetX(0);
                  setTargetY(0);
                  setPathType('linear');
                }}
                className="w-full justify-start"
              >
                Path Dependence at Origin
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setFuncType('continuous');
                  setTargetX(0);
                  setTargetY(0);
                  setShowAllPaths(true);
                }}
                className="w-full justify-start"
              >
                Continuous Function
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Visualization */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-indigo-700">Multivariable Limit Visualization</CardTitle>
            <p className="text-sm text-white/55">
              Click to set target point. Watch how the function behaves along different approach paths.
            </p>
          </CardHeader>
          <CardContent>
            <canvas
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              aria-label="Delta interactive multivariable limit visualization"
              onClick={handleCanvasClick}
              className="border rounded-lg cursor-crosshair bg-white/[0.04]"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </CardContent>
        </Card>

        {/* Analysis Panel */}
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-indigo-700">Limit Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Analysis */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Current Path Limit</h4>
              <div className="space-y-1 text-sm">
                <div>Target: ({targetX.toFixed(2)}, {targetY.toFixed(2)})</div>
                <div>Path: {pathType}</div>
                <div className="font-mono">
                  Limit ≈ {(() => {
                    const limit = calculatePathLimit(pathType, pathParameter);
                    return isNaN(limit) ? 'undefined' : limit.toFixed(3);
                  })()}
                </div>
              </div>
            </div>

            {/* Key Insights */}
            <div className="bg-purple-50 p-3 rounded-lg">
              <h4 className="font-medium text-purple-200 mb-2">Dr. Delta's Insights</h4>
              <div className="space-y-2 text-sm text-purple-700">
                <div>🎯 All paths must give same limit</div>
                <div>🔍 Different path limits → no limit exists</div>
                <div>📐 Continuous functions: limit = f(a,b)</div>
                <div>🌀 Try linear, curved, and spiral paths</div>
              </div>
            </div>

            {/* Progress Tracking */}
            <div className="bg-green-50 p-3 rounded-lg">
              <h4 className="font-medium text-emerald-200 mb-2">Exploration Progress</h4>
              <div className="space-y-2">
                {[
                  'Try different functions',
                  'Find path-dependent case',
                  'Test multiple paths',
                  'Understand continuous case'
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

            {/* Limit Definition */}
            <div className="bg-indigo-50 p-3 rounded-lg">
              <h4 className="font-medium text-indigo-200 mb-2">Limit Definition</h4>
              <div className="text-center">
                <div className="text-sm font-mono text-indigo-700">
                  lim<sub>(x,y)→(a,b)</sub> f(x,y) = L
                </div>
                <div className="text-xs text-indigo-600 mt-1">
                  if all approach paths give same value L
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
                <li><strong>Click on the plot</strong> to set the target point for the limit</li>
                <li><strong>Try different functions</strong> to see various limit behaviors</li>
                <li><strong>Change path types</strong> to test path independence</li>
                <li><strong>Use "Show Multiple Paths"</strong> to compare different approaches</li>
                <li><strong>Look for path dependence</strong> where different paths give different limits</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeltaLimitsExplorer;