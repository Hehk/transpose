import useState, { findNode } from "../lib/state"
import NoneEdit from "./edit/none_edit"
import TopLevelEdit from "./edit/top_level_edit"
import Container from "../components/default_container"
import { Node } from "../lib/state"

export default function App() {
  const { cursor, tree, updateNode } = useState((state) => ({
    cursor: state.cursor,
    tree: state.tree,
    updateNode: state.updateNode,
  }))

  const setState = (update: Partial<Node>) => updateNode(cursor, update)
  const activeNode = findNode(cursor, tree)
  // This should be impossible, I want to work through a way to not make this
  // representable in the types...
  if (!activeNode) return <div>ERROR NODE NOT FOUND</div>

  let content = <></>
  switch (activeNode.edit.type) {
    case "none":
      content = <NoneEdit node={activeNode} />
      break

    case "top_level":
      content = <TopLevelEdit node={activeNode} />
      break
  }

  return <Container>{content}</Container>
}
