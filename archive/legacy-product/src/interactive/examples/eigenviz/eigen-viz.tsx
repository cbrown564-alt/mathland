"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import * as d3 from "d3"

export default function EigenViz() {
  // ===== State Management =====
  const [matrix, setMatrix] = useState({ a: 1, b: 0, c: 0, d: 1 })
  const [isPlaying, setIsPlaying] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)
  const animationRef = useRef<number>()
  const playIntervalRef = useRef<NodeJS.Timeout>()

  // ===== Eigen Math =====
  const eig2x2 = useCallback((a: number, b: number, c: number, d: number) => {
    // Calculate eigenvalues and eigenvectors for 2x2 matrix
    const trace = a + d
    const det = a * d - b * c
    const discriminant = trace * trace - 4 * det

    if (discriminant < 0) {
      // Complex eigenvalues - return real parts and default vectors
      return {
        values: [trace / 2, trace / 2],
        vectors: [
          [1, 0],
          [0, 1],
        ],
      }
    }

    const sqrt_disc = Math.sqrt(discriminant)
    const lambda1 = (trace + sqrt_disc) / 2
    const lambda2 = (trace - sqrt_disc) / 2

    // Calculate eigenvectors
    let v1 = [1, 0],
      v2 = [0, 1]

    if (Math.abs(b) > 1e-10) {
      v1 = [b, lambda1 - a]
      v2 = [b, lambda2 - a]
    } else if (Math.abs(c) > 1e-10) {
      v1 = [lambda1 - d, c]
      v2 = [lambda2 - d, c]
    } else {
      // Diagonal matrix
      v1 = [1, 0]
      v2 = [0, 1]
    }

    // Normalize vectors
    const norm1 = Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1])
    const norm2 = Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1])

    if (norm1 > 1e-10) v1 = [v1[0] / norm1, v1[1] / norm1]
    if (norm2 > 1e-10) v2 = [v2[0] / norm2, v2[1] / norm2]

    return {
      values: [lambda1, lambda2],
      vectors: [v1, v2],
    }
  }, [])

  const generateUnitCircle = useCallback((numPoints = 40) => {
    return Array.from({ length: numPoints }, (_, i) => {
      const angle = (2 * Math.PI * i) / numPoints
      return {
        x: Math.cos(angle) * 100, // Scale to viewBox
        y: Math.sin(angle) * 100,
        id: i,
      }
    })
  }, [])

  const transformPoint = useCallback((x: number, y: number, m: typeof matrix) => {
    return {
      x: m.a * x + m.b * y,
      y: m.c * x + m.d * y,
    }
  }, [])

  // ===== Animation System =====
  const initializeVisualization = useCallback(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    // Add SVG filters
    const defs = svg.append("defs")

    // Glow filter
    const glowFilter = defs
      .append("filter")
      .attr("id", "glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%")

    glowFilter.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "coloredBlur")

    const feMerge = glowFilter.append("feMerge")
    feMerge.append("feMergeNode").attr("in", "coloredBlur")
    feMerge.append("feMergeNode").attr("in", "SourceGraphic")

    // Background
    svg.append("rect").attr("x", -300).attr("y", -300).attr("width", 600).attr("height", 600).attr("fill", "#0b0c10")

    // Grid lines
    const gridGroup = svg.append("g").attr("class", "grid")

    // Minor grid lines
    for (let i = -250; i <= 250; i += 25) {
      if (i !== 0) {
        gridGroup
          .append("line")
          .attr("x1", i)
          .attr("y1", -300)
          .attr("x2", i)
          .attr("y2", 300)
          .attr("stroke", "#222")
          .attr("stroke-width", 0.5)
          .attr("opacity", 0)

        gridGroup
          .append("line")
          .attr("x1", -300)
          .attr("y1", i)
          .attr("x2", 300)
          .attr("y2", i)
          .attr("stroke", "#222")
          .attr("stroke-width", 0.5)
          .attr("opacity", 0)
      }
    }

    // Major axes
    gridGroup
      .append("line")
      .attr("x1", -300)
      .attr("y1", 0)
      .attr("x2", 300)
      .attr("y2", 0)
      .attr("stroke", "#555")
      .attr("stroke-width", 1)
      .attr("opacity", 0)

    gridGroup
      .append("line")
      .attr("x1", 0)
      .attr("y1", -300)
      .attr("x2", 0)
      .attr("y2", 300)
      .attr("stroke", "#555")
      .attr("stroke-width", 1)
      .attr("opacity", 0)

    // Animate grid fade-in
    gridGroup
      .selectAll("line")
      .transition()
      .duration(800)
      .ease(d3.easeCubicOut)
      .attr("opacity", (d, i, nodes) => {
        const line = d3.select(nodes[i])
        return line.attr("stroke") === "#555" ? 1 : 0.6
      })

    // Unit circle
    svg
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 100)
      .attr("fill", "none")
      .attr("stroke", "#666")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "5,5")
      .attr("filter", "url(#glow)")
      .attr("opacity", 0)
      .transition()
      .delay(400)
      .duration(600)
      .attr("opacity", 0.7)

    // Eigen-rays group
    const eigenGroup = svg.append("g").attr("class", "eigen-rays")

    // Sample dots
    const dotsGroup = svg.append("g").attr("class", "sample-dots")
    const unitCirclePoints = generateUnitCircle()

    dotsGroup
      .selectAll("circle")
      .data(unitCirclePoints)
      .enter()
      .append("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", 3)
      .attr("fill", "#8be9fd")
      .attr("opacity", 0)
      .transition()
      .delay((d, i) => 800 + i * 20)
      .duration(300)
      .attr("opacity", 0.8)

    // Transformed dots group
    svg.append("g").attr("class", "transformed-dots")

    updateEigenRays()
  }, [generateUnitCircle])

  const updateEigenRays = useCallback(() => {
    const svg = d3.select(svgRef.current)
    const eigenGroup = svg.select(".eigen-rays")

    const { vectors } = eig2x2(matrix.a, matrix.b, matrix.c, matrix.d)

    eigenGroup.selectAll("line").remove()

    vectors.forEach((vector, i) => {
      const color = i === 0 ? "royalblue" : "tomato"
      const scale = 200 // Extend rays across viewBox

      eigenGroup
        .append("line")
        .attr("x1", -vector[0] * scale)
        .attr("y1", vector[1] * scale)
        .attr("x2", vector[0] * scale)
        .attr("y2", -vector[1] * scale)
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .attr("filter", "url(#glow)")
        .attr("opacity", 0)
        .transition()
        .duration(500)
        .attr("opacity", 0.8)
    })
  }, [matrix, eig2x2])

  const animateTransformation = useCallback(() => {
    const svg = d3.select(svgRef.current)
    const dotsGroup = svg.select(".sample-dots")
    const transformedGroup = svg.select(".transformed-dots")

    // Get current dot positions
    const currentDots = dotsGroup.selectAll("circle").data()

    // Calculate transformed positions
    const transformedDots = currentDots.map((dot) => {
      const transformed = transformPoint(dot.x / 100, dot.y / 100, matrix)
      return {
        ...dot,
        x: transformed.x * 100,
        y: transformed.y * 100,
      }
    })

    // Update sample dots to new positions
    dotsGroup
      .selectAll("circle")
      .data(transformedDots)
      .transition()
      .duration(500)
      .ease(d3.easeQuadInOut)
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", 4)
      .transition()
      .duration(100)
      .attr("r", 3)
  }, [matrix, transformPoint])

  // ===== Event Handlers =====
  const handleSliderChange = useCallback((key: keyof typeof matrix, value: number) => {
    setMatrix((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleReset = useCallback(() => {
    setIsPlaying(false)
    setMatrix({ a: 1, b: 0, c: 0, d: 1 })

    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current)
    }

    // Reset dots to unit circle
    setTimeout(() => {
      const svg = d3.select(svgRef.current)
      const dotsGroup = svg.select(".sample-dots")
      const unitCirclePoints = generateUnitCircle()

      dotsGroup
        .selectAll("circle")
        .data(unitCirclePoints)
        .transition()
        .duration(800)
        .ease(d3.easeCubicOut)
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("opacity", 0.8)
    }, 100)
  }, [generateUnitCircle])

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      const newPlaying = !prev

      if (newPlaying) {
        playIntervalRef.current = setInterval(() => {
          animateTransformation()
        }, 500)
      } else {
        if (playIntervalRef.current) {
          clearInterval(playIntervalRef.current)
        }
      }

      return newPlaying
    })
  }, [animateTransformation])

  // ===== Effects =====
  useEffect(() => {
    initializeVisualization()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current)
      }
    }
  }, [initializeVisualization])

  useEffect(() => {
    updateEigenRays()
  }, [updateEigenRays])

  // ===== Render =====
  return (
    <div className="w-full h-screen bg-slate-900 p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Eigenvalue Visualization</h1>

        {/* SVG Canvas */}
        <div className="bg-slate-800 rounded-lg p-4 mb-6">
          <svg ref={svgRef} viewBox="-300 -300 600 600" className="w-full h-96 border border-slate-700 rounded" />
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Matrix Sliders */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-3">Matrix Controls</h3>

            {(["a", "b", "c", "d"] as const).map((key) => (
              <div key={key} className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  {key.toUpperCase()}: {matrix[key].toFixed(1)}
                </label>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.1"
                  value={matrix[key]}
                  onChange={(e) => handleSliderChange(key, Number.parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            ))}
          </div>

          {/* Matrix Display & Controls */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-3">Matrix A</h3>

            <div className="bg-slate-800 p-4 rounded-lg font-mono text-white">
              <div className="text-center">
                <div className="inline-block">
                  <div className="border-l-2 border-r-2 border-white px-3 py-2">
                    <div className="grid grid-cols-2 gap-4 text-lg">
                      <span>{matrix.a.toFixed(1)}</span>
                      <span>{matrix.b.toFixed(1)}</span>
                      <span>{matrix.c.toFixed(1)}</span>
                      <span>{matrix.d.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={togglePlay}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isPlaying ? "bg-red-600 hover:bg-red-500 text-white" : "bg-blue-600 hover:bg-blue-500 text-white"
                }`}
              >
                {isPlaying ? "Stop" : "Play"}
              </button>

              <button
                onClick={handleReset}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
              >
                Reset
              </button>
            </div>

            <p className="text-sm text-gray-400">
              Adjust sliders to change the transformation matrix. Click Play to see repeated transformations.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  )
}
