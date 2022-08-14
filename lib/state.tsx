import create from "zustand"

export type Mode =
  | "draw"
  | "crop"
  | "style_transfer"
  | "recenter"
  | "inpaint"
  | "none"

type State = {
  mode: Mode
  setMode: (newMode: Mode) => void
}

export default create<State>((set) => ({
  mode: "inpaint",
  setMode: (newMode) => set(() => ({ mode: newMode })),
}))
