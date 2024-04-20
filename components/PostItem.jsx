import Image from 'next/image'
import Link from 'next/link'

const PostItem = ({ post }) => {
  return ( 
    <Link href={'/blog/' + post.slug} passHref>
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

   );
}
 
export default PostItem;