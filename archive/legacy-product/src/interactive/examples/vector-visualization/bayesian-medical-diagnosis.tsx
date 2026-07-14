"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Heart, Stethoscope, Calculator, AlertTriangle, CheckCircle, Activity } from "lucide-react"

export default function BayesianMedicalDiagnosis() {
  const [priorProbability, setPriorProbability] = useState([0.1])
  const [currentStep, setCurrentStep] = useState(0)
  const [test1Applied, setTest1Applied] = useState(false)
  const [test2Applied, setTest2Applied] = useState(false)
  const [posteriorAfterTest1, setPosteriorAfterTest1] = useState(0)
  const [posteriorAfterTest2, setPosteriorAfterTest2] = useState(0)

  // Test characteristics
  const sensitivity = 0.95 // P(Positive | Disease)
  const specificity = 0.95 // P(Negative | Healthy)
  const falsePositiveRate = 1 - specificity // P(Positive | Healthy)

  // Bayes' theorem calculation
  const calculatePosterior = (prior: number) => {
    const pPositive = sensitivity * prior + falsePositiveRate * (1 - prior)
    return (sensitivity * prior) / pPositive
  }

  const applyTest1 = () => {
    const prior = priorProbability[0] / 100
    const posterior = calculatePosterior(prior)
    setPosteriorAfterTest1(posterior)
    setTest1Applied(true)
    setCurrentStep(1)
  }

  const applyTest2 = () => {
    const posterior = calculatePosterior(posteriorAfterTest1)
    setPosteriorAfterTest2(posterior)
    setTest2Applied(true)
    setCurrentStep(2)
  }

  const reset = () => {
    setCurrentStep(0)
    setTest1Applied(false)
    setTest2Applied(false)
    setPosteriorAfterTest1(0)
    setPosteriorAfterTest2(0)
  }

  const formatPercentage = (value: number) => (value * 100).toFixed(2)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="w-full max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-blue-200/50 shadow-sm">
            <Stethoscope className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Medical Statistics</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
            Medical Diagnosis: Bayesian Reasoning
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Understand how base rates affect medical test interpretation using Bayes' theorem
          </p>
        </div>

        {/* Scenario Context */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-500 to-teal-600 text-white overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Clinical Scenario</h2>
                <p className="text-blue-100">Rare cardiovascular condition screening</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/10 rounded-xl p-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Disease Prevalence
                </h3>
                <p className="text-blue-100">
                  This rare condition affects only <strong>0.1%</strong> of the population
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Test Accuracy
                </h3>
                <p className="text-blue-100">
                  The diagnostic test is <strong>95% accurate</strong> (both sensitivity and specificity)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Prior Belief & Controls */}
          <div className="space-y-6">
            {/* Prior Probability */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                <CardTitle className="text-lg font-bold">Prior Belief</CardTitle>
                <p className="text-purple-100 text-sm">Before any tests</p>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700">
                    Probability patient has disease: {priorProbability[0]}%
                  </label>
                  <Slider
                    value={priorProbability}
                    onValueChange={setPriorProbability}
                    max={1}
                    min={0.01}
                    step={0.01}
                    className="w-full"
                  />
                  <div className="bg-slate-100 rounded-lg p-3">
                    <div className="flex justify-between text-sm text-slate-600 mb-1">
                      <span>Probability</span>
                      <span>{priorProbability[0]}%</span>
                    </div>
                    <Progress value={priorProbability[0]} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reset Button */}
            <Button
              onClick={reset}
              variant="outline"
              className="w-full border-slate-300 text-slate-600 hover:bg-slate-50 bg-transparent"
            >
              Reset Simulation
            </Button>

            {/* Key Insight */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-800 mb-2">Key Insight</h4>
                    <p className="text-sm text-amber-700 leading-relaxed">
                      Even with a 95% accurate test, a positive result doesn't mean 95% chance of having the disease!
                      Base rates matter enormously.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Test Results & Calculations */}
          <div className="lg:col-span-2 space-y-6">
            {/* Test 1 */}
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-red-500 to-pink-600 text-white">
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Calculator className="w-6 h-6" />
                  Test Result 1
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Test Result Badge */}
                  <div className="text-center">
                    <div className="inline-flex items-center gap-3 bg-red-500 text-white px-8 py-4 rounded-2xl shadow-lg">
                      <AlertTriangle className="w-8 h-8" />
                      <span className="text-3xl font-bold">POSITIVE</span>
                    </div>
                  </div>

                  {/* Bayes Calculation */}
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Bayes' Theorem Calculation</h3>
                    <div className="space-y-3 font-mono text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-slate-600">P(Disease) = </span>
                          <span className="font-bold text-purple-600">{(priorProbability[0] / 100).toFixed(4)}</span>
                        </div>
                        <div>
                          <span className="text-slate-600">P(Healthy) = </span>
                          <span className="font-bold text-green-600">{(1 - priorProbability[0] / 100).toFixed(4)}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-slate-600">P(+ | Disease) = </span>
                          <span className="font-bold text-red-600">{sensitivity}</span>
                        </div>
                        <div>
                          <span className="text-slate-600">P(+ | Healthy) = </span>
                          <span className="font-bold text-red-600">{falsePositiveRate}</span>
                        </div>
                      </div>
                      <div className="border-t pt-3">
                        <div className="text-center">
                          <div className="text-slate-600 mb-2">P(Disease | +) = </div>
                          <div className="bg-white p-3 rounded-lg border">
                            <div className="text-red-600 font-bold">P(+ | Disease) × P(Disease)</div>
                            <div className="text-slate-400">÷</div>
                            <div className="text-blue-600 font-bold">
                              P(+ | Disease) × P(Disease) + P(+ | Healthy) × P(Healthy)
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Update Button */}
                  {!test1Applied && (
                    <div className="text-center">
                      <Button
                        onClick={applyTest1}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Update Belief with Test 1
                      </Button>
                    </div>
                  )}

                  {/* Result After Test 1 */}
                  {test1Applied && (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200 animate-in slide-in-from-top-2 duration-500">
                      <h4 className="text-lg font-bold text-blue-800 mb-4">Updated Probability</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Before Test:</span>
                          <span className="text-lg font-bold text-slate-800">{priorProbability[0]}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">After Test 1:</span>
                          <span className="text-2xl font-bold text-blue-600">
                            {formatPercentage(posteriorAfterTest1)}%
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-slate-600">
                            <span>Visual Comparison</span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500 w-16">Before:</span>
                              <Progress value={priorProbability[0]} className="h-2 flex-1" />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500 w-16">After:</span>
                              <Progress value={posteriorAfterTest1 * 100} className="h-2 flex-1" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Test 2 */}
            {test1Applied && (
              <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden animate-in slide-in-from-bottom duration-700">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Calculator className="w-6 h-6" />
                    Test Result 2
                  </CardTitle>
                  <p className="text-orange-100">Previous result becomes new prior</p>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {/* Test Result Badge */}
                    <div className="text-center">
                      <div className="inline-flex items-center gap-3 bg-red-500 text-white px-8 py-4 rounded-2xl shadow-lg">
                        <AlertTriangle className="w-8 h-8" />
                        <span className="text-3xl font-bold">POSITIVE</span>
                      </div>
                    </div>

                    {/* Sequential Bayes */}
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                      <h3 className="text-lg font-bold text-slate-800 mb-4">Sequential Bayesian Update</h3>
                      <div className="space-y-3 font-mono text-sm">
                        <div>
                          <span className="text-slate-600">New Prior P(Disease) = </span>
                          <span className="font-bold text-purple-600">{formatPercentage(posteriorAfterTest1)}%</span>
                          <span className="text-slate-500 ml-2">(from Test 1 result)</span>
                        </div>
                        <div className="text-center text-slate-600">Applying same test characteristics...</div>
                      </div>
                    </div>

                    {/* Update Button */}
                    {!test2Applied && (
                      <div className="text-center">
                        <Button
                          onClick={applyTest2}
                          className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          Update Belief with Test 2
                        </Button>
                      </div>
                    )}

                    {/* Final Result */}
                    {test2Applied && (
                      <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6 border-2 border-green-200 animate-in slide-in-from-top-2 duration-500">
                        <h4 className="text-lg font-bold text-green-800 mb-4">Final Probability</h4>
                        <div className="space-y-4">
                          <div className="text-center">
                            <div className="text-4xl font-bold text-green-600 mb-2">
                              {formatPercentage(posteriorAfterTest2)}%
                            </div>
                            <p className="text-green-700">Probability of having the disease</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm text-slate-600">
                              <span>Progression</span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500 w-20">Initial:</span>
                                <Progress value={priorProbability[0]} className="h-2 flex-1" />
                                <span className="text-xs text-slate-500 w-12">{priorProbability[0]}%</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500 w-20">After Test 1:</span>
                                <Progress value={posteriorAfterTest1 * 100} className="h-2 flex-1" />
                                <span className="text-xs text-slate-500 w-12">
                                  {formatPercentage(posteriorAfterTest1)}%
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500 w-20">After Test 2:</span>
                                <Progress value={posteriorAfterTest2 * 100} className="h-2 flex-1" />
                                <span className="text-xs text-slate-500 w-12">
                                  {formatPercentage(posteriorAfterTest2)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Educational Section */}
        <Card className="border-0 shadow-2xl bg-gradient-to-r from-slate-800 to-slate-900 text-white overflow-hidden">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-blue-300">Bayes' Theorem</h3>
                <div className="bg-slate-700/50 p-4 rounded-xl font-mono text-lg mb-4">
                  P(A|B) = P(B|A) × P(A) / P(B)
                </div>
                <p className="text-slate-300 text-sm">Where A = Disease, B = Positive Test Result</p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4 text-green-300">Why This Matters</h3>
                <div className="space-y-3 text-slate-300 text-sm">
                  <p>
                    • <strong>Base rates are crucial:</strong> Rare diseases remain unlikely even after positive tests
                  </p>
                  <p>
                    • <strong>Test accuracy ≠ Probability:</strong> 95% accuracy doesn't mean 95% chance of disease
                  </p>
                  <p>
                    • <strong>Sequential testing:</strong> Multiple tests can significantly increase confidence
                  </p>
                  <p>
                    • <strong>Clinical judgment:</strong> Doctors must consider prevalence, not just test results
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-900/30 rounded-xl border border-blue-700/50">
              <h4 className="text-lg font-bold text-blue-300 mb-2">Medical Implications</h4>
              <p className="text-blue-100 leading-relaxed">
                This simulation demonstrates why medical professionals must consider disease prevalence when
                interpreting test results. A positive test for a rare condition, even with high accuracy, often
                indicates a higher probability of a false positive than a true positive. This is why confirmatory
                testing and clinical correlation are essential in medical diagnosis.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
