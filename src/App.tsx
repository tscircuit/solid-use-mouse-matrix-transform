import { createEffect, createSignal, createMemo, onCleanup } from "solid-js"
import solidLogo from "./assets/solid.svg"
import viteLogo from "/vite.svg"
import "./App.css"
import {
  applyToPoint,
  compose,
  identity,
  Matrix,
  scale,
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
    const handleWheel = (e: WheelEvent) => {
      const center = getMousePosInElm(container, e)
      // const factor = 1 - e.deltaY / 1000
      // const newTf = compose(
      //   translate(center.x, center.y),
      //   scale(factor, factor),
      //   translate(-center.x, -center.y),
      //   baseTransform(),
      // )
      // setBaseTransform(newTf)
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

  const transform = createMemo(() =>
    compose(baseTransform(), activeModificationTransform()),
  )

  const boxPos = createMemo(() => applyToPoint(transform(), { x: 0, y: 0 }))
  const scale = createMemo(() => transform().a)

  return (
    <div style={{ width: "100vw", height: "100vh" }} ref={setContainerElm}>
      <h1
        style={{
          transform: `translate(${boxPos().x}px, ${boxPos().y}px) scale(${scale()})`,
          "transform-origin": "0,0",
        }}
      >
        Hello World
      </h1>
      <div
        style={{
          left: `${boxPos().x}px`,
          top: `${boxPos().y}px`,
          width: `${100 * scale()}px`,
          height: `${100 * scale()}px`,
          "background-color": "red",
          position: "absolute",
        }}
      />
    </div>
  )
}

export default App
