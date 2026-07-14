"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { TrendingUp, Calculator, Eye, Target } from "lucide-react"

// Profit function: f(p,a) = 1000p - p² + 50a - a²
const profitFunction = (p: number, a: number) => {
  return 1000 * p - p * p + 50 * a - a * a
}

// Partial derivatives
const partialP = (p: number) => 1000 - 2 * p
const partialA = (a: number) => 50 - 2 * a

// Generate contour data
const generateContourData = () => {
  const contours = []
  const levels = [50000, 100000, 150000, 200000, 240000, 250000]

  for (const level of levels) {
    const points = []
    // Approximate contour lines by sampling
    for (let p = 0; p <= 600; p += 10) {
      for (let a = 0; a <= 30; a += 0.5) {
        const profit = profitFunction(p, a)
        if (Math.abs(profit - level) < 2000) {
          points.push({ p, a })
        }
      }
    }
    contours.push({ level, points })
  }
  return contours
}

export default function PartialDerivatives2D() {
  const [price, setPrice] = useState([400])
  const [advertising, setAdvertising] = useState([20])
  const [showPriceDerivative, setShowPriceDerivative] = useState(false)
  const [showAdvertisingDerivative, setShowAdvertisingDerivative] = useState(false)

  const currentProfit = profitFunction(price[0], advertising[0])
  const currentPartialP = partialP(price[0])
  const currentPartialA = partialA(advertising[0])

  const contourData = useMemo(() => generateContourData(), [])

  // Generate cross-section data
  const priceSliceData = useMemo(() => {
    const data = []
    for (let p = 0; p <= 600; p += 10) {
      data.push({ p, profit: profitFunction(p, advertising[0]) })
    }
    return data
  }, [advertising[0]])

  const advertisingSliceData = useMemo(() => {
    const data = []
    for (let a = 0; a <= 30; a += 1) {
      data.push({ a, profit: profitFunction(price[0], a) })
    }
    return data
  }, [price[0]])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-blue-200/50 shadow-sm">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Advanced Calculus</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Profit Optimization for Business
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Explore how partial derivatives help optimize business decisions using contour plots and cross-sections
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Visualizations */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contour Plot */}
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Target className="w-6 h-6" />
                  Profit Contour Map
                </CardTitle>
                <p className="text-blue-100">Level curves showing equal profit regions</p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-blue-100">
                  <svg width="100%" height="400" viewBox="0 0 700 350" className="bg-white rounded-xl shadow-inner">
                    {/* Grid */}
                    <defs>
                      <pattern id="grid" width="50" height="35" patternUnits="userSpaceOnUse">
                        <path d="M 50 0 L 0 0 0 35" fill="none" stroke="#f1f5f9" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />

                    {/* Axes */}
                    <line x1="50" y1="300" x2="650" y2="300" stroke="#374151" strokeWidth="2" />
                    <line x1="50" y1="50" x2="50" y2="300" stroke="#374151" strokeWidth="2" />

                    {/* Axis labels */}
                    <text x="350" y="330" textAnchor="middle" className="text-sm font-medium fill-slate-700">
                      Price ($)
                    </text>
                    <text
                      x="25"
                      y="175"
                      textAnchor="middle"
                      className="text-sm font-medium fill-slate-700"
                      transform="rotate(-90 25 175)"
                    >
                      Advertising ($1000s)
                    </text>

                    {/* Tick marks and labels */}
                    {[0, 100, 200, 300, 400, 500, 600].map((p) => (
                      <g key={p}>
                        <line x1={50 + p} y1="295" x2={50 + p} y2="305" stroke="#64748b" strokeWidth="1" />
                        <text x={50 + p} y="320" textAnchor="middle" className="text-xs fill-slate-600">
                          {p}
                        </text>
                      </g>
                    ))}

                    {[0, 5, 10, 15, 20, 25, 30].map((a) => (
                      <g key={a}>
                        <line
                          x1="45"
                          y1={300 - a * 8.33}
                          x2="55"
                          y2={300 - a * 8.33}
                          stroke="#64748b"
                          strokeWidth="1"
                        />
                        <text x="40" y={305 - a * 8.33} textAnchor="end" className="text-xs fill-slate-600">
                          {a}
                        </text>
                      </g>
                    ))}

                    {/* Contour lines */}
                    {contourData.map((contour, idx) => (
                      <g key={contour.level}>
                        {contour.points.map((point, pointIdx) => (
                          <circle
                            key={pointIdx}
                            cx={50 + point.p}
                            cy={300 - point.a * 8.33}
                            r="1"
                            fill={`hsl(${220 + idx * 20}, 70%, ${60 + idx * 5}%)`}
                          />
                        ))}
                        <text
                          x={50 + (contour.points[0]?.p || 0)}
                          y={300 - (contour.points[0]?.a || 0) * 8.33 - 5}
                          className="text-xs font-medium"
                          fill={`hsl(${220 + idx * 20}, 70%, 40%)`}
                        >
                          ${(contour.level / 1000).toFixed(0)}k
                        </text>
                      </g>
                    ))}

                    {/* Current point */}
                    <circle
                      cx={50 + price[0]}
                      cy={300 - advertising[0] * 8.33}
                      r="8"
                      fill="#ef4444"
                      stroke="white"
                      strokeWidth="3"
                    />

                    {/* Partial derivative arrows */}
                    {showPriceDerivative && (
                      <g>
                        <line
                          x1={50 + price[0]}
                          y1={300 - advertising[0] * 8.33}
                          x2={50 + price[0] + 50}
                          y2={300 - advertising[0] * 8.33}
                          stroke="#22c55e"
                          strokeWidth="3"
                          markerEnd="url(#arrow-green)"
                        />
                        <text
                          x={50 + price[0] + 25}
                          y={300 - advertising[0] * 8.33 - 10}
                          textAnchor="middle"
                          className="text-sm font-bold fill-green-600"
                        >
                          ∂f/∂p
                        </text>
                      </g>
                    )}

                    {showAdvertisingDerivative && (
                      <g>
                        <line
                          x1={50 + price[0]}
                          y1={300 - advertising[0] * 8.33}
                          x2={50 + price[0]}
                          y2={300 - advertising[0] * 8.33 - 40}
                          stroke="#f59e0b"
                          strokeWidth="3"
                          markerEnd="url(#arrow-amber)"
                        />
                        <text
                          x={50 + price[0] + 15}
                          y={300 - advertising[0] * 8.33 - 20}
                          className="text-sm font-bold fill-amber-600"
                        >
                          ∂f/∂a
                        </text>
                      </g>
                    )}

                    {/* Arrow markers */}
                    <defs>
                      <marker id="arrow-green" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e" />
                      </marker>
                      <marker id="arrow-amber" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b" />
                      </marker>
                    </defs>
                  </svg>
                </div>
              </CardContent>
            </Card>

            {/* Cross-sections */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Price Cross-section */}
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                  <CardTitle className="text-lg font-bold">Price Cross-Section</CardTitle>
                  <p className="text-green-100 text-sm">Advertising fixed at ${advertising[0]}k</p>
                </CardHeader>
                <CardContent className="p-4">
                  <svg width="100%" height="200" viewBox="0 0 350 200" className="bg-slate-50 rounded-lg">
                    {/* Axes */}
                    <line x1="40" y1="160" x2="320" y2="160" stroke="#374151" strokeWidth="2" />
                    <line x1="40" y1="20" x2="40" y2="160" stroke="#374151" strokeWidth="2" />

                    {/* Plot line */}
                    <path
                      d={`M ${priceSliceData
                        .map((d, i) => `${40 + (d.p / 600) * 280},${160 - (d.profit / 300000) * 140}`)
                        .join(" L ")}`}
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="3"
                    />

                    {/* Current point */}
                    <circle
                      cx={40 + (price[0] / 600) * 280}
                      cy={160 - (currentProfit / 300000) * 140}
                      r="5"
                      fill="#ef4444"
                      stroke="white"
                      strokeWidth="2"
                    />

                    {/* Tangent line for derivative */}
                    {showPriceDerivative && (
                      <line
                        x1={40 + (price[0] / 600) * 280 - 30}
                        y1={160 - (currentProfit / 300000) * 140 + (currentPartialP / 1000) * 30}
                        x2={40 + (price[0] / 600) * 280 + 30}
                        y2={160 - (currentProfit / 300000) * 140 - (currentPartialP / 1000) * 30}
                        stroke="#22c55e"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                    )}

                    {/* Labels */}
                    <text x="180" y="190" textAnchor="middle" className="text-xs font-medium fill-slate-700">
                      Price ($)
                    </text>
                    <text
                      x="15"
                      y="90"
                      textAnchor="middle"
                      className="text-xs font-medium fill-slate-700"
                      transform="rotate(-90 15 90)"
                    >
                      Profit ($)
                    </text>
                  </svg>
                </CardContent>
              </Card>

              {/* Advertising Cross-section */}
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                  <CardTitle className="text-lg font-bold">Advertising Cross-Section</CardTitle>
                  <p className="text-amber-100 text-sm">Price fixed at ${price[0]}</p>
                </CardHeader>
                <CardContent className="p-4">
                  <svg width="100%" height="200" viewBox="0 0 350 200" className="bg-slate-50 rounded-lg">
                    {/* Axes */}
                    <line x1="40" y1="160" x2="320" y2="160" stroke="#374151" strokeWidth="2" />
                    <line x1="40" y1="20" x2="40" y2="160" stroke="#374151" strokeWidth="2" />

                    {/* Plot line */}
                    <path
                      d={`M ${advertisingSliceData
                        .map((d, i) => `${40 + (d.a / 30) * 280},${160 - (d.profit / 300000) * 140}`)
                        .join(" L ")}`}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="3"
                    />

                    {/* Current point */}
                    <circle
                      cx={40 + (advertising[0] / 30) * 280}
                      cy={160 - (currentProfit / 300000) * 140}
                      r="5"
                      fill="#ef4444"
                      stroke="white"
                      strokeWidth="2"
                    />

                    {/* Tangent line for derivative */}
                    {showAdvertisingDerivative && (
                      <line
                        x1={40 + (advertising[0] / 30) * 280 - 30}
                        y1={160 - (currentProfit / 300000) * 140 + (currentPartialA / 100) * 30}
                        x2={40 + (advertising[0] / 30) * 280 + 30}
                        y2={160 - (currentProfit / 300000) * 140 - (currentPartialA / 100) * 30}
                        stroke="#f59e0b"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                    )}

                    {/* Labels */}
                    <text x="180" y="190" textAnchor="middle" className="text-xs font-medium fill-slate-700">
                      Advertising ($1000s)
                    </text>
                    <text
                      x="15"
                      y="90"
                      textAnchor="middle"
                      className="text-xs font-medium fill-slate-700"
                      transform="rotate(-90 15 90)"
                    >
                      Profit ($)
                    </text>
                  </svg>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            {/* Current Values */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Current Values
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600">Price:</span>
                    <span className="text-lg font-bold text-slate-800">${price[0]}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600">Advertising:</span>
                    <span className="text-lg font-bold text-slate-800">${advertising[0]}k</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm font-medium text-slate-600">Profit:</span>
                    <span className="text-xl font-bold text-green-600">${currentProfit.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sliders */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                <CardTitle className="text-lg font-bold">Interactive Controls</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700">Price: ${price[0]}</label>
                  <Slider value={price} onValueChange={setPrice} max={600} min={0} step={10} className="w-full" />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700">Advertising: ${advertising[0]}k</label>
                  <Slider
                    value={advertising}
                    onValueChange={setAdvertising}
                    max={30}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Derivative Controls */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Partial Derivatives
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-4">
                  <Button
                    onClick={() => setShowPriceDerivative(!showPriceDerivative)}
                    variant={showPriceDerivative ? "default" : "outline"}
                    className={`w-full ${
                      showPriceDerivative
                        ? "bg-green-600 hover:bg-green-700"
                        : "border-green-600 text-green-600 hover:bg-green-50"
                    }`}
                  >
                    {showPriceDerivative ? "Hide" : "Show"} ∂f/∂p (Price Direction)
                  </Button>

                  <Button
                    onClick={() => setShowAdvertisingDerivative(!showAdvertisingDerivative)}
                    variant={showAdvertisingDerivative ? "default" : "outline"}
                    className={`w-full ${
                      showAdvertisingDerivative
                        ? "bg-amber-600 hover:bg-amber-700"
                        : "border-amber-600 text-amber-600 hover:bg-amber-50"
                    }`}
                  >
                    {showAdvertisingDerivative ? "Hide" : "Show"} ∂f/∂a (Advertising Direction)
                  </Button>
                </div>

                {(showPriceDerivative || showAdvertisingDerivative) && (
                  <div className="space-y-3 pt-4 border-t">
                    {showPriceDerivative && (
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <p className="text-sm font-semibold text-green-800 mb-1">Price Derivative:</p>
                        <p className="text-sm text-green-700 font-mono">∂f/∂p = 1000 - 2p = {currentPartialP}</p>
                        <p className="text-xs text-green-600 mt-1">
                          Profit changes by ${currentPartialP} per $1 price increase
                        </p>
                      </div>
                    )}

                    {showAdvertisingDerivative && (
                      <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                        <p className="text-sm font-semibold text-amber-800 mb-1">Advertising Derivative:</p>
                        <p className="text-sm text-amber-700 font-mono">∂f/∂a = 50 - 2a = {currentPartialA}</p>
                        <p className="text-xs text-amber-600 mt-1">
                          Profit changes by ${currentPartialA} per $1k advertising increase
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mathematical Formulas */}
        <Card className="border-0 shadow-2xl bg-gradient-to-r from-slate-800 to-slate-900 text-white overflow-hidden">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-blue-300">Profit Function</h3>
                <div className="bg-slate-700/50 p-4 rounded-xl font-mono text-lg">f(p,a) = 1000p - p² + 50a - a²</div>
                <p className="text-slate-300 text-sm mt-2">Where p = price ($), a = advertising ($1000s)</p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4 text-green-300">Partial Derivatives</h3>
                <div className="space-y-2">
                  <div className="bg-slate-700/50 p-3 rounded-lg font-mono">∂f/∂p = 1000 - 2p</div>
                  <div className="bg-slate-700/50 p-3 rounded-lg font-mono">∂f/∂a = 50 - 2a</div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-900/30 rounded-xl border border-blue-700/50">
              <h4 className="text-lg font-bold text-blue-300 mb-2">Business Interpretation</h4>
              <p className="text-blue-100 leading-relaxed">
                The contour plot shows profit levels as curved lines - each curve represents points with equal profit.
                The cross-sections show how profit changes along each dimension. At your current settings, increasing
                price by $1 changes profit by ${currentPartialP}, while increasing advertising by $1k changes profit by
                ${currentPartialA}. The tangent lines show the rate of change at your current point!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
