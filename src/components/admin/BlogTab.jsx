import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import { Plus, Edit2, Trash2, Save, X, Upload, Image as ImageIcon } from 'lucide-react';

const BlogTab = () => {
  const { posts, addPost, updatePost, deletePost, uploadBlogImage } = useBlog();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const initialFormState = {
    title: '',
    subtitle: '',
    content: '',
    image: '',
    slug: '',
    is_visible: true
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Create local preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);

      // Upload to Supabase
      const publicUrl = await uploadBlogImage(file);
      setFormData(prev => ({ ...prev, image: publicUrl }));
    } catch (error) {
      alert('Error uploading image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let result;
    if (editingId) {
      result = await updatePost(editingId, formData);
    } else {
      result = await addPost(formData);
    }

    if (result.success) {
      setIsEditing(false);
      setEditingId(null);
      setFormData(initialFormState);
      setPreviewImage(null);
    } else {
      alert('Error saving post: ' + result.message);
    }
  };

  const handleEdit = (post) => {
    setFormData({
      title: post.title,
      subtitle: post.subtitle || '',
      content: post.content || '',
      image: post.image || '',
      slug: post.slug || '',
      is_visible: post.is_visible
    });
    setPreviewImage(post.image);
    setEditingId(post.id);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await deletePost(id);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData(initialFormState);
    setPreviewImage(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-serif">Blog Management</h2>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-black text-white px-4 py-2 rounded-md flex items-center text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors"
          >
            <Plus size={16} className="mr-2" /> New Post
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
                  required 
                />
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Subtitle</label>
                <input 
                  type="text" 
                  name="subtitle" 
                  value={formData.subtitle} 
                  onChange={handleInputChange} 
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Slug (URL)</label>
                <input 
                  type="text" 
                  name="slug" 
                  value={formData.slug} 
                  onChange={handleInputChange} 
                  placeholder="auto-generated-from-title"
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black bg-gray-50"
                />
                <p className="text-[10px] text-gray-400 mt-1">Leave blank to auto-generate from title.</p>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input 
                  type="checkbox" 
                  name="is_visible" 
                  checked={formData.is_visible} 
                  onChange={handleInputChange} 
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                />
                <label className="text-xs uppercase tracking-wider text-gray-500">Visible on Site</label>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Featured Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors relative bg-gray-50 h-64">
                {previewImage ? (
                    <div className="relative w-full h-full">
                        <img 
                            src={previewImage} 
                            alt="Preview" 
                            className="w-full h-full object-cover rounded-md" 
                        />
                        <button 
                            type="button"
                            onClick={() => {
                                setPreviewImage(null);
                                setFormData(prev => ({ ...prev, image: '' }));
                            }}
                            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-50 text-red-500"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <>
                        <ImageIcon size={32} className="text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500 mb-2">Click to upload image</span>
                        <span className="text-xs text-gray-400">Recommended: 1200 x 600px</span>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageUpload} 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                        />
                    </>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Blog Content</label>
            <textarea 
              name="content" 
              value={formData.content} 
              onChange={handleInputChange} 
              className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:border-black font-serif text-lg leading-relaxed min-h-[400px]"
              placeholder="Write your story here..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <button 
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-md text-xs uppercase tracking-widest hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 bg-black text-white rounded-md text-xs uppercase tracking-widest hover:bg-gray-800 flex items-center"
            >
              <Save size={16} className="mr-2" /> {editingId ? 'Update Post' : 'Publish Post'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.length === 0 ? (
                <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-sm text-gray-500 italic">
                        No blog posts yet. Create your first one!
                    </td>
                </tr>
              ) : (
                posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-10 w-16 bg-gray-100 rounded overflow-hidden">
                        {post.image && <img src={post.image} alt={post.title} className="h-full w-full object-cover" />}
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{post.title}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">{post.subtitle}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-[10px] leading-5 font-semibold rounded-full ${
                        post.is_visible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                        {post.is_visible ? 'PUBLISHED' : 'DRAFT'}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleEdit(post)} className="text-blue-600 hover:text-blue-900 mr-4">
                        <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:text-red-900">
                        <Trash2 size={16} />
                        </button>
                    </td>
                    </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BlogTab;
