import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Slider } from '@/core/components/ui/slider';
import { Badge } from '@/core/components/ui/badge';

interface PCADimensionReducerProps {
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  isPreview?: boolean;
}

interface DataPoint {
  x: number;
  y: number;
  originalIndex: number;
}

interface PCAResult {
  principalComponents: { direction: [number, number], variance: number }[];
  projectedData: DataPoint[];
  totalVariance: number;
  explainedVariance: number[];
}

const PCADimensionReducer: React.FC<PCADimensionReducerProps> = ({ 
  onComplete, 
  onProgress, 
  isPreview = false 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Dataset parameters
  const [datasetType, setDatasetType] = useState<'ellipse' | 'diagonal' | 'cluster' | 'random'>('ellipse');
  const [numPoints, setNumPoints] = useState(100);
  const [noiseLevel, setNoiseLevel] = useState(0.1);
  const [dataSpread, setDataSpread] = useState(2);
  
  // PCA parameters
  const [numComponents, setNumComponents] = useState(2);
  const [showOriginalData, setShowOriginalData] = useState(true);
  const [showPrincipalComponents, setShowPrincipalComponents] = useState(true);
  const [showProjectedData, setShowProjectedData] = useState(false);
  const [showVarianceEllipse, setShowVarianceEllipse] = useState(true);
  
  // Analysis state
  const [currentData, setCurrentData] = useState<DataPoint[]>([]);
  const [pcaResult, setPcaResult] = useState<PCAResult | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Progress tracking
  const [progress, setProgress] = useState(0);
  const [analyzedDatasets, setAnalyzedDatasets] = useState<Set<string>>(new Set());

  const canvasWidth = 600;
  const canvasHeight = 400;
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;
  const scale = 80;

  // Generate different types of datasets
  const generateDataset = useCallback(() => {
    const points: DataPoint[] = [];
    const baseNoise = noiseLevel * 0.5;
    
    for (let i = 0; i < numPoints; i++) {
      let x: number, y: number;
      
      switch (datasetType) {
        case 'ellipse': {
          // Elliptical distribution with correlation
          const angle = (i / numPoints) * 2 * Math.PI;
          const radius = 1 + (Math.random() - 0.5) * 0.3;
          x = dataSpread * 1.5 * Math.cos(angle) * radius + (Math.random() - 0.5) * baseNoise;
          y = dataSpread * 0.8 * Math.sin(angle) * radius + (Math.random() - 0.5) * baseNoise;
          // Rotate by 30 degrees
          const cos30 = Math.cos(Math.PI / 6);
          const sin30 = Math.sin(Math.PI / 6);
          const rotX = x * cos30 - y * sin30;
          const rotY = x * sin30 + y * cos30;
          x = rotX;
          y = rotY;
          break;
        }
        
        case 'diagonal':
          // Diagonal correlation
          x = (Math.random() - 0.5) * dataSpread * 2;
          y = x * 0.8 + (Math.random() - 0.5) * baseNoise;
          break;
          
        case 'cluster': {
          // Two clusters
          const cluster = Math.random() < 0.5 ? 1 : -1;
          x = cluster * dataSpread * 0.8 + (Math.random() - 0.5) * baseNoise;
          y = cluster * dataSpread * 0.6 + (Math.random() - 0.5) * baseNoise;
          break;
        }
          
        case 'random':
          // Random uncorrelated data
          x = (Math.random() - 0.5) * dataSpread * 2;
          y = (Math.random() - 0.5) * dataSpread * 2;
          break;
      }
      
      points.push({ x, y, originalIndex: i });
    }
    
    return points;
  }, [datasetType, numPoints, noiseLevel, dataSpread]);

  // Compute PCA
  const computePCA = useCallback((data: DataPoint[]) => {
    if (data.length < 2) return null;
    
    // Center the data
    const meanX = data.reduce((sum, p) => sum + p.x, 0) / data.length;
    const meanY = data.reduce((sum, p) => sum + p.y, 0) / data.length;
    const centeredData = data.map(p => ({ x: p.x - meanX, y: p.y - meanY }));
    
    // Compute covariance matrix
    const cov11 = centeredData.reduce((sum, p) => sum + p.x * p.x, 0) / (data.length - 1);
    const cov12 = centeredData.reduce((sum, p) => sum + p.x * p.y, 0) / (data.length - 1);
    const cov21 = cov12; // Symmetric
    const cov22 = centeredData.reduce((sum, p) => sum + p.y * p.y, 0) / (data.length - 1);
    
    // Compute eigenvalues and eigenvectors
    const trace = cov11 + cov22;
    const determinant = cov11 * cov22 - cov12 * cov21;
    const discriminant = trace * trace - 4 * determinant;
    
    if (discriminant < 0) return null;
    
    const lambda1 = (trace + Math.sqrt(discriminant)) / 2;
    const lambda2 = (trace - Math.sqrt(discriminant)) / 2;
    
    // Compute eigenvectors
    const computeEigenvector = (lambda: number): [number, number] => {
      if (Math.abs(cov12) > 1e-10) {
        const v = [cov12, lambda - cov11];
        const length = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
        return [v[0] / length, v[1] / length];
      } else if (Math.abs(cov11 - lambda) < 1e-10) {
        return [0, 1];
      } else {
        return [1, 0];
      }
    };
    
    const eigenvector1 = computeEigenvector(lambda1);
    const eigenvector2 = computeEigenvector(lambda2);
    
    const principalComponents = [
      { direction: eigenvector1, variance: lambda1 },
      { direction: eigenvector2, variance: lambda2 }
    ];
    
    // Sort by variance (largest first)
    principalComponents.sort((a, b) => b.variance - a.variance);
    
    // Project data onto principal components
    const projectedData = data.map((point, index) => {
      const centered = { x: point.x - meanX, y: point.y - meanY };
      const projX = centered.x * principalComponents[0].direction[0] + centered.y * principalComponents[0].direction[1];
      const projY = numComponents > 1 ? (centered.x * principalComponents[1].direction[0] + centered.y * principalComponents[1].direction[1]) : 0;
      
      return { x: projX, y: projY, originalIndex: index };
    });
    
    const totalVariance = lambda1 + lambda2;
    const explainedVariance = principalComponents.map(pc => pc.variance / totalVariance * 100);
    
    return {
      principalComponents,
      projectedData,
      totalVariance,
      explainedVariance
    };
  }, [numComponents]);

  // Drawing functions
  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    
    for (let i = -5; i <= 5; i++) {
      // Vertical lines
      ctx.beginPath();
      ctx.moveTo(centerX + i * scale / 2, 0);
      ctx.lineTo(centerX + i * scale / 2, canvasHeight);
      ctx.stroke();
      
      // Horizontal lines
      ctx.beginPath();
      ctx.moveTo(0, centerY + i * scale / 2);
      ctx.lineTo(canvasWidth, centerY + i * scale / 2);
      ctx.stroke();
    }
  };

  const drawAxes = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 2;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvasWidth, centerY);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvasHeight);
    ctx.stroke();
    
    // Origin
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 3, 0, 2 * Math.PI);
    ctx.fill();
    
    // Labels
    ctx.fillStyle = '#6B7280';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('x', canvasWidth - 20, centerY - 10);
    ctx.fillText('y', centerX + 10, 15);
  };

  const drawDataPoints = (ctx: CanvasRenderingContext2D, data: DataPoint[], color: string, radius = 3) => {
    ctx.fillStyle = color;
    data.forEach(point => {
      ctx.beginPath();
      ctx.arc(
        centerX + point.x * scale,
        centerY - point.y * scale,
        radius,
        0,
        2 * Math.PI
      );
      ctx.fill();
    });
  };

  const drawPrincipalComponents = (ctx: CanvasRenderingContext2D) => {
    if (!pcaResult) return;
    
    const colors = ['#DC2626', '#2563EB'];
    
    pcaResult.principalComponents.forEach((pc, index) => {
      if (index >= numComponents) return;
      
      const color = colors[index];
      const isSelected = selectedComponent === index;
      const lineWidth = isSelected ? 4 : 3;
      const alpha = isSelected ? 1.0 : 0.7;
      
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      
      // Draw component line
      const length = Math.sqrt(pc.variance) * scale * 0.8;
      const endX = centerX + pc.direction[0] * length;
      const endY = centerY - pc.direction[1] * length;
      const startX = centerX - pc.direction[0] * length;
      const startY = centerY + pc.direction[1] * length;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      
      // Draw arrowhead
      const arrowLength = 12;
      const arrowAngle = Math.PI / 6;
      const angle = Math.atan2(startY - endY, endX - startX);
      
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - arrowLength * Math.cos(angle - arrowAngle),
        endY - arrowLength * Math.sin(angle - arrowAngle)
      );
      ctx.lineTo(
        endX - arrowLength * Math.cos(angle + arrowAngle),
        endY - arrowLength * Math.sin(angle + arrowAngle)
      );
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      
      // Label
      ctx.fillStyle = color;
      ctx.font = '14px Inter, sans-serif';
      ctx.fillText(
        `PC${index + 1} (${pcaResult.explainedVariance[index].toFixed(1)}%)`,
        endX + 10,
        endY - 5
      );
      
      ctx.globalAlpha = 1.0;
    });
  };

  const drawVarianceEllipse = (ctx: CanvasRenderingContext2D) => {
    if (!pcaResult || !showVarianceEllipse) return;
    
    const pc1 = pcaResult.principalComponents[0];
    const pc2 = pcaResult.principalComponents[1];
    
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.globalAlpha = 0.5;
    
    // Draw ellipse representing data variance
    const semiMajor = Math.sqrt(pc1.variance) * scale * 0.6;
    const semiMinor = Math.sqrt(pc2.variance) * scale * 0.6;
    const angle = Math.atan2(pc1.direction[1], pc1.direction[0]);
    
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(-angle);
    
    ctx.beginPath();
    ctx.ellipse(0, 0, semiMajor, semiMinor, 0, 0, 2 * Math.PI);
    ctx.stroke();
    
    ctx.restore();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1.0;
  };

  const drawProjectedData = (ctx: CanvasRenderingContext2D) => {
    if (!pcaResult || !showProjectedData) return;
    
    // Draw projected data in a separate area
    const projectionX = canvasWidth - 150;
    const projectionY = 50;
    const projectionWidth = 120;
    const projectionHeight = 300;
    
    // Background
    ctx.fillStyle = '#F3F4F6';
    ctx.fillRect(projectionX, projectionY, projectionWidth, projectionHeight);
    
    // Border
    ctx.strokeStyle = '#D1D5DB';
    ctx.lineWidth = 1;
    ctx.strokeRect(projectionX, projectionY, projectionWidth, projectionHeight);
    
    // Title
    ctx.fillStyle = '#1F2937';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('Projected Data', projectionX + 5, projectionY - 5);
    
    // Draw projected points
    const projScale = 40;
    const maxProj = Math.max(...pcaResult.projectedData.map(p => Math.max(Math.abs(p.x), Math.abs(p.y))));
    
    pcaResult.projectedData.forEach(point => {
      const x = projectionX + projectionWidth / 2 + (point.x / maxProj) * projScale;
      const y = projectionY + projectionHeight / 2 - (point.y / maxProj) * projScale;
      
      ctx.fillStyle = '#6366F1';
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  const drawVarianceAnalysis = (ctx: CanvasRenderingContext2D) => {
    if (!pcaResult) return;
    
    ctx.fillStyle = '#1F2937';
    ctx.font = '14px Inter, sans-serif';
    
    let yPos = 30;
    const lineHeight = 20;
    
    ctx.fillText('Variance Analysis', 20, yPos);
    yPos += lineHeight;
    
    pcaResult.principalComponents.forEach((pc, index) => {
      if (index >= numComponents) return;
      
      const color = index === 0 ? '#DC2626' : '#2563EB';
      ctx.fillStyle = color;
      ctx.fillText(
        `PC${index + 1}: ${pcaResult.explainedVariance[index].toFixed(1)}% variance`,
        20,
        yPos
      );
      yPos += lineHeight;
    });
    
    const totalExplained = pcaResult.explainedVariance.slice(0, numComponents).reduce((sum, v) => sum + v, 0);
    ctx.fillStyle = '#059669';
    ctx.fillText(`Total: ${totalExplained.toFixed(1)}% explained`, 20, yPos);
  };

  // Main drawing function
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw grid and axes
    drawGrid(ctx);
    drawAxes(ctx);

    // Draw variance ellipse
    drawVarianceEllipse(ctx);

    // Draw original data points
    if (showOriginalData) {
      drawDataPoints(ctx, currentData, '#6B7280');
    }

    // Draw principal components
    if (showPrincipalComponents) {
      drawPrincipalComponents(ctx);
    }

    // Draw projected data
    drawProjectedData(ctx);

    // Draw variance analysis
    drawVarianceAnalysis(ctx);
  }, [currentData, pcaResult, numComponents, selectedComponent, showOriginalData, showPrincipalComponents, showProjectedData, showVarianceEllipse]);

  // Generate new dataset and compute PCA
  const analyzeData = useCallback(() => {
    setIsAnalyzing(true);
    const newData = generateDataset();
    setCurrentData(newData);
    
    const result = computePCA(newData);
    setPcaResult(result);
    
    // Track progress
    const datasetKey = `${datasetType}-${numPoints}-${noiseLevel.toFixed(1)}-${dataSpread.toFixed(1)}`;
    setAnalyzedDatasets(prev => new Set([...prev, datasetKey]));
    
    setIsAnalyzing(false);
  }, [generateDataset, computePCA, datasetType, numPoints, noiseLevel, dataSpread]);

  // Redraw when dependencies change
  useEffect(() => {
    draw();
  }, [draw]);

  // Generate initial dataset
  useEffect(() => {
    analyzeData();
  }, []);

  // Progress tracking
  useEffect(() => {
    const newProgress = Math.min(100, analyzedDatasets.size * 8);
    setProgress(newProgress);
    onProgress?.(newProgress);
  }, [analyzedDatasets.size, onProgress]);

  const resetAnalysis = () => {
    setAnalyzedDatasets(new Set());
    setSelectedComponent(null);
    analyzeData();
  };

  const datasetPresets = [
    { name: 'Elliptical', type: 'ellipse' as const, points: 100, noise: 0.1, spread: 2 },
    { name: 'Diagonal', type: 'diagonal' as const, points: 80, noise: 0.2, spread: 1.5 },
    { name: 'Clustered', type: 'cluster' as const, points: 120, noise: 0.15, spread: 1.8 },
    { name: 'Random', type: 'random' as const, points: 100, noise: 0.1, spread: 2 },
    { name: 'High Noise', type: 'ellipse' as const, points: 150, noise: 0.8, spread: 1.2 },
    { name: 'Low Noise', type: 'ellipse' as const, points: 80, noise: 0.05, spread: 2.5 }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="border-2 border-purple-400/30 bg-gradient-to-r from-white/[0.06] to-white/[0.02] border border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-purple-200 flex items-center gap-2">
            🔍 Eileen's PCA Detective Lab
          </CardTitle>
          <p className="text-purple-700">
            Solve data mysteries with Principal Component Analysis! Find the hidden patterns that explain most of the variation.
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Data Investigation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dataset Type */}
            <div className="space-y-3">
              <h4 className="font-medium text-white/70">Dataset Type</h4>
              <div className="grid grid-cols-2 gap-2">
                {(['ellipse', 'diagonal', 'cluster', 'random'] as const).map((type) => (
                  <Button
                    key={type}
                    variant={datasetType === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDatasetType(type)}
                    className={datasetType === type ? 'bg-purple-600 hover:bg-purple-700' : ''}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Dataset Parameters */}
            <div className="space-y-4">
              <h4 className="font-medium text-white/70">Dataset Parameters</h4>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-700">Data Points: {numPoints}</label>
                <Slider
                  value={[numPoints]}
                  onValueChange={(value) => setNumPoints(value[0])}
                  min={50}
                  max={200}
                  step={10}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-700">Noise Level: {noiseLevel.toFixed(2)}</label>
                <Slider
                  value={[noiseLevel]}
                  onValueChange={(value) => setNoiseLevel(value[0])}
                  min={0.05}
                  max={1.0}
                  step={0.05}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-700">Data Spread: {dataSpread.toFixed(1)}</label>
                <Slider
                  value={[dataSpread]}
                  onValueChange={(value) => setDataSpread(value[0])}
                  min={0.5}
                  max={3.0}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>

            {/* PCA Parameters */}
            <div className="space-y-3">
              <h4 className="font-medium text-white/70">PCA Analysis</h4>
              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-700">Components: {numComponents}</label>
                <Slider
                  value={[numComponents]}
                  onValueChange={(value) => setNumComponents(value[0])}
                  min={1}
                  max={2}
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
                    checked={showOriginalData}
                    onChange={(e) => setShowOriginalData(e.target.checked)}
                    className="rounded border-white/10 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm">Show Original Data</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showPrincipalComponents}
                    onChange={(e) => setShowPrincipalComponents(e.target.checked)}
                    className="rounded border-white/10 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm">Show Principal Components</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showVarianceEllipse}
                    onChange={(e) => setShowVarianceEllipse(e.target.checked)}
                    className="rounded border-white/10 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm">Show Variance Ellipse</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showProjectedData}
                    onChange={(e) => setShowProjectedData(e.target.checked)}
                    className="rounded border-white/10 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm">Show Projected Data</span>
                </label>
              </div>
            </div>

            {/* Component Selection */}
            {pcaResult && (
              <div className="space-y-3">
                <h4 className="font-medium text-white/70">Highlight Component</h4>
                <div className="flex gap-2">
                  <Button
                    variant={selectedComponent === 0 ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedComponent(selectedComponent === 0 ? null : 0)}
                    className={selectedComponent === 0 ? 'bg-red-600 hover:bg-red-700' : ''}
                  >
                    PC1
                  </Button>
                  <Button
                    variant={selectedComponent === 1 ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedComponent(selectedComponent === 1 ? null : 1)}
                    className={selectedComponent === 1 ? 'bg-blue-600 hover:bg-blue-700' : ''}
                  >
                    PC2
                  </Button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                onClick={analyzeData}
                variant="outline"
                className="w-full"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? 'Analyzing...' : 'Generate New Dataset'}
              </Button>
              <Button
                onClick={resetAnalysis}
                variant="outline"
                className="w-full"
              >
                Reset Analysis
              </Button>
              <Button
                onClick={onComplete}
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={progress < 40}
              >
                Complete Investigation
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Visualization */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Principal Component Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                aria-label="Eileen principal component analysis visualization"
                className="w-full h-auto border border-white/10 rounded-lg"
              />
              {isAnalyzing && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/[0.08] rounded-lg">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-2"></div>
                    <p className="text-purple-700 font-medium">Analyzing Data...</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dataset Presets */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Dataset Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {datasetPresets.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                onClick={() => {
                  setDatasetType(preset.type);
                  setNumPoints(preset.points);
                  setNoiseLevel(preset.noise);
                  setDataSpread(preset.spread);
                }}
                className="text-sm"
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Variance Analysis */}
      {pcaResult && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Variance Decomposition</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-white/70">Principal Components</h4>
                <div className="space-y-2">
                  {pcaResult.principalComponents.map((pc, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white/[0.03] rounded">
                      <span className="font-medium text-white/70">PC{index + 1}</span>
                      <span className="text-sm text-white/55">
                        {pcaResult.explainedVariance[index].toFixed(1)}% variance
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-white/70">Dimensionality Reduction</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Original dimensions:</span>
                    <span className="font-medium">2</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Reduced dimensions:</span>
                    <span className="font-medium">{numComponents}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Variance preserved:</span>
                    <span className="font-medium text-green-600">
                      {pcaResult.explainedVariance.slice(0, numComponents).reduce((sum, v) => sum + v, 0).toFixed(1)}%
                    </span>
                  </div>
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
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <Badge variant="outline" className="text-purple-700">
              {analyzedDatasets.size} datasets analyzed
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PCADimensionReducer;