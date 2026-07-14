"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import * as d3 from "d3"

// ==== MATH HELPERS ====

const deg = (radians: number) => (radians * 180) / Math.PI
const rad = (degrees: number) => (degrees * Math.PI) / 180

const apply = (M: number[][], v: number[]) => [M[0][0] * v[0] + M[0][1] * v[1], M[1][0] * v[0] + M[1][1] * v[1]]

const lerpMatrix = (M0: number[][], M1: number[][], t: number) => [
  [M0[0][0] + t * (M1[0][0] - M0[0][0]), M0[0][1] + t * (M1[0][1] - M0[0][1])],
  [M1[1][0] + t * (M1[1][0] - M0[1][0]), M0[1][1] + t * (M1[1][1] - M0[1][1])],
]

const svd2x2 = (A: number[][]) => {
  const [[a, b], [c, d]] = A

  // Compute A^T * A
  const AtA = [
    [a * a + c * c, a * b + c * d],
    [a * b + c * d, b * b + d * d],
  ]

  // Eigenvalues of A^T * A
  const trace = AtA[0][0] + AtA[1][1]
  const det = AtA[0][0] * AtA[1][1] - AtA[0][1] * AtA[1][0]
  const discriminant = Math.sqrt(Math.max(0, trace * trace - 4 * det))

  const lambda1 = (trace + discriminant) / 2
  const lambda2 = (trace - discriminant) / 2

  const sigma1 = Math.sqrt(Math.max(0, lambda1))
  const sigma2 = Math.sqrt(Math.max(0, lambda2))

  // Eigenvectors of A^T * A (V matrix)
  let v1: number[], v2: number[]

  if (Math.abs(AtA[0][1]) > 1e-10) {
    v1 = [AtA[0][1], lambda1 - AtA[0][0]]
    v2 = [AtA[0][1], lambda2 - AtA[0][0]]
  } else {
    v1 = [1, 0]
    v2 = [0, 1]
  }

  // Normalize
  const norm1 = Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1])
  const norm2 = Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1])

  if (norm1 > 1e-10) {
    v1 = [v1[0] / norm1, v1[1] / norm1]
  }
  if (norm2 > 1e-10) {
    v2 = [v2[0] / norm2, v2[1] / norm2]
  }

  const V = [v1, v2]

  // Compute U vectors
  let u1: number[], u2: number[]

  if (sigma1 > 1e-10) {
    const Av1 = apply(A, v1)
    u1 = [Av1[0] / sigma1, Av1[1] / sigma1]
  } else {
    u1 = [1, 0]
  }

  if (sigma2 > 1e-10) {
    const Av2 = apply(A, v2)
    u2 = [Av2[0] / sigma2, Av2[1] / sigma2]
  } else {
    u2 = [-u1[1], u1[0]] // Perpendicular to u1
  }

  const U = [u1, u2]

  return { U, sigma1, sigma2, V }
}

// ==== MAIN COMPONENT ====

export default function SVDExplorer() {
  const svgRef = useRef<SVGSVGElement>(null)
  const animationRef = useRef<number>()

  // Matrix state
  const [matrix, setMatrix] = useState([
    [1.5, 0.5],
    [-0.5, 1.2],
  ])
  const [stage, setStage] = useState(0) // 0=neutral, 1=V^T, 2=Sigma, 3=U, 4=all-at-once
  const [showOverlays, setShowOverlays] = useState(true)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Compute SVD
  const svdResult = useMemo(() => svd2x2(matrix), [matrix])
  const { U, sigma1, sigma2, V } = svdResult

  // Sample points on unit circle
  const samplePoints = useMemo(() => {
    const points = []
    for (let i = 0; i < 32; i++) {
      const angle = (i / 32) * 2 * Math.PI
      points.push([Math.cos(angle), Math.sin(angle)])
    }
    return points
  }, [])

  // Animation function
  const animate = useCallback(
    (targetStage: number) => {
      if (isAnimating) return

      setIsAnimating(true)
      const startTime = Date.now()
      const duration = 1000 // 1 second

      const tick = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easedProgress = d3.easeCubicOut(progress)

        setAnimationProgress(easedProgress)

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(tick)
        } else {
          setStage(targetStage)
          setAnimationProgress(0)
          setIsAnimating(false)
        }
      }

      animationRef.current = requestAnimationFrame(tick)
    },
    [isAnimating],
  )

  // Transform points based on current stage
  const getTransformedPoints = useCallback(
    (points: number[][], currentStage: number, progress: number) => {
      const identity = [
        [1, 0],
        [0, 1],
      ]

      switch (currentStage) {
        case 0:
          return points
        case 1: {
          // V^T rotation
          const VT = [
            [V[0][0], V[1][0]],
            [V[0][1], V[1][1]],
          ]
          const lerpedMatrix = lerpMatrix(identity, VT, progress)
          return points.map((p) => apply(lerpedMatrix, p))
        }
        case 2: {
          // V^T then Sigma
          const VT = [
            [V[0][0], V[1][0]],
            [V[0][1], V[1][1]],
          ]
          const Sigma = [
            [sigma1, 0],
            [0, sigma2],
          ]
          const target = [
            [Sigma[0][0] * VT[0][0], Sigma[0][0] * VT[0][1]],
            [Sigma[1][1] * VT[1][0], Sigma[1][1] * VT[1][1]],
          ]
          const lerpedMatrix = lerpMatrix(VT, target, progress)
          return points.map((p) => apply(lerpedMatrix, p))
        }
        case 3: {
          // Full SVD
          const VT = [
            [V[0][0], V[1][0]],
            [V[0][1], V[1][1]],
          ]
          const Sigma = [
            [sigma1, 0],
            [0, sigma2],
          ]
          const intermediate = [
            [Sigma[0][0] * VT[0][0], Sigma[0][0] * VT[0][1]],
            [Sigma[1][1] * VT[1][0], Sigma[1][1] * VT[1][1]],
          ]
          const lerpedMatrix = lerpMatrix(intermediate, matrix, progress)
          return points.map((p) => apply(lerpedMatrix, p))
        }
        case 4:
          return points.map((p) => apply(matrix, p))
        default:
          return points
      }
    },
    [V, sigma1, sigma2, matrix],
  )

  // Update SVG
  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)

    // ==== GRID ====
    const gridGroup = svg.select(".grid-group")

    // Minor grid lines
    const minorLines = gridGroup.selectAll(".minor-line").data(d3.range(-15, 16))

    minorLines
      .enter()
      .append("line")
      .attr("class", "minor-line")
      .attr("stroke", "#222")
      .attr("stroke-width", 0.5)
      .attr("opacity", 0)
      .merge(minorLines)
      .attr("x1", (d) => d * 20)
      .attr("y1", -240)
      .attr("x2", (d) => d * 20)
      .attr("y2", 240)
      .transition()
      .duration(800)
      .ease(d3.easeCubicOut)
      .attr("opacity", 0.6)

    const minorLinesH = gridGroup.selectAll(".minor-line-h").data(d3.range(-12, 13))

    minorLinesH
      .enter()
      .append("line")
      .attr("class", "minor-line-h")
      .attr("stroke", "#222")
      .attr("stroke-width", 0.5)
      .attr("opacity", 0)
      .merge(minorLinesH)
      .attr("x1", -320)
      .attr("y1", (d) => d * 20)
      .attr("x2", 320)
      .attr("y2", (d) => d * 20)
      .transition()
      .duration(800)
      .ease(d3.easeCubicOut)
      .attr("opacity", 0.6)

    // Axes
    svg
      .select(".x-axis")
      .attr("stroke", "#555")
      .attr("stroke-width", 1)
      .attr("opacity", 0)
      .transition()
      .duration(800)
      .ease(d3.easeCubicOut)
      .attr("opacity", 0.6)

    svg
      .select(".y-axis")
      .attr("stroke", "#555")
      .attr("stroke-width", 1)
      .attr("opacity", 0)
      .transition()
      .duration(800)
      .ease(d3.easeCubicOut)
      .attr("opacity", 0.6)

    // ==== SAMPLE DOTS ====
    const currentPoints = getTransformedPoints(samplePoints, stage, animationProgress)

    const dots = svg.select(".dots-group").selectAll(".sample-dot").data(currentPoints)

    dots
      .enter()
      .append("circle")
      .attr("class", "sample-dot")
      .attr("r", 2)
      .attr("fill", "#888")
      .merge(dots)
      .attr("cx", (d) => d[0] * 100)
      .attr("cy", (d) => -d[1] * 100)

    // ==== VECTORS ====
    const vectorsGroup = svg.select(".vectors-group")

    // V vectors
    if (stage >= 1) {
      const v1Arrow = vectorsGroup.select(".v1-arrow")
      const v2Arrow = vectorsGroup.select(".v2-arrow")

      if (v1Arrow.empty()) {
        vectorsGroup
          .append("line")
          .attr("class", "v1-arrow")
          .attr("stroke", "#4169e1")
          .attr("stroke-width", 3)
          .attr("marker-end", "url(#arrowhead-blue)")
      }

      if (v2Arrow.empty()) {
        vectorsGroup
          .append("line")
          .attr("class", "v2-arrow")
          .attr("stroke", "#ff6347")
          .attr("stroke-width", 3)
          .attr("marker-end", "url(#arrowhead-red)")
      }

      vectorsGroup
        .select(".v1-arrow")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", V[0][0] * 100)
        .attr("y2", -V[0][1] * 100)

      vectorsGroup
        .select(".v2-arrow")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", V[1][0] * 100)
        .attr("y2", -V[1][1] * 100)
    }

    // U vectors
    if (stage >= 3) {
      const u1Arrow = vectorsGroup.select(".u1-arrow")
      const u2Arrow = vectorsGroup.select(".u2-arrow")

      if (u1Arrow.empty()) {
        vectorsGroup
          .append("line")
          .attr("class", "u1-arrow")
          .attr("stroke", "#9932cc")
          .attr("stroke-width", 3)
          .attr("marker-end", "url(#arrowhead-purple)")
      }

      if (u2Arrow.empty()) {
        vectorsGroup
          .append("line")
          .attr("class", "u2-arrow")
          .attr("stroke", "#32cd32")
          .attr("stroke-width", 3)
          .attr("marker-end", "url(#arrowhead-green)")
      }

      vectorsGroup
        .select(".u1-arrow")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", U[0][0] * 100)
        .attr("y2", -U[0][1] * 100)

      vectorsGroup
        .select(".u2-arrow")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", U[1][0] * 100)
        .attr("y2", -U[1][1] * 100)
    }
  }, [stage, animationProgress, samplePoints, getTransformedPoints, V, U])

  // Cleanup animation
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const handleMatrixChange = (i: number, j: number, value: number) => {
    const newMatrix = [...matrix]
    newMatrix[i][j] = value
    setMatrix(newMatrix)
  }

  const reset = () => {
    setMatrix([
      [1.5, 0.5],
      [-0.5, 1.2],
    ])
    setStage(0)
    setAnimationProgress(0)
  }

  const det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
  const norm2 = Math.max(sigma1, sigma2)

  return (
    <div className="w-full h-screen bg-[#0b0c10] text-white flex">
      {/* SVG Canvas */}
      <div className="flex-1 flex items-center justify-center">
        <svg ref={svgRef} viewBox="-320 -240 640 480" className="w-full h-full max-w-4xl max-h-3xl">
          {/* Definitions */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <marker id="arrowhead-blue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#4169e1" />
            </marker>
            <marker id="arrowhead-red" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#ff6347" />
            </marker>
            <marker id="arrowhead-purple" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#9932cc" />
            </marker>
            <marker id="arrowhead-green" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#32cd32" />
            </marker>
          </defs>

          {/* Grid */}
          <g className="grid-group"></g>

          {/* Axes */}
          <line className="x-axis" x1="-320" y1="0" x2="320" y2="0" />
          <line className="y-axis" x1="0" y1="-240" x2="0" y2="240" />

          {/* Unit Circle */}
          <circle
            cx="0"
            cy="0"
            r="100"
            fill="none"
            stroke="#444"
            strokeWidth="1"
            strokeDasharray="5,5"
            filter="url(#glow)"
          />

          {/* Vectors */}
          <g className="vectors-group"></g>

          {/* Sample Dots */}
          <g className="dots-group"></g>

          {/* Text Overlays */}
          {showOverlays && (
            <g className="text-overlays">
              <text x="-300" y="-200" fill="white" fontSize="16" fontFamily="monospace">
                A = U Σ V^T
              </text>
              {stage >= 1 && (
                <text x="-300" y="-180" fill="#4169e1" fontSize="14" fontFamily="monospace">
                  Stage 1: V^T rotation
                </text>
              )}
              {stage >= 2 && (
                <text x="-300" y="-160" fill="#ffa500" fontSize="14" fontFamily="monospace">
                  Stage 2: Σ scaling
                </text>
              )}
              {stage >= 3 && (
                <text x="-300" y="-140" fill="#9932cc" fontSize="14" fontFamily="monospace">
                  Stage 3: U rotation
                </text>
              )}
            </g>
          )}
        </svg>
      </div>

      {/* Control Panel */}
      <div className="w-80 p-6 bg-gray-900 border-l border-gray-700">
        <div className="space-y-6">
          {/* Matrix Input */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Matrix A</h3>
            <div className="grid grid-cols-2 gap-2">
              {matrix.map((row, i) =>
                row.map((val, j) => (
                  <div key={`${i}-${j}`}>
                    <input
                      type="range"
                      min="-3"
                      max="3"
                      step="0.1"
                      value={val}
                      onChange={(e) => handleMatrixChange(i, j, Number.parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-sm text-center mt-1">{val.toFixed(1)}</div>
                  </div>
                )),
              )}
            </div>
          </div>

          {/* Stage Controls */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Animation</h3>
            <div className="space-y-2">
              <button
                onClick={() => animate(1)}
                disabled={isAnimating}
                className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 rounded text-sm"
              >
                ▶ Stage 1 (V^T)
              </button>
              <button
                onClick={() => animate(2)}
                disabled={isAnimating}
                className="w-full px-3 py-2 bg-orange-600 hover:bg-orange-500 disabled:bg-gray-600 rounded text-sm"
              >
                ▶ Stage 2 (Σ)
              </button>
              <button
                onClick={() => animate(3)}
                disabled={isAnimating}
                className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 rounded text-sm"
              >
                ▶ Stage 3 (U)
              </button>
              <button
                onClick={() => animate(4)}
                disabled={isAnimating}
                className="w-full px-3 py-2 bg-red-600 hover:bg-red-500 disabled:bg-gray-600 rounded text-sm"
              >
                ▶ All at once
              </button>
            </div>
          </div>

          {/* Options */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showOverlays}
                onChange={(e) => setShowOverlays(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Show text overlays</span>
            </label>
          </div>

          {/* Numeric Readouts */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Values</h3>
            <div className="space-y-1 text-sm font-mono">
              <div>σ₁: {sigma1.toFixed(3)}</div>
              <div>σ₂: {sigma2.toFixed(3)}</div>
              <div>det(A): {det.toFixed(3)}</div>
              <div>‖A‖₂: {norm2.toFixed(3)}</div>
            </div>
          </div>

          {/* Reset */}
          <button
            onClick={reset}
            className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded font-medium"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}
