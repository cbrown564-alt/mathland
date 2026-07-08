import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Slider } from '@/core/components/ui/slider';
import { Badge } from '@/core/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/core/components/ui/radio-group';
import { Label } from '@/core/components/ui/label';

interface SigmundHypothesisArenaProps {
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  isPreview?: boolean;
}

type Scenario = {
  id: string;
  title: string;
  description: string;
  context: string;
  nullHypothesis: string;
  alternativeHypothesis: string;
  populationMean: number;
  populationStd: number;
  testType: 'two-tailed' | 'left-tailed' | 'right-tailed';
  realEffect: boolean; // Whether H1 is actually true
  icon: string;
};

const erf = (x: number): number => {
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;

  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
};

const normalCDF = (x: number): number => {
  return 0.5 * (1 + erf(x / Math.sqrt(2)));
};

const inverseNormalCDF = (p: number): number => {
  let lo = -5;
  let hi = 5;
  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    if (normalCDF(mid) < p) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return (lo + hi) / 2;
};

const SCENARIOS: Scenario[] = [
  {
    id: 'black-swan',
    title: 'Black Swan Discovery',
    description: 'Testing if swans can be black (discovering rare events)',
    context: 'For centuries, Europeans believed all swans were white. Then explorers discovered black swans in Australia, revolutionizing thinking about rare events.',
    nullHypothesis: 'All swans are white (μ = 0% black)',
    alternativeHypothesis: 'Some swans can be black (μ > 0% black)',
    populationMean: 0.15, // 15% are actually black in some regions
    populationStd: 0.1,
    testType: 'right-tailed',
    realEffect: true,
    icon: '🦢'
  },
  {
    id: 'drug-trial',
    title: 'Medical Treatment',
    description: 'Testing if a new drug reduces recovery time',
    context: 'A pharmaceutical company claims their new drug reduces average recovery time from 10 days to 8 days.',
    nullHypothesis: 'Drug has no effect (μ = 10 days)',
    alternativeHypothesis: 'Drug reduces time (μ < 10 days)',
    populationMean: 8.5, // Drug actually works somewhat
    populationStd: 2.5,
    testType: 'left-tailed',
    realEffect: true,
    icon: '💊'
  },
  {
    id: 'coin-fairness',
    title: 'Coin Fairness',
    description: 'Testing if a coin is biased toward heads',
    context: 'A casino patron suspects a coin is rigged to favor heads more than the fair 50%.',
    nullHypothesis: 'Coin is fair (p = 0.5)',
    alternativeHypothesis: 'Coin favors heads (p ≠ 0.5)',
    populationMean: 0.5, // Coin is actually fair
    populationStd: 0.1,
    testType: 'two-tailed',
    realEffect: false,
    icon: '🪙'
  },
  {
    id: 'quality-control',
    title: 'Manufacturing Quality',
    description: 'Testing if defect rate exceeds acceptable limits',
    context: 'A factory monitors defect rates, with acceptable performance at 2% defects or lower.',
    nullHypothesis: 'Process is acceptable (μ ≤ 2%)',
    alternativeHypothesis: 'Defect rate too high (μ > 2%)',
    populationMean: 0.035, // Actually 3.5% defects
    populationStd: 0.01,
    testType: 'right-tailed',
    realEffect: true,
    icon: '⚙️'
  }
];

const SigmundHypothesisArena: React.FC<SigmundHypothesisArenaProps> = ({
  onComplete,
  onProgress,
  isPreview = false
}) => {
  const [selectedScenario, setSelectedScenario] = useState<string>('black-swan');
  const [sampleSize, setSampleSize] = useState([30]);
  const [significanceLevel, setSignificanceLevel] = useState([0.05]);
  const [testResults, setTestResults] = useState<{
    sampleMean: number;
    testStatistic: number;
    pValue: number;
    criticalValue: number;
    decision: 'reject' | 'fail-to-reject';
    errorType?: 'type-i' | 'type-ii' | 'correct';
  } | null>(null);
  const [simulationHistory, setSimulationHistory] = useState<Array<{
    decision: 'reject' | 'fail-to-reject';
    errorType: 'type-i' | 'type-ii' | 'correct';
  }>>([]);
  const [isRunning, setIsRunning] = useState(false);

  const scenario = SCENARIOS.find(s => s.id === selectedScenario)!;

  // Calculate critical values and test statistics
  const testCalculations = useMemo(() => {
    const alpha = significanceLevel[0];
    const n = sampleSize[0];
    const standardError = scenario.populationStd / Math.sqrt(n);
    
    let criticalValue: number;
    switch (scenario.testType) {
      case 'two-tailed':
        criticalValue = inverseNormalCDF(1 - alpha / 2);
        break;
      case 'left-tailed':
        criticalValue = inverseNormalCDF(alpha);
        break;
      case 'right-tailed':
        criticalValue = inverseNormalCDF(1 - alpha);
        break;
      default: {
        const _exhaustive: never = scenario.testType;
        throw new Error(`Unexpected test type: ${_exhaustive}`);
      }
    }
    
    return {
      standardError,
      criticalValue,
      alpha
    };
  }, [scenario, sampleSize, significanceLevel]);

  const runHypothesisTest = useCallback(() => {
    setIsRunning(true);
    
    // Simulate taking a sample
    const n = sampleSize[0];
    let sampleMean = 0;
    
    // Generate sample based on true population parameters
    for (let i = 0; i < n; i++) {
      const randomValue = scenario.populationMean + scenario.populationStd * (Math.random() - 0.5) * 2 * Math.sqrt(3);
      sampleMean += randomValue;
    }
    sampleMean /= n;
    
    // Calculate test statistic (assuming we're testing against null hypothesis mean)
    const nullMean = scenario.id === 'black-swan' ? 0 : 
                    scenario.id === 'drug-trial' ? 10 :
                    scenario.id === 'coin-fairness' ? 0.5 : 0.02;
    
    const testStatistic = (sampleMean - nullMean) / testCalculations.standardError;
    
    // Calculate p-value (simplified)
    let pValue: number;
    const absTestStat = Math.abs(testStatistic);
    
    switch (scenario.testType) {
      case 'two-tailed':
        pValue = 2 * (1 - normalCDF(absTestStat));
        break;
      case 'left-tailed':
        pValue = normalCDF(testStatistic);
        break;
      case 'right-tailed':
        pValue = 1 - normalCDF(testStatistic);
        break;
    }
    
    // Make decision
    const decision: 'reject' | 'fail-to-reject' = pValue < testCalculations.alpha ? 'reject' : 'fail-to-reject';
    
    // Determine error type
    let errorType: 'type-i' | 'type-ii' | 'correct';
    if (scenario.realEffect) {
      // H1 is actually true
      errorType = decision === 'reject' ? 'correct' : 'type-ii';
    } else {
      // H0 is actually true
      errorType = decision === 'reject' ? 'type-i' : 'correct';
    }
    
    const results = {
      sampleMean,
      testStatistic,
      pValue,
      criticalValue: testCalculations.criticalValue,
      decision,
      errorType
    };
    
    setTimeout(() => {
      setTestResults(results);
      setSimulationHistory(prev => [...prev, { decision, errorType }]);
      setIsRunning(false);
      
      if (onProgress) {
        onProgress(Math.min(simulationHistory.length / 20, 1));
      }
    }, 1500);
  }, [scenario, sampleSize, significanceLevel, testCalculations, simulationHistory.length, onProgress]);

  const getDecisionInterpretation = () => {
    if (!testResults) return '';
    
    const { decision, errorType } = testResults;
    
    if (decision === 'reject') {
      if (errorType === 'correct') {
        return "🎯 Correct Decision: We rejected the null hypothesis, and it was indeed false. Well done!";
      } else {
        return "⚠️ Type I Error: We rejected a true null hypothesis (false positive). This happens α% of the time.";
      }
    } else {
      if (errorType === 'correct') {
        return "✅ Correct Decision: We failed to reject the null hypothesis, and it was indeed true.";
      } else {
        return "❌ Type II Error: We failed to reject a false null hypothesis (false negative). We missed a real effect!";
      }
    }
  };

  const simulationStats = useMemo(() => {
    if (simulationHistory.length === 0) return null;
    
    const typeI = simulationHistory.filter(h => h.errorType === 'type-i').length;
    const typeII = simulationHistory.filter(h => h.errorType === 'type-ii').length;
    const correct = simulationHistory.filter(h => h.errorType === 'correct').length;
    const total = simulationHistory.length;
    
    return {
      typeIRate: typeI / total,
      typeIIRate: typeII / total,
      correctRate: correct / total,
      total
    };
  }, [simulationHistory]);

  return (
    <div className="max-w-5xl mx-auto p-4 bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white/90 mb-2">
          👁️ Sigmund's Hypothesis Testing Arena 👁️
        </h2>
        <p className="text-white/55">
          Welcome to the elegant world of statistical hypothesis testing. Let us distinguish meaningful signals from mere noise with mathematical grace.
        </p>
      </div>

      {/* Scenario Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🦢 Choose Your Investigation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedScenario} onValueChange={setSelectedScenario}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SCENARIOS.map((scenario) => (
                <div key={scenario.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={scenario.id} id={scenario.id} />
                  <Label htmlFor={scenario.id} className="flex-1">
                    <div className="p-3 border rounded-lg cursor-pointer hover:bg-white/[0.03]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{scenario.icon}</span>
                        <h4 className="font-semibold">{scenario.title}</h4>
                      </div>
                      <p className="text-sm text-white/55">{scenario.description}</p>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ⚖️ Test Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-lg">
              <h4 className="font-semibold text-white/90 mb-2">Current Investigation:</h4>
              <p className="text-sm text-white/70 mb-3">{scenario.context}</p>
              <div className="space-y-2 text-sm">
                <div><strong>H₀:</strong> {scenario.nullHypothesis}</div>
                <div><strong>H₁:</strong> {scenario.alternativeHypothesis}</div>
                <div><strong>Test Type:</strong> {scenario.testType.replace('-', ' ')}</div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">
                Sample Size (n): {sampleSize[0]}
              </label>
              <Slider
                value={sampleSize}
                onValueChange={setSampleSize}
                min={10}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">
                Significance Level (α): {significanceLevel[0].toFixed(3)}
              </label>
              <Slider
                value={significanceLevel}
                onValueChange={setSignificanceLevel}
                min={0.01}
                max={0.10}
                step={0.01}
                className="w-full"
              />
            </div>

            <div className="p-3 bg-white/[0.03] rounded-lg text-sm">
              <h5 className="font-medium text-white/90 mb-1">Test Parameters:</h5>
              <div>Standard Error: {testCalculations.standardError.toFixed(4)}</div>
              <div>Critical Value: ±{Math.abs(testCalculations.criticalValue).toFixed(3)}</div>
              <div>Significance Level: {(testCalculations.alpha * 100).toFixed(1)}%</div>
            </div>

            <Button
              onClick={runHypothesisTest}
              disabled={isRunning}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
            >
              {isRunning ? "🔍 Investigating..." : "🧪 Conduct Hypothesis Test"}
            </Button>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📊 Test Results & Decision
            </CardTitle>
          </CardHeader>
          <CardContent>
            {testResults ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-white/[0.03] rounded-lg">
                    <div className="font-medium text-white/70">Sample Mean</div>
                    <div className="text-lg font-mono">{testResults.sampleMean.toFixed(4)}</div>
                  </div>
                  <div className="p-3 bg-white/[0.03] rounded-lg">
                    <div className="font-medium text-white/70">Test Statistic</div>
                    <div className="text-lg font-mono">{testResults.testStatistic.toFixed(3)}</div>
                  </div>
                  <div className="p-3 bg-white/[0.03] rounded-lg">
                    <div className="font-medium text-white/70">p-value</div>
                    <div className="text-lg font-mono">{testResults.pValue.toFixed(4)}</div>
                  </div>
                  <div className="p-3 bg-white/[0.03] rounded-lg">
                    <div className="font-medium text-white/70">Decision</div>
                    <Badge variant={testResults.decision === 'reject' ? 'destructive' : 'secondary'}>
                      {testResults.decision === 'reject' ? 'Reject H₀' : 'Fail to Reject H₀'}
                    </Badge>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-white/90 mb-2">Statistical Decision:</h4>
                  <div className="text-sm">
                    {testResults.pValue < testCalculations.alpha ? (
                      <span className="text-red-600">
                        Since p-value ({testResults.pValue.toFixed(4)}) &lt; α ({testCalculations.alpha}), we <strong>reject the null hypothesis</strong>.
                      </span>
                    ) : (
                      <span className="text-blue-600">
                        Since p-value ({testResults.pValue.toFixed(4)}) ≥ α ({testCalculations.alpha}), we <strong>fail to reject the null hypothesis</strong>.
                      </span>
                    )}
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${
                  testResults.errorType === 'correct' ? 'bg-green-100 border-green-300' :
                  testResults.errorType === 'type-i' ? 'bg-red-100 border-red-300' :
                  'bg-yellow-100 border-yellow-300'
                }`}>
                  <h4 className="font-semibold text-white/90 mb-2">Reality Check:</h4>
                  <div className="text-sm">{getDecisionInterpretation()}</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-white/45">
                <div className="text-4xl mb-4">🦢</div>
                <p>Conduct a hypothesis test to see the elegant dance between evidence and decision.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Simulation History */}
      {simulationStats && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📈 Long-Run Performance ({simulationStats.total} tests)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="p-4 bg-green-100 rounded-lg text-center">
                <div className="text-2xl font-bold text-emerald-300/90">
                  {(simulationStats.correctRate * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-green-600">Correct Decisions</div>
              </div>
              <div className="p-4 bg-red-100 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-700">
                  {(simulationStats.typeIRate * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-red-600">Type I Errors</div>
              </div>
              <div className="p-4 bg-yellow-100 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-700">
                  {(simulationStats.typeIIRate * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-yellow-600">Type II Errors</div>
              </div>
            </div>
            
            <div className="text-sm text-white/55">
              <p className="mb-2">
                <strong>Observe:</strong> Type I error rate should approach α = {(testCalculations.alpha * 100).toFixed(1)}% in the long run when H₀ is true.
              </p>
              <p>
                Type II error rate depends on the true effect size, sample size, and significance level. Larger samples reduce Type II errors.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sigmund's Insights */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🦢 Sigmund's Elegant Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-teal-100 to-cyan-100 p-4 rounded-lg">
            <p className="text-white/70 mb-3">
              <strong>The Black Swan Principle:</strong> Hypothesis testing embodies elegant statistical logic - we assume the status quo (null hypothesis) until evidence is strong enough to suggest otherwise. Like the discovery of black swans challenged the belief that "all swans are white," hypothesis testing helps us identify when our assumptions need updating.
            </p>
            <p className="text-white/70">
              Remember: We never "prove" the alternative hypothesis - we simply reject or fail to reject the null. This maintains proper statistical humility while providing a framework for principled decision-making under uncertainty.
            </p>
          </div>
        </CardContent>
      </Card>

      {!isPreview && simulationHistory.length >= 10 && (
        <div className="text-center mt-6">
          <Button
            onClick={onComplete}
            className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700"
          >
            🎯 Investigation Complete! 🎯
          </Button>
        </div>
      )}
    </div>
  );
};

export default SigmundHypothesisArena;