import Head from 'next/head'
import Nav from '../components/Nav'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Lore Blog</title>
      </Head>
      <div className="w-full min-h-screen flex flex-col">
        <Nav />
        <Component {...pageProps} />
      </div>
    </>
  )
}

export default MyApp
