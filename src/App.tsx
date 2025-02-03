import { createEffect, createSignal, createMemo, onCleanup } from "solid-js"
import solidLogo from "./assets/solid.svg"
import viteLogo from "/vite.svg"
import "./App.css"
import {
  applyToPoint,
  compose,
  identity,
  Matrix,
  scale as scaleMatrix,
  translate,
  toCSS,
} from "transformation-matrix"
import { getMousePosInElm } from "./getMousePosInElm"

function App() {
  const [containerElm, setContainerElm] = createSignal<HTMLDivElement>()
  const [realToScreenMat, setRealToScreenMat] = createSignal(identity())

  createEffect(() => {
    const container = containerElm()
    if (!container) return

    let isMouseDown = false
    let mouseDownAt: { x: number; y: number } | null = null
    let lastMouseMoveAt: { x: number; y: number } | null = null
    let preDragRealToScreenMat: Matrix | null = null

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return
      lastMouseMoveAt = getMousePosInElm(container, e)
      const deltaReal = {
        x: lastMouseMoveAt.x - mouseDownAt!.x,
        y: lastMouseMoveAt.y - mouseDownAt!.y,
      }
      setRealToScreenMat(
        compose(
          preDragRealToScreenMat!,
          translate(
            deltaReal.x / preDragRealToScreenMat!.a,
            deltaReal.y / preDragRealToScreenMat!.d,
          ),
        ),
      )
    }
    const handleMouseDown = (e: MouseEvent) => {
      isMouseDown = true
      mouseDownAt = getMousePosInElm(container, e)
      preDragRealToScreenMat = realToScreenMat()
    }
    const handleMouseUp = (e: MouseEvent) => {
      isMouseDown = false
      mouseDownAt = null
      lastMouseMoveAt = null
    }
    const handleWheel = (e: WheelEvent) => {
      const centerScreen = getMousePosInElm(container, e)
      const factor = 1 - e.deltaY / 1000
      const newRealToScreenMat = compose(
        translate(centerScreen.x, centerScreen.y),
        scaleMatrix(factor, factor),
        translate(-centerScreen.x, -centerScreen.y),
        realToScreenMat(),
      )
      setRealToScreenMat(newRealToScreenMat)
      e.preventDefault()
    }

    container.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("mousedown", handleMouseDown)
    container.addEventListener("mouseup", handleMouseUp)
    container.addEventListener("wheel", handleWheel)

    onCleanup(() => {
      container.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("mousedown", handleMouseDown)
      container.removeEventListener("mouseup", handleMouseUp)
      container.removeEventListener("wheel", handleWheel)
    })
  })

  const transform = createMemo(() => realToScreenMat())

  const boxPos = createMemo(() => applyToPoint(transform(), { x: 0, y: 0 }))
  const scale = createMemo(() => transform().a)

  const cssTransform = createMemo(() => toCSS(transform()))

  return (
    <div
      style={{
        width: "500px",
        height: "500px",
        "background-color": "white",
        overflow: "hidden",
      }}
      ref={setContainerElm}
    >
      <div
        style={{
          transform: cssTransform(),
          "transform-origin": "0 0",
          display: "grid",
          "grid-template-columns": "repeat(3, 1fr)",
          "grid-template-rows": "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <div
            style={{
              width: "100px",
              height: "100px",
              "background-color": "red",
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default App
