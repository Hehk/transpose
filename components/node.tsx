import Container from "./default_container"
import Image from "next/image"

export type Edit =
  | {
      type: "style_transfer"
      state: "not_started" | "loading" | "done" | "error"
      result: string
    }
  | { type: "none" }

export type Node = {
  source: string
  id: string
  edit: Edit
  children: Array<Node>
}

export default function Node({ node }: { node: Node }) {
  return (
    <Container>
      <div className="relative h-[36rem] border-black border-2">
        <Image layout="fill" src={node.source} alt="image" />
      </div>
    </Container>
  )
}
