import Link from 'next/link'

const Nav = () => {
  return (
    <nav className="nav p-3">  
      <Link href="/" passHref>
        <h2 className="pointer">/</h2>
      </Link>

      <Link href="/blog" passHref>
        <p className="ms-5 pointer lead my-auto">blog</p>
      </Link>
      
      {/* <Link href="/about" passHref>
        <p className="ms-5 pointer lead my-auto">about</p>
      </Link> */}
    </nav>
  )
}

export default Nav