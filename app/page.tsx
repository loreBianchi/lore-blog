// Import any necessary components or libraries here, e.g., Link if you were navigating internally.

export default function Page() {
  // Configuration of external URLs for easy maintenance
  const blogURL = "https://blog.lorebianchi.com/";

  return (
    <section>
      {/* 1. INTRODUCTION SECTION (HERO) */}
      <h1 className="mb-8 text-4xl font-bold tracking-tighter">Hello, I'm Lorenzo 👋</h1>

      <p className="mb-4">
        {`My name is Lorenzo Bianchi. I'm a Web developer based in Italy. I love building
        beautiful and performant web applications using modern technologies.`}
      </p>
      <p className="mb-4">
        {`I write code primarily using Javascript, Typescript and Python, and I'm always eager to learn and explore new technologies.`}
      </p>
      {/* 2. BLOG LINK (FOCAL CALL TO ACTION) */}
      <div className="my-12">
        <a
          href={blogURL} // External blog URL
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 font-medium underline hover:no-underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          Visit my blog: code, chaos, and questionable ideas
        </a>
      </div>
    </section>
  );
}
