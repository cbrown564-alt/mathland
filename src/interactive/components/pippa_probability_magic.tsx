import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Slider } from '@/core/components/ui/slider';
import { Badge } from '@/core/components/ui/badge';

interface PippaProbabilityMagicProps {
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  isPreview?: boolean;
}

type DistributionType = 'bernoulli' | 'binomial' | 'poisson';

interface MagicTrick {
  id: DistributionType;
  name: string;
  description: string;
  icon: string;
  color: string;
}

const MAGIC_TRICKS: MagicTrick[] = [
  {
    id: 'bernoulli',
    name: "Coin Flip Magic",
    description: "Simple success or failure - the classic!",
    icon: "🪙",
    color: "bg-pink-100 border-pink-300"
  },
  {
    id: 'binomial',
    name: "Success Counter Spell",
    description: "Count successes in multiple trials",
    icon: "🎯",
    color: "bg-rose-100 border-rose-300"
  },
  {
    id: 'poisson',
    name: "Rare Event Surprise",
    description: "Predict magical surprises!",
    icon: "⭐",
    color: "bg-purple-100 border-purple-300"
  }
];

// Mathematical functions
const factorial = (n: number): number => {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
};

const combination = (n: number, k: number): number => {
  if (k > n || k < 0) return 0;
  return factorial(n) / (factorial(k) * factorial(n - k));
};

const bernoulliProbability = (k: number, p: number): number => {
  return k === 1 ? p : (k === 0 ? 1 - p : 0);
};

const binomialProbability = (k: number, n: number, p: number): number => {
  if (k < 0 || k > n) return 0;
  return combination(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
};

const poissonProbability = (k: number, lambda: number): number => {
  if (k < 0) return 0;
  return (Math.pow(Math.E, -lambda) * Math.pow(lambda, k)) / factorial(k);
};

const PippaProbabilityMagic: React.FC<PippaProbabilityMagicProps> = ({
  onComplete,
  onProgress,
  isPreview = false
}) => {
  const [selectedTrick, setSelectedTrick] = useState<DistributionType>('bernoulli');
  const [bernoulliP, setBernoulliP] = useState([0.5]);
  const [binomialN, setBinomialN] = useState([10]);
  const [binomialP, setBinomialP] = useState([0.3]);
  const [poissonLambda, setPoissonLambda] = useState([2]);
  const [simulationResults, setSimulationResults] = useState<number[]>([]);
  const [isPerforming, setIsPerforming] = useState(false);

  // Calculate probabilities for current distribution
  const probabilities = useMemo(() => {
    const probs: { k: number; prob: number; label: string }[] = [];
    
    switch (selectedTrick) {
      case 'bernoulli':
        probs.push(
          { k: 0, prob: bernoulliProbability(0, bernoulliP[0]), label: 'Failure' },
          { k: 1, prob: bernoulliProbability(1, bernoulliP[0]), label: 'Success' }
        );
        break;
      case 'binomial':
        for (let k = 0; k <= binomialN[0]; k++) {
          const prob = binomialProbability(k, binomialN[0], binomialP[0]);
          probs.push({ k, prob, label: `${k} successes` });
        }
        break;
      case 'poisson':
        for (let k = 0; k <= Math.min(15, Math.ceil(poissonLambda[0] * 3)); k++) {
          const prob = poissonProbability(k, poissonLambda[0]);
          if (prob > 0.001) { // Only show probabilities > 0.1%
            probs.push({ k, prob, label: `${k} events` });
          }
        }
        break;
    }
    
    return probs;
  }, [selectedTrick, bernoulliP, binomialN, binomialP, poissonLambda]);

  const performMagicTrick = useCallback(() => {
    setIsPerforming(true);
    const results: number[] = [];
    
    // Simulate 100 experiments
    for (let i = 0; i < 100; i++) {
      let result = 0;
      
      switch (selectedTrick) {
        case 'bernoulli':
          result = Math.random() < bernoulliP[0] ? 1 : 0;
          break;
        case 'binomial':
          for (let trial = 0; trial < binomialN[0]; trial++) {
            if (Math.random() < binomialP[0]) result++;
          }
          break;
        case 'poisson': {
          // Generate Poisson using inverse transform sampling
          const L = Math.exp(-poissonLambda[0]);
          let p = 1;
          let k = 0;
          do {
            k++;
            p *= Math.random();
          } while (p > L);
          result = k - 1;
          break;
        }
      }
      
      results.push(result);
    }
    
    setTimeout(() => {
      setSimulationResults(results);
      setIsPerforming(false);
      
      if (onProgress) {
        const currentProgress = Math.min(results.length / 100, 1);
        onProgress(currentProgress);
      }
    }, 1500); // Magic performance time
  }, [selectedTrick, bernoulliP, binomialP, binomialN, poissonLambda, onProgress]);

  const getParameterControls = () => {
    switch (selectedTrick) {
      case 'bernoulli':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Success Probability (p): {bernoulliP[0].toFixed(2)}
              </label>
              <Slider
                value={bernoulliP}
                onValueChange={setBernoulliP}
                min={0.01}
                max={0.99}
                step={0.01}
                className="w-full"
              />
            </div>
          </div>
        );
      case 'binomial':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Number of Trials (n): {binomialN[0]}
              </label>
              <Slider
                value={binomialN}
                onValueChange={setBinomialN}
                min={1}
                max={20}
                step={1}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Success Probability (p): {binomialP[0].toFixed(2)}
              </label>
              <Slider
                value={binomialP}
                onValueChange={setBinomialP}
                min={0.01}
                max={0.99}
                step={0.01}
                className="w-full"
              />
            </div>
          </div>
        );
      case 'poisson':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Average Rate (λ): {poissonLambda[0].toFixed(1)}
              </label>
              <Slider
                value={poissonLambda}
                onValueChange={setPoissonLambda}
                min={0.1}
                max={8}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>
        );
    }
  };

  const getExpectedValue = () => {
    switch (selectedTrick) {
      case 'bernoulli':
        return bernoulliP[0];
      case 'binomial':
        return binomialN[0] * binomialP[0];
      case 'poisson':
        return poissonLambda[0];
    }
  };

  const getVariance = () => {
    switch (selectedTrick) {
      case 'bernoulli':
        return bernoulliP[0] * (1 - bernoulliP[0]);
      case 'binomial':
        return binomialN[0] * binomialP[0] * (1 - binomialP[0]);
      case 'poisson':
        return poissonLambda[0];
    }
  };

  // Calculate empirical statistics from simulation
  const empiricalStats = useMemo(() => {
    if (simulationResults.length === 0) return null;
    
    const mean = simulationResults.reduce((sum, val) => sum + val, 0) / simulationResults.length;
    const variance = simulationResults.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / simulationResults.length;
    
    // Count frequencies
    const counts: Record<number, number> = {};
    simulationResults.forEach(result => {
      counts[result] = (counts[result] || 0) + 1;
    });
    
    return { mean, variance, counts };
  }, [simulationResults]);

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🪄 Pippa's Probability Magic Show 🪄
        </h2>
        <p className="text-gray-600">
          Welcome to my magical distribution collection! Each trick demonstrates different probability patterns.
        </p>
      </div>

      {/* Magic Trick Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {MAGIC_TRICKS.map((trick) => (
          <Card
            key={trick.id}
            className={`cursor-pointer transition-all duration-200 ${
              selectedTrick === trick.id
                ? 'ring-2 ring-pink-400 shadow-lg'
                : 'hover:shadow-md'
            } ${trick.color}`}
            onClick={() => setSelectedTrick(trick.id)}
          >
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2">{trick.icon}</div>
              <h3 className="font-semibold text-gray-800">{trick.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{trick.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Parameter Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎛️ Magic Parameters
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getParameterControls()}
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Theoretical Properties:</h4>
              <div className="text-sm space-y-1">
                <div>Expected Value: <span className="font-mono">{getExpectedValue().toFixed(3)}</span></div>
                <div>Variance: <span className="font-mono">{getVariance().toFixed(3)}</span></div>
              </div>
            </div>

            <Button
              onClick={performMagicTrick}
              disabled={isPerforming}
              className="w-full mt-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              {isPerforming ? "🪄 Performing Magic..." : "✨ Perform Magic Trick!"}
            </Button>
          </CardContent>
        </Card>

        {/* Probability Visualization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📊 Magical Probabilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {probabilities.map(({ k, prob, label }) => (
                <div key={k} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{label}</span>
                    <span className="font-mono text-gray-600">{prob.toFixed(4)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-pink-400 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${prob * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {empiricalStats && (
              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">🎭 Magic Results (100 tricks):</h4>
                <div className="text-sm space-y-1">
                  <div>Empirical Mean: <span className="font-mono">{empiricalStats.mean.toFixed(3)}</span></div>
                  <div>Empirical Variance: <span className="font-mono">{empiricalStats.variance.toFixed(3)}</span></div>
                </div>
                
                <div className="mt-3">
                  <h5 className="font-medium text-gray-700 mb-2">Frequency of Results:</h5>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(empiricalStats.counts)
                      .sort(([a], [b]) => parseInt(a) - parseInt(b))
                      .map(([value, count]) => (
                        <Badge key={value} variant="secondary" className="text-xs">
                          {value}: {count}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Educational Insights */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎩 Pippa's Magical Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-4 rounded-lg">
            {selectedTrick === 'bernoulli' && (
              <p className="text-gray-700">
                <strong>Coin Flip Magic:</strong> This is my simplest trick! Bernoulli distribution models any situation with just two outcomes - success or failure, heads or tails, yes or no. The magic parameter p controls how likely success is. Notice how the expected value equals p, and the variance is maximized when p = 0.5 (fair coin)!
              </p>
            )}
            {selectedTrick === 'binomial' && (
              <p className="text-gray-700">
                <strong>Success Counter Spell:</strong> This magic counts successes in multiple independent trials! If I flip {binomialN[0]} coins, each with success probability {binomialP[0].toFixed(2)}, this distribution tells me how many successes to expect. The magic formula uses combinations C(n,k) to count all the ways to get exactly k successes!
              </p>
            )}
            {selectedTrick === 'poisson' && (
              <p className="text-gray-700">
                <strong>Rare Event Surprise:</strong> This is my most mysterious trick! Poisson distribution predicts rare events - like shooting stars per hour, or customers arriving at a magic shop. The parameter λ (lambda) is both the expected value AND the variance. When events are rare but happen at a steady average rate, this magic appears!
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {!isPreview && simulationResults.length > 0 && (
        <div className="text-center mt-6">
          <Button
            onClick={onComplete}
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
          >
            🌟 Magic Show Complete! 🌟
          </Button>
        </div>
      )}
    </div>
  );
};

export default PippaProbabilityMagic;