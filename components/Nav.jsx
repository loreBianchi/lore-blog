import Link from 'next/link'

const Nav = () => {
  return (
    <nav className="flex w-full flex-row p-3 text-black bg-deepskyblue">  
      <Link href="/" passHref className="text-green-700 hover:text-green-800">
        <h2 className="pointer">/</h2>
      </Link>

      <Link href="/blog" passHref className="text-green-700 hover:text-green-800">
        <p className="ms-5 pointer lead my-auto">blog</p>
      </Link>
      
      {/* <Link href="/about" passHref>
        <p className="ms-5 pointer lead my-auto">about</p>
      </Link> */}
    </nav>
  )
}

export default Nav