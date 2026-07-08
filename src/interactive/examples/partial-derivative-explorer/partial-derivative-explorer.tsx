"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Canvas, useFrame, useThree, extend, type ThreeEvent } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import * as THREE from "three"
import * as d3 from "d3"

extend({ OrbitControls })

// ==== Math Helpers ====
const fx = (f: (x: number, y: number) => number, x: number, y: number, h = 1e-3) => {
  return (f(x + h, y) - f(x - h, y)) / (2 * h)
}

const fy = (f: (x: number, y: number) => number, x: number, y: number, h = 1e-3) => {
  return (f(x, y + h) - f(x, y - h)) / (2 * h)
}

const gradient = (f: (x: number, y: number) => number, x: number, y: number) => {
  return [fx(f, x, y), fy(f, x, y)]
}

// ==== Function Presets ====
const functionPresets = {
  "sin x cos y": (x: number, y: number) => Math.sin(x) * Math.cos(y),
  "x² - y²": (x: number, y: number) => x * x - y * y,
  "e^(-0.1(x²+y²))sin(x)": (x: number, y: number) => Math.exp(-0.1 * (x * x + y * y)) * Math.sin(x),
  custom: (x: number, y: number) => Math.sin(x) * Math.cos(y),
}

type MathFunc = (x: number, y: number) => number
type Point = number[]
type DragHandler = (newPosition: number[]) => void

// ==== Surface Component ====
function Surface({ func, onPointDrag, pointPosition }: { func: MathFunc; onPointDrag: DragHandler; pointPosition: Point }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null)

  const createSurface = useCallback((f: (x: number, y: number) => number) => {
    const resolution = 64
    const domain = 2 * Math.PI
    const vertices = []
    const colors = []
    const indices = []

    const colorScale = d3.scaleSequential(d3.interpolateTurbo).domain([-2, 2])

    for (let i = 0; i <= resolution; i++) {
      for (let j = 0; j <= resolution; j++) {
        const x = -domain + (2 * domain * i) / resolution
        const y = -domain + (2 * domain * j) / resolution
        const z = f(x, y)

        vertices.push(x, y, z)

        const color = new THREE.Color(colorScale(z))
        colors.push(color.r, color.g, color.b)

        if (i < resolution && j < resolution) {
          const a = i * (resolution + 1) + j
          const b = a + 1
          const c = (i + 1) * (resolution + 1) + j
          const d = c + 1

          indices.push(a, b, d)
          indices.push(a, d, c)
        }
      }
    }

    const geom = new THREE.BufferGeometry()
    geom.setIndex(indices)
    geom.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3))
    geom.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3))
    geom.computeVertexNormals()

    return geom
  }, [])

  useEffect(() => {
    const newGeometry = createSurface(func)
    setGeometry(newGeometry)
  }, [func, createSurface])

  return (
    <mesh ref={meshRef} geometry={geometry || undefined} castShadow receiveShadow>
      <meshStandardMaterial vertexColors side={THREE.DoubleSide} />
    </mesh>
  )
}

// ==== Interactive Point ====
function InteractivePoint({ position, onDrag, func }: { position: Point; onDrag: DragHandler; func: MathFunc }) {
  const pointRef = useRef<THREE.Mesh>(null)
  const { camera, gl, scene } = useThree()
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  const isDragging = useRef(false)

  const handlePointerDown = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      isDragging.current = true
      gl.domElement.style.cursor = "grabbing"
    },
    [gl],
  )

  const handlePointerMove = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      if (!isDragging.current) return

      const rect = gl.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)

      // Create a plane at current z level for intersection
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -position[2])
      const intersection = new THREE.Vector3()

      if (raycaster.ray.intersectPlane(plane, intersection)) {
        const newX = Math.max(-2 * Math.PI, Math.min(2 * Math.PI, intersection.x))
        const newY = Math.max(-2 * Math.PI, Math.min(2 * Math.PI, intersection.y))
        const newZ = func(newX, newY)

        onDrag([newX, newY, newZ])
      }
    },
    [camera, gl, onDrag, position, func],
  )

  const handlePointerUp = useCallback(() => {
    isDragging.current = false
    gl.domElement.style.cursor = "grab"
  }, [gl])

  useEffect(() => {
    const element = gl.domElement
    element.addEventListener("pointermove", handlePointerMove)
    element.addEventListener("pointerup", handlePointerUp)

    return () => {
      element.removeEventListener("pointermove", handlePointerMove)
      element.removeEventListener("pointerup", handlePointerUp)
    }
  }, [handlePointerMove, handlePointerUp, gl])

  return (
    <mesh ref={pointRef} position={position} onPointerDown={handlePointerDown}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color="#ff6b6b" emissive="#ff6b6b" emissiveIntensity={0.3} />
    </mesh>
  )
}

// ==== Tangent Plane ====
function TangentPlane({ position, func, visible, opacity }: { position: Point; func: MathFunc; visible: boolean; opacity: number }) {
  const planeRef = useRef<THREE.Mesh>(null)

  const [fx_val, fy_val] = gradient(func, position[0], position[1])
  const normal = new THREE.Vector3(-fx_val, -fy_val, 1).normalize()

  useFrame(() => {
    if (planeRef.current && visible) {
      planeRef.current.material.opacity = opacity
    }
  })

  if (!visible) return null

  return (
    <mesh ref={planeRef} position={position}>
      <planeGeometry args={[2, 2]} />
      <meshStandardMaterial color="#4fc3f7" transparent opacity={opacity} side={THREE.DoubleSide} />
    </mesh>
  )
}

// ==== Gradient Arrow ====
function GradientArrow({ position, func, visible }: { position: Point; func: MathFunc; visible: boolean }) {
  const arrowRef = useRef<THREE.ArrowHelper>(null)
  const { scene } = useThree()

  const [fx_val, fy_val] = gradient(func, position[0], position[1])
  const direction = new THREE.Vector3(fx_val, fy_val, 0).normalize()
  const length = Math.sqrt(fx_val * fx_val + fy_val * fy_val)

  useEffect(() => {
    if (visible && arrowRef.current) {
      scene.add(arrowRef.current)
    } else if (arrowRef.current) {
      scene.remove(arrowRef.current)
    }

    return () => {
      if (arrowRef.current) {
        scene.remove(arrowRef.current)
      }
    }
  }, [visible, scene])

  useEffect(() => {
    if (visible) {
      if (arrowRef.current) {
        scene.remove(arrowRef.current)
      }

      const arrow = new THREE.ArrowHelper(
        direction,
        new THREE.Vector3(...position),
        length,
        0x00ff88,
        length * 0.2,
        length * 0.1,
      )

      arrowRef.current = arrow
      scene.add(arrow)
    }
  }, [position, fx_val, fy_val, visible, scene, direction, length])

  return null
}

// ==== Cross Section Curves ====
function CrossSectionCurves({ position, func, visible }: { position: Point; func: MathFunc; visible: boolean }) {
  const xCurveRef = useRef<THREE.Line>(null)
  const yCurveRef = useRef<THREE.Line>(null)

  const createCurve = useCallback(
    (isXSlice: boolean) => {
      const points = []
      const domain = 2 * Math.PI
      const resolution = 100

      for (let i = 0; i <= resolution; i++) {
        const t = -domain + (2 * domain * i) / resolution

        if (isXSlice) {
          // x-axis slice (y = y₀)
          const x = t
          const y = position[1]
          const z = func(x, y)
          points.push(new THREE.Vector3(x, y, z))
        } else {
          // y-axis slice (x = x₀)
          const x = position[0]
          const y = t
          const z = func(x, y)
          points.push(new THREE.Vector3(x, y, z))
        }
      }

      return new THREE.BufferGeometry().setFromPoints(points)
    },
    [position, func],
  )

  if (!visible) return null

  return (
    <>
      <line ref={xCurveRef} geometry={createCurve(true)}>
        <lineBasicMaterial color="#4169e1" linewidth={2} />
      </line>
      <line ref={yCurveRef} geometry={createCurve(false)}>
        <lineBasicMaterial color="#ff6347" linewidth={2} />
      </line>
    </>
  )
}

// ==== Main Component ====
export default function PartialDerivativeExplorer() {
  const [selectedFunction, setSelectedFunction] = useState("sin x cos y")
  const [showGradient, setShowGradient] = useState(true)
  const [showTangentPlane, setShowTangentPlane] = useState(true)
  const [showCrossSections, setShowCrossSections] = useState(true)
  const [pointPosition, setPointPosition] = useState([1, 1, Math.sin(1) * Math.cos(1)])
  const [planeOpacity, setPlaneOpacity] = useState(0.6)

  const currentFunction = functionPresets[selectedFunction as keyof typeof functionPresets]

  const handlePointDrag = useCallback((newPosition: number[]) => {
    setPointPosition(newPosition)
  }, [])

  const resetView = useCallback(() => {
    setPointPosition([1, 1, currentFunction(1, 1)])
  }, [currentFunction])

  const [fx_val, fy_val] = gradient(currentFunction, pointPosition[0], pointPosition[1])

  return (
    <div className="w-full h-screen bg-slate-900 relative">
      {/* 3D Canvas */}
      <div
        className="w-full h-full bg-gradient-to-b from-slate-900 to-slate-800"
        style={{ backgroundColor: "#0b0c10" }}
      >
        <Canvas shadows camera={{ position: [4, 4, 4], fov: 45 }}>
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            dampingFactor={0.05}
            enableDamping={true}
          />

          <Surface func={currentFunction} onPointDrag={handlePointDrag} pointPosition={pointPosition} />

          <InteractivePoint position={pointPosition} onDrag={handlePointDrag} func={currentFunction} />

          <TangentPlane
            position={pointPosition}
            func={currentFunction}
            visible={showTangentPlane}
            opacity={planeOpacity}
          />

          <GradientArrow position={pointPosition} func={currentFunction} visible={showGradient} />

          <CrossSectionCurves position={pointPosition} func={currentFunction} visible={showCrossSections} />

          <EffectComposer>
            <Bloom intensity={0.5} luminanceThreshold={0.9} />
          </EffectComposer>
        </Canvas>
      </div>

      {/* UI Panel */}
      <div className="absolute top-4 right-4 bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 min-w-[280px] text-white">
        <h3 className="text-lg font-semibold mb-4">Partial Derivative Explorer</h3>

        {/* Function Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">f(x,y) =</label>
          <select
            value={selectedFunction}
            onChange={(e) => setSelectedFunction(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm"
          >
            {Object.keys(functionPresets).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>

        {/* Checkboxes */}
        <div className="space-y-2 mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showGradient}
              onChange={(e) => setShowGradient(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm">Show gradient arrow</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showTangentPlane}
              onChange={(e) => setShowTangentPlane(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm">Show tangent plane</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showCrossSections}
              onChange={(e) => setShowCrossSections(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm">Show cross-sections</span>
          </label>
        </div>

        {/* Live Readouts */}
        <div className="space-y-1 mb-4 text-sm font-mono">
          <div>x = {pointPosition[0].toFixed(3)}</div>
          <div>y = {pointPosition[1].toFixed(3)}</div>
          <div>z = {pointPosition[2].toFixed(3)}</div>
          <div className="border-t border-slate-600 pt-2 mt-2">
            <div>∂f/∂x = {fx_val.toFixed(3)}</div>
            <div>∂f/∂y = {fy_val.toFixed(3)}</div>
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={resetView}
          className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
        >
          Reset View
        </button>
      </div>
    </div>
  )
}
