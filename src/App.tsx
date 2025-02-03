import { createEffect, createSignal, onCleanup } from "solid-js"
import solidLogo from "./assets/solid.svg"
import viteLogo from "/vite.svg"
import "./App.css"
import { applyToPoint, identity } from "transformation-matrix"

function App() {
  const [containerElm, setContainerElm] = createSignal<HTMLDivElement>()
  const [userToScreenTransform, setUserToScreenTransform] = createSignal(
    identity(),
  )

  createEffect(() => {
    const container = containerElm()
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {}
    const handleMouseDown = (e: MouseEvent) => {
      console.log("Mouse down", e.clientX, e.clientY)
    }
    const handleMouseUp = (e: MouseEvent) => {}

    container.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("mousedown", handleMouseDown)
    container.addEventListener("mouseup", handleMouseUp)

    onCleanup(() => {
      container.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("mousedown", handleMouseDown)
      container.removeEventListener("mouseup", handleMouseUp)
    })
  })

  const boxPos = applyToPoint(userToScreenTransform(), { x: 0, y: 0 })
  const scale = userToScreenTransform().a

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
