import NextLink from "next/link"

function Link({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <NextLink href={href}>
      <a className="pl-4 underline decoration-indigo-500">{children}</a>
    </NextLink>
  )
}

export default function Topbar() {
  return (
    <nav className="w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 h-16 flex justify-between p-4">
      <h1 className="bold">
        <NextLink href="/">_transpose</NextLink>
      </h1>
      <div>
        <Link href="/about">About</Link>
        <Link href="/models">Models</Link>
        <Link href="/account">Account</Link>
      </div>
    </nav>
  )
}
