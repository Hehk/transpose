import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { PaperScope, Size } from "paper/dist/paper-core"
import useGlobalState, { Mode } from "../lib/state"
import DrawTool from "./tools/draw_tool"
import InpaintTool from "./tools/inpaint_tool"
const imageSrc = "/images/exploit_1.png"
import EditorStatus from "./editor_status"
import EditorToolbar from "./editor_toolbar"

function setupTool(
  scope: InstanceType<typeof PaperScope>,
  image: InstanceType<typeof paper.Raster>,
  mode: Mode,
) {
  // Clear out any old tools
  scope.tools.forEach((tool) => tool.remove())

  switch (mode) {
    case "draw":
      new DrawTool(scope, image)
      break

    case "inpaint":
      new InpaintTool(scope)
      break
  }
}

function initializePaper(
  canvas: HTMLCanvasElement,
  container: HTMLDivElement,
  src: string,
): [InstanceType<typeof PaperScope>, InstanceType<typeof paper.Raster>] {
  const scope = new PaperScope()
  scope.setup(canvas)

  // TODO this whole canvas setup stuff can probably be cleaned up with fresh eyes
  const resize = () => {
    canvas.width = container.offsetWidth
    canvas.height = container.offsetHeight
    scope.view.viewSize = new Size(canvas.width, canvas.height)
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
    clipMask: true,
  })
  function resizeImage() {
    const width = canvas.width
    const height = canvas.height
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

  return [scope, image]
}

export default function Editor({}: { src?: string }) {
  const mode = useGlobalState((state) => state.mode)
  const [scope, setScope] = useState<
    InstanceType<typeof PaperScope> | undefined
  >(undefined)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [image, setImage] = useState<
    InstanceType<typeof paper.Raster> | undefined
  >(undefined)

  useEffect(() => {
    if (scope && image) setupTool(scope, image, mode)
  }, [mode])

  useLayoutEffect(() => {
    if (!canvasRef.current || !canvasContainerRef.current) return
    const [scope, image] = initializePaper(
      canvasRef.current,
      canvasContainerRef.current,
      imageSrc,
    )
    setScope(scope)
    setImage(image)
    setupTool(scope, image, mode)
  }, [])

  return (
    <div className="bg-white h-screen flex">
      <EditorToolbar />
      <div
        ref={canvasContainerRef}
        className="m-4 shadow-lg flex-grow rounded-lg overflow-hidden relative border-2 border-zinc-800 bg-zinc-200"
      >
        <canvas
          className="absolute top-0 right-0 left-0 bottom-0 z-10"
          ref={canvasRef}
        />
      </div>
    </div>
  )
}
