import React, { useState } from 'react';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Slider } from '@/core/components/ui/slider';
import { Progress } from '@/core/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/core/components/ui/avatar';
import { Stethoscope, Calculator, AlertTriangle, CheckCircle } from 'lucide-react';

interface BayesMedicalDiagnosisProps {
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  isPreview?: boolean;
}

const BayesMedicalDiagnosis: React.FC<BayesMedicalDiagnosisProps> = ({ 
  onComplete, 
  onProgress, 
  isPreview = false 
}) => {
  const [priorProbability, setPriorProbability] = useState([0.1]); // 0.1% default (rare disease)
  const [currentStep, setCurrentStep] = useState(0);
  const [testApplied, setTestApplied] = useState(false);
  const [posterior, setPosterior] = useState(0);

  // Test characteristics
  const sensitivity = 0.95; // P(Positive | Disease)
  const specificity = 0.95; // P(Negative | Healthy)
  const falsePositiveRate = 1 - specificity; // P(Positive | Healthy)

  // Bayes' theorem calculation
  const calculatePosterior = (prior: number) => {
    const pPositive = sensitivity * prior + falsePositiveRate * (1 - prior);
    return (sensitivity * prior) / pPositive;
  };

  const applyTest = () => {
    const prior = priorProbability[0] / 100;
    const result = calculatePosterior(prior);
    setPosterior(result);
    setTestApplied(true);
    setCurrentStep(1);
    
    if (onProgress) {
      onProgress(1);
    }
    
    if (onComplete) {
      setTimeout(() => onComplete(), 1000);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setTestApplied(false);
    setPosterior(0);
    
    if (onProgress) {
      onProgress(0);
    }
  };

  const formatPercentage = (value: number) => (value * 100).toFixed(2);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src="/lovable-uploads/bayes.png" alt="Bayes the Fox" />
          <AvatarFallback>B</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-bold text-white/90">Bayes' Medical Mystery</h2>
          <p className="text-white/55">Uncover the truth behind medical test results!</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Scenario Description */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5" />
                Clinical Scenario
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="bg-white/[0.04] rounded-lg p-4 border border-indigo-400/30">
                  <h3 className="font-semibold text-indigo-200 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    The Mystery Disease
                  </h3>
                  <p className="text-white/80 text-sm">
                    A rare cardiovascular condition affects only <strong>0.1%</strong> of the population. 
                    Your diagnostic test is <strong>95% accurate</strong> (both sensitivity and specificity).
                  </p>
                </div>

                {/* Test Result */}
                <div className="text-center">
                  <div className="inline-flex items-center gap-3 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg">
                    <AlertTriangle className="w-6 h-6" />
                    <span className="text-xl font-bold">TEST RESULT: POSITIVE</span>
                  </div>
                </div>

                {/* Bayes Calculation Display */}
                {testApplied && (
                  <div className="bg-white/[0.03] rounded-lg p-4 border border-white/10 animate-in slide-in-from-top-2 duration-500">
                    <h4 className="font-semibold text-white/90 mb-3">Bayes' Theorem in Action</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-white/55">P(Disease) = </span>
                        <span className="font-bold text-purple-600">{(priorProbability[0] / 100).toFixed(4)}</span>
                      </div>
                      <div>
                        <span className="text-white/55">P(Healthy) = </span>
                        <span className="font-bold text-green-600">{(1 - priorProbability[0] / 100).toFixed(4)}</span>
                      </div>
                      <div>
                        <span className="text-white/55">P(+ | Disease) = </span>
                        <span className="font-bold text-red-600">{sensitivity}</span>
                      </div>
                      <div>
                        <span className="text-white/55">P(+ | Healthy) = </span>
                        <span className="font-bold text-red-600">{falsePositiveRate}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-white/[0.04] rounded border">
                      <div className="text-center">
                        <div className="text-white/55 mb-2">P(Disease | Positive Test) = </div>
                        <div className="text-lg font-bold text-indigo-600">
                          {formatPercentage(posterior)}%
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls and Results */}
        <div className="space-y-6">
          {/* Prior Probability Control */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Prior Belief</CardTitle>
              <p className="text-sm text-white/55">Before any tests</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <label className="text-sm font-medium text-white/80">
                  Disease Probability: {priorProbability[0]}%
                </label>
                <Slider
                  value={priorProbability}
                  onValueChange={setPriorProbability}
                  max={10}
                  min={0.01}
                  step={0.01}
                  className="w-full"
                  disabled={testApplied}
                />
                <div className="bg-white/[0.06] rounded-lg p-3">
                  <div className="flex justify-between text-sm text-white/55 mb-1">
                    <span>Probability</span>
                    <span>{priorProbability[0]}%</span>
                  </div>
                  <Progress value={priorProbability[0] * 10} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Button */}
          <Card>
            <CardContent className="pt-6">
              {!testApplied ? (
                <Button
                  onClick={applyTest}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Apply Bayes' Theorem
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600 mb-1">
                      {formatPercentage(posterior)}%
                    </div>
                    <p className="text-sm text-white/55">Probability of Disease</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/45 w-16">Before:</span>
                      <Progress value={priorProbability[0] * 10} className="h-2 flex-1" />
                      <span className="text-xs text-white/45">{priorProbability[0]}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/45 w-16">After:</span>
                      <Progress value={posterior * 100} className="h-2 flex-1" />
                      <span className="text-xs text-white/45">{formatPercentage(posterior)}%</span>
                    </div>
                  </div>

                  <Button onClick={reset} variant="outline" className="w-full">
                    Try Different Prior
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Key Insight */}
          {testApplied && (
            <Card className="border-indigo-400/30 bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-indigo-200 mb-2">🧪 Bayes' Detective Insight</h4>
                    <p className="text-sm text-indigo-700">
                      Even with a 95% accurate test, a positive result doesn't mean 95% chance of disease! 
                      Base rates matter enormously in medical diagnosis. This is what smart detectives always investigate first.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!isPreview && (
            <Card className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 border-purple-400/30">
              <CardContent className="pt-6">
                <div className="text-sm text-purple-700 space-y-2">
                  <p><strong>🔍 Detective's Investigation Guide:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Try different prior probabilities (your initial hunches)</li>
                    <li>Notice how low base rates affect results (rare cases are tricky!)</li>
                    <li>See why context matters in diagnosis (smart detectives gather all clues)</li>
                    <li>Understand the false positive problem (evidence can mislead)</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BayesMedicalDiagnosis; 