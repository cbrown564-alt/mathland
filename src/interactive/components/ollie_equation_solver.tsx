import React, { useState, useCallback } from 'react';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Input } from '@/core/components/ui/input';
import { Badge } from '@/core/components/ui/badge';
import { Alert, AlertDescription } from '@/core/components/ui/alert';

interface EquationSolverProps {
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  isPreview?: boolean;
}

interface LinearEquation {
  a: number;
  b: number;
  c: number;
  // ax + b = c
}

interface QuadraticEquation {
  a: number;
  b: number;
  c: number;
  // ax² + bx + c = 0
}

interface SolutionStep {
  step: string;
  equation: string;
  explanation: string;
}

const EquationSolver: React.FC<EquationSolverProps> = ({ 
  onComplete, 
  onProgress, 
  isPreview = false 
}) => {
  // Problem state
  const [problemType, setProblemType] = useState<'linear' | 'quadratic' | 'system'>('linear');
  const [currentProblem, setCurrentProblem] = useState<LinearEquation | QuadraticEquation | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [solutionSteps, setSolutionSteps] = useState<SolutionStep[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  // Progress tracking
  const [progress, setProgress] = useState(0);
  const [problemsSolved, setProblemsSolved] = useState<Set<string>>(new Set());
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);

  // Generate random linear equation
  const generateLinearEquation = useCallback((): LinearEquation => {
    const a = Math.floor(Math.random() * 5) + 1; // 1-5
    const solution = Math.floor(Math.random() * 20) - 10; // -10 to 10
    const b = Math.floor(Math.random() * 10) - 5; // -5 to 5
    const c = a * solution + b; // Calculate c to ensure integer solution
    
    return { a, b, c };
  }, []);

  // Generate random quadratic equation
  const generateQuadraticEquation = useCallback((): QuadraticEquation => {
    // Generate equations that factor nicely
    const root1 = Math.floor(Math.random() * 5) + 1; // 1-5
    const root2 = Math.floor(Math.random() * 5) + 1; // 1-5
    
    // (x - root1)(x - root2) = x² - (root1 + root2)x + root1*root2
    const a = 1;
    const b = -(root1 + root2);
    const c = root1 * root2;
    
    return { a, b, c };
  }, []);

  // Solve linear equation step by step
  const solveLinearEquation = useCallback((eq: LinearEquation): { solution: number; steps: SolutionStep[] } => {
    const { a, b, c } = eq;
    const steps: SolutionStep[] = [];
    
    // Start with the equation
    steps.push({
      step: 'Original equation',
      equation: `${a}x + ${b} = ${c}`,
      explanation: 'Start with the given equation'
    });
    
    // Subtract b from both sides
    if (b !== 0) {
      const newC = c - b;
      steps.push({
        step: b > 0 ? `Subtract ${b} from both sides` : `Add ${Math.abs(b)} to both sides`,
        equation: `${a}x = ${newC}`,
        explanation: 'Isolate the term with x'
      });
    }
    
    // Divide by a
    const solution = (c - b) / a;
    if (a !== 1) {
      steps.push({
        step: `Divide both sides by ${a}`,
        equation: `x = ${solution}`,
        explanation: 'Solve for x'
      });
    }
    
    // Check solution
    const check = a * solution + b;
    steps.push({
      step: 'Check solution',
      equation: `${a}(${solution}) + ${b} = ${check}`,
      explanation: `Substitute x = ${solution} back into the original equation`
    });
    
    return { solution, steps };
  }, []);

  // Solve quadratic equation step by step
  const solveQuadraticEquation = useCallback((eq: QuadraticEquation): { solutions: number[]; steps: SolutionStep[] } => {
    const { a, b, c } = eq;
    const steps: SolutionStep[] = [];
    
    // Start with the equation
    steps.push({
      step: 'Original equation',
      equation: `${a}x² + ${b}x + ${c} = 0`,
      explanation: 'Start with the quadratic equation in standard form'
    });
    
    // Calculate discriminant
    const discriminant = b * b - 4 * a * c;
    steps.push({
      step: 'Calculate discriminant',
      equation: `Δ = b² - 4ac = ${b}² - 4(${a})(${c}) = ${discriminant}`,
      explanation: 'The discriminant tells us about the nature of the solutions'
    });
    
    // Apply quadratic formula
    const sqrtDiscriminant = Math.sqrt(discriminant);
    steps.push({
      step: 'Apply quadratic formula',
      equation: `x = (-b ± √Δ)/(2a) = (-${b} ± √${discriminant})/(2·${a})`,
      explanation: 'Use the quadratic formula to find solutions'
    });
    
    // Calculate solutions
    const solution1 = (-b + sqrtDiscriminant) / (2 * a);
    const solution2 = (-b - sqrtDiscriminant) / (2 * a);
    
    if (discriminant > 0) {
      steps.push({
        step: 'Two solutions',
        equation: `x₁ = ${solution1.toFixed(2)}, x₂ = ${solution2.toFixed(2)}`,
        explanation: 'Positive discriminant means two real solutions'
      });
      return { solutions: [solution1, solution2], steps };
    } else if (discriminant === 0) {
      steps.push({
        step: 'One solution (repeated)',
        equation: `x = ${solution1.toFixed(2)}`,
        explanation: 'Zero discriminant means one repeated solution'
      });
      return { solutions: [solution1], steps };
    } else {
      steps.push({
        step: 'No real solutions',
        equation: 'x ∈ ℂ (complex solutions)',
        explanation: 'Negative discriminant means no real solutions'
      });
      return { solutions: [], steps };
    }
  }, []);

  // Generate new problem
  const generateNewProblem = useCallback(() => {
    setUserAnswer('');
    setShowSolution(false);
    setShowSteps(false);
    setIsCorrect(null);
    
    if (problemType === 'linear') {
      const equation = generateLinearEquation();
      setCurrentProblem(equation);
      const { steps } = solveLinearEquation(equation);
      setSolutionSteps(steps);
    } else if (problemType === 'quadratic') {
      const equation = generateQuadraticEquation();
      setCurrentProblem(equation);
      const { steps } = solveQuadraticEquation(equation);
      setSolutionSteps(steps);
    }
  }, [problemType, generateLinearEquation, generateQuadraticEquation, solveLinearEquation, solveQuadraticEquation]);

  // Check user's answer
  const checkAnswer = useCallback(() => {
    if (!currentProblem) return;
    
    const userValue = parseFloat(userAnswer);
    let correct = false;
    
    if (problemType === 'linear') {
      const { solution } = solveLinearEquation(currentProblem as LinearEquation);
      correct = Math.abs(userValue - solution) < 0.01;
    } else if (problemType === 'quadratic') {
      const { solutions } = solveQuadraticEquation(currentProblem as QuadraticEquation);
      correct = solutions.some(sol => Math.abs(userValue - sol) < 0.01);
    }
    
    setIsCorrect(correct);
    setShowSolution(true);
    
    if (correct) {
      setConsecutiveCorrect(prev => prev + 1);
      const problemKey = `${problemType}-${JSON.stringify(currentProblem)}`;
      setProblemsSolved(prev => new Set([...prev, problemKey]));
    } else {
      setConsecutiveCorrect(0);
    }
  }, [currentProblem, userAnswer, problemType, solveLinearEquation, solveQuadraticEquation]);

  // Format equation for display
  const formatEquation = (problem: LinearEquation | QuadraticEquation): string => {
    if (problemType === 'linear') {
      const { a, b, c } = problem as LinearEquation;
      const bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
      return `${a}x ${bStr} = ${c}`;
    } else if (problemType === 'quadratic') {
      const { a, b, c } = problem as QuadraticEquation;
      const bStr = b >= 0 ? `+ ${b}x` : `- ${Math.abs(b)}x`;
      const cStr = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
      return `${a}x² ${bStr} ${cStr} = 0`;
    }
    return '';
  };

  // Initialize with first problem
  React.useEffect(() => {
    generateNewProblem();
  }, [generateNewProblem]);

  // Update progress
  React.useEffect(() => {
    const newProgress = Math.min(100, (problemsSolved.size * 5) + (consecutiveCorrect * 2));
    setProgress(newProgress);
    onProgress?.(newProgress);
  }, [problemsSolved.size, consecutiveCorrect, onProgress]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="border-2 border-emerald-400/30 bg-gradient-to-r from-white/[0.06] to-white/[0.02] border border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-emerald-200 flex items-center gap-2">
            🦫 Ollie's Equation Balance Builder
          </CardTitle>
          <p className="text-emerald-300/90">
            Learn to solve equations step by step! Just like building a dam, we need to keep everything balanced.
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Problem Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center justify-between">
              Current Problem
              <Badge variant="outline" className="text-emerald-300/90">
                {problemType.charAt(0).toUpperCase() + problemType.slice(1)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Problem Type Selector */}
            <div className="flex gap-2">
              <Button
                variant={problemType === 'linear' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setProblemType('linear')}
                className={problemType === 'linear' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                Linear
              </Button>
              <Button
                variant={problemType === 'quadratic' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setProblemType('quadratic')}
                className={problemType === 'quadratic' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                Quadratic
              </Button>
            </div>

            {/* Current equation */}
            {currentProblem && (
              <div className="bg-white/[0.03] p-4 rounded-lg text-center">
                <div className="text-2xl font-mono font-bold text-white/90">
                  {formatEquation(currentProblem)}
                </div>
                <p className="text-sm text-white/55 mt-2">
                  {problemType === 'linear' ? 'Solve for x' : 'Find all values of x'}
                </p>
              </div>
            )}

            {/* Answer input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-emerald-300/90">Your Answer:</label>
              <Input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter your answer"
                aria-label="Challenge answer"
                className="text-center"
                step="0.01"
              />
            </div>

            {/* Control buttons */}
            <div className="flex gap-2">
              <Button
                onClick={checkAnswer}
                disabled={!userAnswer || showSolution}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Check Answer
              </Button>
              <Button
                onClick={() => setShowSteps(!showSteps)}
                variant="outline"
                disabled={!showSolution}
              >
                {showSteps ? 'Hide Steps' : 'Show Steps'}
              </Button>
            </div>

            {/* Result feedback */}
            {isCorrect !== null && (
              <Alert className={isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}>
                <AlertDescription className={isCorrect ? 'text-emerald-300/90' : 'text-red-700'}>
                  {isCorrect ? 
                    '🎉 Correct! Great job solving the equation!' : 
                    '❌ Not quite right. Try again or check the solution steps.'
                  }
                </AlertDescription>
              </Alert>
            )}

            {/* New problem button */}
            <Button
              onClick={generateNewProblem}
              variant="outline"
              className="w-full"
            >
              Generate New Problem
            </Button>
          </CardContent>
        </Card>

        {/* Solution Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Solution Steps</CardTitle>
          </CardHeader>
          <CardContent>
            {showSteps && solutionSteps.length > 0 ? (
              <div className="space-y-4">
                {solutionSteps.map((step, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                    <h4 className="font-medium text-emerald-200">{step.step}</h4>
                    <div className="font-mono text-lg mt-1">{step.equation}</div>
                    <p className="text-sm text-white/55 mt-1">{step.explanation}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-white/45 py-8">
                <div className="text-6xl mb-4">🔒</div>
                <p>Solve the problem first to see the step-by-step solution!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Balance Principle Explanation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">🎯 Ollie's Balance Principle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-2xl">⚖️</div>
              <div>
                <h4 className="font-medium text-emerald-200">Balance Rule</h4>
                <p className="text-sm text-emerald-300/90">
                  "What you do to one side, do to the other - just like keeping my dam balanced!"
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium text-emerald-300/90">Linear Equations:</h5>
                <ul className="text-green-600 space-y-1">
                  <li>• Isolate x by undoing operations</li>
                  <li>• Keep the equation balanced</li>
                  <li>• Check by substituting back</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-emerald-300/90">Quadratic Equations:</h5>
                <ul className="text-green-600 space-y-1">
                  <li>• Factor when possible</li>
                  <li>• Use quadratic formula as backup</li>
                  <li>• May have 0, 1, or 2 solutions</li>
                </ul>
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
                {problemsSolved.size} solved
              </Badge>
            </div>
            <Button
              onClick={onComplete}
              className="bg-green-600 hover:bg-green-700"
              disabled={progress < 50}
            >
              Complete Builder
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{problemsSolved.size}</div>
              <div className="text-white/55">Problems Solved</div>
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

export default EquationSolver;