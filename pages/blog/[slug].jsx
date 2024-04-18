import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import Image from 'next/image'

const components = { 
  a: ({ href, children }) => <a className='md-link' href={href + '.mdx'}>{children}</a>, 
  p: (props) => <p {...props} className='md-paragraph' />,
  ul: (props) => <ul {...props} className='md-list' />,
  h1: (props) => <h1 {...props} className='md-h1' />,
  h2: (props) => <h2 {...props} className='md-h2' />,
  h3: (props) => <h3 {...props} className='md-h3' />,
  pre: (props) => <SyntaxHighlighter {...props} style={dracula} className="my-3" />, 
}

const PostPage = ({ frontMatter: { title, postImageUrl }, mdxSource }) => {
  return (
    <div className="mt-4 container">
      <h1>{title}</h1>
      <div className='w-full p-2 flex justify-center my-5'>
        <Image
          src={postImageUrl}
          alt="thumbnail"
          className="w-auto h-auto"
          width={500}
          height={300}
          priority
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
