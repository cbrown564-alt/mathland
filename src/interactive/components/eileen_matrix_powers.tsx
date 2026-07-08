import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Badge } from '@/core/components/ui/badge';
import { Alert, AlertDescription } from '@/core/components/ui/alert';
import { Slider } from '@/core/components/ui/slider';

interface MatrixPowersProps {
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  isPreview?: boolean;
}

interface Matrix2x2 {
  a: number;
  b: number;
  c: number;
  d: number;
}

interface EigenData {
  eigenvalue1: number;
  eigenvalue2: number;
  eigenvector1: [number, number];
  eigenvector2: [number, number];
}

interface PopulationState {
  young: number;
  adult: number;
}

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 350;

const MatrixPowers: React.FC<MatrixPowersProps> = ({ 
  onComplete, 
  onProgress, 
  isPreview = false 
}) => {
  // Canvas reference
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Matrix and system state
  const [matrix, setMatrix] = useState<Matrix2x2>({ a: 1.2, b: 0.3, c: 0.1, d: 0.9 });
  const [powerStep, setPowerStep] = useState(0);
  const [maxSteps, setMaxSteps] = useState(20);
  const [animationSpeed, setAnimationSpeed] = useState(500);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // System type
  const [systemType, setSystemType] = useState<'population' | 'markov' | 'custom'>('population');
  const [populationHistory, setPopulationHistory] = useState<PopulationState[]>([]);
  const [initialState, setInitialState] = useState<PopulationState>({ young: 100, adult: 50 });
  
  // Eigenvalue analysis
  const [eigenData, setEigenData] = useState<EigenData | null>(null);
  const [stabilityAnalysis, setStabilityAnalysis] = useState('');
  
  // Challenge state
  const [currentChallenge, setCurrentChallenge] = useState<{ id: string; question: string; answer: string; explanation?: string } | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  // Progress tracking
  const [progress, setProgress] = useState(0);
  const [challengesSolved, setChallengesSolved] = useState<Set<string>>(new Set());
  const [experimentsCompleted, setExperimentsCompleted] = useState(0);

  // Predefined system matrices
  const systemMatrices = {
    population: { a: 1.2, b: 0.3, c: 0.1, d: 0.9 }, // Leslie matrix
    markov: { a: 0.7, b: 0.3, c: 0.4, d: 0.6 }, // Transition matrix
    unstable: { a: 1.5, b: 0.2, c: 0.1, d: 1.1 }, // Unstable system
    stable: { a: 0.8, b: 0.1, c: 0.2, d: 0.7 }, // Stable system
  };

  // Matrix operations
  const multiplyMatrix = useCallback((m1: Matrix2x2, m2: Matrix2x2): Matrix2x2 => {
    return {
      a: m1.a * m2.a + m1.b * m2.c,
      b: m1.a * m2.b + m1.b * m2.d,
      c: m1.c * m2.a + m1.d * m2.c,
      d: m1.c * m2.b + m1.d * m2.d
    };
  }, []);

  const matrixPower = useCallback((m: Matrix2x2, n: number): Matrix2x2 => {
    if (n === 0) return { a: 1, b: 0, c: 0, d: 1 }; // Identity matrix
    if (n === 1) return m;
    
    let result = { a: 1, b: 0, c: 0, d: 1 };
    let base = m;
    let exp = n;
    
    while (exp > 0) {
      if (exp % 2 === 1) {
        result = multiplyMatrix(result, base);
      }
      base = multiplyMatrix(base, base);
      exp = Math.floor(exp / 2);
    }
    
    return result;
  }, [multiplyMatrix]);

  // Eigenvalue calculation for 2x2 matrix
  const calculateEigenvalues = useCallback((m: Matrix2x2): EigenData => {
    const trace = m.a + m.d;
    const det = m.a * m.d - m.b * m.c;
    const discriminant = trace * trace - 4 * det;
    
    let lambda1: number, lambda2: number;
    
    if (discriminant >= 0) {
      lambda1 = (trace + Math.sqrt(discriminant)) / 2;
      lambda2 = (trace - Math.sqrt(discriminant)) / 2;
    } else {
      // Complex eigenvalues
      const real = trace / 2;
      const imag = Math.sqrt(-discriminant) / 2;
      lambda1 = Math.sqrt(real * real + imag * imag); // Magnitude
      lambda2 = lambda1; // Same magnitude for complex conjugates
    }
    
    // Calculate eigenvectors (simplified for real eigenvalues)
    const eigenvector1: [number, number] = m.b !== 0 ? 
      [m.b, lambda1 - m.a] : [lambda1 - m.d, m.c];
    const eigenvector2: [number, number] = m.b !== 0 ? 
      [m.b, lambda2 - m.a] : [lambda2 - m.d, m.c];
    
    // Normalize eigenvectors
    const norm1 = Math.sqrt(eigenvector1[0] * eigenvector1[0] + eigenvector1[1] * eigenvector1[1]);
    const norm2 = Math.sqrt(eigenvector2[0] * eigenvector2[0] + eigenvector2[1] * eigenvector2[1]);
    
    if (norm1 > 0) {
      eigenvector1[0] /= norm1;
      eigenvector1[1] /= norm1;
    }
    if (norm2 > 0) {
      eigenvector2[0] /= norm2;
      eigenvector2[1] /= norm2;
    }
    
    return {
      eigenvalue1: lambda1,
      eigenvalue2: lambda2,
      eigenvector1,
      eigenvector2
    };
  }, []);

  // Analyze stability
  const analyzeStability = useCallback((eigenData: EigenData): string => {
    const mag1 = Math.abs(eigenData.eigenvalue1);
    const mag2 = Math.abs(eigenData.eigenvalue2);
    const maxMag = Math.max(mag1, mag2);
    
    if (maxMag > 1.01) {
      return `Unstable: eigenvalues ${eigenData.eigenvalue1.toFixed(3)}, ${eigenData.eigenvalue2.toFixed(3)} cause exponential growth`;
    } else if (maxMag < 0.99) {
      return `Stable: all eigenvalues have magnitude < 1, system decays to zero`;
    } else {
      return `Neutrally stable: eigenvalue magnitude ≈ 1, system approaches steady state`;
    }
  }, []);

  // Simulate population dynamics
  const simulatePopulation = useCallback((steps: number) => {
    const history: PopulationState[] = [initialState];
    let currentState = initialState;
    
    for (let i = 1; i <= steps; i++) {
      const matrixPowered = matrixPower(matrix, i);
      const newYoung = matrixPowered.a * initialState.young + matrixPowered.b * initialState.adult;
      const newAdult = matrixPowered.c * initialState.young + matrixPowered.d * initialState.adult;
      
      currentState = { young: newYoung, adult: newAdult };
      history.push(currentState);
    }
    
    setPopulationHistory(history);
  }, [matrix, initialState, matrixPower]);

  // Draw population evolution
  const drawPopulationEvolution = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    if (populationHistory.length === 0) return;
    
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const plotWidth = CANVAS_WIDTH - margin.left - margin.right;
    const plotHeight = CANVAS_HEIGHT - margin.top - margin.bottom;
    
    // Find max population for scaling
    const maxPop = Math.max(...populationHistory.map(p => Math.max(p.young, p.adult)));
    
    // Scales
    const xScale = (step: number) => margin.left + (step / (populationHistory.length - 1)) * plotWidth;
    const yScale = (pop: number) => margin.top + plotHeight - (pop / maxPop) * plotHeight;
    
    // Draw axes
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top + plotHeight);
    ctx.lineTo(margin.left + plotWidth, margin.top + plotHeight);
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + plotHeight);
    ctx.stroke();
    
    // Draw young population line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    populationHistory.forEach((state, i) => {
      const x = xScale(i);
      const y = yScale(state.young);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    
    // Draw adult population line
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    populationHistory.forEach((state, i) => {
      const x = xScale(i);
      const y = yScale(state.adult);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    
    // Highlight current step
    if (powerStep < populationHistory.length) {
      const currentState = populationHistory[powerStep];
      const x = xScale(powerStep);
      
      // Young population point
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(x, yScale(currentState.young), 4, 0, 2 * Math.PI);
      ctx.fill();
      
      // Adult population point
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(x, yScale(currentState.adult), 4, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    // Labels
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Time Steps', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 5);
    
    // Legend
    ctx.textAlign = 'left';
    ctx.fillStyle = '#3b82f6';
    ctx.fillText('Young', margin.left + 10, margin.top + 15);
    ctx.fillStyle = '#ef4444';
    ctx.fillText('Adult', margin.left + 60, margin.top + 15);
  }, [populationHistory, powerStep]);

  // Generate challenges
  const generateChallenge = useCallback(() => {
    const challenges = [
      {
        id: 'eigenvalue-stability',
        question: 'A matrix has eigenvalues 1.3 and 0.7. What happens over many iterations?',
        answer: 'grows',
        explanation: 'Since |1.3| > 1, the system grows exponentially in the direction of that eigenvector'
      },
      {
        id: 'markov-steady',
        question: 'In a Markov chain, which eigenvalue determines the steady state?',
        answer: '1',
        explanation: 'The eigenvalue λ = 1 and its eigenvector determine the steady-state distribution'
      },
      {
        id: 'matrix-power',
        question: 'If A = PDP⁻¹, what is A¹⁰?',
        answer: 'PD¹⁰P⁻¹',
        explanation: 'Matrix powers: Aⁿ = PDⁿP⁻¹, so A¹⁰ = PD¹⁰P⁻¹'
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

  // Animation control
  const startAnimation = useCallback(() => {
    setIsAnimating(true);
    setPowerStep(0);
    
    const interval = setInterval(() => {
      setPowerStep(prev => {
        if (prev >= maxSteps) {
          setIsAnimating(false);
          clearInterval(interval);
          setExperimentsCompleted(prev => prev + 1);
          return prev;
        }
        return prev + 1;
      });
    }, animationSpeed);
  }, [maxSteps, animationSpeed]);

  // Initialize
  useEffect(() => {
    generateChallenge();
    const eigenData = calculateEigenvalues(matrix);
    setEigenData(eigenData);
    setStabilityAnalysis(analyzeStability(eigenData));
    simulatePopulation(maxSteps);
  }, [matrix, generateChallenge, calculateEigenvalues, analyzeStability, simulatePopulation, maxSteps]);

  // Update canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    drawPopulationEvolution(ctx);
  }, [drawPopulationEvolution]);

  // Update progress
  useEffect(() => {
    const newProgress = Math.min(100, (challengesSolved.size * 20) + (experimentsCompleted * 10));
    setProgress(newProgress);
    onProgress?.(newProgress);
  }, [challengesSolved.size, experimentsCompleted, onProgress]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="border-2 border-indigo-400/30 bg-gradient-to-r from-white/[0.06] to-white/[0.02] border border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-indigo-200 flex items-center gap-2">
            🔮⏰ Eileen's Matrix Time Machine
          </CardTitle>
          <p className="text-indigo-700">
            Discover how eigenvalues control the future! Watch systems evolve over time and predict long-term behavior.
          </p>
        </CardHeader>
      </Card>

      {/* System Evolution Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">🔮 System Evolution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              aria-label="Eileen matrix powers system evolution visualization"
              className="border border-white/10 rounded-lg bg-white/[0.04]"
            />
          </div>
          
          {powerStep < populationHistory.length && powerStep > 0 && (
            <div className="bg-indigo-50 p-3 rounded-lg text-sm">
              <div className="font-medium text-indigo-200 mb-1">Step {powerStep}:</div>
              <div className="text-indigo-700">
                Young: {populationHistory[powerStep].young.toFixed(1)} | 
                Adult: {populationHistory[powerStep].adult.toFixed(1)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dynamic System Controller */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">⚙️ Dynamic System Controller</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* System Type & Matrix Display */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-indigo-700">System Type:</label>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant={systemType === 'population' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setSystemType('population');
                      setMatrix(systemMatrices.population);
                    }}
                    className={systemType === 'population' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
                  >
                    Population Model
                  </Button>
                  <Button
                    variant={systemType === 'markov' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setSystemType('markov');
                      setMatrix(systemMatrices.markov);
                    }}
                    className={systemType === 'markov' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
                  >
                    Markov Chain
                  </Button>
                </div>
              </div>

              {/* Matrix Display */}
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-medium text-indigo-200 mb-2">Matrix A</h4>
                <div className="grid grid-cols-2 gap-2 text-center font-mono text-sm">
                  <div className="bg-white/[0.04] p-2 rounded border">
                    {matrix.a.toFixed(2)}
                  </div>
                  <div className="bg-white/[0.04] p-2 rounded border">
                    {matrix.b.toFixed(2)}
                  </div>
                  <div className="bg-white/[0.04] p-2 rounded border">
                    {matrix.c.toFixed(2)}
                  </div>
                  <div className="bg-white/[0.04] p-2 rounded border">
                    {matrix.d.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Matrix Parameters */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-indigo-700">a (top-left): {matrix.a.toFixed(2)}</label>
                <Slider
                  value={[matrix.a]}
                  onValueChange={([value]) => setMatrix(prev => ({ ...prev, a: value }))}
                  min={0}
                  max={2}
                  step={0.1}
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-indigo-700">b (top-right): {matrix.b.toFixed(2)}</label>
                <Slider
                  value={[matrix.b]}
                  onValueChange={([value]) => setMatrix(prev => ({ ...prev, b: value }))}
                  min={0}
                  max={1}
                  step={0.1}
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-indigo-700">c (bottom-left): {matrix.c.toFixed(2)}</label>
                <Slider
                  value={[matrix.c]}
                  onValueChange={([value]) => setMatrix(prev => ({ ...prev, c: value }))}
                  min={0}
                  max={1}
                  step={0.1}
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-indigo-700">d (bottom-right): {matrix.d.toFixed(2)}</label>
                <Slider
                  value={[matrix.d]}
                  onValueChange={([value]) => setMatrix(prev => ({ ...prev, d: value }))}
                  min={0}
                  max={2}
                  step={0.1}
                  className="mt-2"
                />
              </div>
            </div>

            {/* Animation Controls */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-indigo-700">Max Steps: {maxSteps}</label>
                <Slider
                  value={[maxSteps]}
                  onValueChange={([value]) => setMaxSteps(value)}
                  min={5}
                  max={50}
                  step={5}
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-indigo-700">Speed: {animationSpeed}ms</label>
                <Slider
                  value={[animationSpeed]}
                  onValueChange={([value]) => setAnimationSpeed(value)}
                  min={100}
                  max={1000}
                  step={100}
                  className="mt-2"
                />
              </div>
            </div>

            {/* Time Machine Controls */}
            <div className="space-y-4">
              <Button
                onClick={startAnimation}
                disabled={isAnimating}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                {isAnimating ? `Running... Step ${powerStep}` : 'Start Time Machine'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Eigenvalue Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">🔍 Eigenvalue Detective Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {eigenData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Eigenvalues</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <div>λ₁ = {eigenData.eigenvalue1.toFixed(3)}</div>
                  <div>λ₂ = {eigenData.eigenvalue2.toFixed(3)}</div>
                  <div className="mt-2">
                    <Badge variant="outline" className={
                      Math.abs(eigenData.eigenvalue1) > 1 || Math.abs(eigenData.eigenvalue2) > 1 ? 
                      'border-red-500 text-red-700' : 
                      Math.abs(eigenData.eigenvalue1) < 1 && Math.abs(eigenData.eigenvalue2) < 1 ?
                      'border-green-500 text-emerald-300/90' :
                      'border-yellow-500 text-yellow-700'
                    }>
                      {Math.abs(eigenData.eigenvalue1) > 1 || Math.abs(eigenData.eigenvalue2) > 1 ? 
                        'Unstable' : 
                        Math.abs(eigenData.eigenvalue1) < 1 && Math.abs(eigenData.eigenvalue2) < 1 ?
                        'Stable' : 'Neutral'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-200 mb-2">Long-term Behavior</h4>
                <p className="text-sm text-purple-700">{stabilityAnalysis}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Challenge Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Time Machine Challenge</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentChallenge && (
            <>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-400/30">
                <h4 className="font-medium text-amber-800 mb-2">Detective Question:</h4>
                <p className="text-amber-700">{currentChallenge.question}</p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Enter your answer"
                  aria-label="Challenge answer"
                  className="flex-1 px-3 py-2 border border-white/10 rounded-md"
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
                  New Case
                </Button>
              </div>

              {isCorrect !== null && (
                <Alert className={isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}>
                  <AlertDescription className={isCorrect ? 'text-emerald-300/90' : 'text-red-700'}>
                    {isCorrect ? (
                      <>🔍 Excellent detective work!</>
                    ) : (
                      <>🕵️ Case closed: {currentChallenge.explanation}</>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Mathematical Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">🧮 Mathematical Time Travel Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-emerald-200 mb-2">Matrix Powers</h4>
              <div className="text-sm text-emerald-300/90 space-y-1">
                <div>• Aⁿ = PDⁿP⁻¹ (diagonalization)</div>
                <div>• Eigenvalues raised to power n</div>
                <div>• |λ| &gt; 1: exponential growth</div>
                <div>• |λ| &lt; 1: exponential decay</div>
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-medium text-orange-800 mb-2">Matrix Exponentials</h4>
              <div className="text-sm text-orange-700 space-y-1">
                <div>• e^(At) = Pe^(Dt)P⁻¹</div>
                <div>• Continuous-time systems</div>
                <div>• Real(λ) &gt; 0: growth</div>
                <div>• Real(λ) &lt; 0: decay</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 bg-indigo-50 p-4 rounded-lg">
            <h4 className="font-medium text-indigo-200 mb-2">Eileen's Detective Rules</h4>
            <div className="text-sm text-indigo-700">
              "Eigenvalue magnitude is destiny! &gt;1 grows, &lt;1 shrinks, =1 stays steady. The largest eigenvalue always wins in the long run!"
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
                {challengesSolved.size} cases solved
              </Badge>
            </div>
            <Button
              onClick={onComplete}
              className="bg-indigo-600 hover:bg-indigo-700"
              disabled={progress < 50}
            >
              Complete Time Machine
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{challengesSolved.size}</div>
              <div className="text-white/55">Cases Solved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{experimentsCompleted}</div>
              <div className="text-white/55">Experiments Run</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{Math.round(progress)}%</div>
              <div className="text-white/55">Progress</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MatrixPowers;