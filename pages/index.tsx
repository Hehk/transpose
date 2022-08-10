import type { NextPage } from "next"
import Head from "next/head"
import Topbar from "../components/topbar"
import App from "../components/app"

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Transpose</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <Topbar /> */}
      <App />
    </div>
  )
}

export default Home
