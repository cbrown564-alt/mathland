import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/core/components/ui/button';
import { Label } from '@/core/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/core/components/ui/avatar';
import { Badge } from '@/core/components/ui/badge';
import { Slider } from '@/core/components/ui/slider';
import { Play, Pause, RotateCcw, Mountain, Target, TrendingDown } from 'lucide-react';

// Optimization landscape functions
const landscapeFunctions = {
  simple_bowl: {
    name: 'Simple Valley',
    func: (x: number, y: number) => 0.1 * (x * x + y * y),
    gradient: (x: number, y: number) => [0.2 * x, 0.2 * y],
    description: 'f(x,y) = 0.1(x² + y²)',
    minimum: [0, 0],
    goal: 'Reach the red flag at the valley bottom',
    insight: 'Perfect bowl - gradient always points toward center!'
  },
  rosenbrock: {
    name: 'Rosenbrock Valley',
    func: (x: number, y: number) => Math.pow(1 - x, 2) + 100 * Math.pow(y - x * x, 2),
    gradient: (x: number, y: number) => [
      -2 * (1 - x) - 400 * x * (y - x * x),
      200 * (y - x * x)
    ],
    description: 'f(x,y) = (1-x)² + 100(y-x²)²',
    minimum: [1, 1],
    goal: 'Reach the red flag at the valley bottom (1, 1)',
    insight: 'Banana-shaped valley - tricky to navigate but leads to (1,1)!'
  },
  saddle_point: {
    name: 'Mountain Pass',
    func: (x: number, y: number) => x * x - y * y,
    gradient: (x: number, y: number) => [2 * x, -2 * y],
    description: 'f(x,y) = x² - y²',
    minimum: [0, 0],
    goal: 'Explore how gradient descent behaves near the saddle at (0, 0)',
    insight: 'Saddle point - minimum in one direction, maximum in another!'
  },
  himmelblau: {
    name: 'Four Peaks Challenge',
    func: (x: number, y: number) => Math.pow(x * x + y - 11, 2) + Math.pow(x + y * y - 7, 2),
    gradient: (x: number, y: number) => [
      4 * x * (x * x + y - 11) + 2 * (x + y * y - 7),
      2 * (x * x + y - 11) + 4 * y * (x + y * y - 7)
    ],
    description: 'f(x,y) = (x²+y-11)² + (x+y²-7)²',
    minimum: [3, 2],
    goal: 'Reach the red flag at one of the four minima',
    insight: 'Multiple minima - various paths to success!'
  }
};

interface GretaGradientDescentClimberProps {
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  isPreview?: boolean;
}

const GretaGradientDescentClimber: React.FC<GretaGradientDescentClimberProps> = ({
  onComplete,
  onProgress,
  isPreview = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  const [selectedLandscape, setSelectedLandscape] = useState<keyof typeof landscapeFunctions>('simple_bowl');
  const [learningRate, setLearningRate] = useState([0.01]);
  const [startPoint, setStartPoint] = useState<[number, number]>([-5, 4]);
  const [currentPoint, setCurrentPoint] = useState<[number, number]>([-5, 4]);
  const [path, setPath] = useState<Array<[number, number]>>([]);
  const [isClimbing, setIsClimbing] = useState(false);
  const [step, setStep] = useState(0);
  const [expeditionCount, setExpeditionCount] = useState(0);

  // Canvas settings
  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 400;
  const DOMAIN = 6; // -6 to 6
  const SCALE = CANVAS_WIDTH / (2 * DOMAIN);

  const currentLandscape = landscapeFunctions[selectedLandscape];

  // Convert world coordinates to canvas coordinates
  const worldToCanvas = (x: number, y: number) => {
    return {
      x: CANVAS_WIDTH / 2 + x * SCALE,
      y: CANVAS_HEIGHT / 2 - y * SCALE
    };
  };

  // Convert canvas coordinates to world coordinates
  const canvasToWorld = (canvasX: number, canvasY: number) => {
    return {
      x: (canvasX - CANVAS_WIDTH / 2) / SCALE,
      y: -(canvasY - CANVAS_HEIGHT / 2) / SCALE
    };
  };

  // Draw the optimization landscape
  const drawLandscape = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw contour map
    const resolution = 60;
    const stepX = (2 * DOMAIN) / resolution;
    const stepY = (2 * DOMAIN) / resolution;

    // Calculate function values for color mapping
    const values: number[] = [];
    for (let i = 0; i <= resolution; i++) {
      for (let j = 0; j <= resolution; j++) {
        const x = -DOMAIN + i * stepX;
        const y = -DOMAIN + j * stepY;
        values.push(currentLandscape.func(x, y));
      }
    }

    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);

    // Draw elevation map
    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        const x = -DOMAIN + i * stepX;
        const y = -DOMAIN + j * stepY;
        const z = currentLandscape.func(x, y);
        
        const intensity = Math.max(0, Math.min(1, (maxVal - z) / (maxVal - minVal)));
        const elevation = Math.floor(intensity * 255);
        
        // Mountain-like color scheme: high = white/yellow, low = brown/green
        let r, g, b;
        if (intensity > 0.8) {
          // High peaks - white/yellow
          r = 255;
          g = 255;
          b = 200 + Math.floor(intensity * 55);
        } else if (intensity > 0.5) {
          // Mid elevation - browns/oranges  
          r = 139 + Math.floor(intensity * 100);
          g = 69 + Math.floor(intensity * 80);
          b = 19 + Math.floor(intensity * 50);
        } else {
          // Low valleys - greens
          r = 34 + Math.floor(intensity * 50);
          g = 139 + Math.floor(intensity * 80);
          b = 34 + Math.floor(intensity * 50);
        }
        
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        
        const canvasPos = worldToCanvas(x, y);
        ctx.fillRect(canvasPos.x, canvasPos.y, SCALE * stepX + 1, SCALE * stepY + 1);
      }
    }

    // Draw contour lines for better visualization
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 1;
    
    // Draw a few key contour lines
    const contourLevels = 5;
    for (let level = 1; level <= contourLevels; level++) {
      const targetValue = minVal + (level / contourLevels) * (maxVal - minVal);
      // Simplified contour approximation - just draw some reference circles/lines
      if (selectedLandscape === 'simple_bowl') {
        const radius = Math.sqrt(targetValue / 0.1) * SCALE;
        if (radius < CANVAS_WIDTH / 2) {
          ctx.beginPath();
          ctx.arc(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, radius, 0, 2 * Math.PI);
          ctx.stroke();
        }
      }
    }

    // Draw minimum point
    const minPos = worldToCanvas(currentLandscape.minimum[0], currentLandscape.minimum[1]);
    ctx.fillStyle = '#dc2626';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(minPos.x, minPos.y, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    
    // Flag at minimum
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(minPos.x + 8, minPos.y - 15, 12, 8);
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(minPos.x + 8, minPos.y - 15);
    ctx.lineTo(minPos.x + 8, minPos.y + 5);
    ctx.stroke();

    // Draw path if exists
    if (path.length > 1) {
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      const firstPoint = worldToCanvas(path[0][0], path[0][1]);
      ctx.moveTo(firstPoint.x, firstPoint.y);
      
      for (let i = 1; i < path.length; i++) {
        const point = worldToCanvas(path[i][0], path[i][1]);
        ctx.lineTo(point.x, point.y);
      }
      ctx.stroke();

      // Draw path points
      path.forEach((point, index) => {
        const canvasPoint = worldToCanvas(point[0], point[1]);
        ctx.fillStyle = index === 0 ? '#10b981' : '#f59e0b';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(canvasPoint.x, canvasPoint.y, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      });
    }

    // Draw current position
    const currentPos = worldToCanvas(currentPoint[0], currentPoint[1]);
    ctx.fillStyle = '#8b5cf6';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(currentPos.x, currentPos.y, 10, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Draw Greta icon at current position
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px serif';
    ctx.textAlign = 'center';
    ctx.fillText('🐐', currentPos.x, currentPos.y + 5);

    // Draw current gradient vector
    const gradient = currentLandscape.gradient(currentPoint[0], currentPoint[1]);
    const gradientMagnitude = Math.sqrt(gradient[0] * gradient[0] + gradient[1] * gradient[1]);
    
    if (gradientMagnitude > 0.01) {
      const gradientScale = 30;
      const gradientEnd = {
        x: currentPos.x - (gradient[0] / gradientMagnitude) * gradientScale,
        y: currentPos.y + (gradient[1] / gradientMagnitude) * gradientScale
      };

      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(currentPos.x, currentPos.y);
      ctx.lineTo(gradientEnd.x, gradientEnd.y);
      ctx.stroke();

      // Arrow head
      const angle = Math.atan2(gradientEnd.y - currentPos.y, gradientEnd.x - currentPos.x);
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(gradientEnd.x, gradientEnd.y);
      ctx.lineTo(gradientEnd.x - 8 * Math.cos(angle - Math.PI/6), gradientEnd.y - 8 * Math.sin(angle - Math.PI/6));
      ctx.lineTo(gradientEnd.x - 8 * Math.cos(angle + Math.PI/6), gradientEnd.y - 8 * Math.sin(angle + Math.PI/6));
      ctx.closePath();
      ctx.fill();
    }

  }, [currentLandscape, currentPoint, path, selectedLandscape]);

  // Perform gradient descent step
  const performGradientStep = useCallback(() => {
    const gradient = currentLandscape.gradient(currentPoint[0], currentPoint[1]);
    const lr = learningRate[0];
    
    // Take step in negative gradient direction
    const newX = currentPoint[0] - lr * gradient[0];
    const newY = currentPoint[1] - lr * gradient[1];
    
    // Bound within domain
    const boundedX = Math.max(-DOMAIN, Math.min(DOMAIN, newX));
    const boundedY = Math.max(-DOMAIN, Math.min(DOMAIN, newY));
    
    const newPoint: [number, number] = [boundedX, boundedY];
    setCurrentPoint(newPoint);
    setPath(prev => [...prev, newPoint]);
    setStep(prev => prev + 1);

    // Check if we're close to minimum (within 0.1 units)
    const distToMin = Math.sqrt(
      Math.pow(boundedX - currentLandscape.minimum[0], 2) + 
      Math.pow(boundedY - currentLandscape.minimum[1], 2)
    );

    if (distToMin < 0.2 || step > 1000) {
      setIsClimbing(false);
      if (onComplete && distToMin < 0.2) {
        onComplete();
      }
    }

    if (onProgress) {
      onProgress(Math.min(step / 50, 1)); // Progress based on steps taken
    }

  }, [currentLandscape, currentPoint, learningRate, step, onComplete, onProgress]);

  // Animation loop
  useEffect(() => {
    if (isClimbing) {
      animationRef.current = setTimeout(() => {
        performGradientStep();
      }, 200); // Step every 200ms
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isClimbing, performGradientStep]);

  useEffect(() => {
    drawLandscape();
  }, [drawLandscape]);

  const startClimbing = () => {
    setIsClimbing(true);
    setStep(0);
    setPath([currentPoint]);
    setExpeditionCount(prev => prev + 1);
  };

  const stopClimbing = () => {
    setIsClimbing(false);
  };

  const resetPosition = () => {
    setCurrentPoint(startPoint);
    setPath([]);
    setStep(0);
    setIsClimbing(false);
  };

  const changeLandscape = (landscape: keyof typeof landscapeFunctions) => {
    setSelectedLandscape(landscape);
    setCurrentPoint([-5, 4]);
    setPath([]);
    setStep(0);
    setIsClimbing(false);
  };

  const currentFunction = currentLandscape.func(currentPoint[0], currentPoint[1]);
  const currentGradient = currentLandscape.gradient(currentPoint[0], currentPoint[1]);
  const gradientMagnitude = Math.sqrt(currentGradient[0] * currentGradient[0] + currentGradient[1] * currentGradient[1]);

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src="/lovable-uploads/greta.png" alt="Gradient Greta" />
          <AvatarFallback>G</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Greta's Mountain Optimization</h2>
          <p className="text-slate-600">{currentLandscape.goal}</p>
        </div>
        <Badge variant="outline" className="ml-auto">
          Expedition #{expeditionCount}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Mountain Visualization */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-amber-800 flex items-center gap-2">
                <Mountain className="w-5 h-5" />
                {currentLandscape.name} Landscape
              </CardTitle>
              <p className="text-sm text-amber-600">{currentLandscape.description}</p>
            </CardHeader>
            <CardContent className="flex justify-center">
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="border border-amber-200 rounded-lg cursor-crosshair"
                onClick={(e) => {
                  if (!isClimbing) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const worldCoords = canvasToWorld(x, y);
                    const newPoint: [number, number] = [
                      Math.max(-DOMAIN, Math.min(DOMAIN, worldCoords.x)),
                      Math.max(-DOMAIN, Math.min(DOMAIN, worldCoords.y))
                    ];
                    setCurrentPoint(newPoint);
                    setStartPoint(newPoint);
                    setPath([]);
                    setStep(0);
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* Climbing Stats */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-700">{step}</div>
                  <div className="text-xs text-green-600">Steps Taken</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-700">{currentFunction.toFixed(3)}</div>
                  <div className="text-xs text-blue-600">Current Elevation</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-red-700">{gradientMagnitude.toFixed(3)}</div>
                  <div className="text-xs text-red-600">Slope Steepness</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Climbing Controls */}
        <div className="space-y-6">
          {/* Expedition Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5" />
                Climbing Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm mb-2 block">Learning Rate: {learningRate[0].toFixed(3)}</Label>
                <Slider
                  value={learningRate}
                  onValueChange={setLearningRate}
                  min={0.001}
                  max={0.1}
                  step={0.001}
                  disabled={isClimbing}
                  className="w-full"
                />
                <div className="text-xs text-slate-500 mt-1">
                  Higher = bigger steps, Lower = smaller steps
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={isClimbing ? stopClimbing : startClimbing}
                  disabled={gradientMagnitude < 0.001}
                  className="flex-1"
                  variant={isClimbing ? "destructive" : "default"}
                >
                  {isClimbing ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Climb
                    </>
                  )}
                </Button>
                <Button
                  onClick={resetPosition}
                  variant="outline"
                  disabled={isClimbing}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg">
                <div className="text-sm text-amber-800">
                  <strong>🐐 Position:</strong> ({currentPoint[0].toFixed(2)}, {currentPoint[1].toFixed(2)})
                </div>
                <div className="text-xs text-amber-600 mt-1">
                  Click on the mountain to set a new starting position!
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mountain Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingDown className="w-5 h-5" />
                Choose Your Mountain
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(landscapeFunctions).map(([key, landscape]) => (
                <Button
                  key={key}
                  variant={selectedLandscape === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => changeLandscape(key as keyof typeof landscapeFunctions)}
                  disabled={isClimbing}
                  className="w-full justify-start text-left h-auto p-3"
                >
                  <div>
                    <div className="font-medium">{landscape.name}</div>
                    <div className="text-xs opacity-70">{landscape.description}</div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {!isPreview && (
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <CardContent className="pt-6">
                <div className="text-sm text-amber-700 space-y-2">
                  <p><strong>⛰️ Greta's Climbing Tips:</strong></p>
                  <div className="text-xs space-y-1">
                    <div><strong>Red Arrow:</strong> Shows downhill direction (negative gradient)</div>
                    <div><strong>Learning Rate:</strong> Controls step size - find the sweet spot!</div>
                    <div><strong>Goal:</strong> {currentLandscape.goal}</div>
                    <div><strong>Insight:</strong> {currentLandscape.insight}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default GretaGradientDescentClimber;