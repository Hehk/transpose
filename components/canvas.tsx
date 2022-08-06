import { PaperScope } from "paper/dist/paper-core"
import { useLayoutEffect, useRef, useState } from "react"

export default function Canvas({ src }: { src: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [scope, setScope] = useState<paper.PaperScope | undefined>(undefined)
  const [canvasRect, setCanvasRect] = useState<DOMRect | undefined>(undefined)
  useLayoutEffect(() => {
    if (!ref.current) return

    const scope = new PaperScope()
    scope.setup(ref.current)
    new scope.Raster(src)

    setScope(scope)
    // TODO handle window resize or move
    setCanvasRect(ref.current.getBoundingClientRect())
  }, [])

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!scope || !canvasRect) return

    const x = e.clientX - canvasRect.x
    const y = e.clientY - canvasRect.y
    const point = new scope.Path.Circle({
      center: [x, y],
      radius: 10,
      fillColor: "red",
    })
  }

  return <canvas ref={ref} width="500" height="500" onMouseDown={onMouseDown} />
}
