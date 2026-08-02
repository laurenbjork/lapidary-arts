import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import FadeIn from '../components/FadeIn';
import { ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { posts, loading } = useBlog();
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (!loading) {
      const foundPost = posts.find(p => p.slug === slug || p.id === slug);
      if (foundPost) {
        setPost(foundPost);
        console.log("Fetched post data:", foundPost);
      } else {
        console.log("Post not found for slug/id:", slug);
      }
    }
  }, [slug, posts, loading]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-burgundy"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-32 px-4 text-center">
        <SEO title="Post Not Found" description="The blog post you are looking for could not be found." />
        <h1 className="font-serif text-2xl mb-4">Post not found</h1>
        <Link to="/blog" className="text-xs uppercase tracking-widest border-b border-black">Return to Journal</Link>
      </div>
    );
  }

  const postSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: post.image,
    author: {
      '@type': 'Organization',
      name: 'Lapidary Arts Jewelry',
      url: 'https://www.lapidaryartsjewelry.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Lapidary Arts Jewelry',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.lapidaryartsjewelry.com/images/logo.svg'
      }
    },
    datePublished: new Date(post.created_at).toISOString(),
    dateModified: new Date(post.created_at).toISOString(), // Or use an updated_at field if you have one
    description: post.subtitle
  };

  return (
    <article className="pt-32 pb-20">
      <SEO 
        title={post.title}
        description={post.subtitle}
        keywords={post.title.split(' ').concat(['blog', 'journal', 'fine jewelry'])}
        schema={postSchema}
        url={`https://www.lapidaryartsjewelry.com/blog/${post.slug}`}
        image={post.image}
        type="article"
      />
      <div className="max-w-4xl mx-auto px-4">
        <FadeIn>
          <div className="text-center mb-12">
            <Link to="/blog" className="inline-flex items-center text-[10px] uppercase tracking-widest text-gray-500 hover:text-black mb-8 transition-colors">
              <ArrowLeft size={14} className="mr-2" /> Back to Journal
            </Link>
            <h1 
              className="text-3xl md:text-5xl text-gray-900 mb-6 leading-tight"
              style={(() => {
                const titleStyle = {
                  fontFamily: post.title_font_family ? `'${post.title_font_family}', serif` : undefined,
                  fontSize: post.title_font_size || undefined,
                  color: post.title_color || undefined,
                };
                console.log("Title Style:", titleStyle);
                return titleStyle;
              })()}
            >
              {post.title}
            </h1>
            {post.subtitle && (
              <p 
                className="text-lg text-gray-500 italic max-w-2xl mx-auto mb-6"
                style={(() => {
                  const subtitleStyle = {
                    fontFamily: post.subtitle_font_family ? `'${post.subtitle_font_family}', serif` : undefined,
                    fontSize: post.subtitle_font_size || undefined,
                    color: post.subtitle_color || undefined,
                  };
                  console.log("Subtitle Style:", subtitleStyle);
                  return subtitleStyle;
                })()}
              >
                {post.subtitle}
              </p>
            )}
            <p className="text-[10px] uppercase tracking-widest text-gray-400">
              {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <div className="aspect-video w-full overflow-hidden bg-gray-100 mb-16">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>

          <div 
            className="prose prose-lg mx-auto text-gray-800 leading-relaxed max-w-2xl"
            style={{ fontFamily: post.font_family ? `'${post.font_family}', serif` : undefined }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </FadeIn>
      </div>
    </article>
  );
};

export default BlogPost;
