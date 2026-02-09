import React, { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import { Plus, Edit2, Trash2, Save, X, Upload } from 'lucide-react';

const ProductsTab = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const initialFormState = {
    name: '',
    category: 'earrings',
    subcategory: '',
    price: '',
    discountPrice: '',
    description: '',
    image: '',
    isVisible: true,
    isNewArrival: false,
  };
  const [formData, setFormData] = useState(initialFormState);
  const [previewImage, setPreviewImage] = useState(null);

  const categories = [
    { value: 'earrings', label: 'Earrings' },
    { value: 'necklaces', label: 'Necklaces' },
    { value: 'rings', label: 'Rings' },
    { value: 'engagement', label: 'Engagement Rings' },
    { value: 'diamonds', label: 'Diamonds & Gemstones' },
    { value: 'watches', label: 'Watches' },
    { value: 'collections', label: 'Collections' },
  ];

  const subcategories = {
    earrings: [
      { value: 'hoops-&-huggies', label: 'Hoops & Huggies' },
      { value: 'studs', label: 'Studs' },
      { value: 'ear-bands-&-cuffs', label: 'Ear Bands & Cuffs' },
    ],
    necklaces: [
      { value: 'chokers', label: 'Chokers' },
      { value: 'pendant', label: 'Pendant' },
      { value: 'tennis', label: 'Tennis' },
      { value: 'lariat', label: 'Lariat' },
      { value: 'disk-and-coins', label: 'Disk and Coins' },
    ],
    rings: [
      { value: 'stacks-and-bands', label: 'Stacks and Bands' },
      { value: 'dome-rings', label: 'Dome Rings' },
      { value: 'double-band-rings', label: 'Double Band Rings' },
      { value: 'diamond-bands', label: 'Diamond Bands' },
      { value: 'bridal-&-engagement', label: 'Bridal & Engagement' },
    ],
    engagement: [
      { value: 'solitaire', label: 'Solitaire' },
      { value: 'halo', label: 'Halo' },
      { value: 'vintage', label: 'Vintage' },
    ],
    diamonds: [
      { value: 'emerald', label: 'Emerald' },
      { value: 'topaz', label: 'Topaz' },
      { value: 'sapphire', label: 'Sapphire' },
      { value: 'spinel', label: 'Spinel' },
      { value: 'pearl', label: 'Pearl' },
      { value: 'opal', label: 'Opal' },
      { value: 'tourmaline', label: 'Tourmaline' },
      { value: 'ruby', label: 'Ruby' },
      { value: 'garnet', label: 'Garnet' },
      { value: 'loose', label: 'Loose Diamonds' },
      { value: 'gemstones', label: 'Gemstones' },
    ],
    watches: [
      { value: 'men', label: 'Men' },
      { value: 'women', label: 'Women' },
    ],
    collections: [
      { value: 'new', label: 'New Collection' },
      { value: 'classic', label: 'Classic Collection' },
    ]
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);
      setFormData({ 
        ...formData, 
        image: objectUrl, // Keep for preview
        imageFile: file   // Store actual file for upload
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
    };

    let result;
    if (editingId) {
      result = await updateProduct(editingId, productData);
      setEditingId(null);
    } else {
      result = await addProduct(productData);
    }
    
    if (result && result.success) {
        setFormData(initialFormState);
        setPreviewImage(null);
        setIsEditing(false);
    } else {
        alert(`Failed to save product: ${result?.message || 'Unknown error'}`);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      category: product.category,
      subcategory: product.subcategory || '',
      price: product.price,
      discountPrice: product.discountPrice || '',
      description: product.description || '',
      image: product.image,
      isVisible: product.isVisible,
      isNewArrival: product.isNewArrival || false,
    });
    setPreviewImage(product.image);
    setEditingId(product.id);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const handleCancel = () => {
    setFormData(initialFormState);
    setPreviewImage(null);
    setEditingId(null);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-serif">Product Management</h2>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-black text-white px-4 py-2 rounded-md flex items-center text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors"
          >
            <Plus size={16} className="mr-2" /> Add Product
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Product Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
                required 
              />
            </div>
            
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Category</label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={(e) => {
                    handleInputChange(e);
                    // Reset subcategory when category changes
                    setFormData(prev => ({ ...prev, category: e.target.value, subcategory: '' }));
                }} 
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Subcategory (Optional)</label>
              <select 
                name="subcategory" 
                value={formData.subcategory} 
                onChange={handleInputChange} 
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
              >
                <option value="">None</option>
                {subcategories[formData.category]?.map(sub => (
                  <option key={sub.value} value={sub.value}>{sub.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Price ($)</label>
              <input 
                type="number" 
                name="price" 
                value={formData.price} 
                onChange={handleInputChange} 
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
                required 
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Sale Price ($) - Optional</label>
              <input 
                type="number" 
                name="discountPrice" 
                value={formData.discountPrice} 
                onChange={handleInputChange} 
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
                min="0"
                step="0.01"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Description</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
                rows="3"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Product Image</label>
              <div className="flex items-center space-x-4">
                <div className="relative overflow-hidden w-32 h-32 bg-gray-200 rounded-md flex justify-center items-center">
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-xs">No Image</span>
                  )}
                </div>
                <div className="flex-1">
                  <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors inline-flex items-center">
                    <Upload size={16} className="mr-2" /> Upload Image
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  <p className="text-[10px] text-gray-400 mt-1">Recommended: 1000 x 1250 px (4:5 Portrait)</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 flex space-x-6">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="isVisible" 
                  checked={formData.isVisible} 
                  onChange={handleInputChange} 
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Product is visible in store</span>
              </label>

              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="isNewArrival" 
                  checked={formData.isNewArrival} 
                  onChange={handleInputChange} 
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Show in "New Arrivals"</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button 
              type="button" 
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 text-xs uppercase tracking-widest hover:bg-white"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 bg-burgundy text-white rounded-md text-xs uppercase tracking-widest hover:bg-burgundy-light"
            >
              {editingId ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Image</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Name</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Category</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Price</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Status</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wider text-gray-500 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium">{product.name}</td>
                  <td className="py-3 px-4 capitalize text-gray-500">{product.category}</td>
                  <td className="py-3 px-4">
                    {product.discountPrice ? (
                      <div>
                        <span className="text-red-600 font-medium">${product.discountPrice}</span>
                        <span className="text-gray-400 line-through text-xs ml-2">${product.price}</span>
                      </div>
                    ) : (
                      <span>${product.price}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] uppercase tracking-wide ${product.isVisible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.isVisible ? 'Visible' : 'Hidden'}
                    </span>
                    {product.isNewArrival && (
                      <span className="ml-2 px-2 py-1 rounded-full text-[10px] uppercase tracking-wide bg-blue-100 text-blue-800">
                        New Arrival
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-800 mx-2">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800 mx-2">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">
                    No products found. Click "Add Product" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductsTab;
