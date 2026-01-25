"use client";

import Link from "next/link";

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
                <span className="text-primary/50">Email:</span>{" "}
                <a
                  href="mailto:lorebianchi123@gmail.com"
                  className="hover:text-navbar-active transition-colors hover:underline"
                >
                  lorebianchi123@gmail.com
                </a>
              </p>

              <p>
                <span className="text-primary/50">Github:</span>{" "}
                <Link
                  href="https://github.com/lorebianchi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-navbar-active transition-colors hover:underline"
                >
                  @lorebianchi
                </Link>
              </p>

              <p>
                <span className="text-primary/50">Github (2nd):</span>{" "}
                <Link
                  href="https://github.com/lorenzobianchi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-navbar-active transition-colors hover:underline"
                >
                  @lorenzobianchi
                </Link>
              </p>

              <p>
                <span className="text-green-400/50">Based in:</span> <span>Bergamo, Italy 🇮🇹🍕</span>
              </p>
            </div>
          </div>

          {/* Map */}
          <div className="overflow-hidden rounded-2xl border border-green-400/20 shadow-lg">
            <iframe
              title="OpenStreetMap"
              src="https://www.openstreetmap.org/export/embed.html?bbox=9.05%2C45.35%2C9.35%2C45.55&layer=mapnik"
              className="h-80 w-full"
              loading="lazy"
            />
          </div>
        </section>
      </div>
    </main>
  );
}
