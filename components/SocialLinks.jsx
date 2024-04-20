const SocialLinks = () => {
  return (
    <div className="mt-4 flex flex-row">
      <a
        href="https://twitter.com/LoreBianchi"
        className="underline decoration-sky-500 font-semibold hover:text-slate-500 underline-offset-2"
        target="blank"
      >
        X
      </a>
      <a
        href="https://github.com/loreBianchi"
        className="underline decoration-purple-500 ms-3 font-semibold hover:text-slate-500 underline-offset-2"
        target="blank"
      >
        Github
      </a>
      <a
        href="https://www.linkedin.com/in/lorenzo-bianchi-ba6622bb/"
        className="underline decoration-blue-500 ms-3 font-semibold hover:text-slate-500 underline-offset-2"
        target="blank"
      >
        Linkedin
      </a>
    </div>
  );
};

export default SocialLinks;
