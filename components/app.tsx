import { useState } from "react"
import { FocusScope } from "@react-aria/focus"
import Image from "next/image"

type Edit =
  | {
      type: "style_transfer"
      state: "not_started" | "loading" | "done" | "error"
      result: string
    }
  | { type: "none" }

type Node = {
  source: string
  edit: Edit
  children: Array<Node>
}

type State = {
  query: string
  status: "not_started" | "loading" | "done" | "error"
  children: Array<Node>
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

function Container({ children }: { children: React.ReactNode }) {
  return (
    <main className="py-16 w-full max-w-7xl mx-auto px-2 xm:px-6 lg:px-8 h-full ">
      {children}
    </main>
  )
}

export default function App() {
  const [state, setState] = useState<State>({
    query: "",
    status: "not_started",
    children: [],
  })

  switch (state.status) {
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
                setState({ ...state, status: "loading" })
                const images = await getImages()
                const children = images.map((s) => ({
                  source: s,
                  edit: { type: "none" as const },
                  children: [],
                }))
                setState({ ...state, status: "done", children })
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
      return (
        <Container>
          <FocusScope autoFocus contain restoreFocus>
            <Query query={state.query} />
            <div className="grid grid-cols-3 gap-4">
              {state.children.map((node) => {
                return (
                  <button className="relative h-48 border-2 border-black hover:border-indigo-500 focus:border-indigo-500 outline-none hover:shadow-md focus:shadow-md">
                    <Image layout="fill" src={node.source} alt="image" />
                  </button>
                )
              })}
            </div>
          </FocusScope>
        </Container>
      )

    default:
      return (
        <Container>
          <span>{state.query}</span>
          <span>{state.status}...</span>
        </Container>
      )
  }
}
