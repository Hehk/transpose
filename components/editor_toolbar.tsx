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

const modeToIcon: Record<Mode, IconType> = {
  draw: IoBrushOutline,
  crop: IoCropOutline,
  style_transfer: IoImagesOutline,
  recenter: IoLocateOutline,
  inpaint: IoScanOutline,

  // default
  none: IoBrushOutline,
}

function EditorButton({ mode }: { mode: Mode }) {
  const { currentMode, setMode } = useState((state) => ({
    currentMode: state.mode,
    setMode: state.setMode,
  }))
  let Icon = modeToIcon[mode]

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
    <div className="p-4 w-56 flex-shrink-0">
      <h1 className="w-8 text-center mb-6 bold text-2xl">T</h1>
      <div className="mb-6 grid grid-cols-6">
        <EditorButton mode="draw" />
        <EditorButton mode="inpaint" />
        <EditorButton mode="crop" />
        <EditorButton mode="style_transfer" />
        <EditorButton mode="recenter" />
        <EditorButton mode="none" />
      </div>
      <div className="mb-6 grid grid-cols-6">
        <EditorButton mode="draw" />
        <EditorButton mode="crop" />
        <EditorButton mode="style_transfer" />
      </div>
    </div>
  )
}
