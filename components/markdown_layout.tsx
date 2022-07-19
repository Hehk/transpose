import Topbar from "./topbar"
export default function MarkdownLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Topbar />
      <main className="py-4 w-full max-w-4xl mx-auto px-2 xm:px-6 lg:px-8 h-full ">
        {children}
      </main>
    </>
  )
}
