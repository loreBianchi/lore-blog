import "./global.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Navbar } from "./components/nav";
import Footer from "./components/footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://lorebianchi.com"),
  title: {
    default: "lorebianchi.com",
    template: "%s | LoreBianchi.com",
  },
  description: "This is my portfolio.",
  openGraph: {
    title: "lorebianchi.com",
    description: "This is my portfolio.",
    url: "https://lorebianchi.com",
    siteName: "Lorenzo Bianchi personal site",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const cx = (...classes) => classes.filter(Boolean).join(" ");

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={cx(
        "text-black bg-white dark:text-white dark:bg-black",
        GeistSans.variable,
        GeistMono.variable
      )}
    >
      <body className="antialiased min-h-screen flex flex-col">
        <div className="max-w-xl mx-4 mt-8 lg:mx-auto w-full flex flex-col flex-1">
          <main className="flex flex-1 min-w-0 mt-6 flex-col px-2 md:px-0">
            <Navbar />
            {children}
          </main>
        </div>
          <Footer />
      </body>
    </html>
  );
}
