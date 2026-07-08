import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/core/components/ui/button';
import { Input } from '@/core/components/ui/input';
import { Label } from '@/core/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/core/components/ui/avatar';
import { Badge } from '@/core/components/ui/badge';
import { Search, RotateCw, Target, Eye } from 'lucide-react';

// Matrix operations
const multiplyMatrix = (matrix: number[][], point: number[]): number[] => {
  return [
    matrix[0][0] * point[0] + matrix[0][1] * point[1],
    matrix[1][0] * point[0] + matrix[1][1] * point[1]
  ];
};

const calculateEigenvalues = (matrix: number[][]): { values: number[], vectors: number[][] } => {
  const [[a, b], [c, d]] = matrix;
  const trace = a + d;
  const det = a * d - b * c;
  const discriminant = trace * trace - 4 * det;

  if (discriminant < 0) {
    // Complex eigenvalues - use real part for visualization
    return {
      values: [trace / 2, trace / 2],
      vectors: [[1, 0], [0, 1]]
    };
  }

  const sqrt_disc = Math.sqrt(discriminant);
  const lambda1 = (trace + sqrt_disc) / 2;
  const lambda2 = (trace - sqrt_disc) / 2;

  // Calculate eigenvectors
  let v1 = [1, 0], v2 = [0, 1];

  if (Math.abs(b) > 1e-10) {
    v1 = [b, lambda1 - a];
    v2 = [b, lambda2 - a];
  } else if (Math.abs(c) > 1e-10) {
    v1 = [lambda1 - d, c];
    v2 = [lambda2 - d, c];
  }

  // Normalize vectors
  const normalize = (v: number[]) => {
    const mag = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
    return mag > 1e-10 ? [v[0] / mag, v[1] / mag] : v;
  };

  return {
    values: [lambda1, lambda2],
    vectors: [normalize(v1), normalize(v2)]
  };
};

interface EileenEigenvalueDetectiveProps {
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  isPreview?: boolean;
}

const EileenEigenvalueDetective: React.FC<EileenEigenvalueDetectiveProps> = ({
  onComplete,
  onProgress,
  isPreview = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [matrix, setMatrix] = useState<number[][]>([[2, 1], [1, 2]]);
  const [showEigenvectors, setShowEigenvectors] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState<string>('symmetric');
  const [investigationStep, setInvestigationStep] = useState(0);

  // Canvas dimensions
  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 400;
  const CENTER_X = CANVAS_WIDTH / 2;
  const CENTER_Y = CANVAS_HEIGHT / 2;
  const SCALE = 80;

  // Preset matrices for investigation
  const presetMatrices = {
    symmetric: { matrix: [[2, 1], [1, 2]], name: 'Symmetric Matrix', clue: 'Real eigenvalues guaranteed!' },
    rotation: { matrix: [[0, -1], [1, 0]], name: 'Rotation Matrix', clue: 'Complex eigenvalues - special directions!' },
    scaling: { matrix: [[3, 0], [0, 1]], name: 'Scaling Matrix', clue: 'Diagonal = easy eigenvalues!' },
    shear: { matrix: [[1, 2], [0, 1]], name: 'Shear Matrix', clue: 'One repeated eigenvalue!' }
  };

  // Calculate eigenvalues and eigenvectors
  const eigenData = calculateEigenvalues(matrix);

  // Convert to canvas coordinates
  const toCanvasCoords = (point: number[]): number[] => {
    return [
      CENTER_X + point[0] * SCALE,
      CENTER_Y - point[1] * SCALE
    ];
  };

  // Draw visualization
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    const gridSpacing = SCALE / 2;
    for (let x = gridSpacing; x < CANVAS_WIDTH; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let y = gridSpacing; y < CANVAS_HEIGHT; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, CENTER_Y);
    ctx.lineTo(CANVAS_WIDTH, CENTER_Y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(CENTER_X, 0);
    ctx.lineTo(CENTER_X, CANVAS_HEIGHT);
    ctx.stroke();

    // Draw unit circle for reference
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(CENTER_X, CENTER_Y, SCALE, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw sample vectors around unit circle
    const numVectors = 12;
    for (let i = 0; i < numVectors; i++) {
      const angle = (2 * Math.PI * i) / numVectors;
      const unitVector = [Math.cos(angle), Math.sin(angle)];
      const transformedVector = multiplyMatrix(matrix, unitVector);
      
      const start = toCanvasCoords([0, 0]);
      const originalEnd = toCanvasCoords(unitVector);
      const transformedEnd = toCanvasCoords(transformedVector);

      // Original vector (light)
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(start[0], start[1]);
      ctx.lineTo(originalEnd[0], originalEnd[1]);
      ctx.stroke();

      // Transformed vector
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(start[0], start[1]);
      ctx.lineTo(transformedEnd[0], transformedEnd[1]);
      ctx.stroke();

      // Arrow head for transformed vector
      const angle2 = Math.atan2(transformedVector[1], transformedVector[0]);
      const arrowLength = 8;
      const arrowAngle = Math.PI / 6;
      ctx.beginPath();
      ctx.moveTo(transformedEnd[0], transformedEnd[1]);
      ctx.lineTo(
        transformedEnd[0] - arrowLength * Math.cos(angle2 - arrowAngle),
        transformedEnd[1] - arrowLength * Math.sin(angle2 - arrowAngle)
      );
      ctx.moveTo(transformedEnd[0], transformedEnd[1]);
      ctx.lineTo(
        transformedEnd[0] - arrowLength * Math.cos(angle2 + arrowAngle),
        transformedEnd[1] - arrowLength * Math.sin(angle2 + arrowAngle)
      );
      ctx.stroke();
    }

    // Draw eigenvectors if enabled
    if (showEigenvectors && eigenData.values[0] !== eigenData.values[1]) {
      eigenData.vectors.forEach((eigenvector, index) => {
        if (Math.abs(eigenData.values[index]) < 1e-10) return;

        const scaledVector = eigenvector.map(x => x * 1.5);
        const start = toCanvasCoords([0, 0]);
        const end = toCanvasCoords(scaledVector);
        const negEnd = toCanvasCoords(scaledVector.map(x => -x));

        // Eigenvector line (both directions)
        ctx.strokeStyle = index === 0 ? '#dc2626' : '#059669';
        ctx.lineWidth = 4;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(negEnd[0], negEnd[1]);
        ctx.lineTo(end[0], end[1]);
        ctx.stroke();

        // Labels
        ctx.fillStyle = index === 0 ? '#dc2626' : '#059669';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText(`λ${index + 1} = ${eigenData.values[index].toFixed(2)}`, end[0] + 10, end[1] - 10);
      });
    }

    // Origin point
    ctx.fillStyle = '#374151';
    ctx.beginPath();
    ctx.arc(CENTER_X, CENTER_Y, 4, 0, 2 * Math.PI);
    ctx.fill();

  }, [matrix, showEigenvectors, eigenData]);

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
    const preset = presetMatrices[presetName as keyof typeof presetMatrices];
    setMatrix(preset.matrix);
    setSelectedPreset(presetName);
    setInvestigationStep(prev => Math.min(prev + 1, 3));
    
    if (onProgress) {
      onProgress(investigationStep / 3);
    }
  };

  const currentPreset = presetMatrices[selectedPreset as keyof typeof presetMatrices];

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src="/lovable-uploads/eileen.png" alt="Eileen Eigen" />
          <AvatarFallback>E</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Eileen's Eigenvalue Detective Kit</h2>
          <p className="text-slate-600">Discover hidden directions in matrix transformations!</p>
        </div>
        <Badge variant="outline" className="ml-auto">
          Case {investigationStep}/3
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Visualization Canvas */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold text-purple-800 flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Investigation Scene
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEigenvectors(!showEigenvectors)}
                  className="text-xs"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  {showEigenvectors ? 'Hide' : 'Show'} Eigenvectors
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex justify-center">
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="border border-purple-200 rounded-lg bg-white"
              />
            </CardContent>
          </Card>

          {/* Evidence Analysis */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
              <CardContent className="pt-4">
                <div className="text-sm">
                  <h4 className="font-semibold text-red-800 mb-2">🔍 Evidence: Eigenvalues</h4>
                  <div className="space-y-1">
                    <div>λ₁ = {eigenData.values[0].toFixed(3)}</div>
                    <div>λ₂ = {eigenData.values[1].toFixed(3)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="pt-4">
                <div className="text-sm">
                  <h4 className="font-semibold text-green-800 mb-2">🧭 Clue: Special Directions</h4>
                  <div className="text-xs text-green-700">
                    {eigenData.values[0] === eigenData.values[1] 
                      ? "All directions are special!"
                      : "Red and green lines show eigenvector directions"}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detective Tools */}
        <div className="space-y-6">
          {/* Matrix Input */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5" />
                Evidence Matrix
              </CardTitle>
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
                    className="text-center"
                  />
                </div>
              </div>
              
              {currentPreset && (
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-sm font-medium text-purple-800 mb-1">Detective's Note</div>
                  <div className="text-xs text-purple-600">{currentPreset.clue}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Case Files */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <RotateCw className="w-5 h-5" />
                Case Files
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(presetMatrices).map(([key, preset]) => (
                <Button
                  key={key}
                  variant={selectedPreset === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => applyPreset(key)}
                  className="w-full justify-start text-left"
                >
                  📁 {preset.name}
                </Button>
              ))}
            </CardContent>
          </Card>

          {!isPreview && (
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="pt-6">
                <div className="text-sm text-purple-700 space-y-2">
                  <p><strong>🔍 Eileen's Investigation Tips:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Look for eigenvectors - they point in special directions</li>
                    <li>Eigenvalues tell you how much stretching happens</li>
                    <li>Some matrices have hidden patterns - investigate each case!</li>
                    <li>Complex eigenvalues mean rotation is involved</li>
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

export default EileenEigenvalueDetective;