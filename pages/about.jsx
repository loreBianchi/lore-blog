import SocialLinks from "../components/SocialLinks";

const Bio = () => {
  return (
    <div className="bg-rainbow dark:bg-dark-rainbow flex flex-grow p-6">
      <div className="mt-3 w-full">
        <h1>About Me</h1>
        <p className="display-4 mb-3 border-b-2 border-lime-300 pb-6">
          Welcome to my website! My name is Lorenzo Bianchi, and I'm a passionate software developer with a keen interest in building robust and scalable web applications. 
          I specialize in Javacript, Typescript and Python, and I'm always eager to learn and explore new technologies.
        </p>
        <div className="mt-3 mb-3 border-b-2 border-orange-400 pb-3">
          <h2>My Expertise</h2>
          <ul>
            <li>Programming Languages: Typescript, Javascript, Python</li>
            <li>Frameworks & Libraries: React, Django, Angular, Next</li>
            <li>Database Technologies: Postgres, SQLlite, MongoDB</li>
            <li>Other Technologies: D3, Node, Cypress. SCSS, Tailwindcss, Postcss</li>
          </ul>
        </div>
        <div className="mt-3 border-b-2 border-purple-400 pb-3">
          <h2>My Projects</h2>
          <p>Here are some of the projects I've worked on:</p>
          <ul>
            <li><a className="underline font-bold" href="https://sciclubchiari.com/" target="blank">Sci Club Chiari</a>: a Next.js blog for a Sky Club</li>
            <li><a className="underline font-bold" href="https://ww1.lu/">WW1.lu</a>: Interactive site about 1st World War in Luxembourg</li>
          </ul>
        </div>
        <div className="mt-3 border-b-2 border-red-400 pb-6">
          <h2>What I Do</h2>
          <p>
            I love transforming ideas into reality through code. Whether it's developing a responsive web application, crafting elegant user interfaces, or solving complex problems, I'm up for the challenge. 
            I'm dedicated to writing clean, efficient, and maintainable code that adheres to industry best practices.
          </p>
        </div>
        <div className="mt-3 border-b-2 border-cyan-400 pb-6">
          <h2>Get In Touch</h2>
          <p>
            If you'd like to collaborate on a project, discuss a potential opportunity, or simply say hello, feel free to reach out to me. I'm always open to new connections and exciting opportunities!
          </p>
          <p>
            Email: <a href="mailto:lorebianchi123@gmail.com" className="underline font-semibold">lorebianchi123@gmail.com</a><br />
          </p>
        </div>
        <SocialLinks />
      </div>
    </div>
  );
};
export default Bio;
