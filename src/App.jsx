
import { Canvas } from '@react-three/fiber'

import { Scene } from './components/Scene'
import { OrbitControls, KeyboardControls } from '@react-three/drei'
import { Suspense, useMemo } from "react";
import { UI } from "./components/UI";
import { SocketManager } from "./components/SocketManager";




export const Controls = {
  forward: "forward",
  back: "back",
  left: "left",
  right: "right",
  attack: "attack",
  hold: "hold",
  c: "c",
  f: "f"
}


function App() {

  const keyMap = useMemo(() => [
    { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
    { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
    { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
    { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
    { name: Controls.hold, keys: ["KeyH", "KeyH"] },
    { name: Controls.c, keys: ["KeyC", "KeyC"] },
    { name: Controls.c, keys: ["KeyF", "KeyF"] },
    { name: Controls.attack, keys: ["Space"] },
  ], [])


  return (
    <>
      <SocketManager />
      <KeyboardControls map={keyMap} />
      <Canvas>

        <OrbitControls />
        <Suspense fallback={null}>
          <Scene />
        </Suspense>

      </Canvas>
      <UI />
    </>

  )
}

export default App