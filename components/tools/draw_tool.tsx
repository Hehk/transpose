import type { PaperScope, Tool, Path } from "paper/dist/paper-core"
import path from "path"

export default class DrawTool {
  tool: InstanceType<typeof Tool>
  constructor(
    scope: InstanceType<typeof PaperScope>,
    image: InstanceType<typeof paper.Raster>,
  ) {
    this.tool = new scope.Tool()

    const eraserGroup = new scope.Group({
      children: [image],
      blendMode: "source-over",
    })
    let currentPath: InstanceType<typeof Path>
    this.tool.onMouseDown = function (e: paper.MouseEvent) {
      currentPath = new scope.Path.Line({
        strokeColor: new scope.Color("black"),
        strokeWidth: 10,
        strokeCap: "round",
        blendMode: "destination-out",
      })
      currentPath.smooth({ type: "continuous" })
      eraserGroup.addChild(currentPath)
    }
    this.tool.onMouseDrag = function (e: paper.MouseEvent) {
      currentPath.add(e.point)
    }
  }
}
