import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { PaperScope, Size } from "paper/dist/paper-core"
import {
  IoBrushOutline,
  IoCropOutline,
  IoImagesOutline,
  IoLocateOutline,
  IoScanOutline,
} from "react-icons/io5"
import DrawTool from "./tools/draw_tool"
import InpaintTool from "./tools/inpaint_tool"
const image = "/images/exploit_1.png"

const canvasOffset = {
  top: 16,
  left: 4 * 16,
  bottom: 4 * 12,
  right: 16,
}

function EditorButton({
  type,
  setMode,
}: {
  type: Mode
  setMode: (mode: Mode) => void
}) {
  let Icon = IoBrushOutline
  switch (type) {
    case "pen":
      Icon = IoBrushOutline
      break
    case "crop":
      Icon = IoCropOutline
      break
    case "style_transfer":
      Icon = IoImagesOutline
      break
    case "recenter":
      Icon = IoLocateOutline
      break
    case "inpaint":
      Icon = IoScanOutline
      break
  }

  return (
    <button className="h-8 w-8" onClick={() => setMode(type)}>
      <Icon className="h-4 w-4 mx-2 inline" />
    </button>
  )
}

function EditorStatus() {
  return (
    <div
      className="fixed flex"
      style={{
        left: canvasOffset.left,
        bottom: 4 * 4,
        right: canvasOffset.right,
      }}
    >
      <div>~/image/doc.js </div>
      <div>Download</div>
    </div>
  )
}

function EditorControls({
  mode,
  setMode,
}: {
  mode: Mode
  setMode: (mode: Mode) => void
}) {
  return (
    <div className="fixed p-4 w-40">
      <h1 className="w-8 text-center mb-6">T</h1>
      <div className="flex flex-col mb-6">
        <EditorButton type="pen" setMode={setMode} />
        <EditorButton type="inpaint" setMode={setMode} />
        <EditorButton type="crop" setMode={setMode} />
        <EditorButton type="style_transfer" setMode={setMode} />
        <EditorButton type="recenter" setMode={setMode} />
      </div>
      <div className="flex flex-col">
        <EditorButton type="pen" setMode={setMode} />
        <EditorButton type="crop" setMode={setMode} />
        <EditorButton type="style_transfer" setMode={setMode} />
      </div>
    </div>
  )
}

type Mode = "pen" | "crop" | "style_transfer" | "recenter" | "inpaint" | "none"

export default function Editor({ src = image }: { src?: string }) {
  const [mode, setMode] = useState<Mode>("none")
  const [scope, setScope] = useState<
    InstanceType<typeof PaperScope> | undefined
  >(undefined)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!scope) return

    scope.tools.forEach((tool) => {
      tool.remove()
    })
    switch (mode) {
      case "pen":
        new DrawTool(scope)
        break

      case "inpaint":
        new InpaintTool(scope)
        break
    }
  }, [mode])

  useLayoutEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const scope = new PaperScope()
    scope.setup(canvasRef.current)

    // TODO this whole canvas setup stuff can probably be cleaned up with fresh eyes
    const resize = () => {
      const width = window.innerWidth - canvasOffset.left - canvasOffset.right
      const height = window.innerHeight - canvasOffset.top - canvasOffset.bottom
      canvas.width = width
      canvas.height = height
      scope.view.viewSize = new Size(width, height)
    }
    resize()
    addEventListener("resize", resize)

    const editor = new scope.Group({
      bounds: scope.view.size,
      point: scope.view.center,
    })
    const image = new scope.Raster({
      source: src,
      size: editor.view.size,
      position: editor.view.center,
    })
    function resizeImage() {
      const width = window.innerWidth - canvasOffset.left - canvasOffset.right
      const height = window.innerHeight - canvasOffset.top - canvasOffset.bottom
      const imageSize = image.size
      const aspectRatio = imageSize.width / imageSize.height
      const container = { width: 0, height: 0 }

      let scale = 1
      // TODO something is wrong with my logic here, probably relook at this when I am not sick
      if (aspectRatio >= 1) {
        let h = width * aspectRatio
        if (h > height) {
          scale = h / height
        }
        container.width = width * scale
        container.height = width * aspectRatio * scale
        image.scale(container.width / image.width)
      } else {
        let w = height / aspectRatio
        if (w > width) {
          scale = w / width
        }
        container.width = (height / aspectRatio) * scale
        container.height = height * scale
        image.scale(container.height / image.height)
      }
      editor.bounds = new scope.Rectangle({
        size: [container.width, container.height],
      })
    }
    image.on("load", resizeImage)
    addEventListener("resize", resizeImage)

    editor.addChild(image)
    editor.clipped = true

    addEventListener("resize", () => {
      image.position = scope.view.center
    })
    setScope(scope)
  }, [])

  return (
    <div className="flex-grow">
      <canvas
        className="fixed shadow-xl rounded-lg"
        style={canvasOffset}
        ref={canvasRef}
      />
      <EditorControls mode={mode} setMode={setMode} />
      <EditorStatus />
    </div>
  )
}
