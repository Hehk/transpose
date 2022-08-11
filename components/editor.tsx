import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { PaperScope, Size } from "paper/dist/paper-core"
import useGlobalState, { Mode } from "../lib/state"
import DrawTool from "./tools/draw_tool"
import InpaintTool from "./tools/inpaint_tool"
const image = "/images/exploit_1.png"
import EditorStatus from "./editor_status"
import EditorToolbar from "./editor_toolbar"

// TODO convert to just styles, and have the canvas grab it's container's dimensions
const canvasOffset = {
  top: 16,
  left: 4 * 16,
  bottom: 4 * 16,
  right: 16,
}

function setupTool(scope: InstanceType<typeof PaperScope>, mode: Mode) {
  // Clear out any old tools
  scope.tools.forEach((tool) => tool.remove())

  switch (mode) {
    case "draw":
      new DrawTool(scope)
      break

    case "inpaint":
      new InpaintTool(scope)
      break
  }
}

function initializePaper(
  canvas: HTMLCanvasElement,
  src: string,
): InstanceType<typeof PaperScope> {
  const scope = new PaperScope()
  scope.setup(canvas)

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

  return scope
}

export default function Editor({ src = image }: { src?: string }) {
  const mode = useGlobalState((state) => state.mode)
  const [scope, setScope] = useState<
    InstanceType<typeof PaperScope> | undefined
  >(undefined)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (scope) setupTool(scope, mode)
  }, [mode])

  useLayoutEffect(() => {
    if (!canvasRef.current) return
    const scope = initializePaper(canvasRef.current, image)
    setupTool(scope, mode)
    setScope(scope)
  }, [])

  return (
    <div className="flex-grow">
      <canvas
        className="fixed shadow-xl"
        style={canvasOffset}
        ref={canvasRef}
      />
      <EditorToolbar />
      <EditorStatus />
    </div>
  )
}
