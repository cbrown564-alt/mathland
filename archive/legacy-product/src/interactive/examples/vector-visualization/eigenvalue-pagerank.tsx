"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, RotateCcw, CheckCircle, XCircle, Info, Globe } from "lucide-react"

interface Vector {
  x: number
  y: number
  color: string
  label: string
  isEigenvector: boolean
}

export default function EigenvaluePageRank() {
  const [isAnimating, setIsAnimating] = useState(false)
  const [showTransformed, setShowTransformed] = useState(false)
  const [selectedVector, setSelectedVector] = useState<number | null>(null)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [step, setStep] = useState(0)

  // Transformation matrix A = [[0.5, 0.5], [0.5, 0.5]]
  const transformMatrix = [
    [0.5, 0.5],
    [0.5, 0.5],
  ]

  // Original vectors
  const originalVectors: Vector[] = [
    { x: 1, y: 0, color: "#3b82f6", label: "Vector 1: [1,0]", isEigenvector: false },
    { x: 1, y: 1, color: "#22c55e", label: "Vector 2: [1,1]", isEigenvector: true },
    { x: 1, y: -1, color: "#ef4444", label: "Vector 3: [1,-1]", isEigenvector: false },
  ]

  // Transform a vector using the matrix
  const transformVector = (vector: Vector) => {
    const newX = transformMatrix[0][0] * vector.x + transformMatrix[0][1] * vector.y
    const newY = transformMatrix[1][0] * vector.x + transformMatrix[1][1] * vector.y
    return { ...vector, x: newX, y: newY }
  }

  const transformedVectors = originalVectors.map(transformVector)

  const playAnimation = () => {
    setIsAnimating(true)
    setStep(1)
    setTimeout(() => {
      setShowTransformed(true)
      setStep(2)
      setTimeout(() => {
        setIsAnimating(false)
        setStep(3)
      }, 1000)
    }, 500)
  }

  const reset = () => {
    setIsAnimating(false)
    setShowTransformed(false)
    setSelectedVector(null)
    setHasAnswered(false)
    setIsCorrect(false)
    setStep(0)
  }

  const handleVectorSelection = (index: number) => {
    if (hasAnswered) return
    setSelectedVector(index)
    setHasAnswered(true)
    setIsCorrect(originalVectors[index].isEigenvector)
  }

  // Convert vector coordinates to SVG coordinates
  const toSVG = (x: number, y: number) => ({
    x: 250 + x * 80, // Center at 250, scale by 80
    y: 250 - y * 80, // Flip Y axis, center at 250
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-purple-200/50 shadow-sm">
            <Globe className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Linear Algebra & Web Search</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Eigenvalues & Google PageRank
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Discover how eigenvectors power the algorithm that ranks web pages
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Visualization */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Play className="w-6 h-6" />
                  Vector Transformation Visualization
                </CardTitle>
                <p className="text-purple-100">Watch how different vectors transform under matrix multiplication</p>
              </CardHeader>
              <CardContent className="p-8">
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-blue-100">
                  <svg width="100%" height="500" viewBox="0 0 500 500" className="bg-white rounded-xl shadow-inner">
                    {/* Grid */}
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
                      </pattern>
                      <pattern id="majorGrid" width="80" height="80" patternUnits="userSpaceOnUse">
                        <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                      </pattern>

                      {/* Arrow markers */}
                      <marker id="arrowhead-blue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                      </marker>
                      <marker id="arrowhead-green" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e" />
                      </marker>
                      <marker id="arrowhead-red" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
                      </marker>
                      <marker
                        id="arrowhead-blue-dashed"
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                      >
                        <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" opacity="0.6" />
                      </marker>
                      <marker
                        id="arrowhead-green-dashed"
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                      >
                        <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e" opacity="0.6" />
                      </marker>
                      <marker
                        id="arrowhead-red-dashed"
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                      >
                        <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" opacity="0.6" />
                      </marker>
                    </defs>

                    <rect width="100%" height="100%" fill="url(#grid)" />
                    <rect width="100%" height="100%" fill="url(#majorGrid)" />

                    {/* Axes */}
                    <line x1="50" y1="250" x2="450" y2="250" stroke="#374151" strokeWidth="2" />
                    <line x1="250" y1="50" x2="250" y2="450" stroke="#374151" strokeWidth="2" />

                    {/* Axis labels */}
                    <text x="460" y="255" className="text-sm font-medium fill-slate-700">
                      x
                    </text>
                    <text x="255" y="45" className="text-sm font-medium fill-slate-700">
                      y
                    </text>

                    {/* Grid labels */}
                    {[-2, -1, 1, 2].map((val) => (
                      <g key={val}>
                        <text x={250 + val * 80} y="270" textAnchor="middle" className="text-xs fill-slate-600">
                          {val}
                        </text>
                        <text x="235" y={250 - val * 80 + 5} textAnchor="end" className="text-xs fill-slate-600">
                          {val}
                        </text>
                      </g>
                    ))}

                    {/* Original vectors */}
                    {originalVectors.map((vector, index) => {
                      const svgPos = toSVG(vector.x, vector.y)
                      const isSelected = selectedVector === index
                      const strokeWidth = isSelected ? 6 : 4

                      return (
                        <g key={`original-${index}`}>
                          <line
                            x1="250"
                            y1="250"
                            x2={svgPos.x}
                            y2={svgPos.y}
                            stroke={vector.color}
                            strokeWidth={strokeWidth}
                            markerEnd={`url(#arrowhead-${vector.color === "#3b82f6" ? "blue" : vector.color === "#22c55e" ? "green" : "red"})`}
                            className={`transition-all duration-300 cursor-pointer hover:opacity-80 ${
                              showTransformed ? "opacity-50" : "opacity-100"
                            }`}
                            onClick={() => handleVectorSelection(index)}
                          />
                          <text
                            x={svgPos.x + 10}
                            y={svgPos.y - 10}
                            className="text-sm font-medium cursor-pointer"
                            fill={vector.color}
                            onClick={() => handleVectorSelection(index)}
                          >
                            {vector.label}
                          </text>
                        </g>
                      )
                    })}

                    {/* Transformed vectors */}
                    {showTransformed &&
                      transformedVectors.map((vector, index) => {
                        const svgPos = toSVG(vector.x, vector.y)
                        const isSelected = selectedVector === index

                        return (
                          <g key={`transformed-${index}`} className="animate-in fade-in duration-1000">
                            <line
                              x1="250"
                              y1="250"
                              x2={svgPos.x}
                              y2={svgPos.y}
                              stroke={vector.color}
                              strokeWidth="4"
                              strokeDasharray="8,4"
                              markerEnd={`url(#arrowhead-${vector.color === "#3b82f6" ? "blue" : vector.color === "#22c55e" ? "green" : "red"}-dashed)`}
                              className="transition-all duration-1000"
                            />
                            <text
                              x={svgPos.x + 10}
                              y={svgPos.y + 15}
                              className="text-sm font-medium"
                              fill={vector.color}
                            >
                              A{originalVectors[index].label.split(":")[1]}
                            </text>
                          </g>
                        )
                      })}

                    {/* Origin point */}
                    <circle cx="250" cy="250" r="4" fill="#374151" />
                    <text x="260" y="265" className="text-xs fill-slate-600">
                      Origin
                    </text>
                  </svg>

                  {/* Controls */}
                  <div className="flex justify-center gap-4 mt-6">
                    <Button
                      onClick={playAnimation}
                      disabled={isAnimating}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {isAnimating ? "Transforming..." : "Play Transformation"}
                    </Button>
                    <Button
                      onClick={reset}
                      variant="outline"
                      className="border-slate-300 text-slate-600 hover:bg-slate-50 py-2 px-6 rounded-xl bg-transparent"
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
            {/* Step Counter */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                <CardTitle className="text-lg font-bold">Transformation Steps</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className={`flex items-center gap-2 ${step >= 0 ? "text-slate-800" : "text-slate-400"}`}>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 0 ? "bg-green-500 text-white" : "bg-slate-200"}`}
                    >
                      1
                    </div>
                    <span className="text-sm">Original vectors shown</span>
                  </div>
                  <div className={`flex items-center gap-2 ${step >= 1 ? "text-slate-800" : "text-slate-400"}`}>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? "bg-green-500 text-white" : "bg-slate-200"}`}
                    >
                      2
                    </div>
                    <span className="text-sm">Apply matrix transformation</span>
                  </div>
                  <div className={`flex items-center gap-2 ${step >= 2 ? "text-slate-800" : "text-slate-400"}`}>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? "bg-green-500 text-white" : "bg-slate-200"}`}
                    >
                      3
                    </div>
                    <span className="text-sm">Compare directions</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Question */}
            {step >= 2 && (
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden animate-in slide-in-from-right duration-500">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                  <CardTitle className="text-lg font-bold">Interactive Question</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <p className="text-slate-700 font-medium">
                    Which vector maintains its direction after transformation?
                  </p>
                  <div className="space-y-2">
                    {originalVectors.map((vector, index) => (
                      <Button
                        key={index}
                        onClick={() => handleVectorSelection(index)}
                        disabled={hasAnswered}
                        variant={selectedVector === index ? "default" : "outline"}
                        className={`w-full justify-start ${
                          selectedVector === index
                            ? vector.isEigenvector
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-red-600 hover:bg-red-700"
                            : `border-2 hover:bg-slate-50`
                        }`}
                        style={{
                          borderColor: hasAnswered && selectedVector === index ? "transparent" : vector.color,
                        }}
                      >
                        <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: vector.color }}></div>
                        {vector.label}
                      </Button>
                    ))}
                  </div>

                  {hasAnswered && (
                    <div
                      className={`p-4 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2 duration-300 ${
                        isCorrect
                          ? "bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200"
                          : "bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCorrect ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <XCircle className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div>
                        <p className={`font-semibold mb-1 ${isCorrect ? "text-green-800" : "text-red-800"}`}>
                          {isCorrect ? "Correct!" : "Not quite!"}
                        </p>
                        <p className={`text-sm ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                          {isCorrect
                            ? "Vector [1,1] is an eigenvector! It maintains its direction because A[1,1] = [1,1]."
                            : "The green vector [1,1] is the eigenvector. It's the only one that doesn't change direction."}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Matrix Info */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-purple-50 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Info className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 mb-2">Transformation Matrix</h4>
                    <div className="bg-white p-3 rounded-lg border font-mono text-sm">A = [[0.5, 0.5], [0.5, 0.5]]</div>
                  </div>
                </div>
                <div className="text-sm text-slate-600 space-y-2">
                  <p>
                    <strong>Eigenvalue equation:</strong> Av = λv
                  </p>
                  <p>For vector [1,1]: A[1,1] = [1,1] = 1×[1,1]</p>
                  <p>So λ = 1 and [1,1] is an eigenvector!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* PageRank Connection */}
        <Card className="border-0 shadow-2xl bg-gradient-to-r from-blue-600 to-purple-700 text-white overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Google PageRank Connection</h2>
                <p className="text-blue-100">How eigenvectors power web search</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-blue-200">The PageRank Algorithm</h3>
                <div className="space-y-3 text-blue-100 text-sm">
                  <p>
                    • <strong>Web pages as vectors:</strong> Each page has an importance score
                  </p>
                  <p>
                    • <strong>Links as matrix:</strong> How importance flows between pages
                  </p>
                  <p>
                    • <strong>Steady state:</strong> The eigenvector represents final page rankings
                  </p>
                  <p>
                    • <strong>Dominant eigenvalue:</strong> Usually λ = 1 for web link matrices
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4 text-green-200">Why Eigenvectors Matter</h3>
                <div className="space-y-3 text-green-100 text-sm">
                  <p>
                    • <strong>Stability:</strong> Rankings don't change after convergence
                  </p>
                  <p>
                    • <strong>Authority:</strong> Important pages link to other important pages
                  </p>
                  <p>
                    • <strong>Scalability:</strong> Works for billions of web pages
                  </p>
                  <p>
                    • <strong>Mathematical foundation:</strong> Reliable, repeatable results
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-white/10 rounded-xl border border-white/20">
              <h4 className="text-lg font-bold text-white mb-2">Key Insight</h4>
              <p className="text-blue-100 leading-relaxed">
                In our example, the eigenvector [1,1] represents equal importance distribution. In PageRank, the
                eigenvector of the web link matrix gives us the relative importance of all web pages. The pages with
                higher values in this eigenvector rank higher in search results!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
