import { PaperScope, Path, Tool } from "paper/dist/paper-core"

export default class InpaintTool {
  tool: InstanceType<typeof Tool>
  activePath?: InstanceType<typeof paper.Path.Rectangle>
  constructor(private scope: InstanceType<typeof PaperScope>) {
    this.tool = new this.scope.Tool()

    let startPoint: paper.Point
    this.tool.onMouseDown = (e: paper.MouseEvent) => {
      startPoint = e.point
      this.activePath = new scope.Path.Rectangle({
        to: e.point,
        from: e.point,
        strokeColor: "black",
        radius: 2,
        clipMask: true,
      })
    }
    this.tool.onMouseDrag = (e: paper.MouseEvent) => {
      this.activePath?.remove()
      this.activePath = new scope.Path.Rectangle({
        from: startPoint,
        to: e.point,
        strokeColor: "black",
        strokeWidth: 2,
        fillColor: "white",
        clipMask: true,
      })
    }
    this.tool.onMouseUp = (e: paper.MouseEvent) => {}
  }
}
