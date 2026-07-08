import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/core/components/ui/button';
import { Label } from '@/core/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/core/components/ui/avatar';
import { Badge } from '@/core/components/ui/badge';
import { Slider } from '@/core/components/ui/slider';
import { TrendingUp, Activity, Target, BarChart3 } from 'lucide-react';

// Mathematical functions for exploration
const functionPresets = {
  quadratic: {
    name: 'Quadratic Bowl',
    func: (x: number, y: number) => 0.1 * (x * x + y * y),
    description: 'f(x,y) = 0.1(x² + y²)',
    insight: 'Perfect bowl shape - derivatives increase linearly from center'
  },
  saddle: {
    name: 'Saddle Point',
    func: (x: number, y: number) => 0.1 * (x * x - y * y),
    description: 'f(x,y) = 0.1(x² - y²)',
    insight: 'Classic saddle - opposite curvature in x and y directions'
  },
  sine: {
    name: 'Sine Wave Hills',
    func: (x: number, y: number) => Math.sin(x * 0.3) * Math.cos(y * 0.3),
    description: 'f(x,y) = sin(0.3x)cos(0.3y)',
    insight: 'Periodic waves - derivatives show oscillating patterns'
  },
  exponential: {
    name: 'Exponential Decay',
    func: (x: number, y: number) => Math.exp(-0.02 * (x * x + y * y)) * Math.cos(x * 0.2),
    description: 'f(x,y) = e^(-0.02(x²+y²))cos(0.2x)',
    insight: 'Decaying oscillation - derivatives fade with distance'
  }
};

// Calculate partial derivatives using finite differences
const calculatePartialDerivatives = (func: (x: number, y: number) => number, x: number, y: number, h: number = 0.1) => {
  const fx = (func(x + h, y) - func(x - h, y)) / (2 * h);
  const fy = (func(x, y + h) - func(x, y - h)) / (2 * h);
  return { fx, fy };
};

interface DeltaPartialDerivativeExplorerProps {
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  isPreview?: boolean;
}

const DeltaPartialDerivativeExplorer: React.FC<DeltaPartialDerivativeExplorerProps> = ({
  onComplete,
  onProgress,
  isPreview = false
}) => {
  const contourCanvasRef = useRef<HTMLCanvasElement>(null);
  const derivativeCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const [selectedFunction, setSelectedFunction] = useState<keyof typeof functionPresets>('quadratic');
  const [pointX, setPointX] = useState([0]);
  const [pointY, setPointY] = useState([0]);
  const [showDerivatives, setShowDerivatives] = useState(true);
  const [analysisStep, setAnalysisStep] = useState(0);

  // Canvas dimensions
  const CANVAS_WIDTH = 300;
  const CANVAS_HEIGHT = 300;
  const DOMAIN = 10; // -10 to 10 in both x and y
  const SCALE = CANVAS_WIDTH / (2 * DOMAIN);

  const currentFunction = functionPresets[selectedFunction];
  const pointXVal = pointX[0];
  const pointYVal = pointY[0];
  const derivatives = calculatePartialDerivatives(currentFunction.func, pointXVal, pointYVal);

  // Convert world coordinates to canvas coordinates
  const worldToCanvas = (x: number, y: number) => {
    return {
      x: CANVAS_WIDTH / 2 + x * SCALE,
      y: CANVAS_HEIGHT / 2 - y * SCALE
    };
  };

  // Draw contour plot
  const drawContourPlot = useCallback(() => {
    const canvas = contourCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw contour lines
    const resolution = 40;
    const stepX = (2 * DOMAIN) / resolution;
    const stepY = (2 * DOMAIN) / resolution;

    // Calculate function values for color mapping
    const values: number[] = [];
    for (let i = 0; i <= resolution; i++) {
      for (let j = 0; j <= resolution; j++) {
        const x = -DOMAIN + i * stepX;
        const y = -DOMAIN + j * stepY;
        values.push(currentFunction.func(x, y));
      }
    }

    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);

    // Draw colored regions
    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        const x = -DOMAIN + i * stepX;
        const y = -DOMAIN + j * stepY;
        const z = currentFunction.func(x, y);
        
        const intensity = (z - minVal) / (maxVal - minVal);
        const hue = 240 - intensity * 240; // Blue to red
        
        ctx.fillStyle = `hsl(${hue}, 70%, ${50 + intensity * 30}%)`;
        
        const canvasPos = worldToCanvas(x, y);
        ctx.fillRect(canvasPos.x, canvasPos.y, SCALE * stepX, SCALE * stepY);
      }
    }

    // Draw grid
    ctx.strokeStyle = '#ffffff40';
    ctx.lineWidth = 1;
    for (let x = -DOMAIN; x <= DOMAIN; x += 2) {
      const canvasX = worldToCanvas(x, 0).x;
      ctx.beginPath();
      ctx.moveTo(canvasX, 0);
      ctx.lineTo(canvasX, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let y = -DOMAIN; y <= DOMAIN; y += 2) {
      const canvasY = worldToCanvas(0, y).y;
      ctx.beginPath();
      ctx.moveTo(0, canvasY);
      ctx.lineTo(CANVAS_WIDTH, canvasY);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    const centerX = worldToCanvas(0, 0).x;
    const centerY = worldToCanvas(0, 0).y;
    
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(CANVAS_WIDTH, centerY);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, CANVAS_HEIGHT);
    ctx.stroke();

    // Draw exploration point
    const pointPos = worldToCanvas(pointXVal, pointYVal);
    ctx.fillStyle = '#ff4444';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(pointPos.x, pointPos.y, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

  }, [currentFunction, pointXVal, pointYVal]);

  // Draw derivative visualization
  const drawDerivativeVisualization = useCallback(() => {
    const canvas = derivativeCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw derivative vectors if enabled
    if (showDerivatives) {
      const centerX = CANVAS_WIDTH / 2;
      const centerY = CANVAS_HEIGHT / 2;
      const vectorScale = 30;

      // Partial derivative with respect to x (red arrow)
      const fxLength = derivatives.fx * vectorScale;
      ctx.strokeStyle = '#dc2626';
      ctx.fillStyle = '#dc2626';
      ctx.lineWidth = 4;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + fxLength, centerY);
      ctx.stroke();
      
      // Arrow head for fx
      if (Math.abs(fxLength) > 5) {
        const sign = fxLength >= 0 ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(centerX + fxLength, centerY);
        ctx.lineTo(centerX + fxLength - sign * 10, centerY - 5);
        ctx.lineTo(centerX + fxLength - sign * 10, centerY + 5);
        ctx.closePath();
        ctx.fill();
      }

      // Partial derivative with respect to y (green arrow)
      const fyLength = -derivatives.fy * vectorScale; // Negative because canvas y is flipped
      ctx.strokeStyle = '#16a34a';
      ctx.fillStyle = '#16a34a';
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX, centerY + fyLength);
      ctx.stroke();
      
      // Arrow head for fy
      if (Math.abs(fyLength) > 5) {
        const sign = fyLength >= 0 ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY + fyLength);
        ctx.lineTo(centerX - 5, centerY + fyLength - sign * 10);
        ctx.lineTo(centerX + 5, centerY + fyLength - sign * 10);
        ctx.closePath();
        ctx.fill();
      }

      // Gradient vector (combined - blue arrow)
      const gradLength = Math.sqrt(derivatives.fx * derivatives.fx + derivatives.fy * derivatives.fy);
      if (gradLength > 0.01) {
        const gradX = (derivatives.fx / gradLength) * gradLength * vectorScale;
        const gradY = -(derivatives.fy / gradLength) * gradLength * vectorScale; // Negative for canvas
        
        ctx.strokeStyle = '#2563eb';
        ctx.fillStyle = '#2563eb';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 4]);
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + gradX, centerY + gradY);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Arrow head for gradient
        const angle = Math.atan2(gradY, gradX);
        ctx.beginPath();
        ctx.moveTo(centerX + gradX, centerY + gradY);
        ctx.lineTo(centerX + gradX - 8 * Math.cos(angle - Math.PI/6), centerY + gradY - 8 * Math.sin(angle - Math.PI/6));
        ctx.lineTo(centerX + gradX - 8 * Math.cos(angle + Math.PI/6), centerY + gradY - 8 * Math.sin(angle + Math.PI/6));
        ctx.closePath();
        ctx.fill();
        
        // Gradient label
        ctx.fillStyle = '#374151';
        ctx.font = '12px sans-serif';
        ctx.fillText('∇f', centerX + gradX/2, centerY + gradY/2 - 10);
      }

      // Origin point
      ctx.fillStyle = '#374151';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI);
      ctx.fill();

      // Labels
      ctx.fillStyle = '#374151';
      ctx.font = '12px sans-serif';
      ctx.fillText('∂f/∂x', centerX + Math.max(fxLength, 20), centerY - 10);
      ctx.fillText('∂f/∂y', centerX + 10, centerY + Math.min(fyLength, -20));
    }

  }, [derivatives, showDerivatives]);

  useEffect(() => {
    drawContourPlot();
    drawDerivativeVisualization();
  }, [drawContourPlot, drawDerivativeVisualization]);

  const handleFunctionChange = (funcName: keyof typeof functionPresets) => {
    setSelectedFunction(funcName);
    setAnalysisStep(prev => Math.min(prev + 1, 3));
    
    if (onProgress) {
      onProgress(analysisStep / 3);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src="/lovable-uploads/delta.png" alt="Dr. Delta" />
          <AvatarFallback>Δ</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Dr. Delta's Change Analysis Lab</h2>
          <p className="text-slate-600">Explore how functions change in multiple dimensions!</p>
        </div>
        <Badge variant="outline" className="ml-auto">
          Analysis {analysisStep}/3
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Visualizations */}
        <div className="lg:col-span-2 space-y-4">
          {/* Contour Plot */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-green-800 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Function Landscape: {currentFunction.name}
              </CardTitle>
              <p className="text-sm text-green-600">{currentFunction.description}</p>
            </CardHeader>
            <CardContent className="flex justify-center">
              <canvas
                ref={contourCanvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="border border-green-200 rounded-lg bg-white cursor-crosshair"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const worldX = ((x - CANVAS_WIDTH/2) / SCALE);
                  const worldY = -((y - CANVAS_HEIGHT/2) / SCALE);
                  setPointX([Math.max(-DOMAIN, Math.min(DOMAIN, worldX))]);
                  setPointY([Math.max(-DOMAIN, Math.min(DOMAIN, worldY))]);
                }}
              />
            </CardContent>
          </Card>

          {/* Derivative Visualization */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-green-50">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold text-emerald-800 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Partial Derivatives at Point
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDerivatives(!showDerivatives)}
                  className="text-xs"
                >
                  {showDerivatives ? 'Hide' : 'Show'} Vectors
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex justify-center">
              <canvas
                ref={derivativeCanvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="border border-emerald-200 rounded-lg"
              />
            </CardContent>
          </Card>
        </div>

        {/* Controls and Analysis */}
        <div className="space-y-6">
          {/* Point Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5" />
                Exploration Point
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm mb-2 block">x-coordinate: {pointXVal.toFixed(2)}</Label>
                <Slider
                  value={pointX}
                  onValueChange={setPointX}
                  min={-DOMAIN}
                  max={DOMAIN}
                  step={0.1}
                  className="w-full"
                />
              </div>
              <div>
                <Label className="text-sm mb-2 block">y-coordinate: {pointYVal.toFixed(2)}</Label>
                <Slider
                  value={pointY}
                  onValueChange={setPointY}
                  min={-DOMAIN}
                  max={DOMAIN}
                  step={0.1}
                  className="w-full"
                />
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-sm font-medium text-green-800 mb-2">Function Value</div>
                <div className="text-lg font-mono text-green-700">
                  f({pointXVal.toFixed(1)}, {pointYVal.toFixed(1)}) = {currentFunction.func(pointXVal, pointYVal).toFixed(3)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Derivative Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Change Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-red-700">∂f/∂x (red):</span>
                <span className="font-mono text-red-700">{derivatives.fx.toFixed(3)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">∂f/∂y (green):</span>
                <span className="font-mono text-green-700">{derivatives.fy.toFixed(3)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">|∇f| (magnitude):</span>
                <span className="font-mono text-blue-700">
                  {Math.sqrt(derivatives.fx * derivatives.fx + derivatives.fy * derivatives.fy).toFixed(3)}
                </span>
              </div>
              
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-xs text-slate-600">
                  <strong>Dr. Delta's Note:</strong> The gradient vector points in the direction of steepest increase!
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Function Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mathematical Specimens</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(functionPresets).map(([key, preset]) => (
                <Button
                  key={key}
                  variant={selectedFunction === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFunctionChange(key as keyof typeof functionPresets)}
                  className="w-full justify-start text-left h-auto p-3"
                >
                  <div>
                    <div className="font-medium">{preset.name}</div>
                    <div className="text-xs opacity-70">{preset.description}</div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {!isPreview && (
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="pt-6">
                <div className="text-sm text-green-700 space-y-2">
                  <p><strong>📈 Dr. Delta's Analysis Tips:</strong></p>
                  <div className="text-xs space-y-1">
                    <div><strong>Red vector (∂f/∂x):</strong> Rate of change in x-direction</div>
                    <div><strong>Green vector (∂f/∂y):</strong> Rate of change in y-direction</div>
                    <div><strong>Blue vector (∇f):</strong> Direction of steepest increase</div>
                    <div><strong>Insight:</strong> {currentFunction.insight}</div>
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

export default DeltaPartialDerivativeExplorer;