"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Instagram, Sparkles, Calculator } from "lucide-react"

export default function MatrixMultiplication() {
  const [currentStep, setCurrentStep] = useState(0)
  const [step1Answer, setStep1Answer] = useState("")
  const [step2Answer, setStep2Answer] = useState("")
  const [step1Feedback, setStep1Feedback] = useState<{
    show: boolean
    correct: boolean
    message: string
  }>({ show: false, correct: false, message: "" })
  const [step2Feedback, setStep2Feedback] = useState<{
    show: boolean
    correct: boolean
    message: string
  }>({ show: false, correct: false, message: "" })
  const [showFinalInsight, setShowFinalInsight] = useState(false)

  // Matrix values
  const matrixA = [
    [0.8, 0.1],
    [0.2, 0.9],
  ]
  const matrixB = [[100], [200]]
  const correctAnswers = [100, 200] // Results of matrix multiplication

  const checkStep1 = () => {
    const answer = Number.parseFloat(step1Answer)
    if (answer === correctAnswers[0]) {
      setStep1Feedback({
        show: true,
        correct: true,
        message: "Perfect! You calculated (0.8×100) + (0.1×200) = 80 + 20 = 100",
      })
      setTimeout(() => {
        setCurrentStep(1)
      }, 1500)
    } else {
      setStep1Feedback({
        show: true,
        correct: false,
        message:
          "Not quite! Remember: multiply each element in the row by each element in the column, then add them together.",
      })
    }
  }

  const checkStep2 = () => {
    const answer = Number.parseFloat(step2Answer)
    if (answer === correctAnswers[1]) {
      setStep2Feedback({
        show: true,
        correct: true,
        message: "Excellent! You calculated (0.2×100) + (0.9×200) = 20 + 180 = 200",
      })
      setTimeout(() => {
        setShowFinalInsight(true)
      }, 1500)
    } else {
      setStep2Feedback({
        show: true,
        correct: false,
        message: "Almost there! Calculate (0.2×100) + (0.9×200). What do you get when you add 20 + 180?",
      })
    }
  }

  const resetStep1Feedback = () => {
    setStep1Feedback({ show: false, correct: false, message: "" })
  }

  const resetStep2Feedback = () => {
    setStep2Feedback({ show: false, correct: false, message: "" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-4">
      <div className="w-full max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-purple-200/50 shadow-sm">
            <Instagram className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Interactive Math Learning</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
            Instagram Filter Mathematics
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Discover how matrix multiplication creates the visual effects behind every Instagram filter
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Matrix Display */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Calculator className="w-6 h-6" />
                  Matrix Multiplication Visualization
                </CardTitle>
                <p className="text-purple-100">Watch how matrices transform pixel data step by step</p>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-8">
                  {/* Matrix Equation */}
                  <div className="flex items-center justify-center gap-6 flex-wrap">
                    {/* Matrix A */}
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-bold text-purple-600">Matrix A (Filter)</h3>
                      <div className="relative">
                        <div className="grid grid-cols-2 gap-2 p-4 border-l-4 border-r-4 border-slate-400 bg-white rounded-lg shadow-lg">
                          {matrixA.map((row, rowIndex) =>
                            row.map((value, colIndex) => (
                              <div
                                key={`${rowIndex}-${colIndex}`}
                                className={`w-16 h-16 flex items-center justify-center text-lg font-bold rounded-lg border-2 transition-all duration-500 ${
                                  currentStep === 0 && rowIndex === 0
                                    ? "bg-yellow-200 border-yellow-400 scale-110 shadow-lg"
                                    : currentStep === 1 && rowIndex === 1
                                      ? "bg-yellow-200 border-yellow-400 scale-110 shadow-lg"
                                      : "bg-slate-50 border-slate-200"
                                }`}
                              >
                                {value}
                              </div>
                            )),
                          )}
                        </div>
                        <div className="absolute -top-2 -left-2 w-6 h-full border-l-4 border-t-4 border-b-4 border-slate-400 rounded-l-lg"></div>
                        <div className="absolute -top-2 -right-2 w-6 h-full border-r-4 border-t-4 border-b-4 border-slate-400 rounded-r-lg"></div>
                      </div>
                      <p className="text-sm text-slate-600">Sepia filter matrix</p>
                    </div>

                    {/* Multiplication Symbol */}
                    <div className="text-4xl font-bold text-slate-400">×</div>

                    {/* Matrix B */}
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-bold text-blue-600">Matrix B (Pixel)</h3>
                      <div className="relative">
                        <div className="grid grid-cols-1 gap-2 p-4 border-l-4 border-r-4 border-slate-400 bg-white rounded-lg shadow-lg">
                          {matrixB.map((row, rowIndex) =>
                            row.map((value, colIndex) => (
                              <div
                                key={`${rowIndex}-${colIndex}`}
                                className={`w-16 h-16 flex items-center justify-center text-lg font-bold rounded-lg border-2 transition-all duration-500 ${
                                  currentStep >= 0 && currentStep <= 1
                                    ? "bg-blue-200 border-blue-400 scale-110 shadow-lg"
                                    : "bg-slate-50 border-slate-200"
                                }`}
                              >
                                {value}
                              </div>
                            )),
                          )}
                        </div>
                        <div className="absolute -top-2 -left-2 w-6 h-full border-l-4 border-t-4 border-b-4 border-slate-400 rounded-l-lg"></div>
                        <div className="absolute -top-2 -right-2 w-6 h-full border-r-4 border-t-4 border-b-4 border-slate-400 rounded-r-lg"></div>
                      </div>
                      <p className="text-sm text-slate-600">Red=100, Blue=200</p>
                    </div>

                    {/* Equals Symbol */}
                    <div className="text-4xl font-bold text-slate-400">=</div>

                    {/* Result Matrix C */}
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-bold text-green-600">Matrix C (Result)</h3>
                      <div className="relative">
                        <div className="grid grid-cols-1 gap-2 p-4 border-l-4 border-r-4 border-slate-400 bg-white rounded-lg shadow-lg">
                          <div
                            className={`w-16 h-16 flex items-center justify-center text-lg font-bold rounded-lg border-2 transition-all duration-500 ${
                              step1Feedback.correct
                                ? "bg-green-200 border-green-400 text-green-800"
                                : "bg-slate-100 border-slate-300 text-slate-400"
                            }`}
                          >
                            {step1Feedback.correct ? correctAnswers[0] : "?"}
                          </div>
                          <div
                            className={`w-16 h-16 flex items-center justify-center text-lg font-bold rounded-lg border-2 transition-all duration-500 ${
                              step2Feedback.correct
                                ? "bg-green-200 border-green-400 text-green-800"
                                : "bg-slate-100 border-slate-300 text-slate-400"
                            }`}
                          >
                            {step2Feedback.correct ? correctAnswers[1] : "?"}
                          </div>
                        </div>
                        <div className="absolute -top-2 -left-2 w-6 h-full border-l-4 border-t-4 border-b-4 border-slate-400 rounded-l-lg"></div>
                        <div className="absolute -top-2 -right-2 w-6 h-full border-r-4 border-t-4 border-b-4 border-slate-400 rounded-r-lg"></div>
                      </div>
                      <p className="text-sm text-slate-600">Filtered pixel values</p>
                    </div>
                  </div>

                  {/* Step-by-step calculation */}
                  <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-6 border border-blue-100">
                    {currentStep === 0 && (
                      <div className="space-y-4 animate-in slide-in-from-left duration-500">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            1
                          </div>
                          <h4 className="text-xl font-bold text-slate-800">Calculate First Element</h4>
                        </div>
                        <div className="bg-white p-4 rounded-xl border-2 border-yellow-200">
                          <p className="text-lg text-center mb-4">
                            <span className="bg-yellow-200 px-2 py-1 rounded font-mono">Row 1</span> ×{" "}
                            <span className="bg-blue-200 px-2 py-1 rounded font-mono">Column 1</span>
                          </p>
                          <p className="text-2xl text-center font-mono bg-slate-100 p-4 rounded-lg">
                            (0.8 × 100) + (0.1 × 200) = ?
                          </p>
                        </div>
                      </div>
                    )}

                    {currentStep === 1 && (
                      <div className="space-y-4 animate-in slide-in-from-left duration-500">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            2
                          </div>
                          <h4 className="text-xl font-bold text-slate-800">Calculate Second Element</h4>
                        </div>
                        <div className="bg-white p-4 rounded-xl border-2 border-yellow-200">
                          <p className="text-lg text-center mb-4">
                            <span className="bg-yellow-200 px-2 py-1 rounded font-mono">Row 2</span> ×{" "}
                            <span className="bg-blue-200 px-2 py-1 rounded font-mono">Column 1</span>
                          </p>
                          <p className="text-2xl text-center font-mono bg-slate-100 p-4 rounded-lg">
                            (0.2 × 100) + (0.9 × 200) = ?
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Input Panel */}
          <div className="space-y-6">
            {/* Step 1 Input */}
            {currentStep === 0 && (
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden animate-in slide-in-from-right duration-500">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                  <CardTitle className="text-lg font-bold">Step 1: First Element</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Your Answer</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={step1Answer}
                        onChange={(e) => {
                          setStep1Answer(e.target.value)
                          resetStep1Feedback()
                        }}
                        className="text-center font-mono text-xl border-2 border-slate-200 focus:border-purple-400 transition-colors"
                        placeholder="Enter result"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={checkStep1}
                    disabled={!step1Answer}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Check Answer
                  </Button>

                  {step1Feedback.show && (
                    <div
                      className={`border-2 p-4 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2 duration-300 ${
                        step1Feedback.correct
                          ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                          : "bg-gradient-to-r from-red-50 to-rose-50 border-red-200"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          step1Feedback.correct ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {step1Feedback.correct ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <XCircle className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div>
                        <p
                          className={`font-semibold mb-1 ${step1Feedback.correct ? "text-green-800" : "text-red-800"}`}
                        >
                          {step1Feedback.correct ? "Correct!" : "Try Again"}
                        </p>
                        <p className={`text-sm ${step1Feedback.correct ? "text-green-700" : "text-red-700"}`}>
                          {step1Feedback.message}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 2 Input */}
            {currentStep === 1 && (
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden animate-in slide-in-from-right duration-500">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                  <CardTitle className="text-lg font-bold">Step 2: Second Element</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Your Answer</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={step2Answer}
                        onChange={(e) => {
                          setStep2Answer(e.target.value)
                          resetStep2Feedback()
                        }}
                        className="text-center font-mono text-xl border-2 border-slate-200 focus:border-purple-400 transition-colors"
                        placeholder="Enter result"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={checkStep2}
                    disabled={!step2Answer}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Check Answer
                  </Button>

                  {step2Feedback.show && (
                    <div
                      className={`border-2 p-4 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2 duration-300 ${
                        step2Feedback.correct
                          ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                          : "bg-gradient-to-r from-red-50 to-rose-50 border-red-200"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          step2Feedback.correct ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {step2Feedback.correct ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <XCircle className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div>
                        <p
                          className={`font-semibold mb-1 ${step2Feedback.correct ? "text-green-800" : "text-red-800"}`}
                        >
                          {step2Feedback.correct ? "Excellent!" : "Keep Trying"}
                        </p>
                        <p className={`text-sm ${step2Feedback.correct ? "text-green-700" : "text-red-700"}`}>
                          {step2Feedback.message}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Progress Indicator */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-purple-50 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h4 className="font-bold text-slate-800">Progress</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        step1Feedback.correct ? "bg-green-500" : currentStep >= 0 ? "bg-purple-500" : "bg-slate-300"
                      }`}
                    ></div>
                    <span className="text-sm">Calculate first element</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        step2Feedback.correct ? "bg-green-500" : currentStep >= 1 ? "bg-purple-500" : "bg-slate-300"
                      }`}
                    ></div>
                    <span className="text-sm">Calculate second element</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Final Insight */}
        {showFinalInsight && (
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-purple-500 to-pink-600 text-white overflow-hidden animate-in slide-in-from-bottom duration-700">
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                  <Instagram className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold">🎉 Congratulations!</h3>
                <p className="text-lg text-purple-100 max-w-3xl mx-auto">
                  You've just performed the same mathematical operation that powers Instagram filters! Matrix
                  multiplication transforms image data - every time you apply a sepia, blur, or color filter, you're
                  using linear algebra to modify pixel values across millions of data points.
                </p>
                <div className="bg-white/10 rounded-xl p-4 mt-6">
                  <p className="text-sm text-purple-100">
                    <strong>Real-world impact:</strong> This math is used in computer graphics, machine learning, data
                    science, and AI image processing. You've just learned a fundamental building block of modern
                    technology!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
