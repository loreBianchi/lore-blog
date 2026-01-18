import "./global.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Navbar } from "../components/ui/navbar";
import Footer from "../components/footer";
import { ThemeProvider } from "next-themes";

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

const cx = (...classes: string[]) => classes.filter(Boolean).join(" ");

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className={cx("antialiased min-h-screen flex flex-col", GeistSans.variable, GeistMono.variable)}>
        <ThemeProvider enableSystem={true} defaultTheme="system">
          <div className="max-w-xl mx-4 mt-8 lg:mx-auto w-full flex flex-col flex-1">
            <Navbar />
            <main className="flex flex-1 min-w-0 mt-6 flex-col px-2 md:px-0">
              {children}
            </main>
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
