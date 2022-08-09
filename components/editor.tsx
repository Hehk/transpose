import { useLayoutEffect, useRef } from "react"
import { PaperScope, Size } from "paper/dist/paper-core"
const image = "/images/exploit_1.png"

const canvasOffset = {
  top: 16 * 4,
  left: 0,
  bottom: 0,
  right: 0,
}

const imageWidth = 640

export default function Editor({ src = image }: { src?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useLayoutEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const scope = new PaperScope()
    scope.setup(canvasRef.current)

    const resize = () => {
      const width = window.innerWidth - canvasOffset.left - canvasOffset.right
      const height = window.innerHeight - canvasOffset.top - canvasOffset.bottom
      canvas.width = width
      canvas.height = height
      scope.view.viewSize = new Size(width, height)
    }
    resize()
    addEventListener("resize", resize)

    const editor = new scope.Group([
      new scope.Path.Rectangle({
        size: [imageWidth, 400],
        point: [(scope.view.size.width - imageWidth) / 2, 100],
      }),
    ])

    const image = new scope.Raster({
      source: src,
      size: editor.view.size,
      position: editor.view.center,
    })
    // image.scale(imageWidth / image.width)
    editor.addChild(image)
    editor.clipped = true

    addEventListener("resize", () => {
      image.position = scope.view.center
    })

    let currentPath: paper.Path | undefined
    image.onMouseDown = (e: paper.MouseEvent) => {
      currentPath = new scope.Path({
        center: e.point,
        strokeWidth: 10,
        strokeColor: "red",
        strokeCap: "round",
      })
      currentPath.smooth({ type: "continuous" })
      editor.addChild(currentPath)
    }
    image.onMouseDrag = (e: paper.MouseEvent) => {
      currentPath?.add(e.point)
    }
    image.onMouseUp = (e: paper.MouseEvent) => {
      // currentPath?.simplify()
      currentPath = undefined
    }
  }, [])

  return (
    <div className="flex-grow">
      <canvas ref={canvasRef} />
    </div>
  )
}
