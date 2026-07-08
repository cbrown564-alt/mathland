import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/core/components/ui/button';
import { Input } from '@/core/components/ui/input';
import { Label } from '@/core/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/core/components/ui/avatar';
import { RotateCw, Square, Maximize, Shuffle, RotateCcw } from 'lucide-react';
import { drawVectorArrow } from '@/interactive/utils/canvasArrow';
import { AXIS, BACKGROUND, GRID } from '@/interactive/utils/canvasTheme';

// Matrix operations
const multiplyMatrix = (matrix: number[][], point: number[]): number[] => {
  return [
    matrix[0][0] * point[0] + matrix[0][1] * point[1],
    matrix[1][0] * point[0] + matrix[1][1] * point[1]
  ];
};

const determinant = (matrix: number[][]): number => {
  return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
};

// Predefined transformations
const presetTransformations = {
  identity: [[1, 0], [0, 1]],
  rotation45: [[Math.cos(Math.PI/4), -Math.sin(Math.PI/4)], [Math.sin(Math.PI/4), Math.cos(Math.PI/4)]],
  scaleUp: [[1.5, 0], [0, 1.5]],
  shearX: [[1, 0.5], [0, 1]],
  reflection: [[1, 0], [0, -1]],
  compression: [[0.5, 0], [0, 2]]
};

interface MatrixTransformerProps {
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  isPreview?: boolean;
}

const MaxMatrixTransformer: React.FC<MatrixTransformerProps> = ({ 
  onComplete, 
  onProgress, 
  isPreview = false 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [matrix, setMatrix] = useState<number[][]>([[1, 0], [0, 1]]);
  const [selectedPreset, setSelectedPreset] = useState<string>('identity');
  const [showGrid, setShowGrid] = useState(true);
  const [animating, setAnimating] = useState(false);

  // Canvas dimensions and coordinate system
  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 400;
  const GRID_SIZE = 20;
  const CENTER_X = CANVAS_WIDTH / 2;
  const CENTER_Y = CANVAS_HEIGHT / 2;

  // Original shape vertices (unit square)
  const originalShape = [
    [1, 1],   // top-right
    [-1, 1],  // top-left
    [-1, -1], // bottom-left
    [1, -1]   // bottom-right
  ];

  // Scale points to canvas coordinates
  const toCanvasCoords = (point: number[]): number[] => {
    return [
      CENTER_X + point[0] * GRID_SIZE,
      CENTER_Y - point[1] * GRID_SIZE // Flip Y for canvas
    ];
  };

  // Draw grid
  const drawGrid = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!showGrid) return;
    
    ctx.strokeStyle = GRID;
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = 0; x <= CANVAS_WIDTH; x += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= CANVAS_HEIGHT; y += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = AXIS;
    ctx.lineWidth = 2;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, CENTER_Y);
    ctx.lineTo(CANVAS_WIDTH, CENTER_Y);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(CENTER_X, 0);
    ctx.lineTo(CENTER_X, CANVAS_HEIGHT);
    ctx.stroke();
  }, [showGrid, CENTER_X, CENTER_Y]);

  // Draw shape
  const drawShape = useCallback((ctx: CanvasRenderingContext2D, vertices: number[][], color: string, filled: boolean = false) => {
    if (vertices.length === 0) return;
    
    const canvasVertices = vertices.map(toCanvasCoords);
    
    ctx.beginPath();
    ctx.moveTo(canvasVertices[0][0], canvasVertices[0][1]);
    
    for (let i = 1; i < canvasVertices.length; i++) {
      ctx.lineTo(canvasVertices[i][0], canvasVertices[i][1]);
    }
    ctx.closePath();
    
    if (filled) {
      ctx.fillStyle = color + '40'; // Add transparency
      ctx.fill();
    }
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw vertices
    canvasVertices.forEach(vertex => {
      ctx.beginPath();
      ctx.arc(vertex[0], vertex[1], 4, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    });
  }, [toCanvasCoords]);

  // Animation function
  const animateTransformation = useCallback(async (targetMatrix: number[][]) => {
    if (!canvasRef.current) return;
    
    setAnimating(true);
    const steps = 30;
    const startMatrix = [...matrix.map(row => [...row])];
    
    for (let step = 0; step <= steps; step++) {
      const t = step / steps;
      const interpolatedMatrix = [
        [
          startMatrix[0][0] + t * (targetMatrix[0][0] - startMatrix[0][0]),
          startMatrix[0][1] + t * (targetMatrix[0][1] - startMatrix[0][1])
        ],
        [
          startMatrix[1][0] + t * (targetMatrix[1][0] - startMatrix[1][0]),
          startMatrix[1][1] + t * (targetMatrix[1][1] - startMatrix[1][1])
        ]
      ];
      
      setMatrix(interpolatedMatrix);
      await new Promise(resolve => setTimeout(resolve, 16)); // ~60fps
      
      if (onProgress) {
        onProgress(t);
      }
    }
    
    setMatrix(targetMatrix);
    setAnimating(false);
    
    if (onComplete) {
      onComplete();
    }
  }, [matrix, onComplete, onProgress]);

  // Draw everything
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = BACKGROUND;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw grid
    drawGrid(ctx);
    
    // Draw original shape (light blue)
    drawShape(ctx, originalShape, 'rgba(255,255,255,0.25)', false);
    
    // Draw transformed shape (Max's blue color)
    const transformedShape = originalShape.map(vertex => multiplyMatrix(matrix, vertex));
    drawShape(ctx, transformedShape, '#2563eb', true);
    
    // Draw unit vectors and their transformations
    const unitX = [[0, 0], [1, 0]];
    const unitY = [[0, 0], [0, 1]];
    const transformedX = unitX.map(vertex => multiplyMatrix(matrix, vertex));
    const transformedY = unitY.map(vertex => multiplyMatrix(matrix, vertex));
    
    const xCanvas = transformedX.map(toCanvasCoords);
    const yCanvas = transformedY.map(toCanvasCoords);
    
    // Draw basis vectors
    drawVectorArrow(ctx, xCanvas[0][0], xCanvas[0][1], xCanvas[1][0], xCanvas[1][1], '#dc2626', 2);
    drawVectorArrow(ctx, yCanvas[0][0], yCanvas[0][1], yCanvas[1][0], yCanvas[1][1], '#16a34a', 2);
  }, [matrix, drawGrid, drawShape, originalShape, toCanvasCoords]);

  // Update canvas when matrix changes
  useEffect(() => {
    draw();
  }, [draw]);

  const handleMatrixChange = (row: number, col: number, value: string) => {
    const newValue = parseFloat(value) || 0;
    const newMatrix = [...matrix];
    newMatrix[row][col] = newValue;
    setMatrix(newMatrix);
  };

  const applyPreset = (presetName: string) => {
    const preset = presetTransformations[presetName as keyof typeof presetTransformations];
    setSelectedPreset(presetName);
    animateTransformation(preset);
  };

  const resetTransformation = () => {
    setSelectedPreset('identity');
    animateTransformation(presetTransformations.identity);
  };

  const det = determinant(matrix);

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src="/lovable-uploads/max.png" alt="Matrix Max" />
          <AvatarFallback>M</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-bold text-white/90">Matrix Max's Transformation Studio</h2>
          <p className="text-white/55">Watch how matrices transform geometric shapes!</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Visualization Canvas */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold text-blue-800">
                  Transformation Visualization
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowGrid(!showGrid)}
                    className="text-xs"
                  >
                    {showGrid ? 'Hide Grid' : 'Show Grid'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetTransformation}
                    disabled={animating}
                    className="text-xs"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Reset
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex justify-center">
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                aria-label="Max matrix transformation visualization"
                className="border border-white/10 rounded-lg"
              />
            </CardContent>
          </Card>

          {/* Legend */}
          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/20 rounded"></div>
              <span>Original Shape</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span>Transformed Shape</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-red-600"></div>
              <div className="w-1 h-4 bg-green-600"></div>
              <span>Basis Vectors</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          {/* Matrix Input */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Transformation Matrix</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">a</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={matrix[0][0]}
                    onChange={(e) => handleMatrixChange(0, 0, e.target.value)}
                    disabled={animating}
                    className="text-center"
                  />
                </div>
                <div>
                  <Label className="text-sm">b</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={matrix[0][1]}
                    onChange={(e) => handleMatrixChange(0, 1, e.target.value)}
                    disabled={animating}
                    className="text-center"
                  />
                </div>
                <div>
                  <Label className="text-sm">c</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={matrix[1][0]}
                    onChange={(e) => handleMatrixChange(1, 0, e.target.value)}
                    disabled={animating}
                    className="text-center"
                  />
                </div>
                <div>
                  <Label className="text-sm">d</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={matrix[1][1]}
                    onChange={(e) => handleMatrixChange(1, 1, e.target.value)}
                    disabled={animating}
                    className="text-center"
                  />
                </div>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-800 mb-1">Matrix Properties</div>
                <div className="text-xs text-blue-600">
                  Determinant: {det.toFixed(3)}
                  <br />
                  {det > 0 ? 'Preserves orientation' : det < 0 ? 'Flips orientation' : 'Collapses to line/point'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preset Transformations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shuffle className="w-5 h-5" />
                Preset Transformations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(presetTransformations).map(([name, _]) => (
                <Button
                  key={name}
                  variant={selectedPreset === name ? "default" : "outline"}
                  size="sm"
                  onClick={() => applyPreset(name)}
                  disabled={animating}
                  className="w-full justify-start text-left"
                >
                  {name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1')}
                </Button>
              ))}
            </CardContent>
          </Card>

          {!isPreview && (
            <Card className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 border-blue-400/30">
              <CardContent className="pt-6">
                <div className="text-sm text-blue-700 space-y-2">
                  <p><strong>⊞ Max's Organization Tips:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Start with different preset transformations</li>
                    <li>Notice how the determinant affects area systematically</li>
                    <li>Experiment with your own matrix values</li>
                    <li>Watch how basis vectors organize the transformation</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaxMatrixTransformer; 