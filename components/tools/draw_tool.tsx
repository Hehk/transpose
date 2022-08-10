import type { PaperScope, Tool } from "paper/dist/paper-core"

export default class DrawTool {
  tool: InstanceType<typeof Tool>
  constructor(private scope: InstanceType<typeof PaperScope>) {
    this.tool = new scope.Tool()

    this.tool.onMouseDown = function () {
      console.log("Test")
    }
  }
}
