import { Mode } from "fs"
import { useState } from "react"
import useGlobalState from "../lib/state"
import { FocusScope } from "@react-aria/focus"

// TODO once styling is no longer fixed
const canvasOffset = {
  top: 16,
  left: 4 * 16,
  bottom: 4 * 16,
  right: 16,
}

function InpaintStatus() {
  const [input, setInput] = useState<string>("")
  return (
    <FocusScope autoFocus restoreFocus>
      <input
        className="mr-4 w-full outline-none bg-transparent border-b-2 border-b-black focus:border-b-indigo-500"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        className="outline-none bg-indigo-500 text-white p-2"
        onClick={() => console.log("Inpaint")}
      >
        Inpaint
      </button>
    </FocusScope>
  )
}

const modeToStatus: { [Key in Mode]: () => JSX.Element } = {
  inpaint: InpaintStatus,
}

export default function EditorStatus() {
  const mode = useGlobalState((state) => state.mode)
  const Component = modeToStatus[mode]

  return (
    <div
      className="fixed flex"
      style={{
        left: canvasOffset.left,
        bottom: 4 * 3,
        right: canvasOffset.right,
      }}
    >
      {Component ? <Component /> : <div>{mode}</div>}
    </div>
  )
}
