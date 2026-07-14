"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Play, Square, RotateCcw, Info, Zap, Target, TrendingDown } from "lucide-react"

interface Point {
  w1: number
  w2: number
}

export default function GradientDescentML() {
  const [currentPosition, setCurrentPosition] = useState<Point>({ w1: 0, w2: 0 })
  const [learningRate, setLearningRate] = useState([0.1])
  const [isRunning, setIsRunning] = useState(false)
  const [stepCount, setStepCount] = useState(0)
  const [path, setPath] = useState<Point[]>([])
  const [isConverged, setIsConverged] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [speed, setSpeed] = useState([200]) // milliseconds between steps
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Error function: (w1-3)² + (w2-2)²
  const errorFunction = (w1: number, w2: number) => {
    return Math.pow(w1 - 3, 2) + Math.pow(w2 - 2, 2)
  }

  // Gradient calculation: [2(w1-3), 2(w2-2)]
  const calculateGradient = (w1: number, w2: number) => {
    return {
      dw1: 2 * (w1 - 3),
      dw2: 2 * (w2 - 2),
    }
  }

  const currentError = errorFunction(currentPosition.w1, currentPosition.w2)
  const currentGradient = calculateGradient(currentPosition.w1, currentPosition.w2)
  const gradientMagnitude = Math.sqrt(currentGradient.dw1 ** 2 + currentGradient.dw2 ** 2)

  // Check convergence (gradient magnitude < threshold)
  const checkConvergence = useCallback(() => {
    const threshold = 0.01
    return gradientMagnitude < threshold
  }, [gradientMagnitude])

  // Single gradient descent step
  const performStep = useCallback(() => {
    const gradient = calculateGradient(currentPosition.w1, currentPosition.w2)
    const newPosition = {
      w1: currentPosition.w1 - learningRate[0] * gradient.dw1,
      w2: currentPosition.w2 - learningRate[0] * gradient.dw2,
    }

    setCurrentPosition(newPosition)
    setPath((prev) => [...prev, newPosition])
    setStepCount((prev) => prev + 1)

    if (checkConvergence()) {
      setIsConverged(true)
      setIsRunning(false)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [currentPosition, learningRate, checkConvergence])

  // Auto-run gradient descent
  useEffect(() => {
    if (isRunning && !isConverged) {
      intervalRef.current = setInterval(performStep, speed[0])
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, isConverged, performStep, speed])

  const reset = () => {
    setCurrentPosition({ w1: 0, w2: 0 })
    setPath([{ w1: 0, w2: 0 }])
    setStepCount(0)
    setIsConverged(false)
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isRunning) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Convert SVG coordinates to function coordinates
    const w1 = ((x - 50) / 350) * 8 - 1 // Scale to -1 to 7 range
    const w2 = 5 - ((y - 50) / 350) * 8 // Scale to -1 to 7 range, flip Y

    const newPosition = { w1, w2 }
    setCurrentPosition(newPosition)
    setPath([newPosition])
    setStepCount(0)
    setIsConverged(false)
  }

  // Convert function coordinates to SVG coordinates
  const toSVG = (w1: number, w2: number) => ({
    x: 50 + ((w1 + 1) / 8) * 350,
    y: 50 + ((5 - w2) / 8) * 350,
  })

  // Generate contour lines
  const generateContours = () => {
    const contours = []
    const levels = [0.5, 1, 2, 4, 8, 16, 32]

    for (const level of levels) {
      const points = []
      // Sample points around the contour
      for (let angle = 0; angle <= 2 * Math.PI; angle += 0.1) {
        const radius = Math.sqrt(level)
        const w1 = 3 + radius * Math.cos(angle)
        const w2 = 2 + radius * Math.sin(angle)
        if (w1 >= -1 && w1 <= 7 && w2 >= -1 && w2 <= 5) {
          points.push(toSVG(w1, w2))
        }
      }
      contours.push({ level, points })
    }
    return contours
  }

  const contours = generateContours()

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-4">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-orange-200/50 shadow-sm">
            <TrendingDown className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-700">Machine Learning Optimization</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
            Netflix Recommendation Optimization
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Watch gradient descent minimize prediction error to improve movie recommendations
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Visualization */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Target className="w-6 h-6" />
                  Error Function Landscape
                </CardTitle>
                <p className="text-orange-100">Click anywhere to set starting point, then optimize!</p>
              </CardHeader>
              <CardContent className="p-8">
                <div className="bg-gradient-to-br from-slate-50 to-orange-50 rounded-2xl p-6 border border-orange-100">
                  <svg
                    width="100%"
                    height="450"
                    viewBox="0 0 450 450"
                    className="bg-white rounded-xl shadow-inner border border-slate-200 cursor-crosshair"
                    onClick={handleCanvasClick}
                  >
                    {/* Contour lines */}
                    {contours.map((contour, idx) => {
                      const intensity = Math.min(contour.level / 32, 1)
                      const color = `hsl(${240 - intensity * 120}, 70%, ${80 - intensity * 30}%)`

                      return (
                        <g key={contour.level}>
                          {contour.points.length > 2 && (
                            <path
                              d={`M ${contour.points.map((p) => `${p.x},${p.y}`).join(" L ")} Z`}
                              fill="none"
                              stroke={color}
                              strokeWidth="2"
                              opacity="0.7"
                            />
                          )}
                          {contour.points[0] && (
                            <text
                              x={contour.points[0].x + 10}
                              y={contour.points[0].y - 5}
                              className="text-xs font-medium"
                              fill={color}
                            >
                              {contour.level}
                            </text>
                          )}
                        </g>
                      )
                    })}

                    {/* Global minimum */}
                    <g>
                      <circle
                        cx={toSVG(3, 2).x}
                        cy={toSVG(3, 2).y}
                        r="8"
                        fill="#22c55e"
                        stroke="white"
                        strokeWidth="3"
                      />
                      <text
                        x={toSVG(3, 2).x}
                        y={toSVG(3, 2).y - 15}
                        textAnchor="middle"
                        className="text-sm font-bold fill-green-600"
                      >
                        Global Min (3,2)
                      </text>
                    </g>

                    {/* Path visualization */}
                    {path.length > 1 && (
                      <path
                        d={`M ${path.map((p) => `${toSVG(p.w1, p.w2).x},${toSVG(p.w1, p.w2).y}`).join(" L ")}`}
                        fill="none"
                        stroke="#8b5cf6"
                        strokeWidth="3"
                        strokeDasharray="5,5"
                        opacity="0.8"
                      />
                    )}

                    {/* Path points */}
                    {path.slice(0, -1).map((point, idx) => (
                      <circle
                        key={idx}
                        cx={toSVG(point.w1, point.w2).x}
                        cy={toSVG(point.w1, point.w2).y}
                        r="3"
                        fill="#8b5cf6"
                        opacity="0.6"
                      />
                    ))}

                    {/* Current position */}
                    <circle
                      cx={toSVG(currentPosition.w1, currentPosition.w2).x}
                      cy={toSVG(currentPosition.w1, currentPosition.w2).y}
                      r="8"
                      fill="#ef4444"
                      stroke="white"
                      strokeWidth="3"
                      className="animate-pulse"
                    />

                    {/* Gradient arrow */}
                    {gradientMagnitude > 0.01 && (
                      <g>
                        <defs>
                          <marker
                            id="gradient-arrow"
                            markerWidth="10"
                            markerHeight="7"
                            refX="9"
                            refY="3.5"
                            orient="auto"
                          >
                            <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b" />
                          </marker>
                        </defs>
                        <line
                          x1={toSVG(currentPosition.w1, currentPosition.w2).x}
                          y1={toSVG(currentPosition.w1, currentPosition.w2).y}
                          x2={
                            toSVG(currentPosition.w1, currentPosition.w2).x +
                            (currentGradient.dw1 / gradientMagnitude) * 40
                          }
                          y2={
                            toSVG(currentPosition.w1, currentPosition.w2).y -
                            (currentGradient.dw2 / gradientMagnitude) * 40
                          }
                          stroke="#f59e0b"
                          strokeWidth="3"
                          markerEnd="url(#gradient-arrow)"
                        />
                        <text
                          x={
                            toSVG(currentPosition.w1, currentPosition.w2).x +
                            (currentGradient.dw1 / gradientMagnitude) * 50
                          }
                          y={
                            toSVG(currentPosition.w1, currentPosition.w2).y -
                            (currentGradient.dw2 / gradientMagnitude) * 50
                          }
                          className="text-xs font-bold fill-amber-600"
                        >
                          ∇Error
                        </text>
                      </g>
                    )}

                    {/* Axes */}
                    <line x1="50" y1="400" x2="400" y2="400" stroke="#374151" strokeWidth="2" />
                    <line x1="50" y1="50" x2="50" y2="400" stroke="#374151" strokeWidth="2" />

                    {/* Axis labels */}
                    <text x="225" y="430" textAnchor="middle" className="text-sm font-medium fill-slate-700">
                      w₁ (Weight 1)
                    </text>
                    <text
                      x="25"
                      y="225"
                      textAnchor="middle"
                      className="text-sm font-medium fill-slate-700"
                      transform="rotate(-90 25 225)"
                    >
                      w₂ (Weight 2)
                    </text>

                    {/* Grid labels */}
                    {[-1, 0, 1, 2, 3, 4, 5, 6, 7].map((val) => (
                      <g key={val}>
                        <text x={toSVG(val, 0).x} y="420" textAnchor="middle" className="text-xs fill-slate-600">
                          {val}
                        </text>
                      </g>
                    ))}
                    {[-1, 0, 1, 2, 3, 4, 5].map((val) => (
                      <g key={val}>
                        <text x="40" y={toSVG(0, val).y + 5} textAnchor="end" className="text-xs fill-slate-600">
                          {val}
                        </text>
                      </g>
                    ))}
                  </svg>

                  {/* Controls */}
                  <div className="flex justify-center gap-4 mt-6 flex-wrap">
                    <Button
                      onClick={performStep}
                      disabled={isRunning || isConverged}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Step
                    </Button>
                    <Button
                      onClick={() => setIsRunning(!isRunning)}
                      disabled={isConverged}
                      className={`font-semibold py-2 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                        isRunning
                          ? "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                          : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      } text-white`}
                    >
                      {isRunning ? <Square className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                      {isRunning ? "Stop" : "Run"}
                    </Button>
                    <Button
                      onClick={reset}
                      variant="outline"
                      className="border-slate-300 text-slate-600 hover:bg-slate-50 py-2 px-4 rounded-xl bg-transparent"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls and Info */}
          <div className="space-y-6">
            {/* Current Status */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                <CardTitle className="text-lg font-bold">Current Status</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600">Position:</span>
                    <span className="text-sm font-mono text-slate-800">
                      ({currentPosition.w1.toFixed(3)}, {currentPosition.w2.toFixed(3)})
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600">Error:</span>
                    <span className="text-lg font-bold text-red-600">{currentError.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600">Steps:</span>
                    <span className="text-lg font-bold text-blue-600">{stepCount}</span>
                  </div>
                  {isConverged && (
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center">
                      <p className="text-green-800 font-bold">🎉 Converged!</p>
                      <p className="text-green-600 text-sm">Found optimal solution</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Learning Rate Control */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                <CardTitle className="text-lg font-bold">Learning Rate</CardTitle>
                <p className="text-purple-100 text-sm">Controls step size</p>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700">α = {learningRate[0]}</label>
                  <Slider
                    value={learningRate}
                    onValueChange={setLearningRate}
                    max={0.5}
                    min={0.01}
                    step={0.01}
                    className="w-full"
                  />
                  <div className="text-xs text-slate-600 space-y-1">
                    <p>• Low: Slow but stable</p>
                    <p>• High: Fast but may overshoot</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700">Speed: {speed[0]}ms</label>
                  <Slider value={speed} onValueChange={setSpeed} max={1000} min={50} step={50} className="w-full" />
                </div>
              </CardContent>
            </Card>

            {/* Mathematical Display */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                <CardTitle className="text-lg font-bold">Mathematics</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-slate-700 mb-1">Error Function:</p>
                    <p className="font-mono bg-slate-100 p-2 rounded">Error = (w₁-3)² + (w₂-2)²</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700 mb-1">Gradient:</p>
                    <p className="font-mono bg-slate-100 p-2 rounded">
                      ∇Error = [{currentGradient.dw1.toFixed(3)}, {currentGradient.dw2.toFixed(3)}]
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700 mb-1">Update Rule:</p>
                    <p className="font-mono bg-slate-100 p-2 rounded">w_new = w_old - α × ∇Error</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Info Panel */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Info className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-800 mb-2">Why Gradient Descent?</h4>
                    <div className="text-sm text-amber-700 space-y-2">
                      <p>
                        • <strong>Automatic:</strong> Finds optimal parameters without manual tuning
                      </p>
                      <p>
                        • <strong>Scalable:</strong> Works with millions of parameters
                      </p>
                      <p>
                        • <strong>Universal:</strong> Core algorithm in neural networks
                      </p>
                      <p>
                        • <strong>Efficient:</strong> Follows steepest descent path
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Netflix Context */}
        <Card className="border-0 shadow-2xl bg-gradient-to-r from-slate-800 to-slate-900 text-white overflow-hidden">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-red-300">Netflix Recommendation System</h3>
                <div className="space-y-3 text-slate-300 text-sm">
                  <p>
                    • <strong>w₁, w₂:</strong> Model weights that determine how much different factors (genre
                    preference, viewing history) influence recommendations
                  </p>
                  <p>
                    • <strong>Error Function:</strong> Measures how far off our predictions are from actual user ratings
                  </p>
                  <p>
                    • <strong>Optimization Goal:</strong> Find weights that minimize prediction errors across all users
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4 text-blue-300">Real-World Impact</h3>
                <div className="space-y-3 text-slate-300 text-sm">
                  <p>
                    • <strong>Billions of parameters:</strong> Netflix uses models with millions of weights, not just 2
                  </p>
                  <p>
                    • <strong>Continuous learning:</strong> Models update constantly as users watch new content
                  </p>
                  <p>
                    • <strong>Business value:</strong> Better recommendations = higher user engagement = more revenue
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-red-900/30 rounded-xl border border-red-700/50">
              <h4 className="text-lg font-bold text-red-300 mb-2">Machine Learning Connection</h4>
              <p className="text-red-100 leading-relaxed">
                This visualization shows the core of how machine learning works: define an error function, calculate
                gradients, and iteratively update parameters to minimize error. The same principle powers everything
                from Netflix recommendations to self-driving cars to language models like ChatGPT!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
