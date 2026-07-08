import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Badge } from '@/core/components/ui/badge';
import { Alert, AlertDescription } from '@/core/components/ui/alert';
import { Slider } from '@/core/components/ui/slider';

interface HessianAnalyzerProps {
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  isPreview?: boolean;
}

interface HessianData {
  fxx: number;
  fxy: number;
  fyx: number;
  fyy: number;
  discriminant: number;
  classification: string;
  eigenvalues: [number, number];
}

interface TestFunction {
  name: string;
  f: (x: number, y: number) => number;
  fx: (x: number, y: number) => number;
  fy: (x: number, y: number) => number;
  fxx: (x: number, y: number) => number;
  fxy: (x: number, y: number) => number;
  fyy: (x: number, y: number) => number;
  criticalPoints: Array<{x: number, y: number, type: string}>;
  description: string;
}

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 450;

const HessianAnalyzer: React.FC<HessianAnalyzerProps> = ({ 
  onComplete, 
  onProgress, 
  isPreview = false 
}) => {
  // Canvas references
  const surfaceCanvasRef = useRef<HTMLCanvasElement>(null);
  const contourCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // State
  const [selectedFunction, setSelectedFunction] = useState('paraboloid');
  const [currentPoint, setCurrentPoint] = useState({ x: 0, y: 0 });
  const [hessianData, setHessianData] = useState<HessianData | null>(null);
  const [showEigenDirections, setShowEigenDirections] = useState(true);
  const [showCriticalPoints, setShowCriticalPoints] = useState(true);
  
  // Manual Hessian entry
  const [manualMode, setManualMode] = useState(false);
  const [manualHessian, setManualHessian] = useState({ fxx: -4, fxy: 1, fyy: -2 });
  
  // Challenge state
  const [currentChallenge, setCurrentChallenge] = useState<{ id: string; question: string; answer: string; explanation?: string } | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  // Progress tracking
  const [progress, setProgress] = useState(0);
  const [challengesSolved, setChallengesSolved] = useState<Set<string>>(new Set());
  const [classificationsCompleted, setClassificationsCompleted] = useState<Set<string>>(new Set());

  // Test functions
  const testFunctions: Record<string, TestFunction> = {
    paraboloid: {
      name: 'Paraboloid (minimum)',
      f: (x, y) => x*x + y*y,
      fx: (x, y) => 2*x,
      fy: (x, y) => 2*y,
      fxx: (x, y) => 2,
      fxy: (x, y) => 0,
      fyy: (x, y) => 2,
      criticalPoints: [{x: 0, y: 0, type: 'minimum'}],
      description: 'Classic bowl shape with minimum at origin'
    },
    inverted_paraboloid: {
      name: 'Inverted Paraboloid (maximum)',
      f: (x, y) => -(x*x + y*y),
      fx: (x, y) => -2*x,
      fy: (x, y) => -2*y,
      fxx: (x, y) => -2,
      fxy: (x, y) => 0,
      fyy: (x, y) => -2,
      criticalPoints: [{x: 0, y: 0, type: 'maximum'}],
      description: 'Inverted bowl with maximum at origin'
    },
    saddle: {
      name: 'Saddle Point',
      f: (x, y) => x*x - y*y,
      fx: (x, y) => 2*x,
      fy: (x, y) => -2*y,
      fxx: (x, y) => 2,
      fxy: (x, y) => 0,
      fyy: (x, y) => -2,
      criticalPoints: [{x: 0, y: 0, type: 'saddle'}],
      description: 'Hyperbolic paraboloid - saddle at origin'
    },
    monkey_saddle: {
      name: 'Monkey Saddle',
      f: (x, y) => x*x*x - 3*x*y*y,
      fx: (x, y) => 3*x*x - 3*y*y,
      fy: (x, y) => -6*x*y,
      fxx: (x, y) => 6*x,
      fxy: (x, y) => -6*y,
      fyy: (x, y) => -6*x,
      criticalPoints: [{x: 0, y: 0, type: 'inconclusive'}],
      description: 'Degenerate saddle - test inconclusive at origin'
    },
    mixed_critical: {
      name: 'Mixed Critical Points',
      f: (x, y) => x*x*x*x + y*y*y*y - 2*x*x - 2*y*y,
      fx: (x, y) => 4*x*x*x - 4*x,
      fy: (x, y) => 4*y*y*y - 4*y,
      fxx: (x, y) => 12*x*x - 4,
      fxy: (x, y) => 0,
      fyy: (x, y) => 12*y*y - 4,
      criticalPoints: [
        {x: 0, y: 0, type: 'maximum'},
        {x: 1, y: 1, type: 'minimum'},
        {x: -1, y: -1, type: 'minimum'},
        {x: 1, y: -1, type: 'minimum'},
        {x: -1, y: 1, type: 'minimum'}
      ],
      description: 'Multiple critical points of different types'
    }
  };

  // Calculate Hessian data
  const calculateHessian = useCallback((func: TestFunction, x: number, y: number): HessianData => {
    const fxx = func.fxx(x, y);
    const fxy = func.fxy(x, y);
    const fyx = fxy; // Assuming mixed partials are equal
    const fyy = func.fyy(x, y);
    
    const discriminant = fxx * fyy - fxy * fxy;
    
    let classification = '';
    if (Math.abs(discriminant) < 1e-10) {
      classification = 'Inconclusive (D ≈ 0)';
    } else if (discriminant > 0) {
      if (fxx > 0) {
        classification = 'Local Minimum';
      } else {
        classification = 'Local Maximum';
      }
    } else {
      classification = 'Saddle Point';
    }
    
    // Calculate eigenvalues
    const trace = fxx + fyy;
    const det = fxx * fyy - fxy * fxy;
    const discriminantEigen = trace * trace - 4 * det;
    
    let eigenvalues: [number, number];
    if (discriminantEigen >= 0) {
      const lambda1 = (trace + Math.sqrt(discriminantEigen)) / 2;
      const lambda2 = (trace - Math.sqrt(discriminantEigen)) / 2;
      eigenvalues = [lambda1, lambda2];
    } else {
      eigenvalues = [trace / 2, trace / 2]; // Complex eigenvalues - use real part
    }
    
    return {
      fxx,
      fxy,
      fyx,
      fyy,
      discriminant,
      classification,
      eigenvalues
    };
  }, []);

  // Calculate manual Hessian
  const calculateManualHessian = useCallback((): HessianData => {
    const { fxx, fxy, fyy } = manualHessian;
    const fyx = fxy; // Assuming symmetry
    
    const discriminant = fxx * fyy - fxy * fxy;
    
    let classification = '';
    if (Math.abs(discriminant) < 1e-10) {
      classification = 'Inconclusive (D ≈ 0)';
    } else if (discriminant > 0) {
      if (fxx > 0) {
        classification = 'Local Minimum';
      } else {
        classification = 'Local Maximum';
      }
    } else {
      classification = 'Saddle Point';
    }
    
    // Calculate eigenvalues
    const trace = fxx + fyy;
    const det = fxx * fyy - fxy * fxy;
    const discriminantEigen = trace * trace - 4 * det;
    
    let eigenvalues: [number, number];
    if (discriminantEigen >= 0) {
      const lambda1 = (trace + Math.sqrt(discriminantEigen)) / 2;
      const lambda2 = (trace - Math.sqrt(discriminantEigen)) / 2;
      eigenvalues = [lambda1, lambda2];
    } else {
      eigenvalues = [trace / 2, trace / 2];
    }
    
    return {
      fxx,
      fxy,
      fyx,
      fyy,
      discriminant,
      classification,
      eigenvalues
    };
  }, [manualHessian]);

  // Draw surface visualization
  const drawSurface = useCallback((ctx: CanvasRenderingContext2D) => {
    if (manualMode) {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.fillStyle = '#374151';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Manual Hessian Mode', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
      ctx.fillText('Enter matrix values below', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
      return;
    }
    
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    const func = testFunctions[selectedFunction];
    if (!func) return;
    
    const scale = 0.1;
    const centerX = CANVAS_WIDTH / 2;
    const centerY = CANVAS_HEIGHT / 2;
    
    // Draw contour lines
    const levels = [-2, -1, -0.5, 0, 0.5, 1, 2];
    levels.forEach((level, i) => {
      ctx.strokeStyle = `hsl(${200 + i * 30}, 50%, 70%)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      
      // Simple contour drawing (approximation)
      for (let px = 0; px < CANVAS_WIDTH; px += 2) {
        for (let py = 0; py < CANVAS_HEIGHT; py += 2) {
          const x = (px - centerX) * scale;
          const y = (py - centerY) * scale;
          const z = func.f(x, y);
          
          if (Math.abs(z - level) < 0.1) {
            ctx.fillRect(px, py, 2, 2);
          }
        }
      }
    });
    
    // Draw critical points
    if (showCriticalPoints) {
      func.criticalPoints.forEach(cp => {
        const px = centerX + cp.x / scale;
        const py = centerY + cp.y / scale;
        
        ctx.fillStyle = cp.type === 'minimum' ? '#10b981' : 
                        cp.type === 'maximum' ? '#ef4444' : 
                        cp.type === 'saddle' ? '#f59e0b' : '#6b7280';
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(cp.type[0].toUpperCase(), px, py + 4);
      });
    }
    
    // Draw current point
    const px = centerX + currentPoint.x / scale;
    const py = centerY + currentPoint.y / scale;
    
    ctx.fillStyle = '#8b5cf6';
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw eigenvalue directions if applicable
    if (showEigenDirections && hessianData) {
      const [lambda1, lambda2] = hessianData.eigenvalues;
      
      // Draw principal curvature directions
      ctx.strokeStyle = lambda1 > 0 ? '#ef4444' : '#10b981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(px - 30, py);
      ctx.lineTo(px + 30, py);
      ctx.stroke();
      
      ctx.strokeStyle = lambda2 > 0 ? '#ef4444' : '#10b981';
      ctx.beginPath();
      ctx.moveTo(px, py - 30);
      ctx.lineTo(px, py + 30);
      ctx.stroke();
    }
    
    // Labels
    ctx.fillStyle = '#374151';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Click to analyze curvature', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 10);
  }, [selectedFunction, currentPoint, hessianData, showCriticalPoints, showEigenDirections, manualMode]);

  // Handle canvas click
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (manualMode) return;
    
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const scale = 0.1;
    const centerX = CANVAS_WIDTH / 2;
    const centerY = CANVAS_HEIGHT / 2;
    
    const mathX = (x - centerX) * scale;
    const mathY = (y - centerY) * scale;
    
    setCurrentPoint({ x: mathX, y: mathY });
  }, [manualMode]);

  // Generate challenges
  const generateChallenge = useCallback(() => {
    const challenges = [
      {
        id: 'classify-maximum',
        question: 'Given fxx = -2, fyy = -3, fxy = 0.5, classify the critical point.',
        answer: 'maximum',
        explanation: 'D = (-2)(-3) - (0.5)² = 6 - 0.25 = 5.75 > 0, and fxx = -2 < 0, so it\'s a local maximum'
      },
      {
        id: 'classify-saddle',
        question: 'Given fxx = 2, fyy = -1, fxy = 0, classify the critical point.',
        answer: 'saddle',
        explanation: 'D = (2)(-1) - (0)² = -2 < 0, so it\'s a saddle point'
      },
      {
        id: 'discriminant-calculation',
        question: 'If fxx = 3, fyy = 2, fxy = 1, what is the discriminant D?',
        answer: '5',
        explanation: 'D = fxx·fyy - (fxy)² = 3·2 - 1² = 6 - 1 = 5'
      },
      {
        id: 'eigenvalue-meaning',
        question: 'If both eigenvalues are negative, what type of critical point is it?',
        answer: 'maximum',
        explanation: 'Negative eigenvalues mean downward curvature in all directions → local maximum'
      }
    ];
    
    const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    setCurrentChallenge(randomChallenge);
    setUserAnswer('');
    setShowAnswer(false);
    setIsCorrect(null);
  }, []);

  // Check challenge answer
  const checkAnswer = useCallback(() => {
    if (!currentChallenge) return;
    
    const userLower = userAnswer.toLowerCase().trim();
    const correctLower = currentChallenge.answer.toLowerCase().trim();
    const correct = userLower.includes(correctLower) || correctLower.includes(userLower);
    
    setIsCorrect(correct);
    setShowAnswer(true);
    
    if (correct) {
      const challengeKey = currentChallenge.id;
      setChallengesSolved(prev => new Set([...prev, challengeKey]));
    }
  }, [currentChallenge, userAnswer]);

  // Update Hessian data when parameters change
  useEffect(() => {
    if (manualMode) {
      const data = calculateManualHessian();
      setHessianData(data);
      setClassificationsCompleted(prev => new Set([...prev, data.classification]));
    } else {
      const func = testFunctions[selectedFunction];
      if (func) {
        const data = calculateHessian(func, currentPoint.x, currentPoint.y);
        setHessianData(data);
        setClassificationsCompleted(prev => new Set([...prev, data.classification]));
      }
    }
  }, [selectedFunction, currentPoint, manualMode, manualHessian, calculateHessian, calculateManualHessian]);

  // Initialize
  useEffect(() => {
    generateChallenge();
  }, [generateChallenge]);

  // Update canvas
  useEffect(() => {
    const canvas = surfaceCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    drawSurface(ctx);
  }, [drawSurface]);

  // Update progress
  useEffect(() => {
    const newProgress = Math.min(100, (challengesSolved.size * 20) + (classificationsCompleted.size * 5));
    setProgress(newProgress);
    onProgress?.(newProgress);
  }, [challengesSolved.size, classificationsCompleted.size, onProgress]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-orange-800 flex items-center gap-2">
            ⛰️🔍 Greta's Hessian Mountain Surveyor
          </CardTitle>
          <p className="text-orange-700">
            Master the art of curvature analysis! Use the Hessian matrix to distinguish between peaks, valleys, and mountain passes.
          </p>
        </CardHeader>
      </Card>

      {/* Curvature Analysis Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">⛰️ Curvature Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <canvas
              ref={surfaceCanvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="border border-gray-300 rounded-lg bg-white cursor-crosshair"
              onClick={handleCanvasClick}
            />
          </div>
          <div className="mt-2 text-center text-xs text-gray-600">
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Min</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Max</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Saddle</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Current</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mountain Terrain Explorer */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">🎔️ Mountain Terrain Explorer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mode and Function Selection */}
            <div className="space-y-4">
              {/* Mode Selection */}
              <div className="flex gap-2">
                <Button
                  variant={!manualMode ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setManualMode(false)}
                  className={!manualMode ? 'bg-orange-600 hover:bg-orange-700' : ''}
                >
                  Function Mode
                </Button>
                <Button
                  variant={manualMode ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setManualMode(true)}
                  className={manualMode ? 'bg-orange-600 hover:bg-orange-700' : ''}
                >
                  Manual Hessian
                </Button>
              </div>

              {!manualMode ? (
                <>
                  {/* Function Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-orange-700">Choose Terrain:</label>
                    <div className="grid grid-cols-1 gap-2">
                      {Object.entries(testFunctions).map(([key, func]) => (
                        <Button
                          key={key}
                          variant={selectedFunction === key ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedFunction(key)}
                          className={selectedFunction === key ? 'bg-orange-600 hover:bg-orange-700' : ''}
                        >
                          {func.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Current Point */}
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h4 className="font-medium text-orange-800 mb-2">Current Analysis Point</h4>
                    <div className="text-sm text-orange-700">
                      <div>x = {currentPoint.x.toFixed(2)}</div>
                      <div>y = {currentPoint.y.toFixed(2)}</div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Manual Hessian Entry */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-orange-800">Enter Hessian Matrix Values</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-orange-700">fxx = {manualHessian.fxx}</label>
                        <Slider
                          value={[manualHessian.fxx]}
                          onValueChange={([value]) => setManualHessian(prev => ({ ...prev, fxx: value }))}
                          min={-5}
                          max={5}
                          step={0.1}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-orange-700">fyy = {manualHessian.fyy}</label>
                        <Slider
                          value={[manualHessian.fyy]}
                          onValueChange={([value]) => setManualHessian(prev => ({ ...prev, fyy: value }))}
                          min={-5}
                          max={5}
                          step={0.1}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-orange-700">fxy = {manualHessian.fxy}</label>
                        <Slider
                          value={[manualHessian.fxy]}
                          onValueChange={([value]) => setManualHessian(prev => ({ ...prev, fxy: value }))}
                          min={-3}
                          max={3}
                          step={0.1}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Visualization Options */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showCriticalPoints}
                    onChange={(e) => setShowCriticalPoints(e.target.checked)}
                    disabled={manualMode}
                  />
                  Show critical points
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showEigenDirections}
                    onChange={(e) => setShowEigenDirections(e.target.checked)}
                  />
                  Show curvature directions
                </label>
              </div>
            </div>

            {/* Spacer Column */}
            <div>
              {/* This column provides balance to the layout */}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hessian Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">🧮 Hessian Matrix Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          {hessianData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hessian Matrix */}
              <div className="space-y-4">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-medium text-orange-800 mb-3">Hessian Matrix H</h4>
                  <div className="grid grid-cols-2 gap-2 text-center font-mono text-sm">
                    <div className="bg-white p-2 rounded border">
                      {hessianData.fxx.toFixed(2)}
                    </div>
                    <div className="bg-white p-2 rounded border">
                      {hessianData.fxy.toFixed(2)}
                    </div>
                    <div className="bg-white p-2 rounded border">
                      {hessianData.fyx.toFixed(2)}
                    </div>
                    <div className="bg-white p-2 rounded border">
                      {hessianData.fyy.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">Second Derivative Test</h4>
                  <div className="text-sm text-yellow-700 space-y-1">
                    <div>Discriminant: D = {hessianData.discriminant.toFixed(3)}</div>
                    <div>fxx = {hessianData.fxx.toFixed(2)}</div>
                    <div className="mt-2">
                      <Badge variant="outline" className={
                        hessianData.classification.includes('Minimum') ? 'border-green-500 text-green-700' :
                        hessianData.classification.includes('Maximum') ? 'border-red-500 text-red-700' :
                        hessianData.classification.includes('Saddle') ? 'border-yellow-500 text-yellow-700' :
                        'border-gray-500 text-gray-700'
                      }>
                        {hessianData.classification}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Eigenvalue Analysis */}
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Eigenvalue Analysis</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <div>λ₁ = {hessianData.eigenvalues[0].toFixed(3)}</div>
                    <div>λ₂ = {hessianData.eigenvalues[1].toFixed(3)}</div>
                    <div className="mt-2">
                      <div className="text-xs">
                        {hessianData.eigenvalues[0] > 0 ? '↑' : '↓'} Principal curvature 1: {hessianData.eigenvalues[0] > 0 ? 'Upward' : 'Downward'}
                      </div>
                      <div className="text-xs">
                        {hessianData.eigenvalues[1] > 0 ? '↑' : '↓'} Principal curvature 2: {hessianData.eigenvalues[1] > 0 ? 'Upward' : 'Downward'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-2">Geometric Interpretation</h4>
                  <div className="text-sm text-purple-700">
                    {hessianData.eigenvalues[0] > 0 && hessianData.eigenvalues[1] > 0 ? 
                      "Both eigenvalues positive → curves upward in all directions (bowl shape)" :
                      hessianData.eigenvalues[0] < 0 && hessianData.eigenvalues[1] < 0 ? 
                      "Both eigenvalues negative → curves downward in all directions (dome shape)" :
                      "Mixed eigenvalues → curves up in one direction, down in another (saddle shape)"
                    }
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Challenge Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Mountain Survey Challenge</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentChallenge && (
            <>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <h4 className="font-medium text-amber-800 mb-2">Survey Question:</h4>
                <p className="text-amber-700">{currentChallenge.question}</p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Enter your answer"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  disabled={showAnswer}
                />
                <Button
                  onClick={checkAnswer}
                  disabled={!userAnswer || showAnswer}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Survey!
                </Button>
                <Button
                  onClick={generateChallenge}
                  variant="outline"
                >
                  New Terrain
                </Button>
              </div>

              {isCorrect !== null && (
                <Alert className={isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}>
                  <AlertDescription className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                    {isCorrect ? (
                      <>⛰️ Excellent surveying! You've read the terrain correctly!</>
                    ) : (
                      <>🔍 Survey complete: {currentChallenge.explanation}</>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Method Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">🏔️ Greta's Mountain Survey Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Second Derivative Test</h4>
              <div className="text-sm text-green-700 space-y-1">
                <div>1. Calculate D = fxx·fyy - (fxy)²</div>
                <div>2. If D &gt; 0 and fxx &gt; 0: Minimum</div>
                <div>3. If D &gt; 0 and fxx &lt; 0: Maximum</div>
                <div>4. If D &lt; 0: Saddle point</div>
                <div>5. If D = 0: Inconclusive</div>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Eigenvalue Method</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <div>• Both λ &gt; 0: Local minimum</div>
                <div>• Both λ &lt; 0: Local maximum</div>
                <div>• Mixed signs: Saddle point</div>
                <div>• One λ = 0: Degenerate case</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 bg-orange-50 p-4 rounded-lg">
            <h4 className="font-medium text-orange-800 mb-2">Greta's Survey Wisdom</h4>
            <div className="text-sm text-orange-700">
              "The Hessian shows the curve, discriminant reveals the serve - peaks curl down, valleys curl up, saddles do both with mathematical nerve!"
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <Badge variant="outline" className="text-orange-700">
                {challengesSolved.size} surveys complete
              </Badge>
            </div>
            <Button
              onClick={onComplete}
              className="bg-orange-600 hover:bg-orange-700"
              disabled={progress < 50}
            >
              Complete Survey
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{challengesSolved.size}</div>
              <div className="text-gray-600">Surveys Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{classificationsCompleted.size}</div>
              <div className="text-gray-600">Classification Types</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{Math.round(progress)}%</div>
              <div className="text-gray-600">Progress</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HessianAnalyzer;