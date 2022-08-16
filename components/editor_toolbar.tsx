import useState from "../lib/state"
import type { Mode } from "../lib/state"
import { VscCircuitBoard, VscBeaker, VscEdit } from "react-icons/vsc"
import { IconType } from "react-icons"

// TODO eventually make this non-nullable
const modeToIcon: { [Key in Mode]?: IconType } = {
  inpaint: VscEdit,
  style_transfer: VscBeaker,
  segmentation: VscCircuitBoard,
}

function EditorButton({ mode }: { mode: Mode }) {
  const { currentMode, setMode } = useState((state) => ({
    currentMode: state.mode,
    setMode: state.setMode,
  }))
  let Icon = modeToIcon[mode]
  if (!Icon) return null

  return (
    <button
      className={`aspect-square ${
        currentMode === mode
          ? "bg-red-200 border-2 border-black rounded-sm"
          : ""
      }`}
      onClick={() => setMode(mode)}
    >
      <Icon className="w-6 h-6 inline" />
    </button>
  )
}

export default function EditorToolbar() {
  return (
    <div className="m-4 w-80 flex-shrink-0">
      <h1 className="w-8 text-center mb-6 bold text-2xl">_transpose</h1>
      <div className="mb-6 grid grid-cols-6">
        <EditorButton mode="inpaint" />
        <EditorButton mode="style_transfer" />
        <EditorButton mode="segmentation" />
      </div>
    </div>
  )
}
