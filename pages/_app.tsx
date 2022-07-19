import "../styles/globals.css"
import type { AppProps } from "next/app"
import MarkdownLayout from "../components/markdown_layout"

function MyApp({ Component, pageProps }: AppProps) {
  if (pageProps.markdoc) {
    return (
      <MarkdownLayout>
        <Component {...pageProps} />
      </MarkdownLayout>
    )
  }

  return <Component {...pageProps} />
}

export default MyApp
