import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import SyntaxHighlighter from 'react-syntax-highlighter'
import Image from 'next/image'

import Nav from '../../components/Nav'
import Button from '../../components/Button'

const components = { Nav, Button, SyntaxHighlighter }

const PostPage = ({ frontMatter: { title, postImageUrl }, mdxSource }) => {
  return (
    <div className="mt-4 container">
      <h1>{title}</h1>
      <div className='w-100 p2 d-flex justify-content-center my-5'>
        <Image
          src={postImageUrl}
          className="img-fluid"
          alt="thumbnail"
          width={500}
          height={300}
        />
      </div>
      <MDXRemote {...mdxSource} components={components}/>
    </div>
  )
}

const getStaticPaths = async () => {
  const files = fs.readdirSync(path.join('posts'))

  const paths = files.map(filename => ({
    params: {
      slug: filename.replace('.mdx', '')
    }
  }))

  return {
    paths,
    fallback: false
  }
}

const getStaticProps = async ({ params: { slug } }) => {
  const markdownWithMeta = fs.readFileSync(path.join('posts',
    slug + '.mdx'), 'utf-8')

  const { data: frontMatter, content } = matter(markdownWithMeta)
  const mdxSource = await serialize(content)

  return {
    props: {
      frontMatter,
      slug,
      mdxSource
    }
  }
}

export { getStaticProps, getStaticPaths }
export default PostPage