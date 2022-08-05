import { FocusScope } from "@react-aria/focus"
import { Node, TopLevelEdit } from "../../lib/state"
import useState from "../../lib/state"
import Image from "next/image"

import id, { ID } from "../../lib/id"
import { cursorTo } from "readline"

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

type Props = {
  node: Node
}

export default function TopLevel({ node }: Props) {
  const edit = node.edit as TopLevelEdit
  const { setEdit, addToCursor } = useState((state) => ({
    setEdit: (update: Partial<TopLevelEdit>) =>
      state.updateNode(state.cursor, { edit: { ...edit, ...update } }),
    addToCursor: (id: ID) => state.updateCursor([...state.cursor, id]),
  }))

  function createContent() {
    // TODO clean up the types to make this not representable
    if (edit.type !== "top_level") return <div>Error</div>
    const { query } = edit

    switch (edit.state.type) {
      case "not_started":
        return (
          <>
            <input
              className="shadow-md hover:shadow-lg focus:shadow-lg w-full h-12 border-2 border-black focus:border-indigo-500 outline-none px-4 text-lg br-2"
              onChange={(e) => setEdit({ query: e.target.value })}
              value={query}
            />
            <button
              type="submit"
              className="br-2 h-12 bg-indigo-500 shadow-md hover:shadow-lg focus:shadow-lg text-white ml-4 px-4"
              onClick={async () => {
                setEdit({ state: { type: "loading" } })
                const images = await getImages()
                const children: Record<ID, Node> = {}
                images.forEach((s) => {
                  const nodeId = id()
                  children[nodeId] = {
                    source: s,
                    id: nodeId,
                    edit: { type: "none", children: {} },
                  }
                })
                setEdit({ state: { type: "done" }, children })
              }}
            >
              Generate
            </button>
          </>
        )

      case "loading":
        return (
          <>
            <Query query={edit.query} />
            <div>Loading...</div>
          </>
        )

      case "done":
        const children = Object.keys(edit.children) as ID[]
        return (
          <>
            <Query query={edit.query} />
            <div className="grid grid-cols-3 gap-4">
              {children
                .map((id) => {
                  const node = edit.children[id]
                  if (!node) return
                  return (
                    <button
                      key={id}
                      className="relative h-48 border-2 border-black hover:border-indigo-500 focus:border-indigo-500 outline-none hover:shadow-md focus:shadow-md"
                      onSubmit={() => addToCursor(id)}
                      onClick={() => addToCursor(id)}
                    >
                      <Image layout="fill" src={node.source} alt="image" />
                    </button>
                  )
                })
                .filter((x) => x)}
            </div>
          </>
        )
    }
  }

  return (
    <FocusScope autoFocus restoreFocus>
      {createContent()}
    </FocusScope>
  )
}
