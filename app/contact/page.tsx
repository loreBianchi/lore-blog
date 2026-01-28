import Link from "next/link";
import Map from "./map"

export const metadata = {
  title: "Contact",
  description: "Get in touch with me for projects, collaborations, or just to say hi.",
};

export default function ContactPage() {
  return (

    <main className="max-w-2xl mx-auto">
      <div className="flex flex-col mt-16 px-4 space-y-12">
        <section className="space-y-4">
          <h1 className="text-4xl font-extrabold text-primary">Get in touch</h1>
          <p className="max-w-2xl text-primary/80">
            Have a project in mind, a collaboration idea, or just want to say hi?
            <br />
            Feel free to reach out: I always reply.
          </p>
        </section>

        {/* Contact info */}
        <section className="grid gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-primary">Contacts</h3>
            <div className="space-y-3 text-primary/80">
              <p>
                <span className="text-active/50 font-bold">Email:</span>{" "}
                <a
                  href="mailto:lorebianchi123@gmail.com"
                  className="hover:text-navbar-active transition-colors hover:underline text-primary"
                >
                  lorebianchi123@gmail.com
                </a>
              </p>

              <p>
                <span className="text-active/50 font-bold">Github:</span>{" "}
                <Link
                  href="https://github.com/lorebianchi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-navbar-active transition-colors hover:underline text-primary"
                >
                  @lorebianchi
                </Link>
              </p>

              <p>
                <span className="text-active/50 font-bold">Github (2nd):</span>{" "}
                <Link
                  href="https://github.com/lorenzobianchi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-navbar-active transition-colors hover:underline text-primary"
                >
                  @lorenzobianchi
                </Link>
              </p>

              <p>
                <span className="text-active/50 font-bold">Linkedin:</span>{" "}
                <Link
                  href="hhttps://www.linkedin.com/in/lorenzo-bianchi-ba6622bb/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-navbar-active transition-colors hover:underline text-primary"
                >
                  Lorenzo Bianchi
                </Link>
              </p>

              <p>
                <span className="text-active/50 font-bold">Based in:</span> <span className="text-primary">Bergamo, Italy 🇮🇹🍕</span>
              </p>
            </div>
          </div>

          <Map />

        </section>
      </div>
    </main>
  );
}
