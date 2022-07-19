import { useState } from "react"
import { FocusScope } from "@react-aria/focus"
import Image from "next/image"
import Container from "./default_container"
import Node, { Node as NodeType } from "./node"

type State = {
  query: string
  status:
    | { type: "not_started" }
    | { type: "loading" }
    | { type: "done" }
    | { type: "error"; message: string }
    | {
        type: "focus_node"
        node: string
      }
  children: Array<NodeType>
}

async function getImages() {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return [
    "/images/exploit_1.png",
    "/images/exploit_2.png",
    "/images/exploit_3.png",
    "/images/exploit_4.png",
    "/images/exploit_5.png",
    "/images/exploit_6.png",
  ]
}

function Query({ query }: { query: string }) {
  return (
    <h2 className="text-3xl mb-4">
      <span className="text-indigo-500">"</span>
      {query}
      <span className="text-indigo-500">"</span>
    </h2>
  )
}

export default function App() {
  const [state, setState] = useState<State>({
    query: "",
    status: { type: "not_started" },
    children: [],
  })

  switch (state.status.type) {
    case "not_started":
      return (
        <Container>
          <FocusScope contain autoFocus restoreFocus>
            <input
              className="shadow-md hover:shadow-lg focus:shadow-lg w-full h-12 border-2 border-black focus:border-indigo-500 outline-none px-4 text-lg br-2"
              onChange={(e) => setState({ ...state, query: e.target.value })}
              value={state.query}
            />
            <button
              type="submit"
              className="br-2 h-12 bg-indigo-500 shadow-md hover:shadow-lg focus:shadow-lg text-white ml-4 px-4"
              onClick={async () => {
                setState({ ...state, status: { type: "loading" } })
                const images = await getImages()
                const children = images.map((s) => ({
                  source: s,
                  id: s,
                  edit: { type: "none" as const },
                  children: [],
                }))
                setState({ ...state, status: { type: "done" }, children })
              }}
            >
              Generate
            </button>
          </FocusScope>
        </Container>
      )

    case "loading":
      return (
        <Container>
          <Query query={state.query} />
          <div>Loading...</div>
        </Container>
      )

    case "done":
      const focusNode = (id: string) => {
        setState({ ...state, status: { type: "focus_node", node: id } })
      }
      return (
        <Container>
          <FocusScope autoFocus contain restoreFocus>
            <Query query={state.query} />
            <div className="grid grid-cols-3 gap-4">
              {state.children.map((node) => {
                return (
                  <button
                    key={node.id}
                    className="relative h-48 border-2 border-black hover:border-indigo-500 focus:border-indigo-500 outline-none hover:shadow-md focus:shadow-md"
                    onSubmit={() => focusNode(node.id)}
                    onClick={() => focusNode(node.id)}
                  >
                    <Image layout="fill" src={node.source} alt="image" />
                  </button>
                )
              })}
            </div>
          </FocusScope>
        </Container>
      )

    case "focus_node":
      const nodeId = state.status.node
      const node = state.children.find((node) => node.id === nodeId)
      if (!node) return "YOU DONE FUCKED UP!!!"
      return <Node node={node} />

    default:
      return (
        <Container>
          <span>{state.query}</span>
          <span>{state.status.type}...</span>
        </Container>
      )
  }
}
