import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Badge } from '@/core/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/core/components/ui/radio-group';
import { Label } from '@/core/components/ui/label';

interface OllieFoundationBuilderProps {
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  isPreview?: boolean;
}

type BuildingMode = 'expand' | 'factor';

type Expression = {
  id: string;
  expression: string;
  expanded?: string;
  factored?: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  pattern: string;
};

const EXPRESSIONS: Expression[] = [
  {
    id: 'simple-distributive',
    expression: '3(x + 4)',
    expanded: '3x + 12',
    factored: '3(x + 4)',
    description: 'Basic distributive property - spreading materials evenly',
    difficulty: 'beginner',
    pattern: 'Distributive'
  },
  {
    id: 'negative-distributive',
    expression: '-2(3x - 5)',
    expanded: '-6x + 10',
    factored: '-2(3x - 5)',
    description: 'Distributive with negatives - careful with signs!',
    difficulty: 'beginner',
    pattern: 'Distributive'
  },
  {
    id: 'binomial-multiply',
    expression: '(x + 3)(x + 2)',
    expanded: 'x² + 5x + 6',
    factored: '(x + 3)(x + 2)',
    description: 'FOIL method - combining building sections',
    difficulty: 'intermediate',
    pattern: 'FOIL'
  },
  {
    id: 'difference-of-squares',
    expression: '(x + 4)(x - 4)',
    expanded: 'x² - 16',
    factored: '(x + 4)(x - 4)',
    description: 'Difference of squares pattern - special structure',
    difficulty: 'intermediate',
    pattern: 'Difference of Squares'
  },
  {
    id: 'perfect-square',
    expression: '(x + 3)²',
    expanded: 'x² + 6x + 9',
    factored: '(x + 3)²',
    description: 'Perfect square - symmetrical building pattern',
    difficulty: 'intermediate',
    pattern: 'Perfect Square'
  },
  {
    id: 'complex-factor',
    expression: '2x² + 8x + 6',
    expanded: '2x² + 8x + 6',
    factored: '2(x + 1)(x + 3)',
    description: 'Common factor plus quadratic - multi-step building',
    difficulty: 'advanced',
    pattern: 'Common Factor'
  },
  {
    id: 'trinomial-factor',
    expression: 'x² - 7x + 12',
    expanded: 'x² - 7x + 12',
    factored: '(x - 3)(x - 4)',
    description: 'Trinomial factoring - finding the right building blocks',
    difficulty: 'advanced',
    pattern: 'Trinomial'
  }
];

const OllieFoundationBuilder: React.FC<OllieFoundationBuilderProps> = ({
  onComplete,
  onProgress,
  isPreview = false
}) => {
  const [selectedExpression, setSelectedExpression] = useState<string>('simple-distributive');
  const [buildingMode, setBuildingMode] = useState<BuildingMode>('expand');
  const [userInput, setUserInput] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(0);
  const [solvedExpressions, setSolvedExpressions] = useState<Set<string>>(new Set());
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showWork, setShowWork] = useState<boolean>(false);

  const currentExpression = EXPRESSIONS.find(exp => exp.id === selectedExpression)!;
  const targetAnswer = buildingMode === 'expand' ? currentExpression.expanded : currentExpression.factored;

  const checkAnswer = useCallback(() => {
    const cleanedInput = userInput.replace(/\s/g, '').toLowerCase();
    const cleanedTarget = targetAnswer?.replace(/\s/g, '').toLowerCase();
    
    if (cleanedInput === cleanedTarget) {
      setSolvedExpressions(prev => new Set([...prev, selectedExpression]));
      setUserInput('');
      setAttempts(0);
      setShowHint(false);
      setShowWork(false);
      
      if (onProgress) {
        const totalSolved = solvedExpressions.size + 1;
        onProgress(totalSolved / EXPRESSIONS.length);
      }
      
      return true;
    } else {
      setAttempts(prev => prev + 1);
      return false;
    }
  }, [userInput, targetAnswer, selectedExpression, solvedExpressions.size, onProgress]);

  const getWorkingSteps = () => {
    const exp = currentExpression;
    
    if (buildingMode === 'expand') {
      switch (exp.pattern) {
        case 'Distributive':
          return [
            `Starting with: ${exp.expression}`,
            'Apply distributive property: a(b + c) = ab + ac',
            `Multiply each term: ${exp.expanded}`,
            'Final answer: ' + exp.expanded
          ];
        case 'FOIL':
          return [
            `Starting with: ${exp.expression}`,
            'Apply FOIL: (a + b)(c + d) = ac + ad + bc + bd',
            'First: x × x = x²',
            'Outer + Inner: combine middle terms',
            'Last: multiply constants',
            'Final answer: ' + exp.expanded
          ];
        case 'Difference of Squares':
          return [
            `Starting with: ${exp.expression}`,
            'This is a difference of squares pattern',
            '(a + b)(a - b) = a² - b²',
            'Final answer: ' + exp.expanded
          ];
        case 'Perfect Square':
          return [
            `Starting with: ${exp.expression}`,
            'Perfect square pattern: (a + b)² = a² + 2ab + b²',
            'Apply the formula',
            'Final answer: ' + exp.expanded
          ];
        default:
          return [`Starting with: ${exp.expression}`, 'Apply algebraic rules', 'Final answer: ' + exp.expanded];
      }
    } else {
      switch (exp.pattern) {
        case 'Common Factor':
          return [
            `Starting with: ${exp.expression}`,
            'Look for common factors first',
            'Factor out the GCD',
            'Then factor the remaining expression',
            'Final answer: ' + exp.factored
          ];
        case 'Trinomial':
          return [
            `Starting with: ${exp.expression}`,
            'Find two numbers that multiply to give the constant term',
            'And add to give the middle coefficient',
            'Write as a product of binomials',
            'Final answer: ' + exp.factored
          ];
        default:
          return [`Starting with: ${exp.expression}`, 'Reverse the expansion process', 'Final answer: ' + exp.factored];
      }
    }
  };

  const getHint = () => {
    const exp = currentExpression;
    
    if (buildingMode === 'expand') {
      switch (exp.pattern) {
        case 'Distributive':
          return 'Remember: distribute the outside number to each term inside the parentheses. Like spreading cement evenly!';
        case 'FOIL':
          return 'Use FOIL: First terms, Outer terms, Inner terms, Last terms. Then combine like terms.';
        case 'Difference of Squares':
          return 'This follows the pattern (a + b)(a - b) = a² - b². The middle terms cancel out!';
        case 'Perfect Square':
          return 'Perfect square pattern: (a + b)² = a² + 2ab + b². Don\'t forget the middle term!';
        default:
          return 'Break it down step by step, just like building a dam piece by piece.';
      }
    } else {
      switch (exp.pattern) {
        case 'Common Factor':
          return 'First, look for the greatest common factor. Then factor what remains.';
        case 'Trinomial':
          return 'Find two numbers that multiply to the last term and add to the middle coefficient.';
        default:
          return 'Think about what multiplication would give you this expression.';
      }
    }
  };

  const expressionsByDifficulty = useMemo(() => {
    const grouped = EXPRESSIONS.reduce((acc, exp) => {
      if (!acc[exp.difficulty]) acc[exp.difficulty] = [];
      acc[exp.difficulty].push(exp);
      return acc;
    }, {} as Record<string, Expression[]>);
    return grouped;
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4 bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white/90 mb-2">
          🔧 Ollie's Foundation Builder 🔧
        </h2>
        <p className="text-white/55">
          Let's build mathematical foundations step by step! Just like constructing a dam, we'll expand and factor expressions piece by piece.
        </p>
      </div>

      {/* Building Mode Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🏗️ Choose Your Building Mode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={buildingMode} onValueChange={(value) => setBuildingMode(value as BuildingMode)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="expand">🔨 Expand (Build Out)</TabsTrigger>
              <TabsTrigger value="factor">🧱 Factor (Break Down)</TabsTrigger>
            </TabsList>
            
            <TabsContent value="expand" className="mt-4">
              <div className="p-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg">
                <h4 className="font-semibold text-white/90 mb-2">🔨 Expansion Mode</h4>
                <p className="text-sm text-white/70">
                  Just like building out from blueprints! Take a compact expression and expand it into all its parts. 
                  Apply distributive property, FOIL method, and special patterns to build the complete structure.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="factor" className="mt-4">
              <div className="p-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg">
                <h4 className="font-semibold text-white/90 mb-2">🧱 Factoring Mode</h4>
                <p className="text-sm text-white/70">
                  Like taking apart a structure to see how it was built! Find the building blocks that multiply together 
                  to create the expression. Look for common factors, special patterns, and systematic approaches.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expression Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📋 Building Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="beginner">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="beginner">Beginner</TabsTrigger>
                <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              
              {Object.entries(expressionsByDifficulty).map(([difficulty, expressions]) => (
                <TabsContent key={difficulty} value={difficulty} className="mt-4">
                  <RadioGroup value={selectedExpression} onValueChange={setSelectedExpression}>
                    <div className="space-y-3">
                      {expressions.map((exp) => (
                        <div key={exp.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={exp.id} id={exp.id} />
                          <Label htmlFor={exp.id} className="flex-1">
                            <div className="p-3 border rounded-lg cursor-pointer hover:bg-white/[0.03]">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                  {buildingMode === 'expand' ? exp.expression : (exp.expanded || exp.expression)}
                                </span>
                                {solvedExpressions.has(exp.id) && (
                                  <Badge variant="secondary" className="bg-green-100 text-emerald-300/90">
                                    ✅ Built!
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-white/55">{exp.description}</p>
                              <Badge variant="outline" className="mt-1 text-xs">
                                {exp.pattern}
                              </Badge>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Building Workspace */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔧 Construction Workspace
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg">
              <h4 className="font-semibold text-white/90 mb-2">Current Project:</h4>
              <div className="text-lg font-mono text-center p-3 bg-white/[0.04] border-2 border-dashed border-amber-300 rounded">
                {buildingMode === 'expand' ? currentExpression.expression : (currentExpression.expanded || currentExpression.expression)}
              </div>
              <div className="text-center mt-2 text-white/55">
                {buildingMode === 'expand' ? '➡️ Expand to:' : '➡️ Factor to:'}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">
                Your Answer:
              </label>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={`Enter ${buildingMode === 'expand' ? 'expanded' : 'factored'} form...`}
                className="w-full p-3 border border-white/10 rounded-lg font-mono"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    checkAnswer();
                  }
                }}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={checkAnswer}
                disabled={!userInput.trim()}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
              >
                🔨 Check Construction
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowHint(!showHint)}
                className="px-3"
              >
                💡
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowWork(!showWork)}
                className="px-3"
              >
                📋
              </Button>
            </div>

            {attempts > 0 && (
              <div className="p-3 bg-yellow-100 border border-yellow-300 rounded-lg text-sm">
                <p className="text-yellow-800">
                  {attempts === 1 ? 'Not quite right. Try again!' : 
                   attempts === 2 ? 'Getting closer! Check your work step by step.' :
                   'Let me give you a hint or show the working steps.'}
                </p>
              </div>
            )}

            {showHint && (
              <div className="p-4 bg-blue-100 border border-blue-300 rounded-lg">
                <h5 className="font-semibold text-blue-800 mb-2">🦫 Ollie's Hint:</h5>
                <p className="text-blue-700 text-sm">{getHint()}</p>
              </div>
            )}

            {showWork && (
              <div className="p-4 bg-green-100 border border-green-300 rounded-lg">
                <h5 className="font-semibold text-emerald-200 mb-2">🔧 Step-by-Step Construction:</h5>
                <ol className="text-emerald-300/90 text-sm space-y-1">
                  {getWorkingSteps().map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="font-mono text-xs bg-green-200 px-1 rounded">{index + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Progress Summary */}
      {solvedExpressions.size > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📊 Building Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold">
                {solvedExpressions.size} / {EXPRESSIONS.length} Projects Completed
              </span>
              <span className="text-2xl">
                {Math.round((solvedExpressions.size / EXPRESSIONS.length) * 100)}%
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-gradient-to-r from-amber-500 to-orange-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(solvedExpressions.size / EXPRESSIONS.length) * 100}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-amber-100 rounded-lg">
                <div className="text-lg font-bold text-amber-700">
                  {expressionsByDifficulty.beginner?.filter(exp => solvedExpressions.has(exp.id)).length || 0}
                </div>
                <div className="text-sm text-amber-600">Beginner</div>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <div className="text-lg font-bold text-orange-700">
                  {expressionsByDifficulty.intermediate?.filter(exp => solvedExpressions.has(exp.id)).length || 0}
                </div>
                <div className="text-sm text-orange-600">Intermediate</div>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <div className="text-lg font-bold text-red-700">
                  {expressionsByDifficulty.advanced?.filter(exp => solvedExpressions.has(exp.id)).length || 0}
                </div>
                <div className="text-sm text-red-600">Advanced</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ollie's Engineering Wisdom */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🦫 Ollie's Engineering Wisdom
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-4 rounded-lg">
            <p className="text-white/70 mb-3">
              <strong>Building Mathematical Foundations:</strong> Just like constructing a solid dam, algebra requires patience and systematic approach. Whether we're expanding expressions (building out) or factoring them (breaking down), each step builds upon the previous one.
            </p>
            <p className="text-white/70">
              Remember: in engineering and mathematics, there's always a logical sequence. Follow the patterns, check your work, and don't be afraid to take it step by step. Every expert was once a beginner who kept building!
            </p>
          </div>
        </CardContent>
      </Card>

      {!isPreview && solvedExpressions.size >= 5 && (
        <div className="text-center mt-6">
          <Button
            onClick={onComplete}
            className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
          >
            🏗️ Foundation Complete! 🏗️
          </Button>
        </div>
      )}
    </div>
  );
};

export default OllieFoundationBuilder;