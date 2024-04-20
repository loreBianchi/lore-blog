import Link from 'next/link'
import {useTheme} from 'next-themes'
import { FaSun, FaMoon } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";

const Nav = () => {
  const {theme, setTheme} = useTheme()

  return (
    <nav className="flex w-full flex-row justify-between p-3 text-black bg-deepskyblue dark:bg-gray-900 dark:text-yellow-100">
      <div className='flex flex-row'>
        <Link href="/" passHref className="nav-link">
          <FaHome className="h-6 w-6" />
        </Link>

        <Link href="/blog" passHref className="nav-link">
          <p className="ms-5 pointer lead my-auto">blog</p>
        </Link>

        <Link href="/porfolio" passHref className="nav-link">
          <p className="ms-5 pointer lead my-auto">porfolio</p>
        </Link>
      </div>
      
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="ms-auto">
        {theme === 'dark' ? (
          <FaSun className="h-6 w-6 text-yellow-400 hover:text-yellow-500" />
        ) : (
          <FaMoon className="h-6 w-6 text-yellow-100 hover:text-yellow-50" />
        )}
      </button> 
      {/* <Link href="/about" passHref>
        <p className="ms-5 pointer lead my-auto">about</p>
      </Link> */}
    </nav>
  )
}

export default Nav