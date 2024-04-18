import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'
import Image from 'next/image'

const Blog = ({ posts }) => {
  return (
    <div className='bg-rainbow flex flex-grow'>
      <div className="mt-5 container">
        {posts.map((post, index) => (
          <Link href={'/blog/' + post.slug} passHref key={index}>
            <div className="card mb-3 blog-card">
              <div className="flex flex-row w-full justify-between">
                <div className='p-8'>
                  <div className="card-body">
                    <h5 className="card-title">{post.frontMatter.title}</h5>
                    <p className="card-text">{post.frontMatter.description}</p>
                    <p className="card-text mt-2">
                      <small className="text-gray-500">{post.frontMatter.date}</small>
                    </p>
                  </div>
                </div>
                <div className='w-[300px] h-[218px] relative'>
                  <Image
                    src={post.frontMatter.thumbnailUrl}
                    className="img-thumbnail"
                    alt="thumbnail"
                    priority
                    fill
                    sizes="300px"

                  />
                </div>
              </div>
            </div>
          </Link>
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
