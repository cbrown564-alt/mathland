"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, HelpCircle, Navigation, Target, Zap } from "lucide-react"

export default function VectorVisualization() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [vectorX, setVectorX] = useState("")
  const [vectorY, setVectorY] = useState("")
  const [distance, setDistance] = useState("")
  const [showHint, setShowHint] = useState(false)
  const [feedback, setFeedback] = useState<{
    show: boolean
    correct: boolean
    message: string
  }>({ show: false, correct: false, message: "" })

  const svgRef = useRef<SVGSVGElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return

    const rect = svgRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - 50) / 40
    const y = (rect.height - 50 - (e.clientY - rect.top)) / 40

    setMousePos({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 })
  }, [])

  const checkAnswer = () => {
    const x = Number.parseFloat(vectorX)
    const y = Number.parseFloat(vectorY)
    const dist = Number.parseFloat(distance)

    const correctX = 3
    const correctY = 4
    const correctDist = 5

    if (x === correctX && y === correctY && dist === correctDist) {
      setFeedback({
        show: true,
        correct: true,
        message:
          "Perfect! You've mastered vector addition. The displacement vector is (3, 4) km with a magnitude of 5 km.",
      })
    } else {
      let message = "Almost there! "
      if (x !== correctX || y !== correctY) {
        message += "The vector components represent the total displacement: 3 km east and 4 km north. "
      }
      if (dist !== correctDist) {
        message += "Try using the Pythagorean theorem: √(3² + 4²) = 5 km."
      }
      setFeedback({
        show: true,
        correct: false,
        message,
      })
    }
  }

  const resetFeedback = () => {
    setFeedback({ show: false, correct: false, message: "" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-blue-200/50 shadow-sm">
            <Navigation className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Interactive Math Learning</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Vector Navigation Challenge
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Master vector addition through an engaging GPS navigation scenario. Perfect for data science foundations.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Visualization Panel */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Target className="w-6 h-6" />
                  Interactive Vector Grid
                </CardTitle>
                <p className="text-blue-100">
                  A hiker walks 3km East, then 4km North. Track the vectors and find the total displacement.
                </p>
              </CardHeader>
              <CardContent className="p-8">
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-blue-100">
                  <svg
                    ref={svgRef}
                    width="100%"
                    height="500"
                    viewBox="0 0 500 500"
                    className="rounded-xl bg-white shadow-inner border border-slate-200 transition-all duration-300 hover:shadow-lg"
                    onMouseMove={handleMouseMove}
                  >
                    {/* Enhanced Grid */}
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                      </pattern>
                      <pattern id="majorGrid" width="200" height="200" patternUnits="userSpaceOnUse">
                        <path d="M 200 0 L 0 0 0 200" fill="none" stroke="#cbd5e1" strokeWidth="2" />
                      </pattern>

                      {/* Enhanced Arrow Markers */}
                      <marker id="arrowhead-blue" markerWidth="12" markerHeight="8" refX="10" refY="4" orient="auto">
                        <polygon points="0 0, 12 4, 0 8" fill="url(#blueGradient)" />
                      </marker>
                      <marker id="arrowhead-red" markerWidth="12" markerHeight="8" refX="10" refY="4" orient="auto">
                        <polygon points="0 0, 12 4, 0 8" fill="url(#redGradient)" />
                      </marker>
                      <marker id="arrowhead-green" markerWidth="12" markerHeight="8" refX="10" refY="4" orient="auto">
                        <polygon points="0 0, 12 4, 0 8" fill="url(#greenGradient)" />
                      </marker>

                      {/* Gradients */}
                      <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#1d4ed8" />
                      </linearGradient>
                      <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#dc2626" />
                      </linearGradient>
                      <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="100%" stopColor="#16a34a" />
                      </linearGradient>
                    </defs>

                    <rect width="100%" height="100%" fill="url(#grid)" />
                    <rect width="100%" height="100%" fill="url(#majorGrid)" />

                    {/* Enhanced Axes */}
                    <line x1="50" y1="50" x2="50" y2="450" stroke="#475569" strokeWidth="3" />
                    <line x1="50" y1="450" x2="450" y2="450" stroke="#475569" strokeWidth="3" />

                    {/* Axis Labels with Better Styling */}
                    {Array.from({ length: 11 }, (_, i) => (
                      <g key={i}>
                        <text
                          x={50 + i * 40}
                          y="470"
                          textAnchor="middle"
                          className="text-sm font-medium fill-slate-600"
                        >
                          {i}
                        </text>
                        <text
                          x="30"
                          y={455 - i * 40}
                          textAnchor="middle"
                          className="text-sm font-medium fill-slate-600"
                        >
                          {i}
                        </text>
                        {/* Tick marks */}
                        <line x1={50 + i * 40} y1="445" x2={50 + i * 40} y2="455" stroke="#64748b" strokeWidth="2" />
                        <line x1="45" y1={450 - i * 40} x2="55" y2={450 - i * 40} stroke="#64748b" strokeWidth="2" />
                      </g>
                    ))}

                    {/* Enhanced Axis Titles */}
                    <text x="250" y="495" textAnchor="middle" className="text-lg font-semibold fill-slate-700">
                      East (km)
                    </text>
                    <text
                      x="15"
                      y="250"
                      textAnchor="middle"
                      className="text-lg font-semibold fill-slate-700"
                      transform="rotate(-90 15 250)"
                    >
                      North (km)
                    </text>

                    {/* Enhanced Origin */}
                    <circle cx="50" cy="450" r="6" fill="#1e293b" stroke="white" strokeWidth="2" />
                    <text x="30" y="470" className="text-sm font-bold fill-slate-700">
                      Origin
                    </text>

                    {/* Vector 1: 3km East (Enhanced Blue) */}
                    <line
                      x1="50"
                      y1="450"
                      x2="170"
                      y2="450"
                      stroke="url(#blueGradient)"
                      strokeWidth="4"
                      markerEnd="url(#arrowhead-blue)"
                      className="drop-shadow-sm"
                    />
                    <rect x="85" y="425" width="70" height="20" rx="10" fill="white" stroke="#3b82f6" strokeWidth="1" />
                    <text x="120" y="438" textAnchor="middle" className="text-sm font-bold fill-blue-600">
                      3km East
                    </text>

                    {/* Vector 2: 4km North (Enhanced Red) */}
                    <line
                      x1="170"
                      y1="450"
                      x2="170"
                      y2="290"
                      stroke="url(#redGradient)"
                      strokeWidth="4"
                      markerEnd="url(#arrowhead-red)"
                      className="drop-shadow-sm"
                    />
                    <rect
                      x="175"
                      y="360"
                      width="75"
                      height="20"
                      rx="10"
                      fill="white"
                      stroke="#ef4444"
                      strokeWidth="1"
                    />
                    <text x="212" y="373" textAnchor="middle" className="text-sm font-bold fill-red-600">
                      4km North
                    </text>

                    {/* Total Displacement Vector (Enhanced Green) */}
                    <line
                      x1="50"
                      y1="450"
                      x2="170"
                      y2="290"
                      stroke="url(#greenGradient)"
                      strokeWidth="4"
                      strokeDasharray="12,6"
                      markerEnd="url(#arrowhead-green)"
                      className="drop-shadow-sm"
                    />
                    <rect
                      x="75"
                      y="355"
                      width="110"
                      height="35"
                      rx="12"
                      fill="white"
                      stroke="#22c55e"
                      strokeWidth="2"
                    />
                    <text x="130" y="370" textAnchor="middle" className="text-sm font-bold fill-green-600">
                      Total Displacement
                    </text>
                    <text x="130" y="385" textAnchor="middle" className="text-xs font-medium fill-green-600">
                      Magnitude: 5km
                    </text>
                  </svg>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-slate-600">
                        Mouse: ({mousePos.x}, {mousePos.y})
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Input Panel */}
          <div className="space-y-6">
            {/* Answer Section */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Solve the Challenge
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Vector Components</label>
                    <div className="flex items-center gap-2 text-lg">
                      <span className="text-slate-600">(</span>
                      <Input
                        type="number"
                        value={vectorX}
                        onChange={(e) => {
                          setVectorX(e.target.value)
                          resetFeedback()
                        }}
                        className="w-20 text-center font-mono text-lg border-2 border-slate-200 focus:border-purple-400 transition-colors"
                        placeholder="x"
                      />
                      <span className="text-slate-600">,</span>
                      <Input
                        type="number"
                        value={vectorY}
                        onChange={(e) => {
                          setVectorY(e.target.value)
                          resetFeedback()
                        }}
                        className="w-20 text-center font-mono text-lg border-2 border-slate-200 focus:border-purple-400 transition-colors"
                        placeholder="y"
                      />
                      <span className="text-slate-600">) km</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Straight-line Distance</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={distance}
                        onChange={(e) => {
                          setDistance(e.target.value)
                          resetFeedback()
                        }}
                        className="w-24 text-center font-mono text-lg border-2 border-slate-200 focus:border-purple-400 transition-colors"
                        placeholder="0"
                      />
                      <span className="text-slate-600 text-lg">km</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={checkAnswer}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      Check Answer
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowHint(!showHint)}
                      className="px-4 border-2 border-purple-200 text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-300"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </Button>
                  </div>

                  {showHint && (
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 p-4 rounded-xl animate-in slide-in-from-top-2 duration-300">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">💡</span>
                        </div>
                        <div>
                          <p className="font-semibold text-amber-800 mb-1">Pythagorean Theorem</p>
                          <p className="text-sm text-amber-700">
                            For a right triangle:{" "}
                            <code className="bg-amber-100 px-2 py-1 rounded font-mono">√(a² + b²)</code>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {feedback.show && (
                    <div
                      className={`border-2 p-4 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2 duration-300 ${
                        feedback.correct
                          ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                          : "bg-gradient-to-r from-red-50 to-rose-50 border-red-200"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          feedback.correct ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {feedback.correct ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <XCircle className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div>
                        <p className={`font-semibold mb-1 ${feedback.correct ? "text-green-800" : "text-red-800"}`}>
                          {feedback.correct ? "Excellent Work!" : "Keep Trying!"}
                        </p>
                        <p className={`text-sm ${feedback.correct ? "text-green-700" : "text-red-700"}`}>
                          {feedback.message}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Context Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Navigation className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 mb-2">Real-World Application</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      GPS navigation systems use vector mathematics to calculate optimal routes. Understanding vector
                      addition is fundamental for data science, computer graphics, and machine learning algorithms.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
