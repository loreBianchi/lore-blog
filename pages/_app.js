import Head from "next/head";
import Nav from "../components/Nav";
import "../styles/globals.css";
import { ThemeProvider } from "next-themes";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Lore Blog</title>
      </Head>
      <ThemeProvider attribute="class">
        <div className="w-full min-h-screen flex flex-col">
          <Nav />
          <Component {...pageProps} />
        </div>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
