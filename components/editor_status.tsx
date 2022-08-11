import useState from "../lib/state"

// TODO once styling is no longer fixed
const canvasOffset = {
  top: 16,
  left: 4 * 16,
  bottom: 4 * 16,
  right: 16,
}

export default function EditorStatus() {
  const mode = useState((state) => state.mode)

  return (
    <div
      className="fixed flex"
      style={{
        left: canvasOffset.left,
        bottom: 4 * 6,
        right: canvasOffset.right,
      }}
    >
      <div>{mode}</div>
    </div>
  )
}
