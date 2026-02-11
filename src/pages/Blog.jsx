import React from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import FadeIn from '../components/FadeIn';

const Blog = () => {
  const { posts, loading } = useBlog();
  const visiblePosts = posts.filter(post => post.is_visible);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-burgundy"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <FadeIn className="text-center mb-16">
        <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-6 italic">The Journal</h1>
        <p className="text-gray-500 text-xs uppercase tracking-widest max-w-2xl mx-auto">
          Stories, Inspiration, and Education from the World of Jewelry
        </p>
      </FadeIn>

      {visiblePosts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 font-serif italic text-lg">Coming soon...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {visiblePosts.map((post) => (
            <FadeIn key={post.id}>
              <Link to={`/blog/${post.slug || post.id}`} className="group block">
                <div className="aspect-[4/3] overflow-hidden mb-6 bg-gray-100">
                  <img 
                    src={post.image || '/images/placeholder.jpg'} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-[10px] uppercase tracking-widest text-gray-400 space-x-2">
                    <span>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <h2 className="font-serif text-xl text-gray-900 group-hover:text-burgundy transition-colors">
                    {post.title}
                  </h2>
                  {post.subtitle && (
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                      {post.subtitle}
                    </p>
                  )}
                  <span className="inline-block text-[10px] uppercase tracking-widest border-b border-gray-300 pb-1 pt-2 group-hover:border-black transition-colors">
                    Read Story
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;
