import { GithubIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="px-4 py-8 mt-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-navbar">
          <p>© {new Date().getFullYear()} Lorenzo Bianchi</p>
          <div className="flex gap-6">
            <a
              href="https://github.com/lorebianchi"
              className="hover:text-navbar-active transition-colors"
            >
              <GithubIcon size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
