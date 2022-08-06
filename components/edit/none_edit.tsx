import type { Node, NoneEdit } from "../../lib/state"
import Image from "next/image"
import React from "react"
import Canvas from "../canvas"

function EditButton({
  onSubmit,
  children,
}: {
  onSubmit: () => void
  children: React.ReactNode
}) {
  return (
    <button onClick={onSubmit} onSubmit={onSubmit}>
      {children}
    </button>
  )
}

type state = {
  editMode: "none"
}

export default function None({ node }: { node: Node }) {
  return (
    <div className="flex">
      <div className="bg-black h-96 w-16">
        <EditButton onSubmit={() => console.log("+")}>+</EditButton>
        <EditButton onSubmit={() => console.log("-")}>-</EditButton>
      </div>
      <Canvas src={node.source} />
      <div className="bg-black h-96 w-16"></div>
    </div>
  )
}
