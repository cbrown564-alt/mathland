import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Slider } from '@/core/components/ui/slider';
import { Badge } from '@/core/components/ui/badge';

interface DiagonalizationExplorerProps {
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  isPreview?: boolean;
}

const DiagonalizationExplorer: React.FC<DiagonalizationExplorerProps> = ({ 
  onComplete, 
  onProgress, 
  isPreview = false 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Matrix parameters (2x2 symmetric matrix for guaranteed real eigenvalues)
  const [matrixA, setMatrixA] = useState(3);
  const [matrixB, setMatrixB] = useState(1);
  const [matrixC, setMatrixC] = useState(2);
  const [isSymmetric, setIsSymmetric] = useState(true);
  
  // Visualization options
  const [showOriginalBasis, setShowOriginalBasis] = useState(true);
  const [showEigenvectors, setShowEigenvectors] = useState(true);
  const [showDiagonalization, setShowDiagonalization] = useState(true);
  const [showTransformation, setShowTransformation] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  
  // Animation state
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<'original' | 'eigenvectors' | 'diagonal' | 'reconstruction'>('original');
  
  // Progress tracking
  const [progress, setProgress] = useState(0);
  const [exploredMatrices, setExploredMatrices] = useState<Set<string>>(new Set());

  const canvasWidth = 600;
  const canvasHeight = 400;
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;
  const scale = 80;

  // Construct the matrix
  const matrix = isSymmetric 
    ? [[matrixA, matrixB], [matrixB, matrixC]]
    : [[matrixA, matrixB], [matrixB * 0.7, matrixC]];

  // Calculate eigenvalues and eigenvectors
  const calculateEigenvalues = useCallback(() => {
    const a = matrix[0][0];
    const b = matrix[0][1];
    const c = matrix[1][0];
    const d = matrix[1][1];
    
    const trace = a + d;
    const determinant = a * d - b * c;
    const discriminant = trace * trace - 4 * determinant;
    
    if (discriminant < 0) {
      return { eigenvalues: [], eigenvectors: [], isDiagonalizable: false };
    }
    
    const lambda1 = (trace + Math.sqrt(discriminant)) / 2;
    const lambda2 = (trace - Math.sqrt(discriminant)) / 2;
    
    // Calculate eigenvectors
    const calculateEigenvector = (lambda: number) => {
      const A_minus_lambda = [[a - lambda, b], [c, d - lambda]];
      
      // Find non-zero solution to (A - λI)v = 0
      if (Math.abs(A_minus_lambda[0][0]) > 1e-10) {
        const v = [1, -A_minus_lambda[0][0] / A_minus_lambda[0][1]];
        const length = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
        return [v[0] / length, v[1] / length];
      } else if (Math.abs(A_minus_lambda[0][1]) > 1e-10) {
        const v = [-A_minus_lambda[0][1] / A_minus_lambda[0][0], 1];
        const length = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
        return [v[0] / length, v[1] / length];
      } else {
        return [1, 0]; // Fallback
      }
    };
    
    const eigenvector1 = calculateEigenvector(lambda1);
    const eigenvector2 = calculateEigenvector(lambda2);
    
    return {
      eigenvalues: [lambda1, lambda2],
      eigenvectors: [eigenvector1, eigenvector2],
      isDiagonalizable: Math.abs(discriminant) > 1e-10 || Math.abs(lambda1 - lambda2) < 1e-10
    };
  }, [matrix]);

  const eigenData = calculateEigenvalues();

  // Calculate P and D matrices for diagonalization A = PDP^(-1)
  const calculateDiagonalization = useCallback(() => {
    if (!eigenData.isDiagonalizable) return null;
    
    const P = [
      [eigenData.eigenvectors[0][0], eigenData.eigenvectors[1][0]],
      [eigenData.eigenvectors[0][1], eigenData.eigenvectors[1][1]]
    ];
    
    const D = [
      [eigenData.eigenvalues[0], 0],
      [0, eigenData.eigenvalues[1]]
    ];
    
    // Calculate P^(-1)
    const det = P[0][0] * P[1][1] - P[0][1] * P[1][0];
    const P_inv = [
      [P[1][1] / det, -P[0][1] / det],
      [-P[1][0] / det, P[0][0] / det]
    ];
    
    return { P, D, P_inv };
  }, [eigenData]);

  const diagonalization = calculateDiagonalization();

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
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
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
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 3, 0, 2 * Math.PI);
    ctx.fill();
    
    // Labels
    ctx.fillStyle = '#6B7280';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('x', canvasWidth - 20, centerY - 10);
    ctx.fillText('y', centerX + 10, 15);
  };

  const drawVector = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, label: string, lineWidth = 3) => {
    const endX = centerX + x * scale;
    const endY = centerY - y * scale;
    
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth;
    
    // Draw vector line
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    
    // Draw arrowhead
    const angle = Math.atan2(endY - centerY, endX - centerX);
    const arrowLength = 12;
    const arrowAngle = Math.PI / 6;
    
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - arrowLength * Math.cos(angle - arrowAngle),
      endY - arrowLength * Math.sin(angle - arrowAngle)
    );
    ctx.lineTo(
      endX - arrowLength * Math.cos(angle + arrowAngle),
      endY - arrowLength * Math.sin(angle + arrowAngle)
    );
    ctx.closePath();
    ctx.fill();
    
    // Draw label
    ctx.fillStyle = color;
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText(label, endX + 10, endY - 5);
  };

  const drawEigenspaces = (ctx: CanvasRenderingContext2D) => {
    if (!eigenData.isDiagonalizable) return;
    
    eigenData.eigenvectors.forEach((eigenvector, index) => {
      const color = index === 0 ? '#DC2626' : '#2563EB';
      const eigenvalue = eigenData.eigenvalues[index];
      
      // Draw eigenspace line (extend in both directions)
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.globalAlpha = 0.3;
      
      const lineScale = 10;
      const x1 = centerX - eigenvector[0] * lineScale * scale;
      const y1 = centerY + eigenvector[1] * lineScale * scale;
      const x2 = centerX + eigenvector[0] * lineScale * scale;
      const y2 = centerY - eigenvector[1] * lineScale * scale;
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
      
      // Draw eigenvector
      if (showEigenvectors) {
        drawVector(ctx, eigenvector[0], eigenvector[1], color, 
                  `v${index + 1} (λ=${eigenvalue.toFixed(2)})`);
      }
    });
  };

  const drawUnitCircleTransformation = (ctx: CanvasRenderingContext2D) => {
    if (!showTransformation) return;
    
    // Draw unit circle
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.arc(centerX, centerY, scale / 2, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw transformed ellipse
    const numPoints = 32;
    const transformedPoints = [];
    
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI;
      const x = Math.cos(angle) * 0.5;
      const y = Math.sin(angle) * 0.5;
      
      // Transform point
      const transformedX = matrix[0][0] * x + matrix[0][1] * y;
      const transformedY = matrix[1][0] * x + matrix[1][1] * y;
      
      transformedPoints.push({
        x: centerX + transformedX * scale,
        y: centerY - transformedY * scale
      });
    }
    
    // Draw transformed circle (ellipse)
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(transformedPoints[0].x, transformedPoints[0].y);
    for (let i = 1; i < transformedPoints.length; i++) {
      ctx.lineTo(transformedPoints[i].x, transformedPoints[i].y);
    }
    ctx.closePath();
    ctx.stroke();
  };

  const drawDiagonalizationSteps = (ctx: CanvasRenderingContext2D) => {
    if (!diagonalization || !showDiagonalization) return;
    
    // Show step-by-step diagonalization
    ctx.fillStyle = '#1F2937';
    ctx.font = '14px Inter, sans-serif';
    
    const yPos = 30;
    const stepHeight = 20;
    
    switch (currentStep) {
      case 'original':
        ctx.fillText('Step 1: Original Matrix A', 20, yPos);
        ctx.fillText(`A = [${matrix[0][0].toFixed(2)} ${matrix[0][1].toFixed(2)}]`, 20, yPos + stepHeight);
        ctx.fillText(`    [${matrix[1][0].toFixed(2)} ${matrix[1][1].toFixed(2)}]`, 20, yPos + 2 * stepHeight);
        break;
        
      case 'eigenvectors':
        ctx.fillText('Step 2: Eigenvector Matrix P', 20, yPos);
        ctx.fillText(`P = [${diagonalization.P[0][0].toFixed(2)} ${diagonalization.P[0][1].toFixed(2)}]`, 20, yPos + stepHeight);
        ctx.fillText(`    [${diagonalization.P[1][0].toFixed(2)} ${diagonalization.P[1][1].toFixed(2)}]`, 20, yPos + 2 * stepHeight);
        break;
        
      case 'diagonal':
        ctx.fillText('Step 3: Diagonal Matrix D', 20, yPos);
        ctx.fillText(`D = [${diagonalization.D[0][0].toFixed(2)} ${diagonalization.D[0][1].toFixed(2)}]`, 20, yPos + stepHeight);
        ctx.fillText(`    [${diagonalization.D[1][0].toFixed(2)} ${diagonalization.D[1][1].toFixed(2)}]`, 20, yPos + 2 * stepHeight);
        break;
        
      case 'reconstruction':
        ctx.fillText('Step 4: Verification A = PDP⁻¹', 20, yPos);
        ctx.fillText('✓ Diagonalization complete!', 20, yPos + stepHeight);
        break;
    }
  };

  const drawMatrixPowers = (ctx: CanvasRenderingContext2D) => {
    if (!diagonalization) return;
    
    // Show how diagonalization simplifies matrix powers
    ctx.fillStyle = '#6B7280';
    ctx.font = '12px Inter, sans-serif';
    
    const yStart = canvasHeight - 60;
    ctx.fillText('Matrix Powers: A^n = PD^nP⁻¹', 20, yStart);
    
    const n = 3;
    const D_n = [
      [Math.pow(eigenData.eigenvalues[0], n), 0],
      [0, Math.pow(eigenData.eigenvalues[1], n)]
    ];
    
    ctx.fillText(`D^${n} = [${D_n[0][0].toFixed(2)} ${D_n[0][1].toFixed(2)}]`, 20, yStart + 15);
    ctx.fillText(`      [${D_n[1][0].toFixed(2)} ${D_n[1][1].toFixed(2)}]`, 20, yStart + 30);
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

    // Draw original basis vectors
    if (showOriginalBasis) {
      drawVector(ctx, 1, 0, '#94A3B8', 'e₁', 2);
      drawVector(ctx, 0, 1, '#94A3B8', 'e₂', 2);
    }

    // Draw eigenspaces and eigenvectors
    drawEigenspaces(ctx);

    // Draw unit circle transformation
    drawUnitCircleTransformation(ctx);

    // Draw diagonalization steps
    drawDiagonalizationSteps(ctx);

    // Draw matrix powers example
    drawMatrixPowers(ctx);

    // Information panel
    ctx.fillStyle = '#1F2937';
    ctx.font = '14px Inter, sans-serif';
    const infoX = canvasWidth - 200;
    ctx.fillText('Eigenvalue Analysis', infoX, 25);
    
    if (eigenData.isDiagonalizable) {
      ctx.fillText(`λ₁ = ${eigenData.eigenvalues[0].toFixed(3)}`, infoX, 45);
      ctx.fillText(`λ₂ = ${eigenData.eigenvalues[1].toFixed(3)}`, infoX, 65);
      ctx.fillText('✓ Diagonalizable', infoX, 85);
    } else {
      ctx.fillText('✗ Not diagonalizable', infoX, 45);
      ctx.fillText('(Complex eigenvalues)', infoX, 65);
    }
    
    ctx.fillText(`det(A) = ${(matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]).toFixed(3)}`, infoX, 105);
    ctx.fillText(`tr(A) = ${(matrix[0][0] + matrix[1][1]).toFixed(3)}`, infoX, 125);
  }, [matrix, eigenData, currentStep, showOriginalBasis, showEigenvectors, showDiagonalization, showTransformation, diagonalization]);

  // Animation for stepping through diagonalization
  const animateSteps = useCallback(() => {
    if (!diagonalization) return;
    
    setIsAnimating(true);
    const steps: typeof currentStep[] = ['original', 'eigenvectors', 'diagonal', 'reconstruction'];
    let stepIndex = 0;
    
    const nextStep = () => {
      if (stepIndex < steps.length) {
        setCurrentStep(steps[stepIndex]);
        setAnimationProgress((stepIndex + 1) / steps.length);
        stepIndex++;
        setTimeout(nextStep, 2000 / animationSpeed);
      } else {
        setIsAnimating(false);
        setAnimationProgress(0);
      }
    };
    
    nextStep();
  }, [diagonalization, animationSpeed]);

  // Redraw when dependencies change
  useEffect(() => {
    draw();
  }, [draw]);

  // Progress tracking
  useEffect(() => {
    const matrixKey = `${matrixA.toFixed(1)},${matrixB.toFixed(1)},${matrixC.toFixed(1)}`;
    setExploredMatrices(prev => new Set([...prev, matrixKey]));
    
    const newProgress = Math.min(100, exploredMatrices.size * 5);
    setProgress(newProgress);
    onProgress?.(newProgress);
  }, [matrixA, matrixB, matrixC, exploredMatrices.size, onProgress]);

  const resetMatrix = () => {
    setMatrixA(3);
    setMatrixB(1);
    setMatrixC(2);
    setCurrentStep('original');
    setExploredMatrices(new Set());
  };

  const matrixPresets = [
    { name: 'Identity', a: 1, b: 0, c: 1 },
    { name: 'Stretch', a: 3, b: 0, c: 1 },
    { name: 'Shear', a: 1, b: 1, c: 1 },
    { name: 'Symmetric', a: 2, b: 1, c: 3 },
    { name: 'Rotation-like', a: 0, b: 1, c: 0 },
    { name: 'Negative Eigenvalue', a: -1, b: 0, c: 2 }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="border-2 border-purple-400/30 bg-gradient-to-r from-white/[0.06] to-white/[0.02] border border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-purple-200 flex items-center gap-2">
            🔍 Eileen's Diagonalization Detective Lab
          </CardTitle>
          <p className="text-purple-700">
            Investigate how matrices can be diagonalized and discover the power of eigenvalue decomposition!
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Matrix Investigation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Matrix Type */}
            <div className="space-y-3">
              <h4 className="font-medium text-white/70">Matrix Type</h4>
              <div className="flex gap-2">
                <Button
                  variant={isSymmetric ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setIsSymmetric(true)}
                  className={isSymmetric ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  Symmetric
                </Button>
                <Button
                  variant={!isSymmetric ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setIsSymmetric(false)}
                  className={!isSymmetric ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  General
                </Button>
              </div>
            </div>

            {/* Matrix Parameters */}
            <div className="space-y-4">
              <h4 className="font-medium text-white/70">Matrix Elements</h4>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-700">a₁₁: {matrixA.toFixed(2)}</label>
                <Slider
                  value={[matrixA]}
                  onValueChange={(value) => setMatrixA(value[0])}
                  min={-5}
                  max={5}
                  step={0.1}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-700">a₁₂: {matrixB.toFixed(2)}</label>
                <Slider
                  value={[matrixB]}
                  onValueChange={(value) => setMatrixB(value[0])}
                  min={-3}
                  max={3}
                  step={0.1}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-700">a₂₂: {matrixC.toFixed(2)}</label>
                <Slider
                  value={[matrixC]}
                  onValueChange={(value) => setMatrixC(value[0])}
                  min={-5}
                  max={5}
                  step={0.1}
                  className="w-full"
                />
              </div>
              
              <div className="bg-white/[0.03] p-3 rounded-lg">
                <p className="text-sm text-white/70 text-center">
                  Matrix A = [{matrix[0][0].toFixed(2)} {matrix[0][1].toFixed(2)}]
                </p>
                <p className="text-sm text-white/70 text-center">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[{matrix[1][0].toFixed(2)} {matrix[1][1].toFixed(2)}]
                </p>
              </div>
            </div>

            {/* Diagonalization Step */}
            <div className="space-y-3">
              <h4 className="font-medium text-white/70">Diagonalization Step</h4>
              <div className="grid grid-cols-2 gap-2">
                {(['original', 'eigenvectors', 'diagonal', 'reconstruction'] as const).map((step) => (
                  <Button
                    key={step}
                    variant={currentStep === step ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentStep(step)}
                    className={currentStep === step ? 'bg-purple-600 hover:bg-purple-700' : ''}
                  >
                    {step === 'original' ? 'Original A' : 
                     step === 'eigenvectors' ? 'Matrix P' :
                     step === 'diagonal' ? 'Matrix D' : 'A = PDP⁻¹'}
                  </Button>
                ))}
              </div>
            </div>

            {/* Display Options */}
            <div className="space-y-3">
              <h4 className="font-medium text-white/70">Display Options</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showOriginalBasis}
                    onChange={(e) => setShowOriginalBasis(e.target.checked)}
                    className="rounded border-white/10 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm">Show Standard Basis</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showEigenvectors}
                    onChange={(e) => setShowEigenvectors(e.target.checked)}
                    className="rounded border-white/10 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm">Show Eigenvectors</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showDiagonalization}
                    onChange={(e) => setShowDiagonalization(e.target.checked)}
                    className="rounded border-white/10 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm">Show Diagonalization Steps</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showTransformation}
                    onChange={(e) => setShowTransformation(e.target.checked)}
                    className="rounded border-white/10 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm">Show Unit Circle Transform</span>
                </label>
              </div>
            </div>

            {/* Animation Speed */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">
                Animation Speed: {animationSpeed.toFixed(1)}x
              </label>
              <Slider
                value={[animationSpeed]}
                onValueChange={(value) => setAnimationSpeed(value[0])}
                min={0.5}
                max={3}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                onClick={animateSteps}
                variant="outline"
                className="w-full"
                disabled={isAnimating || !eigenData.isDiagonalizable}
              >
                {isAnimating ? 'Animating...' : 'Animate Diagonalization'}
              </Button>
              <Button
                onClick={resetMatrix}
                variant="outline"
                className="w-full"
              >
                Reset Matrix
              </Button>
              <Button
                onClick={onComplete}
                className="w-full bg-purple-600 hover:bg-purple-700"
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
            <CardTitle className="text-lg font-semibold">Eigenvalue & Eigenvector Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                aria-label="Eileen eigenvalue and eigenvector analysis visualization"
                className="w-full h-auto border border-white/10 rounded-lg"
              />
              {isAnimating && (
                <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm">
                  Step {Math.ceil(animationProgress * 4)}/4
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Matrix Presets */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Matrix Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {matrixPresets.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                onClick={() => {
                  setMatrixA(preset.a);
                  setMatrixB(preset.b);
                  setMatrixC(preset.c);
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
          <CardTitle className="text-lg font-semibold">Diagonalization Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-white/70">Eigenvalues</h4>
              <div className="text-sm space-y-1">
                {eigenData.isDiagonalizable ? (
                  <>
                    <p>λ₁ = {eigenData.eigenvalues[0].toFixed(3)}</p>
                    <p>λ₂ = {eigenData.eigenvalues[1].toFixed(3)}</p>
                    <p className="text-green-600">✓ Real eigenvalues</p>
                  </>
                ) : (
                  <p className="text-red-600">✗ Complex eigenvalues</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-white/70">Eigenvectors</h4>
              <div className="text-sm space-y-1">
                {eigenData.isDiagonalizable ? (
                  <>
                    <p>v₁ = [{eigenData.eigenvectors[0][0].toFixed(2)}, {eigenData.eigenvectors[0][1].toFixed(2)}]</p>
                    <p>v₂ = [{eigenData.eigenvectors[1][0].toFixed(2)}, {eigenData.eigenvectors[1][1].toFixed(2)}]</p>
                    <p className="text-green-600">✓ Linearly independent</p>
                  </>
                ) : (
                  <p className="text-red-600">✗ Cannot compute real eigenvectors</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-white/70">Diagonalization</h4>
              <div className="text-sm space-y-1">
                {eigenData.isDiagonalizable ? (
                  <>
                    <p className="text-green-600">✓ Diagonalizable</p>
                    <p>A = PDP⁻¹</p>
                    <p>det(A) = {(matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]).toFixed(3)}</p>
                    <p>tr(A) = {(matrix[0][0] + matrix[1][1]).toFixed(3)}</p>
                  </>
                ) : (
                  <>
                    <p className="text-red-600">✗ Not diagonalizable</p>
                    <p>Complex eigenvalues</p>
                  </>
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
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <Badge variant="outline" className="text-purple-700">
              {exploredMatrices.size} matrices investigated
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiagonalizationExplorer;