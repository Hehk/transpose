import { PaperScope, Tool } from "paper/dist/paper-core"

export default class InpaintTool {
  tool: InstanceType<typeof Tool>
  constructor(private scope: InstanceType<typeof PaperScope>) {
    this.tool = new this.scope.Tool()

    this.tool.onMouseDown = () => {
      console.log("inpaint")
    }
  }
}
