import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Input } from '@/core/components/ui/input';
import { Badge } from '@/core/components/ui/badge';
import { Alert, AlertDescription } from '@/core/components/ui/alert';
import { Slider } from '@/core/components/ui/slider';

interface FunctionGrapherProps {
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  isPreview?: boolean;
}

interface FunctionData {
  type: 'linear' | 'quadratic' | 'exponential';
  a: number;
  b: number;
  c?: number;
  equation: string;
  description: string;
}

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 300;
const GRID_SPACING = 20;

const FunctionGrapher: React.FC<FunctionGrapherProps> = ({ 
  onComplete, 
  onProgress, 
  isPreview = false 
}) => {
  // Canvas and drawing
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Function state
  const [functionType, setFunctionType] = useState<'linear' | 'quadratic' | 'exponential'>('linear');
  const [parameters, setParameters] = useState({ a: 1, b: 0, c: 0 });
  const [currentFunction, setCurrentFunction] = useState<FunctionData | null>(null);
  
  // Challenge state
  const [challenges, setChallenges] = useState<FunctionData[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<FunctionData | null>(null);
  const [userGuess, setUserGuess] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  // Progress tracking
  const [progress, setProgress] = useState(0);
  const [challengesSolved, setChallengesSolved] = useState<Set<string>>(new Set());
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);

  // Generate function challenges
  const generateChallenges = useCallback((): FunctionData[] => {
    const challenges: FunctionData[] = [];
    
    // Linear challenges
    challenges.push({
      type: 'linear',
      a: 2,
      b: 3,
      equation: 'y = 2x + 3',
      description: 'Steady construction path with grade 2, starting at elevation 3'
    });
    
    challenges.push({
      type: 'linear',
      a: -1,
      b: 4,
      equation: 'y = -x + 4',
      description: 'Descending construction path starting at elevation 4'
    });
    
    // Quadratic challenges
    challenges.push({
      type: 'quadratic',
      a: 1,
      b: 0,
      c: 0,
      equation: 'y = x²',
      description: 'Perfect arch bridge with vertex at origin'
    });
    
    challenges.push({
      type: 'quadratic',
      a: -0.5,
      b: 0,
      c: 4,
      equation: 'y = -0.5x² + 4',
      description: 'Inverted arch bridge with peak at elevation 4'
    });
    
    // Exponential challenges
    challenges.push({
      type: 'exponential',
      a: 1,
      b: 2,
      equation: 'y = 2ˣ',
      description: 'Beaver population doubling growth pattern'
    });
    
    challenges.push({
      type: 'exponential',
      a: 4,
      b: 0.5,
      equation: 'y = 4 × (0.5)ˣ',
      description: 'Wood supply depletion pattern starting at 4 units'
    });
    
    return challenges;
  }, []);

  // Calculate function value
  const calculateFunction = useCallback((x: number, func: FunctionData): number => {
    switch (func.type) {
      case 'linear':
        return func.a * x + func.b;
      case 'quadratic':
        return func.a * x * x + func.b * x + (func.c || 0);
      case 'exponential':
        return func.a * Math.pow(func.b, x);
      default:
        return 0;
    }
  }, []);

  // Draw grid and axes
  const drawGrid = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    const centerX = CANVAS_WIDTH / 2;
    const centerY = CANVAS_HEIGHT / 2;
    
    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let x = 0; x <= CANVAS_WIDTH; x += GRID_SPACING) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let y = 0; y <= CANVAS_HEIGHT; y += GRID_SPACING) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }
    
    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 2;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(CANVAS_WIDTH, centerY);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, CANVAS_HEIGHT);
    ctx.stroke();
    
    // Axis labels
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    
    // X-axis numbers
    for (let i = -10; i <= 10; i += 2) {
      if (i !== 0) {
        const x = centerX + i * (GRID_SPACING / 2);
        if (x >= 0 && x <= CANVAS_WIDTH) {
          ctx.fillText(i.toString(), x, centerY + 15);
        }
      }
    }
    
    // Y-axis numbers
    ctx.textAlign = 'left';
    for (let i = -7; i <= 7; i += 2) {
      if (i !== 0) {
        const y = centerY - i * (GRID_SPACING / 2);
        if (y >= 0 && y <= CANVAS_HEIGHT) {
          ctx.fillText(i.toString(), centerX + 5, y + 4);
        }
      }
    }
  }, []);

  // Draw function
  const drawFunction = useCallback((ctx: CanvasRenderingContext2D, func: FunctionData, color: string = '#059669') => {
    const centerX = CANVAS_WIDTH / 2;
    const centerY = CANVAS_HEIGHT / 2;
    const scale = GRID_SPACING / 2;
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    let isFirstPoint = true;
    
    for (let pixelX = 0; pixelX <= CANVAS_WIDTH; pixelX += 2) {
      const mathX = (pixelX - centerX) / scale;
      const mathY = calculateFunction(mathX, func);
      const pixelY = centerY - mathY * scale;
      
      // Skip points that are off-screen or invalid
      if (isNaN(mathY) || Math.abs(mathY) > 20) continue;
      
      if (isFirstPoint) {
        ctx.moveTo(pixelX, pixelY);
        isFirstPoint = false;
      } else {
        ctx.lineTo(pixelX, pixelY);
      }
    }
    
    ctx.stroke();
    
    // Draw key points
    if (func.type === 'quadratic') {
      // Draw vertex
      const vertexX = -func.b / (2 * func.a);
      const vertexY = calculateFunction(vertexX, func);
      const pixelVertexX = centerX + vertexX * scale;
      const pixelVertexY = centerY - vertexY * scale;
      
      if (pixelVertexX >= 0 && pixelVertexX <= CANVAS_WIDTH && 
          pixelVertexY >= 0 && pixelVertexY <= CANVAS_HEIGHT) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(pixelVertexX, pixelVertexY, 5, 0, 2 * Math.PI);
        ctx.fill();
        
        // Label vertex
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`V(${vertexX.toFixed(1)}, ${vertexY.toFixed(1)})`, 
                    pixelVertexX, pixelVertexY - 10);
      }
    } else if (func.type === 'linear') {
      // Draw y-intercept
      const interceptY = func.b;
      const pixelInterceptX = centerX;
      const pixelInterceptY = centerY - interceptY * scale;
      
      if (pixelInterceptY >= 0 && pixelInterceptY <= CANVAS_HEIGHT) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(pixelInterceptX, pixelInterceptY, 4, 0, 2 * Math.PI);
        ctx.fill();
        
        // Label y-intercept
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`(0, ${interceptY})`, pixelInterceptX + 8, pixelInterceptY - 5);
      }
    }
  }, [calculateFunction]);

  // Update current function from parameters
  const updateCurrentFunction = useCallback(() => {
    let equation = '';
    let description = '';
    
    switch (functionType) {
      case 'linear':
        equation = `y = ${parameters.a}x${parameters.b >= 0 ? ' + ' : ' - '}${Math.abs(parameters.b)}`;
        description = `Construction path with slope ${parameters.a}, starting at elevation ${parameters.b}`;
        break;
      case 'quadratic':
        equation = `y = ${parameters.a}x²${parameters.b >= 0 ? ' + ' : ' - '}${Math.abs(parameters.b)}x${parameters.c >= 0 ? ' + ' : ' - '}${Math.abs(parameters.c)}`;
        description = `${parameters.a > 0 ? 'Upward' : 'Downward'} arch with ${parameters.a > 0 ? 'minimum' : 'maximum'} point`;
        break;
      case 'exponential':
        equation = `y = ${parameters.a} × ${parameters.b}ˣ`;
        description = parameters.b > 1 ? 
          `Growth pattern: starting at ${parameters.a}, multiplying by ${parameters.b}` :
          `Decay pattern: starting at ${parameters.a}, shrinking by factor ${parameters.b}`;
        break;
    }
    
    setCurrentFunction({
      type: functionType,
      a: parameters.a,
      b: parameters.b,
      c: parameters.c,
      equation,
      description
    });
  }, [functionType, parameters]);

  // Check challenge answer
  const checkChallengeAnswer = useCallback(() => {
    if (!currentChallenge) return;
    
    const correct = userGuess.toLowerCase().trim() === currentChallenge.equation.toLowerCase().trim();
    setIsCorrect(correct);
    setShowAnswer(true);
    
    if (correct) {
      setConsecutiveCorrect(prev => prev + 1);
      const challengeKey = currentChallenge.equation;
      setChallengesSolved(prev => new Set([...prev, challengeKey]));
    } else {
      setConsecutiveCorrect(0);
    }
  }, [currentChallenge, userGuess]);

  // Get next challenge
  const getNextChallenge = useCallback(() => {
    const availableChallenges = challenges.filter(c => !challengesSolved.has(c.equation));
    if (availableChallenges.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableChallenges.length);
      setCurrentChallenge(availableChallenges[randomIndex]);
      setUserGuess('');
      setShowAnswer(false);
      setIsCorrect(null);
    }
  }, [challenges, challengesSolved]);

  // Initialize
  useEffect(() => {
    const generatedChallenges = generateChallenges();
    setChallenges(generatedChallenges);
    setCurrentChallenge(generatedChallenges[0]);
    updateCurrentFunction();
  }, [generateChallenges, updateCurrentFunction]);

  // Update function when parameters change
  useEffect(() => {
    updateCurrentFunction();
  }, [updateCurrentFunction]);

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    drawGrid(ctx);
    
    if (currentFunction) {
      drawFunction(ctx, currentFunction);
    }
    
    if (currentChallenge && showAnswer) {
      drawFunction(ctx, currentChallenge, '#dc2626');
    }
  }, [currentFunction, currentChallenge, showAnswer, drawGrid, drawFunction]);

  // Update progress
  useEffect(() => {
    const newProgress = Math.min(100, (challengesSolved.size * 15) + (consecutiveCorrect * 5));
    setProgress(newProgress);
    onProgress?.(newProgress);
  }, [challengesSolved.size, consecutiveCorrect, onProgress]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="border-2 border-emerald-400/30 bg-gradient-to-r from-white/[0.06] to-white/[0.02] border border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-emerald-200 flex items-center gap-2">
            🦫 Ollie's Blueprint Function Grapher
          </CardTitle>
          <p className="text-emerald-300/90">
            Learn to visualize functions like engineering blueprints! Each function type creates its own structural pattern.
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive Function Builder */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Function Builder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Function Type Selector */}
            <div className="flex gap-2">
              <Button
                variant={functionType === 'linear' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFunctionType('linear')}
                className={functionType === 'linear' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                Linear
              </Button>
              <Button
                variant={functionType === 'quadratic' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFunctionType('quadratic')}
                className={functionType === 'quadratic' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                Quadratic
              </Button>
              <Button
                variant={functionType === 'exponential' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFunctionType('exponential')}
                className={functionType === 'exponential' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                Exponential
              </Button>
            </div>

            {/* Parameter Controls */}
            <div className="space-y-4">
              {functionType === 'linear' && (
                <>
                  <div>
                    <label className="text-sm font-medium text-emerald-300/90">Slope (m): {parameters.a}</label>
                    <Slider
                      value={[parameters.a]}
                      onValueChange={([value]) => setParameters(prev => ({ ...prev, a: value }))}
                      min={-3}
                      max={3}
                      step={0.5}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-emerald-300/90">Y-intercept (b): {parameters.b}</label>
                    <Slider
                      value={[parameters.b]}
                      onValueChange={([value]) => setParameters(prev => ({ ...prev, b: value }))}
                      min={-5}
                      max={5}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                </>
              )}

              {functionType === 'quadratic' && (
                <>
                  <div>
                    <label className="text-sm font-medium text-emerald-300/90">a-coefficient: {parameters.a}</label>
                    <Slider
                      value={[parameters.a]}
                      onValueChange={([value]) => setParameters(prev => ({ ...prev, a: value }))}
                      min={-2}
                      max={2}
                      step={0.25}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-emerald-300/90">b-coefficient: {parameters.b}</label>
                    <Slider
                      value={[parameters.b]}
                      onValueChange={([value]) => setParameters(prev => ({ ...prev, b: value }))}
                      min={-4}
                      max={4}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-emerald-300/90">c-coefficient: {parameters.c}</label>
                    <Slider
                      value={[parameters.c]}
                      onValueChange={([value]) => setParameters(prev => ({ ...prev, c: value }))}
                      min={-4}
                      max={4}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                </>
              )}

              {functionType === 'exponential' && (
                <>
                  <div>
                    <label className="text-sm font-medium text-emerald-300/90">Initial value (a): {parameters.a}</label>
                    <Slider
                      value={[parameters.a]}
                      onValueChange={([value]) => setParameters(prev => ({ ...prev, a: value }))}
                      min={0.5}
                      max={4}
                      step={0.5}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-emerald-300/90">Base (b): {parameters.b}</label>
                    <Slider
                      value={[parameters.b]}
                      onValueChange={([value]) => setParameters(prev => ({ ...prev, b: value }))}
                      min={0.25}
                      max={3}
                      step={0.25}
                      className="mt-2"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Current Function Display */}
            {currentFunction && (
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="font-mono text-lg font-bold text-emerald-200 mb-2">
                  {currentFunction.equation}
                </div>
                <p className="text-sm text-emerald-300/90">{currentFunction.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Graph Display */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Blueprint Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                aria-label="Ollie function graph visualization"
                className="border border-white/10 rounded-lg bg-white/[0.04]"
              />
            </div>
            <div className="mt-4 text-center text-sm text-white/55">
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-1 bg-green-600"></div>
                  <span>Your Function</span>
                </div>
                {showAnswer && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-red-600"></div>
                    <span>Challenge Answer</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Challenge Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Blueprint Challenge</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentChallenge && (
            <>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-400/30">
                <h4 className="font-medium text-amber-800 mb-2">Identify this construction pattern:</h4>
                <p className="text-amber-700">{currentChallenge.description}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-emerald-300/90">Enter the equation:</label>
                <Input
                  value={userGuess}
                  onChange={(e) => setUserGuess(e.target.value)}
                  placeholder="e.g., y = 2x + 3"
                  className="text-center"
                  disabled={showAnswer}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={checkChallengeAnswer}
                  disabled={!userGuess || showAnswer}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Check Answer
                </Button>
                <Button
                  onClick={getNextChallenge}
                  variant="outline"
                  disabled={challengesSolved.size >= challenges.length}
                >
                  Next Challenge
                </Button>
              </div>

              {isCorrect !== null && (
                <Alert className={isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}>
                  <AlertDescription className={isCorrect ? 'text-emerald-300/90' : 'text-red-700'}>
                    {isCorrect ? (
                      <>🎉 Correct! The equation is {currentChallenge.equation}</>
                    ) : (
                      <>❌ Not quite right. The correct equation is: {currentChallenge.equation}</>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Function Pattern Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">🏗️ Ollie's Construction Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Linear Functions</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <div className="font-mono">y = mx + b</div>
                <div>• Straight construction paths</div>
                <div>• m = slope (grade)</div>
                <div>• b = starting elevation</div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-200 mb-2">Quadratic Functions</h4>
              <div className="text-sm text-purple-700 space-y-1">
                <div className="font-mono">y = ax² + bx + c</div>
                <div>• Arch bridge shapes</div>
                <div>• Vertex = strongest point</div>
                <div>• a &gt; 0: upward arch</div>
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-medium text-orange-800 mb-2">Exponential Functions</h4>
              <div className="text-sm text-orange-700 space-y-1">
                <div className="font-mono">y = a × b^x</div>
                <div>• Growth/decay patterns</div>
                <div>• b &gt; 1: population growth</div>
                <div>• 0 &lt; b &lt; 1: resource depletion</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress and Statistics */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <Badge variant="outline" className="text-emerald-300/90">
                {challengesSolved.size}/{challenges.length} challenges
              </Badge>
            </div>
            <Button
              onClick={onComplete}
              className="bg-green-600 hover:bg-green-700"
              disabled={progress < 50}
            >
              Complete Grapher
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{challengesSolved.size}</div>
              <div className="text-white/55">Challenges Solved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{consecutiveCorrect}</div>
              <div className="text-white/55">Consecutive Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{Math.round(progress)}%</div>
              <div className="text-white/55">Progress</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FunctionGrapher;