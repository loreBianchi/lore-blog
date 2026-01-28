export default function Page() {
  const blogURL = "https://blog.lorebianchi.com/";

  return (
    <section className="max-w-xl mx-auto">
      <div className="flex flex-col items-center text-center mt-16 px-4">
        <h1 className="mb-8 text-center">
          <span className="block text-8xl md:text-9xl lg:text-[10rem] font-extrabold tracking-tight text-transparent bg-clip-text bg-center bg-cover leading-none hello-bg">
            Hello
          </span>

          <span className="block mt-4 text-4xl font-bold tracking-tighter">
            I&apos;m Lorenzo 👋
          </span>
        </h1>

        <p className="mb-4 text-primary">
          {`My name is Lorenzo Bianchi. I'm a Web developer based in Italy. I love building
        beautiful and performant web applications using modern technologies.`}
        </p>

        <p className="mb-2 text-primary">
          {`I write code primarily using Javascript, Typescript and Python, and I'm always eager to learn and explore new technologies.`}
        </p>
        <div className="my-12">
          <a
            href={blogURL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all group hover:underline"
          >
            Visit my blog: code, chaos, and questionable ideas
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
