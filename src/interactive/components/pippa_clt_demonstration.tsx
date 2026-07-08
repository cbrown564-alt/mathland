import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Slider } from '@/core/components/ui/slider';
import { Badge } from '@/core/components/ui/badge';

interface CLTDemonstrationProps {
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  isPreview?: boolean;
}

interface DistributionParams {
  type: 'uniform' | 'exponential' | 'binomial' | 'skewed' | 'bimodal' | 'custom';
  param1: number;
  param2: number;
}

interface SampleData {
  originalSamples: number[];
  sampleMeans: number[];
  populationMean: number;
  populationStd: number;
  theoreticalStdError: number;
  actualStdError: number;
}

const CLTDemonstration: React.FC<CLTDemonstrationProps> = ({ 
  onComplete, 
  onProgress, 
  isPreview = false 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const histogramRef = useRef<HTMLCanvasElement>(null);
  
  // Distribution parameters
  const [distribution, setDistribution] = useState<DistributionParams>({
    type: 'uniform',
    param1: 0,
    param2: 10
  });
  
  // Sampling parameters
  const [sampleSize, setSampleSize] = useState(30);
  const [numSamples, setNumSamples] = useState(1000);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(50);
  
  // Visualization options
  const [showOriginalDist, setShowOriginalDist] = useState(true);
  const [showSampleMeans, setShowSampleMeans] = useState(true);
  const [showNormalOverlay, setShowNormalOverlay] = useState(true);
  const [showStatistics, setShowStatistics] = useState(true);
  
  // Data state
  const [sampleData, setSampleData] = useState<SampleData | null>(null);
  const [currentSample, setCurrentSample] = useState(0);
  const [accumulatedMeans, setAccumulatedMeans] = useState<number[]>([]);
  
  // Progress tracking
  const [progress, setProgress] = useState(0);
  const [demonstrationsRun, setDemonstrationsRun] = useState<Set<string>>(new Set());

  const canvasWidth = 500;
  const canvasHeight = 300;
  const histogramWidth = 500;
  const histogramHeight = 200;

  // Generate random samples from different distributions
  const generateSample = useCallback((dist: DistributionParams): number => {
    switch (dist.type) {
      case 'uniform':
        return Math.random() * (dist.param2 - dist.param1) + dist.param1;
        
      case 'exponential':
        return -Math.log(Math.random()) / dist.param1;
        
      case 'binomial': {
        let successes = 0;
        for (let i = 0; i < dist.param1; i++) {
          if (Math.random() < dist.param2) successes++;
        }
        return successes;
      }
      
      case 'skewed': {
        // Right-skewed using exponential transformation
        const u = Math.random();
        return Math.pow(u, 1/3) * dist.param1;
      }
        
      case 'bimodal':
        // Two peaks
        if (Math.random() < 0.5) {
          return Math.random() * dist.param1;
        } else {
          return Math.random() * dist.param1 + dist.param2;
        }
        
      default:
        return Math.random() * 10;
    }
  }, []);

  // Calculate theoretical parameters for distributions
  const getDistributionStats = useCallback((dist: DistributionParams): { mean: number; std: number } => {
    switch (dist.type) {
      case 'uniform':
        return {
          mean: (dist.param1 + dist.param2) / 2,
          std: Math.sqrt((dist.param2 - dist.param1) ** 2 / 12)
        };
        
      case 'exponential':
        return {
          mean: 1 / dist.param1,
          std: 1 / dist.param1
        };
        
      case 'binomial':
        return {
          mean: dist.param1 * dist.param2,
          std: Math.sqrt(dist.param1 * dist.param2 * (1 - dist.param2))
        };
        
      case 'skewed':
        return {
          mean: dist.param1 * 0.75,
          std: dist.param1 * 0.3
        };
        
      case 'bimodal':
        return {
          mean: (dist.param1 / 2 + (dist.param1 + dist.param2) / 2) / 2,
          std: Math.sqrt(dist.param1 * dist.param1 / 12 + dist.param2 * dist.param2 / 4)
        };
        
      default:
        return { mean: 5, std: 2 };
    }
  }, []);

  // Run CLT simulation
  const runSimulation = useCallback(() => {
    const originalSamples: number[] = [];
    const sampleMeans: number[] = [];
    
    // Generate samples and calculate means
    for (let i = 0; i < numSamples; i++) {
      const sample: number[] = [];
      for (let j = 0; j < sampleSize; j++) {
        const value = generateSample(distribution);
        sample.push(value);
        if (i === 0) originalSamples.push(value); // Store first sample for original distribution
      }
      const mean = sample.reduce((sum, val) => sum + val, 0) / sample.length;
      sampleMeans.push(mean);
    }
    
    const stats = getDistributionStats(distribution);
    const actualMean = sampleMeans.reduce((sum, val) => sum + val, 0) / sampleMeans.length;
    const actualVariance = sampleMeans.reduce((sum, val) => sum + (val - actualMean) ** 2, 0) / (sampleMeans.length - 1);
    const actualStdError = Math.sqrt(actualVariance);
    const theoreticalStdError = stats.std / Math.sqrt(sampleSize);
    
    setSampleData({
      originalSamples,
      sampleMeans,
      populationMean: stats.mean,
      populationStd: stats.std,
      theoreticalStdError,
      actualStdError
    });
    
    setAccumulatedMeans([]);
    setCurrentSample(0);
  }, [distribution, sampleSize, numSamples, generateSample, getDistributionStats]);

  // Animated simulation
  const animateSimulation = useCallback(() => {
    if (!sampleData || isAnimating) return;
    
    setIsAnimating(true);
    setAccumulatedMeans([]);
    
    let frame = 0;
    const interval = setInterval(() => {
      if (frame < sampleData.sampleMeans.length) {
        setAccumulatedMeans(prev => [...prev, sampleData.sampleMeans[frame]]);
        setCurrentSample(frame + 1);
        frame++;
      } else {
        setIsAnimating(false);
        clearInterval(interval);
      }
    }, Math.max(10, 101 - animationSpeed));
    
    return () => clearInterval(interval);
  }, [sampleData, animationSpeed, isAnimating]);

  // Drawing functions
  const drawOriginalDistribution = (ctx: CanvasRenderingContext2D) => {
    if (!showOriginalDist || !sampleData) return;
    
    ctx.fillStyle = '#3B82F6';
    ctx.globalAlpha = 0.7;
    
    // Create histogram of original samples
    const data = sampleData.originalSamples;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const bins = 30;
    const binWidth = (max - min) / bins;
    const counts = new Array(bins).fill(0);
    
    data.forEach(value => {
      const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
      counts[binIndex]++;
    });
    
    const maxCount = Math.max(...counts);
    const barWidth = canvasWidth / bins;
    const maxHeight = canvasHeight * 0.8;
    
    counts.forEach((count, index) => {
      const height = (count / maxCount) * maxHeight;
      const x = index * barWidth;
      const y = canvasHeight - height;
      
      ctx.fillRect(x, y, barWidth - 1, height);
    });
    
    ctx.globalAlpha = 1.0;
  };

  const drawSampleMeansDistribution = (ctx: CanvasRenderingContext2D) => {
    if (!showSampleMeans || !sampleData) return;
    
    const data = accumulatedMeans.length > 0 ? accumulatedMeans : sampleData.sampleMeans;
    if (data.length === 0) return;
    
    ctx.fillStyle = '#059669';
    ctx.globalAlpha = 0.7;
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const bins = 50;
    const binWidth = (max - min) / bins;
    const counts = new Array(bins).fill(0);
    
    data.forEach(value => {
      const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
      counts[binIndex]++;
    });
    
    const maxCount = Math.max(...counts);
    const barWidth = histogramWidth / bins;
    const maxHeight = histogramHeight * 0.8;
    
    counts.forEach((count, index) => {
      const height = (count / maxCount) * maxHeight;
      const x = index * barWidth;
      const y = histogramHeight - height;
      
      ctx.fillRect(x, y, barWidth - 1, height);
    });
    
    ctx.globalAlpha = 1.0;
  };

  const drawNormalOverlay = (ctx: CanvasRenderingContext2D) => {
    if (!showNormalOverlay || !sampleData) return;
    
    const data = accumulatedMeans.length > 0 ? accumulatedMeans : sampleData.sampleMeans;
    if (data.length === 0) return;
    
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.8;
    
    const mean = sampleData.populationMean;
    const stdError = sampleData.theoreticalStdError;
    const min = Math.min(...data);
    const max = Math.max(...data);
    
    // Draw normal curve
    ctx.beginPath();
    for (let i = 0; i <= histogramWidth; i++) {
      const x = min + (max - min) * (i / histogramWidth);
      const normalValue = Math.exp(-0.5 * Math.pow((x - mean) / stdError, 2)) / (stdError * Math.sqrt(2 * Math.PI));
      
      // Scale to match histogram
      const scaledHeight = normalValue * data.length * (max - min) / 50 * histogramHeight * 0.8;
      const y = histogramHeight - scaledHeight;
      
      if (i === 0) {
        ctx.moveTo(i, y);
      } else {
        ctx.lineTo(i, y);
      }
    }
    ctx.stroke();
    
    ctx.globalAlpha = 1.0;
  };

  const drawStatistics = (ctx: CanvasRenderingContext2D) => {
    if (!showStatistics || !sampleData) return;
    
    ctx.fillStyle = '#1F2937';
    ctx.font = '14px Inter, sans-serif';
    
    const stats = [
      `Sample Size: n = ${sampleSize}`,
      `Number of Samples: ${currentSample}/${numSamples}`,
      `Population Mean: μ = ${sampleData.populationMean.toFixed(3)}`,
      `Population Std: σ = ${sampleData.populationStd.toFixed(3)}`,
      `Theoretical SE: σ/√n = ${sampleData.theoreticalStdError.toFixed(3)}`,
      `Actual SE: ${sampleData.actualStdError.toFixed(3)}`
    ];
    
    stats.forEach((stat, index) => {
      ctx.fillText(stat, 10, 20 + index * 20);
    });
  };

  // Main drawing function for original distribution
  const drawOriginal = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Title
    ctx.fillStyle = '#1F2937';
    ctx.font = '16px Inter, sans-serif';
    ctx.fillText('Original Distribution', 10, 20);
    
    drawOriginalDistribution(ctx);
  }, [sampleData, showOriginalDist]);

  // Main drawing function for sample means
  const drawHistogram = useCallback(() => {
    const canvas = histogramRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, histogramWidth, histogramHeight);
    
    drawSampleMeansDistribution(ctx);
    drawNormalOverlay(ctx);
    drawStatistics(ctx);
  }, [sampleData, accumulatedMeans, currentSample, showSampleMeans, showNormalOverlay, showStatistics, sampleSize, numSamples]);

  // Redraw when dependencies change
  useEffect(() => {
    drawOriginal();
  }, [drawOriginal]);

  useEffect(() => {
    drawHistogram();
  }, [drawHistogram]);

  // Run initial simulation
  useEffect(() => {
    runSimulation();
  }, [runSimulation]);

  // Progress tracking
  useEffect(() => {
    const demoKey = `${distribution.type}-${sampleSize}-${numSamples}`;
    setDemonstrationsRun(prev => new Set([...prev, demoKey]));
    
    const newProgress = Math.min(100, demonstrationsRun.size * 8);
    setProgress(newProgress);
    onProgress?.(newProgress);
  }, [distribution.type, sampleSize, numSamples, demonstrationsRun.size, onProgress]);

  const resetDemo = () => {
    setDemonstrationsRun(new Set());
    setAccumulatedMeans([]);
    setCurrentSample(0);
    runSimulation();
  };

  const distributionPresets = [
    { name: 'Uniform', type: 'uniform' as const, param1: 0, param2: 10 },
    { name: 'Exponential', type: 'exponential' as const, param1: 0.5, param2: 0 },
    { name: 'Binomial', type: 'binomial' as const, param1: 20, param2: 0.3 },
    { name: 'Right Skewed', type: 'skewed' as const, param1: 8, param2: 0 },
    { name: 'Bimodal', type: 'bimodal' as const, param1: 4, param2: 8 },
    { name: 'Extreme Skew', type: 'skewed' as const, param1: 15, param2: 0 }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="border-2 border-pink-400/30 bg-gradient-to-r from-white/[0.06] to-white/[0.02] border border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-pink-800 flex items-center gap-2">
            🎭 Pippa's Central Limit Theorem Magic Show
          </CardTitle>
          <p className="text-pink-700">
            Witness the most magical theorem in probability! No matter what distribution you start with, sample means always become bell-shaped!
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Magic Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Distribution Type */}
            <div className="space-y-3">
              <h4 className="font-medium text-white/70">Population Distribution</h4>
              <div className="grid grid-cols-2 gap-2">
                {(['uniform', 'exponential', 'binomial', 'skewed'] as const).map((type) => (
                  <Button
                    key={type}
                    variant={distribution.type === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDistribution({ ...distribution, type })}
                    className={distribution.type === type ? 'bg-pink-600 hover:bg-pink-700' : ''}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Distribution Parameters */}
            {distribution.type === 'uniform' && (
              <div className="space-y-4">
                <h4 className="font-medium text-white/70">Uniform Parameters</h4>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-pink-700">Min: {distribution.param1.toFixed(1)}</label>
                  <Slider
                    value={[distribution.param1]}
                    onValueChange={(value) => setDistribution({ ...distribution, param1: value[0] })}
                    min={-5}
                    max={5}
                    step={0.1}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-pink-700">Max: {distribution.param2.toFixed(1)}</label>
                  <Slider
                    value={[distribution.param2]}
                    onValueChange={(value) => setDistribution({ ...distribution, param2: value[0] })}
                    min={5}
                    max={15}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {distribution.type === 'exponential' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-pink-700">Rate λ: {distribution.param1.toFixed(2)}</label>
                <Slider
                  value={[distribution.param1]}
                  onValueChange={(value) => setDistribution({ ...distribution, param1: value[0] })}
                  min={0.1}
                  max={2.0}
                  step={0.1}
                  className="w-full"
                />
              </div>
            )}

            {distribution.type === 'binomial' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-pink-700">Trials n: {distribution.param1}</label>
                  <Slider
                    value={[distribution.param1]}
                    onValueChange={(value) => setDistribution({ ...distribution, param1: value[0] })}
                    min={5}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-pink-700">Probability p: {distribution.param2.toFixed(2)}</label>
                  <Slider
                    value={[distribution.param2]}
                    onValueChange={(value) => setDistribution({ ...distribution, param2: value[0] })}
                    min={0.1}
                    max={0.9}
                    step={0.05}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {distribution.type === 'skewed' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-pink-700">Scale: {distribution.param1.toFixed(1)}</label>
                <Slider
                  value={[distribution.param1]}
                  onValueChange={(value) => setDistribution({ ...distribution, param1: value[0] })}
                  min={2}
                  max={20}
                  step={0.5}
                  className="w-full"
                />
              </div>
            )}

            {/* Sampling Parameters */}
            <div className="space-y-4">
              <h4 className="font-medium text-white/70">Sampling Parameters</h4>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-pink-700">Sample Size n: {sampleSize}</label>
                <Slider
                  value={[sampleSize]}
                  onValueChange={(value) => setSampleSize(value[0])}
                  min={1}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-pink-700">Number of Samples: {numSamples}</label>
                <Slider
                  value={[numSamples]}
                  onValueChange={(value) => setNumSamples(value[0])}
                  min={100}
                  max={5000}
                  step={100}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-pink-700">Animation Speed: {animationSpeed}</label>
                <Slider
                  value={[animationSpeed]}
                  onValueChange={(value) => setAnimationSpeed(value[0])}
                  min={1}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Display Options */}
            <div className="space-y-3">
              <h4 className="font-medium text-white/70">Display Options</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showOriginalDist}
                    onChange={(e) => setShowOriginalDist(e.target.checked)}
                    className="rounded border-white/10 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="text-sm">Show Original Distribution</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showSampleMeans}
                    onChange={(e) => setShowSampleMeans(e.target.checked)}
                    className="rounded border-white/10 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="text-sm">Show Sample Means</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showNormalOverlay}
                    onChange={(e) => setShowNormalOverlay(e.target.checked)}
                    className="rounded border-white/10 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="text-sm">Show Normal Overlay</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showStatistics}
                    onChange={(e) => setShowStatistics(e.target.checked)}
                    className="rounded border-white/10 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="text-sm">Show Statistics</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                onClick={animateSimulation}
                variant="outline"
                className="w-full"
                disabled={isAnimating || !sampleData}
              >
                {isAnimating ? 'Animating Magic...' : 'Animate CLT Magic'}
              </Button>
              <Button
                onClick={runSimulation}
                variant="outline"
                className="w-full"
              >
                New Simulation
              </Button>
              <Button
                onClick={resetDemo}
                variant="outline"
                className="w-full"
              >
                Reset Demo
              </Button>
              <Button
                onClick={onComplete}
                className="w-full bg-pink-600 hover:bg-pink-700"
                disabled={progress < 50}
              >
                Complete Magic Show
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Visualizations */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Central Limit Theorem in Action</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Original Distribution */}
            <div>
              <h4 className="font-medium text-white/70 mb-2">Population Distribution</h4>
              <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                aria-label="Pippa population distribution visualization"
                className="w-full h-auto border border-white/10 rounded-lg"
              />
            </div>
            
            {/* Sample Means Distribution */}
            <div>
              <h4 className="font-medium text-white/70 mb-2">Distribution of Sample Means</h4>
              <canvas
                ref={histogramRef}
                width={histogramWidth}
                height={histogramHeight}
                aria-label="Pippa sample means distribution visualization"
                className="w-full h-auto border border-white/10 rounded-lg"
              />
            </div>
            
            {isAnimating && (
              <div className="text-center">
                <p className="text-pink-700 font-medium">
                  Collecting sample {currentSample} of {numSamples}...
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-pink-600 h-2 rounded-full transition-all duration-100"
                    style={{ width: `${(currentSample / numSamples) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Distribution Presets */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Distribution Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {distributionPresets.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                onClick={() => {
                  setDistribution({
                    type: preset.type,
                    param1: preset.param1,
                    param2: preset.param2
                  });
                }}
                className="text-sm"
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CLT Analysis */}
      {sampleData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Central Limit Theorem Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-white/70">Population Parameters</h4>
                <div className="text-sm space-y-1">
                  <p>Mean μ = {sampleData.populationMean.toFixed(3)}</p>
                  <p>Std σ = {sampleData.populationStd.toFixed(3)}</p>
                  <p>Distribution: {distribution.type}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-white/70">Sample Mean Distribution</h4>
                <div className="text-sm space-y-1">
                  <p>Expected Mean: μ = {sampleData.populationMean.toFixed(3)}</p>
                  <p>Theoretical SE: σ/√n = {sampleData.theoreticalStdError.toFixed(3)}</p>
                  <p>Actual SE: {sampleData.actualStdError.toFixed(3)}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-white/70">CLT Verification</h4>
                <div className="text-sm space-y-1">
                  <p>Sample Size: n = {sampleSize}</p>
                  <p>CLT Applicable: {sampleSize >= 30 ? '✓ Yes' : '⚠ Marginal'}</p>
                  <p>Normality: {showNormalOverlay ? '✓ Visible' : 'Hidden'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Indicator */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-pink-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <Badge variant="outline" className="text-pink-700">
              {demonstrationsRun.size} distributions explored
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CLTDemonstration;