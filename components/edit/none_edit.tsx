import type { Node, NoneEdit } from "../../lib/state"
import Image from "next/image"
import React from "react"

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

export default function NoneEdit({ node }: { node: Node }) {
  return (
    <div className="flex">
      <div className="bg-black h-96 w-16">
        <EditButton onSubmit={() => console.log("+")}>+</EditButton>
        <EditButton onSubmit={() => console.log("-")}>-</EditButton>
      </div>
      <div className="grow relative h-96 mx-4 border-2 border-black">
        <Image layout="fill" src={node.source} />
      </div>
      <div className="bg-black h-96 w-16"></div>
    </div>
  )
}
