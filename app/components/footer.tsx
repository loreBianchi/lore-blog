import { GithubIcon } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear(); 
  
  return (
    <footer className="mt-16 mb-8 w-full p-8">    
      <div className="flex justify-between items-center w-full"> 
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          © {currentYear} Lorenzo Bianchi
        </p>
        <a
          className="flex items-center text-sm transition-all hover:text-neutral-800 dark:hover:text-neutral-100"
          rel="noopener noreferrer"
          target="_blank"
          href="https://github.com/lorebianchi"
        >
          <GithubIcon size={18} /> 
        </a>
      </div>
    </footer>
  )
}