import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import FadeIn from '../components/FadeIn';
import { ArrowLeft } from 'lucide-react';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { posts, loading } = useBlog();
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (!loading) {
      // Try finding by slug first, then by ID as fallback
      const foundPost = posts.find(p => p.slug === slug || p.id === slug);
      if (foundPost) {
        setPost(foundPost);
      } else {
        // If not found in current state (e.g. direct link load), it might be fetching still or actually 404
        // But since we have loading check, if we are here and not found, it's likely 404
        // However, let's wait a bit or handle graceful "Not Found"
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
        <h1 className="font-serif text-2xl mb-4">Post not found</h1>
        <Link to="/blog" className="text-xs uppercase tracking-widest border-b border-black">Return to Journal</Link>
      </div>
    );
  }

  return (
    <article className="pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <FadeIn>
          <div className="text-center mb-12">
            <Link to="/blog" className="inline-flex items-center text-[10px] uppercase tracking-widest text-gray-500 hover:text-black mb-8 transition-colors">
              <ArrowLeft size={14} className="mr-2" /> Back to Journal
            </Link>
            <h1 className="font-serif text-3xl md:text-5xl text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>
            {post.subtitle && (
              <p className="text-lg text-gray-500 font-serif italic max-w-2xl mx-auto mb-6">
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
            className="prose prose-lg mx-auto font-serif text-gray-800 leading-relaxed max-w-2xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </FadeIn>
      </div>
    </article>
  );
};

export default BlogPost;
