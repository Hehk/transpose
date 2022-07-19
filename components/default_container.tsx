export default function DefaultContainer({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="py-16 w-full max-w-7xl mx-auto px-2 xm:px-6 lg:px-8 h-full ">
      {children}
    </main>
  )
}
