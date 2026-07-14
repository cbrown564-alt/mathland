"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import * as d3 from "d3"

type Vector = { x: number; y: number }
type Mode = "Add" | "Subtract" | "Scalar" | "Dot"

export default function VectorPlayground() {
  // ===== State Management =====
  const [vectorA, setVectorA] = useState<Vector>({ x: 2, y: 1 })
  const [vectorB, setVectorB] = useState<Vector>({ x: -1, y: 1 })
  const [scalarK, setScalarK] = useState(1)
  const [mode, setMode] = useState<Mode>("Add")
  const svgRef = useRef<SVGSVGElement>(null)
  const dragRef = useRef<{ vector: "A" | "B"; isDragging: boolean }>({ vector: "A", isDragging: false })

  // ===== Vector Math Helpers =====
  const length = useCallback((v: Vector): number => {
    return Math.sqrt(v.x * v.x + v.y * v.y)
  }, [])

  const dot = useCallback((u: Vector, v: Vector): number => {
    return u.x * v.x + u.y * v.y
  }, [])

  const scale = useCallback((v: Vector, k: number): Vector => {
    return { x: v.x * k, y: v.y * k }
  }, [])

  const add = useCallback((u: Vector, v: Vector): Vector => {
    return { x: u.x + v.x, y: u.y + v.y }
  }, [])

  const sub = useCallback((u: Vector, v: Vector): Vector => {
    return { x: u.x - v.x, y: u.y - v.y }
  }, [])

  const proj = useCallback(
    (u: Vector, v: Vector): Vector => {
      const vLength = length(v)
      if (vLength === 0) return { x: 0, y: 0 }
      const scalar = dot(u, v) / (vLength * vLength)
      return scale(v, scalar)
    },
    [length, dot, scale],
  )

  const angle = useCallback(
    (u: Vector, v: Vector): number => {
      const lenU = length(u)
      const lenV = length(v)
      if (lenU === 0 || lenV === 0) return 0
      const cosTheta = dot(u, v) / (lenU * lenV)
      return Math.acos(Math.max(-1, Math.min(1, cosTheta))) * (180 / Math.PI)
    },
    [length, dot],
  )

  // ===== Coordinate Conversion =====
  const toScreen = useCallback((v: Vector): Vector => {
    return { x: v.x * 40, y: -v.y * 40 } // Scale and flip Y
  }, [])

  const fromScreen = useCallback((screenPos: Vector): Vector => {
    return { x: screenPos.x / 40, y: -screenPos.y / 40 } // Scale and flip Y back
  }, [])

  // ===== Drawing Functions =====
  const drawArrow = useCallback(
    (
      svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
      start: Vector,
      end: Vector,
      color: string,
      className: string,
      strokeWidth = 2,
    ) => {
      const startScreen = toScreen(start)
      const endScreen = toScreen(end)

      const dx = endScreen.x - startScreen.x
      const dy = endScreen.y - startScreen.y
      const length = Math.sqrt(dx * dx + dy * dy)

      if (length < 1) return

      const angle = Math.atan2(dy, dx)
      const arrowLength = 12
      const arrowAngle = Math.PI / 6

      // Arrow line
      svg
        .select(`.${className}-line`)
        .attr("x1", startScreen.x)
        .attr("y1", startScreen.y)
        .attr("x2", endScreen.x)
        .attr("y2", endScreen.y)
        .attr("stroke", color)
        .attr("stroke-width", strokeWidth)

      // Arrow head
      const headX1 = endScreen.x - arrowLength * Math.cos(angle - arrowAngle)
      const headY1 = endScreen.y - arrowLength * Math.sin(angle - arrowAngle)
      const headX2 = endScreen.x - arrowLength * Math.cos(angle + arrowAngle)
      const headY2 = endScreen.y - arrowLength * Math.sin(angle + arrowAngle)

      svg
        .select(`.${className}-head`)
        .attr(
          "d",
          `M ${endScreen.x} ${endScreen.y} L ${headX1} ${headY1} M ${endScreen.x} ${endScreen.y} L ${headX2} ${headY2}`,
        )
        .attr("stroke", color)
        .attr("stroke-width", strokeWidth)
    },
    [toScreen],
  )

  const drawDashedLine = useCallback(
    (
      svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
      start: Vector,
      end: Vector,
      color: string,
      className: string,
    ) => {
      const startScreen = toScreen(start)
      const endScreen = toScreen(end)

      svg
        .select(`.${className}`)
        .attr("x1", startScreen.x)
        .attr("y1", startScreen.y)
        .attr("x2", endScreen.x)
        .attr("y2", endScreen.y)
        .attr("stroke", color)
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "4,4")
        .attr("opacity", 0.8)
    },
    [toScreen],
  )

  // ===== Initialization =====
  const initializeVisualization = useCallback(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    // ===== SVG Filters =====
    const defs = svg.append("defs")

    const glowFilter = defs
      .append("filter")
      .attr("id", "glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%")

    glowFilter.append("feGaussianBlur").attr("stdDeviation", "2").attr("result", "coloredBlur")
    const feMerge = glowFilter.append("feMerge")
    feMerge.append("feMergeNode").attr("in", "coloredBlur")
    feMerge.append("feMergeNode").attr("in", "SourceGraphic")

    // ===== Background =====
    svg.append("rect").attr("x", -320).attr("y", -240).attr("width", 640).attr("height", 480).attr("fill", "#0b0c10")

    // ===== Grid =====
    const gridGroup = svg.append("g").attr("class", "grid")

    // Minor grid lines
    for (let i = -300; i <= 300; i += 40) {
      if (i !== 0) {
        gridGroup
          .append("line")
          .attr("x1", i)
          .attr("y1", -240)
          .attr("x2", i)
          .attr("y2", 240)
          .attr("stroke", "#222")
          .attr("stroke-width", 0.5)
          .attr("opacity", 0)

        gridGroup
          .append("line")
          .attr("x1", -320)
          .attr("y1", i)
          .attr("x2", 320)
          .attr("y2", i)
          .attr("stroke", "#222")
          .attr("stroke-width", 0.5)
          .attr("opacity", 0)
      }
    }

    // Major axes
    gridGroup
      .append("line")
      .attr("x1", -320)
      .attr("y1", 0)
      .attr("x2", 320)
      .attr("y2", 0)
      .attr("stroke", "#555")
      .attr("stroke-width", 1)
      .attr("opacity", 0)

    gridGroup
      .append("line")
      .attr("x1", 0)
      .attr("y1", -240)
      .attr("x2", 0)
      .attr("y2", 240)
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

    // ===== Unit Circle =====
    svg
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 40)
      .attr("fill", "none")
      .attr("stroke", "#444")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "3,3")
      .attr("filter", "url(#glow)")
      .attr("opacity", 0)
      .transition()
      .delay(400)
      .duration(600)
      .attr("opacity", 0.5)

    // ===== Vector Elements =====
    // Vector A
    svg.append("line").attr("class", "vector-a-line")
    svg.append("path").attr("class", "vector-a-head").attr("fill", "none")
    svg
      .append("circle")
      .attr("class", "vector-a-handle")
      .attr("r", 6)
      .attr("fill", "royalblue")
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .style("cursor", "grab")

    // Vector B
    svg.append("line").attr("class", "vector-b-line")
    svg.append("path").attr("class", "vector-b-head").attr("fill", "none")
    svg
      .append("circle")
      .attr("class", "vector-b-handle")
      .attr("r", 6)
      .attr("fill", "tomato")
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .style("cursor", "grab")

    // Vector C (result)
    svg.append("line").attr("class", "vector-c-line").attr("opacity", 0)
    svg.append("path").attr("class", "vector-c-head").attr("fill", "none").attr("opacity", 0)

    // Parallelogram lines
    svg.append("line").attr("class", "para-line-1").attr("opacity", 0)
    svg.append("line").attr("class", "para-line-2").attr("opacity", 0)

    // Projection line
    svg.append("line").attr("class", "projection-line").attr("opacity", 0)

    // Angle arc
    svg.append("path").attr("class", "angle-arc").attr("fill", "none").attr("opacity", 0)

    // Angle label
    svg
      .append("text")
      .attr("class", "angle-label")
      .attr("fill", "white")
      .attr("font-size", "12")
      .attr("text-anchor", "middle")
      .attr("opacity", 0)

    setupDragBehavior()
  }, [])

  // ===== Drag Behavior =====
  const setupDragBehavior = useCallback(() => {
    const svg = d3.select(svgRef.current)

    const dragBehavior = d3
      .drag<SVGCircleElement, unknown>()
      .on("start", function (event) {
        const element = d3.select(this)
        const isVectorA = element.classed("vector-a-handle")
        dragRef.current = { vector: isVectorA ? "A" : "B", isDragging: true }
        element.style("cursor", "grabbing")
      })
      .on("drag", (event) => {
        const [x, y] = d3.pointer(event, svg.node())
        const constrainedX = Math.max(-300, Math.min(300, x))
        const constrainedY = Math.max(-200, Math.min(200, y))

        const newVector = fromScreen({ x: constrainedX, y: constrainedY })

        if (dragRef.current.vector === "A") {
          setVectorA(newVector)
        } else {
          setVectorB(newVector)
        }
      })
      .on("end", function () {
        d3.select(this).style("cursor", "grab")
        dragRef.current.isDragging = false
      })

    svg.select(".vector-a-handle").call(dragBehavior)
    svg.select(".vector-b-handle").call(dragBehavior)
  }, [fromScreen])

  // ===== Update Visualization =====
  const updateVisualization = useCallback(() => {
    const svg = d3.select(svgRef.current)
    if (!svg.node()) return

    const scaledB = scale(vectorB, scalarK)
    const resultVector = mode === "Add" ? add(vectorA, scaledB) : mode === "Subtract" ? sub(vectorA, scaledB) : scaledB

    // Update vector A
    drawArrow(svg, { x: 0, y: 0 }, vectorA, "royalblue", "vector-a")
    const aScreen = toScreen(vectorA)
    svg.select(".vector-a-handle").attr("cx", aScreen.x).attr("cy", aScreen.y)

    // Update vector B (or scaled B)
    const displayB = mode === "Scalar" ? scaledB : vectorB
    drawArrow(svg, { x: 0, y: 0 }, displayB, "tomato", "vector-b")
    const bScreen = toScreen(displayB)
    svg.select(".vector-b-handle").attr("cx", bScreen.x).attr("cy", bScreen.y)

    // Mode-specific visualizations
    svg
      .selectAll(
        ".vector-c-line, .vector-c-head, .para-line-1, .para-line-2, .projection-line, .angle-arc, .angle-label",
      )
      .attr("opacity", 0)

    if (mode === "Add") {
      // Show result vector and parallelogram
      drawArrow(svg, { x: 0, y: 0 }, resultVector, "springgreen", "vector-c")
      svg.selectAll(".vector-c-line, .vector-c-head").attr("opacity", 1)

      // Parallelogram completion
      drawDashedLine(svg, vectorA, resultVector, "#666", "para-line-1")
      drawDashedLine(svg, scaledB, resultVector, "#666", "para-line-2")
      svg.selectAll(".para-line-1, .para-line-2").attr("opacity", 0.6)
    } else if (mode === "Subtract") {
      // Show A - B
      drawArrow(svg, { x: 0, y: 0 }, resultVector, "violet", "vector-c")
      svg.selectAll(".vector-c-line, .vector-c-head").attr("opacity", 1)

      // Triangle visualization
      drawDashedLine(svg, vectorA, { x: 0, y: 0 }, "#666", "para-line-1")
      drawDashedLine(svg, vectorA, resultVector, "#666", "para-line-2")
      svg.selectAll(".para-line-1, .para-line-2").attr("opacity", 0.6)
    } else if (mode === "Dot") {
      // Show projection
      const projection = proj(vectorA, vectorB)
      drawDashedLine(svg, { x: 0, y: 0 }, projection, "gold", "projection-line")
      drawDashedLine(svg, vectorA, projection, "gold", "para-line-1")
      svg.selectAll(".projection-line, .para-line-1").attr("opacity", 0.8)

      // Angle arc
      const angleRad = angle(vectorA, vectorB) * (Math.PI / 180)
      const arcRadius = 30
      const startAngle = Math.atan2(-vectorA.y, vectorA.x)
      const endAngle = Math.atan2(-vectorB.y, vectorB.x)

      const arc = d3
        .arc()
        .innerRadius(arcRadius)
        .outerRadius(arcRadius)
        .startAngle(Math.min(startAngle, endAngle))
        .endAngle(Math.max(startAngle, endAngle))

      svg
        .select(".angle-arc")
        .attr("d", arc())
        .attr("stroke", "yellow")
        .attr("stroke-width", 2)
        .attr("opacity", 0.8)

      // Angle label
      const midAngle = (startAngle + endAngle) / 2
      const labelRadius = arcRadius + 15
      svg
        .select(".angle-label")
        .attr("x", labelRadius * Math.cos(midAngle))
        .attr("y", -labelRadius * Math.sin(midAngle))
        .text(`${angle(vectorA, vectorB).toFixed(1)}°`)
        .attr("opacity", 1)
    }
  }, [vectorA, vectorB, scalarK, mode, scale, add, sub, proj, angle, drawArrow, drawDashedLine, toScreen])

  // ===== Event Handlers =====
  const handleReset = useCallback(() => {
    setVectorA({ x: 2, y: 1 })
    setVectorB({ x: -1, y: 1 })
    setScalarK(1)
    setMode("Add")
  }, [])

  // ===== Effects =====
  useEffect(() => {
    initializeVisualization()
  }, [initializeVisualization])

  useEffect(() => {
    updateVisualization()
  }, [updateVisualization])

  // ===== Computed Values =====
  const scaledB = scale(vectorB, scalarK)
  const resultVector = mode === "Add" ? add(vectorA, scaledB) : mode === "Subtract" ? sub(vectorA, scaledB) : scaledB
  const dotProduct = dot(vectorA, vectorB)
  const angleValue = angle(vectorA, vectorB)

  // ===== Render =====
  return (
    <div className="w-full h-screen bg-slate-900 p-6 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Vector Playground</h1>

        {/* SVG Canvas */}
        <div className="bg-slate-800 rounded-lg p-4 mb-6">
          <svg ref={svgRef} viewBox="-320 -240 640 480" className="w-full h-96 border border-slate-700 rounded" />
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mode Controls */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-3">Operations</h3>

            <div className="flex flex-wrap gap-2">
              {(["Add", "Subtract", "Scalar", "Dot"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    mode === m ? "bg-blue-600 text-white" : "bg-slate-800 text-gray-300 hover:bg-slate-700"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {mode === "Scalar" && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Scalar k: {scalarK.toFixed(1)}</label>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.1"
                  value={scalarK}
                  onChange={(e) => setScalarK(Number.parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>
            )}

            <button
              onClick={handleReset}
              className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
            >
              Reset
            </button>
          </div>

          {/* Vector Display */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-3">Vectors</h3>

            <div className="bg-slate-800 p-4 rounded-lg font-mono text-sm space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-gray-300">A =</span>
                <span className="text-white">
                  ({vectorA.x.toFixed(1)}, {vectorA.y.toFixed(1)})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-gray-300">B =</span>
                <span className="text-white">
                  ({vectorB.x.toFixed(1)}, {vectorB.y.toFixed(1)})
                </span>
              </div>

              {mode === "Scalar" && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded"></div>
                  <span className="text-gray-300">k·B =</span>
                  <span className="text-white">
                    ({scaledB.x.toFixed(1)}, {scaledB.y.toFixed(1)})
                  </span>
                </div>
              )}

              {(mode === "Add" || mode === "Subtract") && (
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded ${mode === "Add" ? "bg-green-400" : "bg-purple-400"}`}></div>
                  <span className="text-gray-300">{mode === "Add" ? "A + B =" : "A - B ="}</span>
                  <span className="text-white">
                    ({resultVector.x.toFixed(1)}, {resultVector.y.toFixed(1)})
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Calculations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-3">Calculations</h3>

            <div className="bg-slate-800 p-4 rounded-lg space-y-3">
              <div>
                <span className="text-gray-300 text-sm">Length |A|:</span>
                <span className="text-white font-mono ml-2">{length(vectorA).toFixed(2)}</span>
              </div>

              <div>
                <span className="text-gray-300 text-sm">Length |B|:</span>
                <span className="text-white font-mono ml-2">{length(vectorB).toFixed(2)}</span>
              </div>

              <div>
                <span className="text-gray-300 text-sm">Dot Product A·B:</span>
                <span className="text-white font-mono ml-2">{dotProduct.toFixed(2)}</span>
              </div>

              <div>
                <span className="text-gray-300 text-sm">Angle θ:</span>
                <span className="text-white font-mono ml-2">{angleValue.toFixed(1)}°</span>
              </div>
            </div>

            {/* Legend */}
            <div className="text-xs text-gray-400 space-y-1">
              <p>💡 Drag vector endpoints to adjust</p>
              <p>🎯 Switch modes to explore operations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
