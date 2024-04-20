import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import PostItem from '../components/PostItem'

const Blog = ({ posts }) => {
  return (
    <div className='bg-rainbow dark:bg-dark-rainbow flex flex-grow'>
      <div className="mt-5 container">
        {posts.map((post, index) => (
          <PostItem post={post} key={index} />
        ))}
      </div>
    </div>
  )
}

export const getStaticProps = async () => {
  const files = fs.readdirSync(path.join('posts'))

  const posts = files.map(filename => {
    const markdownWithMeta = fs.readFileSync(path.join('posts', filename), 'utf-8')
    const { data: frontMatter } = matter(markdownWithMeta)

    return {
      frontMatter,
      slug: filename.split('.')[0]
    }
  })

  return {
    props: {
      posts
    }
  }
}

export default Blog
