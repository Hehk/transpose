import useState from "../lib/state"
import type { Mode } from "../lib/state"
import {
  IoBrushOutline,
  IoCropOutline,
  IoImagesOutline,
  IoLocateOutline,
  IoScanOutline,
} from "react-icons/io5"
import { IconType } from "react-icons"

function modeToIcon(mode: Mode): IconType {
  switch (mode) {
    case "draw":
      return IoBrushOutline
    case "crop":
      return IoCropOutline
    case "style_transfer":
      return IoImagesOutline
    case "recenter":
      return IoLocateOutline
    case "inpaint":
      return IoScanOutline
  }
}

function EditorButton({ mode }: { mode: Mode }) {
  const { currentMode, setMode } = useState((state) => ({
    currentMode: state.mode,
    setMode: state.setMode,
  }))
  let Icon = modeToIcon(mode)

  return (
    <button
      className={`h-8 w-8 ${currentMode === mode ? "bg-red-200" : ""}`}
      onClick={() => setMode(mode)}
    >
      <Icon className="h-4 w-4 mx-2 inline" />
    </button>
  )
}

export default function EditorToolbar() {
  return (
    <div className="fixed p-4 w-40">
      <h1 className="w-8 text-center mb-6 bold text-2xl">T</h1>
      <div className="flex flex-col mb-6">
        <EditorButton mode="draw" />
        <EditorButton mode="inpaint" />
        <EditorButton mode="crop" />
        <EditorButton mode="style_transfer" />
        <EditorButton mode="recenter" />
      </div>
      <div className="flex flex-col">
        <EditorButton mode="draw" />
        <EditorButton mode="crop" />
        <EditorButton mode="style_transfer" />
      </div>
    </div>
  )
}
