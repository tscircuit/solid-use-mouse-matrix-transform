import { createEffect, createSignal, onCleanup } from "solid-js"
import solidLogo from "./assets/solid.svg"
import viteLogo from "/vite.svg"
import "./App.css"
import {
  applyToPoint,
  compose,
  identity,
  Matrix,
  translate,
} from "transformation-matrix"
import { getMousePosInElm } from "./getMousePosInElm"

function App() {
  const [containerElm, setContainerElm] = createSignal<HTMLDivElement>()
  const [baseTransform, setBaseTransform] = createSignal(identity())
  const [activeModificationTransform, setActiveModificationTransform] =
    createSignal(identity())

  createEffect(() => {
    const container = containerElm()
    if (!container) return

    let isMouseDown = false
    let mouseDownAt: { x: number; y: number } | null = null
    let lastMouseMoveAt: { x: number; y: number } | null = null

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return
      lastMouseMoveAt = getMousePosInElm(container, e)
      const delta = {
        x: lastMouseMoveAt.x - mouseDownAt!.x,
        y: lastMouseMoveAt.y - mouseDownAt!.y,
      }
      setActiveModificationTransform(translate(delta.x, delta.y))
    }
    const handleMouseDown = (e: MouseEvent) => {
      isMouseDown = true
      mouseDownAt = getMousePosInElm(container, e)
    }
    const handleMouseUp = (e: MouseEvent) => {
      isMouseDown = false
      mouseDownAt = null
      lastMouseMoveAt = null
      setBaseTransform(compose(baseTransform(), activeModificationTransform()))
      setActiveModificationTransform(identity())
    }

    container.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("mousedown", handleMouseDown)
    container.addEventListener("mouseup", handleMouseUp)

    onCleanup(() => {
      container.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("mousedown", handleMouseDown)
      container.removeEventListener("mouseup", handleMouseUp)
    })
  })

  const transform = compose(baseTransform(), activeModificationTransform())

  const boxPos = applyToPoint(transform, { x: 0, y: 0 })
  const scale = transform.a

  return (
    <div style={{ width: "100vw", height: "100vh" }} ref={setContainerElm}>
      <h1
        style={{
          transform: `translate(${boxPos.x}px, ${boxPos.y}px) scale(${scale})`,
          "transform-origin": "0,0",
        }}
      >
        Hello World
      </h1>
      <div
        style={{
          left: `${boxPos.x}px`,
          top: `${boxPos.y}px`,
          width: `${100 * scale}px`,
          height: `${100 * scale}px`,
          "background-color": "red",
          position: "absolute",
        }}
      />
    </div>
  )
}

export default App
