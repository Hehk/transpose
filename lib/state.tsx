import create from "zustand"
import type { ID } from "./id"
import id from "./id"

type T<s> = { type: s }

type NodeChildren = Record<ID, undefined | Node>
export type TopLevelEdit = {
  type: "top_level"
  query: string
  state:
    | T<"not_started">
    | T<"loading">
    | T<"done">
    | { type: "error"; message: string }
  children: NodeChildren
}

export type NoneEdit = {
  type: "none"
  children: NodeChildren
}

type ZoomInEdit = {
  type: "zoom_in"
  state: T<"loading"> | T<"done">
  children: NodeChildren
}

type ZoomOutEdit = {
  type: "zoom_out"
  state: T<"loading"> | T<"done">
  children: NodeChildren
}

type State = {
  // Selector for the currently focused node
  cursor: ID[]
  tree: Node
  updateNode: (cursor: ID[], update: Partial<Node>) => void
  updateCursor: (cursor: ID[]) => void
}

type Edit = TopLevelEdit | ZoomInEdit | ZoomOutEdit | NoneEdit

export type Node = {
  id: ID
  source: string
  edit: Edit
}

// TODO make this nicer, this works but also will build up a large callstack
// At some point a node map might be a better solution...
export const findNode = (cursor: ID[], node: Node): Node => {
  const [id, ...rest] = cursor
  if (id !== node.id) throw new Error("Invalid Cursor")
  if (rest.length === 0) return node

  const child = node.edit.children[rest[0]]
  if (!child) throw new Error("Invalid Cursor")
  return findNode(rest, child)
}

export const updateNode = (cursor: ID[], tree: Node, update: Partial<Node>) => {
  const [hd, ...tl] = cursor
  const node = tree

  if (tree.id !== hd) throw new Error("Invalid Cursor")
  if (tl.length === 0) {
    return {
      ...node,
      ...update,
    }
  } else {
    const children = Object.keys(node.edit.children) as ID[]
    node.edit.children = children.reduce<Record<ID, Node | undefined>>(
      (acc, id) => {
        const currentNode = node.edit.children[id]
        if (!currentNode) throw new Error("WTF")
        acc[id] =
          id === tl[0] ? updateNode(tl, currentNode, update) : currentNode
        return acc
      },
      {},
    )
    return node
  }
}

const topLevelId = id()
export default create<State>((set) => ({
  cursor: [topLevelId],
  tree: {
    id: topLevelId,
    source: "",
    edit: {
      type: "top_level",
      query: "",
      state: { type: "not_started" },
      children: {},
    },
    parentNode: undefined,
  },
  updateNode: (cursor, update) =>
    set((state) => {
      const newTree = updateNode(cursor, state.tree, update)
      return { tree: newTree }
    }),
  updateCursor: (cursor) => set({ cursor }),
}))
