import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Badge } from '@/core/components/ui/badge';
import { Alert, AlertDescription } from '@/core/components/ui/alert';
import { Slider } from '@/core/components/ui/slider';

interface ComplexEigenvaluesProps {
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  isPreview?: boolean;
}

interface ComplexNumber {
  real: number;
  imag: number;
}

interface SystemPoint {
  x: number;
  y: number;
  time: number;
}

interface SystemData {
  name: string;
  eigenvalue: ComplexNumber;
  description: string;
  realWorldExample: string;
}

const CANVAS_WIDTH = 350;
const CANVAS_HEIGHT = 350;

const ComplexEigenvalues: React.FC<ComplexEigenvaluesProps> = ({ 
  onComplete, 
  onProgress, 
  isPreview = false 
}) => {
  // Canvas references
  const spiralCanvasRef = useRef<HTMLCanvasElement>(null);
  const complexPlaneRef = useRef<HTMLCanvasElement>(null);
  
  // System state
  const [eigenvalue, setEigenvalue] = useState<ComplexNumber>({ real: -0.1, imag: 2.0 });
  const [initialPoint, setInitialPoint] = useState({ x: 100, y: 50 });
  const [timeStep, setTimeStep] = useState(0.05);
  const [maxTime, setMaxTime] = useState(10);
  
  // Animation and visualization
  const [trajectoryPoints, setTrajectoryPoints] = useState<SystemPoint[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showMagnitudeCircle, setShowMagnitudeCircle] = useState(true);
  
  // Predefined systems
  const [selectedSystem, setSelectedSystem] = useState<string>('custom');
  const [systemAnalysis, setSystemAnalysis] = useState('');
  
  // Challenge state
  const [currentChallenge, setCurrentChallenge] = useState<{ id: string; question: string; answer: string; explanation?: string } | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  // Progress tracking
  const [progress, setProgress] = useState(0);
  const [challengesSolved, setChallengesSolved] = useState<Set<string>>(new Set());
  const [experimentsCompleted, setExperimentsCompleted] = useState(0);

  // Predefined system examples
  const systemExamples: Record<string, SystemData> = {
    stable_spiral: {
      name: 'Stable Spiral',
      eigenvalue: { real: -0.1, imag: 2.0 },
      description: 'Decaying oscillations spiral inward',
      realWorldExample: 'Damped pendulum or building earthquake response'
    },
    unstable_spiral: {
      name: 'Unstable Spiral',
      eigenvalue: { real: 0.05, imag: 1.5 },
      description: 'Growing oscillations spiral outward',
      realWorldExample: 'Unstable aircraft dynamics or market bubble growth'
    },
    pure_rotation: {
      name: 'Pure Rotation',
      eigenvalue: { real: 0, imag: 3.0 },
      description: 'Constant circular motion',
      realWorldExample: 'Ideal pendulum or orbital mechanics'
    },
    fast_decay: {
      name: 'Fast Decaying Spiral',
      eigenvalue: { real: -0.3, imag: 1.0 },
      description: 'Quickly spiraling inward',
      realWorldExample: 'Heavily damped vibrations'
    },
    predator_prey: {
      name: 'Predator-Prey Cycle',
      eigenvalue: { real: -0.02, imag: 0.8 },
      description: 'Slow ecological oscillations',
      realWorldExample: 'Population cycles in ecosystems'
    }
  };

  // Complex number operations
  const complexMultiply = useCallback((a: ComplexNumber, b: ComplexNumber): ComplexNumber => {
    return {
      real: a.real * b.real - a.imag * b.imag,
      imag: a.real * b.imag + a.imag * b.real
    };
  }, []);

  const complexExp = useCallback((c: ComplexNumber): ComplexNumber => {
    const expReal = Math.exp(c.real);
    return {
      real: expReal * Math.cos(c.imag),
      imag: expReal * Math.sin(c.imag)
    };
  }, []);

  const complexMagnitude = useCallback((c: ComplexNumber): number => {
    return Math.sqrt(c.real * c.real + c.imag * c.imag);
  }, []);

  const complexArgument = useCallback((c: ComplexNumber): number => {
    return Math.atan2(c.imag, c.real);
  }, []);

  // Calculate trajectory point at time t
  const calculateTrajectoryPoint = useCallback((t: number): SystemPoint => {
    // Solution: x(t) = x₀ * e^(λt)
    const lambdaT = { real: eigenvalue.real * t, imag: eigenvalue.imag * t };
    const expLambdaT = complexExp(lambdaT);
    
    const x = initialPoint.x * expLambdaT.real - initialPoint.y * expLambdaT.imag;
    const y = initialPoint.x * expLambdaT.imag + initialPoint.y * expLambdaT.real;
    
    return { x, y, time: t };
  }, [eigenvalue, initialPoint, complexExp]);

  // Generate full trajectory
  const generateTrajectory = useCallback(() => {
    const points: SystemPoint[] = [];
    for (let t = 0; t <= maxTime; t += timeStep) {
      points.push(calculateTrajectoryPoint(t));
    }
    setTrajectoryPoints(points);
  }, [calculateTrajectoryPoint, maxTime, timeStep]);

  // Analyze system behavior
  const analyzeSystem = useCallback((lambda: ComplexNumber): string => {
    const magnitude = complexMagnitude(lambda);
    const realPart = lambda.real;
    const imagPart = lambda.imag;
    
    let stability = '';
    let motion = '';
    
    if (Math.abs(realPart) < 0.001) {
      stability = 'Neutrally stable (pure rotation)';
    } else if (realPart < 0) {
      stability = 'Stable (decaying)';
    } else {
      stability = 'Unstable (growing)';
    }
    
    if (Math.abs(imagPart) < 0.001) {
      motion = 'No oscillation';
    } else {
      const frequency = Math.abs(imagPart);
      const period = 2 * Math.PI / frequency;
      motion = `Oscillates with frequency ${frequency.toFixed(3)}, period ${period.toFixed(2)}`;
    }
    
    return `${stability}. ${motion}. Magnitude: ${magnitude.toFixed(3)}`;
  }, [complexMagnitude]);

  // Draw spiral trajectory
  const drawSpiral = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    const centerX = CANVAS_WIDTH / 2;
    const centerY = CANVAS_HEIGHT / 2;
    const scale = 1;
    
    // Draw axes
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(CANVAS_WIDTH, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, CANVAS_HEIGHT);
    ctx.stroke();
    
    // Draw grid circles
    ctx.strokeStyle = '#f3f4f6';
    for (let r = 50; r < 200; r += 50) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
      ctx.stroke();
    }
    
    // Draw trajectory
    if (trajectoryPoints.length > 1) {
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      let validPoints = 0;
      trajectoryPoints.forEach((point, i) => {
        const x = centerX + point.x * scale;
        const y = centerY + point.y * scale;
        
        // Only draw points that are within reasonable bounds
        if (Math.abs(point.x) < 300 && Math.abs(point.y) < 300) {
          if (validPoints === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          validPoints++;
        }
      });
      
      ctx.stroke();
      
      // Draw direction arrows along trajectory
      const arrowSpacing = Math.max(10, Math.floor(trajectoryPoints.length / 8));
      ctx.fillStyle = '#8b5cf6';
      for (let i = arrowSpacing; i < trajectoryPoints.length - arrowSpacing; i += arrowSpacing) {
        const p1 = trajectoryPoints[i - arrowSpacing];
        const p2 = trajectoryPoints[i];
        
        if (Math.abs(p1.x) < 300 && Math.abs(p1.y) < 300 && 
            Math.abs(p2.x) < 300 && Math.abs(p2.y) < 300) {
          const x1 = centerX + p1.x * scale;
          const y1 = centerY + p1.y * scale;
          const x2 = centerX + p2.x * scale;
          const y2 = centerY + p2.y * scale;
          
          const angle = Math.atan2(y2 - y1, x2 - x1);
          const arrowSize = 8;
          
          ctx.save();
          ctx.translate(x2, y2);
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.moveTo(-arrowSize, -arrowSize/2);
          ctx.lineTo(0, 0);
          ctx.lineTo(-arrowSize, arrowSize/2);
          ctx.fill();
          ctx.restore();
        }
      }
      
      // Highlight current position
      if (currentTime >= 0 && currentTime < trajectoryPoints.length) {
        const currentPoint = trajectoryPoints[Math.floor(currentTime / timeStep)];
        if (currentPoint && Math.abs(currentPoint.x) < 300 && Math.abs(currentPoint.y) < 300) {
          const x = centerX + currentPoint.x * scale;
          const y = centerY + currentPoint.y * scale;
          
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    }
    
    // Draw initial point
    const initX = centerX + initialPoint.x * scale;
    const initY = centerY + initialPoint.y * scale;
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(initX, initY, 5, 0, 2 * Math.PI);
    ctx.fill();
    
    // Labels
    ctx.fillStyle = '#374151';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('x', CANVAS_WIDTH - 15, centerY - 10);
    ctx.fillText('y', centerX + 10, 15);
    ctx.fillText('Start', initX, initY - 10);
  }, [trajectoryPoints, currentTime, timeStep, initialPoint]);

  // Draw complex plane representation
  const drawComplexPlane = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    const centerX = CANVAS_WIDTH / 2;
    const centerY = CANVAS_HEIGHT / 2;
    const scale = 80;
    
    // Draw axes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(CANVAS_WIDTH, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, CANVAS_HEIGHT);
    ctx.stroke();
    
    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = -2; i <= 2; i++) {
      if (i !== 0) {
        // Vertical lines (real axis)
        ctx.beginPath();
        ctx.moveTo(centerX + i * scale, 0);
        ctx.lineTo(centerX + i * scale, CANVAS_HEIGHT);
        ctx.stroke();
        
        // Horizontal lines (imaginary axis)
        ctx.beginPath();
        ctx.moveTo(0, centerY + i * scale);
        ctx.lineTo(CANVAS_WIDTH, centerY + i * scale);
        ctx.stroke();
      }
    }
    
    // Draw unit circle (stability boundary)
    if (showMagnitudeCircle) {
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, scale, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    // Draw eigenvalue
    const x = centerX + eigenvalue.real * scale;
    const y = centerY - eigenvalue.imag * scale; // Negative because canvas y is inverted
    
    ctx.fillStyle = '#8b5cf6';
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw conjugate eigenvalue
    const conjY = centerY + eigenvalue.imag * scale;
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.arc(x, conjY, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw magnitude vector
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    // Labels
    ctx.fillStyle = '#374151';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Real', CANVAS_WIDTH - 30, centerY - 10);
    ctx.fillText('Imaginary', centerX + 10, 15);
    
    // Eigenvalue label
    ctx.fillText(`${eigenvalue.real.toFixed(2)} + ${eigenvalue.imag.toFixed(2)}i`, 
                 x + 15, y - 10);
    ctx.fillText(`${eigenvalue.real.toFixed(2)} - ${eigenvalue.imag.toFixed(2)}i`, 
                 x + 15, conjY + 15);
    
    // Magnitude and stability region labels
    if (showMagnitudeCircle) {
      ctx.fillStyle = '#f59e0b';
      ctx.fillText('|λ| = 1', centerX + scale + 10, centerY - 5);
      ctx.fillText('(Stability boundary)', centerX + scale + 10, centerY + 10);
    }
  }, [eigenvalue, showMagnitudeCircle]);

  // Generate challenges
  const generateChallenge = useCallback(() => {
    const challenges = [
      {
        id: 'stability-analysis',
        question: 'If eigenvalues are -0.2 ± 1.5i, what type of motion occurs?',
        answer: 'decaying spiral',
        explanation: 'Real part -0.2 < 0 means decay, imaginary part ±1.5i means oscillation → decaying spiral'
      },
      {
        id: 'oscillation-frequency',
        question: 'For eigenvalue 0.1 + 3i, what is the oscillation frequency?',
        answer: '3',
        explanation: 'The imaginary part determines oscillation frequency: frequency = |Im(λ)| = 3'
      },
      {
        id: 'growth-rate',
        question: 'If λ = 0.05 + 2i, will the system grow or decay?',
        answer: 'grow',
        explanation: 'Real part 0.05 > 0 means exponential growth despite oscillation'
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

  // Start animation
  const startAnimation = useCallback(() => {
    setIsAnimating(true);
    setCurrentTime(0);
    
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const next = prev + timeStep;
        if (next >= maxTime) {
          setIsAnimating(false);
          clearInterval(interval);
          setExperimentsCompleted(prev => prev + 1);
          return maxTime;
        }
        return next;
      });
    }, 50);
  }, [timeStep, maxTime]);

  // Load system example
  const loadSystemExample = useCallback((systemKey: string) => {
    if (systemKey !== 'custom' && systemExamples[systemKey]) {
      const system = systemExamples[systemKey];
      setEigenvalue(system.eigenvalue);
      setSelectedSystem(systemKey);
    }
  }, [systemExamples]);

  // Initialize and update
  useEffect(() => {
    generateChallenge();
    generateTrajectory();
    setSystemAnalysis(analyzeSystem(eigenvalue));
  }, [eigenvalue, generateChallenge, generateTrajectory, analyzeSystem]);

  // Update canvas drawings
  useEffect(() => {
    const spiralCtx = spiralCanvasRef.current?.getContext('2d');
    const complexCtx = complexPlaneRef.current?.getContext('2d');
    
    if (spiralCtx) drawSpiral(spiralCtx);
    if (complexCtx) drawComplexPlane(complexCtx);
  }, [drawSpiral, drawComplexPlane]);

  // Update progress
  useEffect(() => {
    const newProgress = Math.min(100, (challengesSolved.size * 25) + (experimentsCompleted * 10));
    setProgress(newProgress);
    onProgress?.(newProgress);
  }, [challengesSolved.size, experimentsCompleted, onProgress]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-indigo-800 flex items-center gap-2">
            🌀🔍 Eileen's Complex Eigenvalue Dance Studio
          </CardTitle>
          <p className="text-indigo-700">
            Uncover the mysteries of complex eigenvalues! Watch how they choreograph spiraling, oscillating motions in mathematical space.
          </p>
        </CardHeader>
      </Card>

      {/* Dual Visualization Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spiral Trajectory */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Spiral Trajectory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <canvas
                ref={spiralCanvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="border border-gray-300 rounded-lg bg-white"
              />
            </div>
            <div className="mt-2 text-center text-xs text-gray-600">
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Start</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Current</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-1 bg-purple-500"></div>
                  <span>Trajectory</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Complex Plane */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Complex Plane</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <canvas
                ref={complexPlaneRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="border border-gray-300 rounded-lg bg-white"
              />
            </div>
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-center">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showMagnitudeCircle}
                    onChange={(e) => setShowMagnitudeCircle(e.target.checked)}
                  />
                  Show unit circle
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">🎛️ Eigenvalue Controller</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* System Examples */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-indigo-700">Example Systems:</label>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(systemExamples).map(([key, system]) => (
                    <Button
                      key={key}
                      variant={selectedSystem === key ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => loadSystemExample(key)}
                      className={selectedSystem === key ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
                    >
                      {system.name}
                    </Button>
                  ))}
                  <Button
                    variant={selectedSystem === 'custom' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedSystem('custom')}
                    className={selectedSystem === 'custom' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
                  >
                    Custom
                  </Button>
                </div>
              </div>

              {/* System Analysis */}
              <div className="bg-purple-50 p-3 rounded-lg">
                <h4 className="font-medium text-purple-800 mb-2">System Analysis</h4>
                <p className="text-sm text-purple-700">{systemAnalysis}</p>
              </div>
            </div>

            {/* Eigenvalue Parameters */}
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-indigo-700">
                    Real part (a): {eigenvalue.real.toFixed(2)}
                  </label>
                  <Slider
                    value={[eigenvalue.real]}
                    onValueChange={([value]) => {
                      setEigenvalue(prev => ({ ...prev, real: value }));
                      setSelectedSystem('custom');
                    }}
                    min={-0.5}
                    max={0.5}
                    step={0.01}
                    className="mt-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-indigo-700">
                    Imaginary part (b): {eigenvalue.imag.toFixed(2)}
                  </label>
                  <Slider
                    value={[eigenvalue.imag]}
                    onValueChange={([value]) => {
                      setEigenvalue(prev => ({ ...prev, imag: value }));
                      setSelectedSystem('custom');
                    }}
                    min={0.1}
                    max={4}
                    step={0.1}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Eigenvalue Display */}
              <div className="bg-indigo-50 p-3 rounded-lg">
                <h4 className="font-medium text-indigo-800 mb-2">λ = {eigenvalue.real.toFixed(2)} ± {eigenvalue.imag.toFixed(2)}i</h4>
                <div className="text-sm text-indigo-700 space-y-1">
                  <div>Magnitude: {complexMagnitude(eigenvalue).toFixed(3)}</div>
                  <div>Frequency: {eigenvalue.imag.toFixed(2)}</div>
                  <div>Period: {(2 * Math.PI / eigenvalue.imag).toFixed(2)}</div>
                </div>
              </div>
            </div>

            {/* Animation Controls */}
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-indigo-700">Max Time: {maxTime}</label>
                  <Slider
                    value={[maxTime]}
                    onValueChange={([value]) => setMaxTime(value)}
                    min={5}
                    max={20}
                    step={1}
                    className="mt-2"
                  />
                </div>
                <Button
                  onClick={startAnimation}
                  disabled={isAnimating}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  {isAnimating ? `Dancing... t=${currentTime.toFixed(1)}` : 'Start Dance!'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Challenge Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Complex Eigenvalue Challenge</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentChallenge && (
            <>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <h4 className="font-medium text-amber-800 mb-2">Detective Question:</h4>
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
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Investigate!
                </Button>
                <Button
                  onClick={generateChallenge}
                  variant="outline"
                >
                  New Mystery
                </Button>
              </div>

              {isCorrect !== null && (
                <Alert className={isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}>
                  <AlertDescription className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                    {isCorrect ? (
                      <>🌀 Excellent! You've cracked the complex code!</>
                    ) : (
                      <>🔍 Mystery solved: {currentChallenge.explanation}</>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Concept Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">🧮 Complex Eigenvalue Dance Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Real Part (a)</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <div>• a &gt; 0: Spiral grows outward</div>
                <div>• a &lt; 0: Spiral decays inward</div>
                <div>• a = 0: Pure circular motion</div>
                <div>• Controls growth/decay rate</div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-2">Imaginary Part (b)</h4>
              <div className="text-sm text-purple-700 space-y-1">
                <div>• Determines rotation speed</div>
                <div>• Frequency = |b|</div>
                <div>• Period = 2π/|b|</div>
                <div>• Larger |b| = faster spinning</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 bg-indigo-50 p-4 rounded-lg">
            <h4 className="font-medium text-indigo-800 mb-2">Eileen's Complex Rules</h4>
            <div className="text-sm text-indigo-700">
              "Complex eigenvalues mean spiraling motion! Real part controls growth, imaginary part controls spinning. It's like mathematical choreography!"
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
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <Badge variant="outline" className="text-indigo-700">
                {challengesSolved.size} mysteries solved
              </Badge>
            </div>
            <Button
              onClick={onComplete}
              className="bg-indigo-600 hover:bg-indigo-700"
              disabled={progress < 50}
            >
              Complete Dance Studio
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{challengesSolved.size}</div>
              <div className="text-gray-600">Mysteries Solved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{experimentsCompleted}</div>
              <div className="text-gray-600">Dances Performed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{Math.round(progress)}%</div>
              <div className="text-gray-600">Progress</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplexEigenvalues;