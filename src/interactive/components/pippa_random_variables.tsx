import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Badge } from '@/core/components/ui/badge';
import { Alert, AlertDescription } from '@/core/components/ui/alert';
import { Slider } from '@/core/components/ui/slider';

interface RandomVariablesProps {
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  isPreview?: boolean;
}

interface Distribution {
  name: string;
  type: 'discrete' | 'continuous';
  description: string;
  parameters: Record<string, number>;
  color: string;
}

interface ExperimentOutcome {
  outcome: string;
  value: number;
  probability: number;
}

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 250;

const RandomVariables: React.FC<RandomVariablesProps> = ({ 
  onComplete, 
  onProgress, 
  isPreview = false 
}) => {
  // Canvas references
  const pmfCanvasRef = useRef<HTMLCanvasElement>(null);
  const cdfCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // State
  const [selectedDistribution, setSelectedDistribution] = useState<Distribution>({
    name: 'Coin Flips',
    type: 'discrete',
    description: 'Number of heads in n coin flips',
    parameters: { n: 3, p: 0.5 },
    color: '#8b5cf6'
  });
  
  const [experimentMode, setExperimentMode] = useState<'dice' | 'coins' | 'custom'>('dice');
  const [showCDF, setShowCDF] = useState(false);
  const [outcomes, setOutcomes] = useState<ExperimentOutcome[]>([]);
  
  // Challenge state
  const [currentChallenge, setCurrentChallenge] = useState<{ id: string; question: string; answer: string; explanation?: string } | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  // Progress tracking
  const [progress, setProgress] = useState(0);
  const [challengesSolved, setChallengesSolved] = useState<Set<string>>(new Set());
  const [experimentsCompleted, setExperimentsCompleted] = useState(0);

  // Available distributions
  const distributions: Distribution[] = [
    {
      name: 'Coin Flips',
      type: 'discrete',
      description: 'Number of heads in n coin flips (Binomial)',
      parameters: { n: 3, p: 0.5 },
      color: '#8b5cf6'
    },
    {
      name: 'Dice Rolls',
      type: 'discrete',
      description: 'Sum of two fair dice',
      parameters: {},
      color: '#3b82f6'
    },
    {
      name: 'Uniform Discrete',
      type: 'discrete',
      description: 'Equal probability for each value',
      parameters: { min: 1, max: 6 },
      color: '#10b981'
    },
    {
      name: 'Normal Distribution',
      type: 'continuous',
      description: 'Bell-shaped curve (μ, σ²)',
      parameters: { mu: 0, sigma: 1 },
      color: '#f59e0b'
    },
    {
      name: 'Uniform Continuous',
      type: 'continuous',
      description: 'Equal density over interval [a,b]',
      parameters: { a: 0, b: 1 },
      color: '#ef4444'
    }
  ];

  // Generate experiment outcomes
  const generateExperimentOutcomes = useCallback((mode: 'dice' | 'coins' | 'custom'): ExperimentOutcome[] => {
    const outcomes: ExperimentOutcome[] = [];
    
    if (mode === 'dice') {
      // Sum of two dice
      for (let i = 1; i <= 6; i++) {
        for (let j = 1; j <= 6; j++) {
          const sum = i + j;
          const existing = outcomes.find(o => o.value === sum);
          if (existing) {
            existing.probability += 1/36;
          } else {
            outcomes.push({
              outcome: `(${i},${j})`,
              value: sum,
              probability: 1/36
            });
          }
        }
      }
    } else if (mode === 'coins') {
      // Number of heads in 3 coin flips
      const sequences = ['HHH', 'HHT', 'HTH', 'HTT', 'THH', 'THT', 'TTH', 'TTT'];
      sequences.forEach(seq => {
        const heads = seq.split('').filter(c => c === 'H').length;
        const existing = outcomes.find(o => o.value === heads);
        if (existing) {
          existing.probability += 1/8;
        } else {
          outcomes.push({
            outcome: seq,
            value: heads,
            probability: 1/8
          });
        }
      });
    }
    
    return outcomes.sort((a, b) => a.value - b.value);
  }, []);

  // Calculate binomial probability
  const binomialPMF = useCallback((k: number, n: number, p: number): number => {
    const combination = (n: number, k: number): number => {
      if (k > n) return 0;
      if (k === 0 || k === n) return 1;
      let result = 1;
      for (let i = 0; i < Math.min(k, n - k); i++) {
        result = result * (n - i) / (i + 1);
      }
      return result;
    };
    
    return combination(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
  }, []);

  // Calculate normal PDF
  const normalPDF = useCallback((x: number, mu: number, sigma: number): number => {
    const coefficient = 1 / (sigma * Math.sqrt(2 * Math.PI));
    const exponent = -0.5 * Math.pow((x - mu) / sigma, 2);
    return coefficient * Math.exp(exponent);
  }, []);

  // Draw discrete PMF
  const drawDiscretePMF = useCallback((ctx: CanvasRenderingContext2D, dist: Distribution) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Setup
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const plotWidth = CANVAS_WIDTH - margin.left - margin.right;
    const plotHeight = CANVAS_HEIGHT - margin.top - margin.bottom;
    
    const values: number[] = [];
    const probabilities: number[] = [];
    
    if (dist.name === 'Coin Flips') {
      const n = dist.parameters.n;
      const p = dist.parameters.p;
      for (let k = 0; k <= n; k++) {
        values.push(k);
        probabilities.push(binomialPMF(k, n, p));
      }
    } else if (dist.name === 'Dice Rolls') {
      for (let sum = 2; sum <= 12; sum++) {
        values.push(sum);
        const count = Math.min(sum - 1, 13 - sum);
        probabilities.push(count / 36);
      }
    } else if (dist.name === 'Uniform Discrete') {
      const min = dist.parameters.min;
      const max = dist.parameters.max;
      for (let i = min; i <= max; i++) {
        values.push(i);
        probabilities.push(1 / (max - min + 1));
      }
    }
    
    if (values.length === 0) return;
    
    const maxProb = Math.max(...probabilities);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    
    // Scales
    const xScale = (val: number) => margin.left + ((val - minVal) / (maxVal - minVal)) * plotWidth;
    const yScale = (prob: number) => margin.top + plotHeight - (prob / maxProb) * plotHeight;
    
    // Draw axes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top + plotHeight);
    ctx.lineTo(margin.left + plotWidth, margin.top + plotHeight);
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + plotHeight);
    ctx.stroke();
    
    // Draw bars
    ctx.fillStyle = dist.color;
    const barWidth = plotWidth / (values.length + 1);
    
    values.forEach((val, i) => {
      const x = xScale(val) - barWidth / 4;
      const y = yScale(probabilities[i]);
      const height = margin.top + plotHeight - y;
      
      ctx.fillRect(x, y, barWidth / 2, height);
      
      // Value labels
      ctx.fillStyle = '#374151';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(val.toString(), xScale(val), margin.top + plotHeight + 20);
      
      // Probability labels
      ctx.fillText(probabilities[i].toFixed(3), xScale(val), y - 5);
      
      ctx.fillStyle = dist.color;
    });
    
    // Title
    ctx.fillStyle = '#374151';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`PMF: ${dist.name}`, CANVAS_WIDTH / 2, 15);
  }, [binomialPMF]);

  // Draw continuous PDF
  const drawContinuousPDF = useCallback((ctx: CanvasRenderingContext2D, dist: Distribution) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const plotWidth = CANVAS_WIDTH - margin.left - margin.right;
    const plotHeight = CANVAS_HEIGHT - margin.top - margin.bottom;
    
    let xMin = -3, xMax = 3;
    let yMax = 0.5;
    
    if (dist.name === 'Normal Distribution') {
      const mu = dist.parameters.mu;
      const sigma = dist.parameters.sigma;
      xMin = mu - 3 * sigma;
      xMax = mu + 3 * sigma;
      yMax = normalPDF(mu, mu, sigma) * 1.1;
    } else if (dist.name === 'Uniform Continuous') {
      xMin = dist.parameters.a - 0.5;
      xMax = dist.parameters.b + 0.5;
      yMax = 1.2 / (dist.parameters.b - dist.parameters.a);
    }
    
    // Scales
    const xScale = (x: number) => margin.left + ((x - xMin) / (xMax - xMin)) * plotWidth;
    const yScale = (y: number) => margin.top + plotHeight - (y / yMax) * plotHeight;
    
    // Draw axes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top + plotHeight);
    ctx.lineTo(margin.left + plotWidth, margin.top + plotHeight);
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + plotHeight);
    ctx.stroke();
    
    // Draw curve
    ctx.strokeStyle = dist.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    let isFirstPoint = true;
    for (let pixelX = margin.left; pixelX <= margin.left + plotWidth; pixelX += 2) {
      const x = xMin + ((pixelX - margin.left) / plotWidth) * (xMax - xMin);
      let y = 0;
      
      if (dist.name === 'Normal Distribution') {
        y = normalPDF(x, dist.parameters.mu, dist.parameters.sigma);
      } else if (dist.name === 'Uniform Continuous') {
        y = (x >= dist.parameters.a && x <= dist.parameters.b) ? 
            1 / (dist.parameters.b - dist.parameters.a) : 0;
      }
      
      const pixelY = yScale(y);
      
      if (isFirstPoint) {
        ctx.moveTo(pixelX, pixelY);
        isFirstPoint = false;
      } else {
        ctx.lineTo(pixelX, pixelY);
      }
    }
    
    ctx.stroke();
    
    // Title
    ctx.fillStyle = '#374151';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`PDF: ${dist.name}`, CANVAS_WIDTH / 2, 15);
  }, [normalPDF]);

  // Generate challenges
  const generateChallenge = useCallback(() => {
    const challenges = [
      {
        id: 'pmf-sum',
        question: 'For a discrete random variable with PMF P(X=1)=0.2, P(X=2)=0.5, P(X=3)=0.3, what is P(X ≤ 2)?',
        answer: '0.7',
        explanation: 'P(X ≤ 2) = P(X=1) + P(X=2) = 0.2 + 0.5 = 0.7'
      },
      {
        id: 'uniform-pdf',
        question: 'For a uniform distribution on [0,4], what is the PDF value f(x)?',
        answer: '0.25',
        explanation: 'For uniform distribution on [a,b], PDF = 1/(b-a) = 1/(4-0) = 0.25'
      },
      {
        id: 'binomial-mean',
        question: 'If X ~ Binomial(n=10, p=0.3), what is E[X]?',
        answer: '3',
        explanation: 'For binomial distribution, E[X] = np = 10 × 0.3 = 3'
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
    
    const correct = Math.abs(parseFloat(userAnswer) - parseFloat(currentChallenge.answer)) < 0.01;
    setIsCorrect(correct);
    setShowAnswer(true);
    
    if (correct) {
      const challengeKey = currentChallenge.id;
      setChallengesSolved(prev => new Set([...prev, challengeKey]));
    }
  }, [currentChallenge, userAnswer]);

  // Initialize
  useEffect(() => {
    const outcomes = generateExperimentOutcomes(experimentMode);
    setOutcomes(outcomes);
    generateChallenge();
  }, [experimentMode, generateExperimentOutcomes, generateChallenge]);

  // Update canvas when distribution changes
  useEffect(() => {
    const pmfCtx = pmfCanvasRef.current?.getContext('2d');
    if (!pmfCtx) return;
    
    if (selectedDistribution.type === 'discrete') {
      drawDiscretePMF(pmfCtx, selectedDistribution);
    } else {
      drawContinuousPDF(pmfCtx, selectedDistribution);
    }
  }, [selectedDistribution, drawDiscretePMF, drawContinuousPDF]);

  // Update progress
  useEffect(() => {
    const newProgress = Math.min(100, (challengesSolved.size * 25) + (experimentsCompleted * 5));
    setProgress(newProgress);
    onProgress?.(newProgress);
  }, [challengesSolved.size, experimentsCompleted, onProgress]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-purple-800 flex items-center gap-2">
            🎩✨ Pippa's Random Variable Magic Show
          </CardTitle>
          <p className="text-purple-700">
            Transform chaotic outcomes into mathematical magic! Watch how random variables turn uncertainty into beautiful distribution patterns.
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Experiment Designer */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Magical Experiment Designer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Experiment Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-700">Choose Your Magic Trick:</label>
              <div className="flex gap-2">
                <Button
                  variant={experimentMode === 'dice' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setExperimentMode('dice')}
                  className={experimentMode === 'dice' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  🎲 Dice Magic
                </Button>
                <Button
                  variant={experimentMode === 'coins' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setExperimentMode('coins')}
                  className={experimentMode === 'coins' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  🪙 Coin Magic
                </Button>
              </div>
            </div>

            {/* Outcome Mapping */}
            {outcomes.length > 0 && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-800 mb-3">Outcome → Number Mapping</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {outcomes.map((outcome, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="font-mono text-purple-600">{outcome.outcome}</span>
                      <span className="text-purple-700">→ X = {outcome.value}</span>
                      <span className="text-purple-500">P = {outcome.probability.toFixed(3)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Distribution Preview */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-2">Random Variable Summary</h4>
              <div className="text-sm text-purple-700 space-y-1">
                <div>Type: <Badge variant="outline">{experimentMode === 'dice' ? 'Discrete' : 'Discrete'}</Badge></div>
                <div>Sample Space: {experimentMode === 'dice' ? 'All possible dice pairs' : 'All coin flip sequences'}</div>
                <div>Random Variable: {experimentMode === 'dice' ? 'X = sum of dice' : 'X = number of heads'}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Distribution Visualizer */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Distribution Visualizer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Distribution Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-700">Select Distribution:</label>
              <div className="grid grid-cols-2 gap-2">
                {distributions.map((dist, index) => (
                  <Button
                    key={index}
                    variant={selectedDistribution.name === dist.name ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedDistribution(dist)}
                    className={selectedDistribution.name === dist.name ? 'bg-purple-600 hover:bg-purple-700' : ''}
                  >
                    {dist.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Parameters */}
            {selectedDistribution.name === 'Coin Flips' && (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-purple-700">Number of flips (n): {selectedDistribution.parameters.n}</label>
                  <Slider
                    value={[selectedDistribution.parameters.n]}
                    onValueChange={([value]) => setSelectedDistribution(prev => ({
                      ...prev,
                      parameters: { ...prev.parameters, n: value }
                    }))}
                    min={1}
                    max={10}
                    step={1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-purple-700">Probability of heads (p): {selectedDistribution.parameters.p}</label>
                  <Slider
                    value={[selectedDistribution.parameters.p]}
                    onValueChange={([value]) => setSelectedDistribution(prev => ({
                      ...prev,
                      parameters: { ...prev.parameters, p: value }
                    }))}
                    min={0.1}
                    max={0.9}
                    step={0.1}
                    className="mt-2"
                  />
                </div>
              </div>
            )}

            {selectedDistribution.name === 'Normal Distribution' && (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-purple-700">Mean (μ): {selectedDistribution.parameters.mu}</label>
                  <Slider
                    value={[selectedDistribution.parameters.mu]}
                    onValueChange={([value]) => setSelectedDistribution(prev => ({
                      ...prev,
                      parameters: { ...prev.parameters, mu: value }
                    }))}
                    min={-3}
                    max={3}
                    step={0.5}
                    className="mt-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-purple-700">Standard deviation (σ): {selectedDistribution.parameters.sigma}</label>
                  <Slider
                    value={[selectedDistribution.parameters.sigma]}
                    onValueChange={([value]) => setSelectedDistribution(prev => ({
                      ...prev,
                      parameters: { ...prev.parameters, sigma: value }
                    }))}
                    min={0.5}
                    max={2}
                    step={0.25}
                    className="mt-2"
                  />
                </div>
              </div>
            )}

            {/* Canvas */}
            <div className="flex justify-center">
              <canvas
                ref={pmfCanvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="border border-gray-300 rounded-lg bg-white"
              />
            </div>

            <div className="text-center text-sm text-gray-600">
              <Badge variant="outline" style={{ borderColor: selectedDistribution.color, color: selectedDistribution.color }}>
                {selectedDistribution.type === 'discrete' ? 'PMF' : 'PDF'}: {selectedDistribution.description}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Challenge Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Probability Challenge</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentChallenge && (
            <>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <h4 className="font-medium text-amber-800 mb-2">Magic Question:</h4>
                <p className="text-amber-700">{currentChallenge.question}</p>
              </div>

              <div className="flex gap-2">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Enter your answer"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  step="0.01"
                  disabled={showAnswer}
                />
                <Button
                  onClick={checkAnswer}
                  disabled={!userAnswer || showAnswer}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Cast Spell!
                </Button>
                <Button
                  onClick={generateChallenge}
                  variant="outline"
                >
                  New Challenge
                </Button>
              </div>

              {isCorrect !== null && (
                <Alert className={isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}>
                  <AlertDescription className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                    {isCorrect ? (
                      <>🎉 Magical! You got it right!</>
                    ) : (
                      <>✨ Not quite! The answer is {currentChallenge.answer}. {currentChallenge.explanation}</>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Concept Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">🔮 Random Variable Magic Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Discrete Random Variables</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <div>• Count things (1, 2, 3, ...)</div>
                <div>• PMF: P(X = x) gives exact probabilities</div>
                <div>• Examples: dice rolls, coin flips, arrivals</div>
                <div>• Probabilities sum to 1</div>
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-medium text-orange-800 mb-2">Continuous Random Variables</h4>
              <div className="text-sm text-orange-700 space-y-1">
                <div>• Measure things (heights, times, temperatures)</div>
                <div>• PDF: f(x) gives probability density</div>
                <div>• P(a ≤ X ≤ b) = ∫ f(x)dx from a to b</div>
                <div>• Total area under curve = 1</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-2">The Magic Formula</h4>
            <div className="text-sm text-purple-700">
              Random Variable: X: Ω → ℝ (transforms outcomes to numbers) <br/>
              CDF: F(x) = P(X ≤ x) works for both discrete and continuous!
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
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <Badge variant="outline" className="text-purple-700">
                {challengesSolved.size} challenges solved
              </Badge>
            </div>
            <Button
              onClick={onComplete}
              className="bg-purple-600 hover:bg-purple-700"
              disabled={progress < 50}
            >
              Complete Magic Show
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{challengesSolved.size}</div>
              <div className="text-gray-600">Challenges Solved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{experimentsCompleted}</div>
              <div className="text-gray-600">Experiments Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{Math.round(progress)}%</div>
              <div className="text-gray-600">Progress</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RandomVariables;