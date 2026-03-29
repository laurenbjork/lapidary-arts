import React, { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import { Plus, Edit2, Trash2, Save, X, Upload, Download, MinusCircle, PlusCircle } from 'lucide-react';

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
    secondaryDescription: '',
    image: '',
    isVisible: true,
    isNewArrival: false,
    showOnHome: false,
    brand: '',
    modelName: '',
    modelNumber: '',
    hidePrice: false,
    subTitle: '',
    details: [],
    inStore: false,
    stockNumber: '',
    gallery: [],
    galleryFiles: [],
    availabilityStatus: 'available', // 'available', 'special_order', 'out_of_stock'
    additionalCategories: []
  };
  const [formData, setFormData] = useState(initialFormState);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewGallery, setPreviewGallery] = useState([]); // URLs for previewing new gallery files

  const categories = [
    { value: 'rings', label: 'Rings' },
    { value: 'necklaces', label: 'Necklaces' },
    { value: 'earrings', label: 'Earrings' },
    { value: 'bracelets', label: 'Bracelets' },
    { value: 'lab-grown', label: 'Lab Grown' },
    { value: 'stones', label: 'Stones' },
    { value: 'watches', label: 'Watches' },
    { value: 'gifting', label: 'Gifting' },
  ];

  const subcategories = {
    rings: [
      { value: 'gemstones', label: 'Gemstones' },
      { value: 'cocktail', label: 'Cocktail' },
      { value: 'diamond-bands', label: 'Diamond Bands' },
      { value: 'bridal-&-engagement', label: 'Bridal & Engagement' },
    ],
    necklaces: [
      { value: 'diamond', label: 'Diamond' },
      { value: 'gemstones', label: 'Gemstones' },
      { value: 'coin', label: 'Coin' },
      { value: 'gold', label: 'Gold' },
    ],
    earrings: [
      { value: 'hoops-&-huggies', label: 'Hoops & Huggies' },
      { value: 'studs', label: 'Studs' },
      { value: 'drop-earrings', label: 'Drop Earrings' },
    ],
    bracelets: [
      { value: 'all-bracelets', label: 'All Bracelets' },
      { value: 'chains', label: 'Chains' },
      { value: 'bangles', label: 'Bangles' },
    ],
    'lab-grown': [
      { value: 'all-lab-grown', label: 'All Lab Grown' },
      { value: 'rings', label: 'Rings' },
      { value: 'necklaces', label: 'Necklaces' },
      { value: 'earrings', label: 'Earrings' },
      { value: 'bracelets', label: 'Bracelets' },
    ],
    stones: [
      { value: 'emerald', label: 'Emerald' },
      { value: 'topaz', label: 'Topaz' },
      { value: 'sapphire', label: 'Sapphire' },
      { value: 'spinel', label: 'Spinel' },
      { value: 'pearl', label: 'Pearl' },
      { value: 'opal', label: 'Opal' },
      { value: 'tourmaline', label: 'Tourmaline' },
      { value: 'ruby', label: 'Ruby' },
      { value: 'garnet', label: 'Garnet' },
      { value: 'zircon', label: 'Zircon' },
      { value: 'tanzanite', label: 'Tanzanite' },
    ],
    watches: [
      { value: 'men', label: 'Men' },
      { value: 'women', label: 'Women' },
    ],
    gifting: [
      { value: 'daughters', label: 'Daughters' },
      { value: 'lovers', label: 'Lovers' },
      { value: 'friend', label: 'Friend' },
      { value: 'mamas', label: 'Mamas' },
      { value: 'the-minimalist', label: 'The Minimalist' },
      { value: 'the-maximalist', label: 'The Maximalist' },
      { value: 'bridal-jewelry', label: 'Bridal Jewelry' },
      { value: 'best-sellers', label: 'Best Sellers' },
      { value: '$500-and-under', label: '$500 and under' },
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

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviewGallery([...previewGallery, ...newPreviews]);
      setFormData({
        ...formData,
        galleryFiles: [...(formData.galleryFiles || []), ...files]
      });
    }
  };

  const removeGalleryImage = (index, isExisting) => {
    if (isExisting) {
      // Remove from formData.gallery
      const newGallery = formData.gallery.filter((_, i) => i !== index);
      setFormData({ ...formData, gallery: newGallery });
    } else {
      // Remove from formData.galleryFiles and previewGallery
      const newFiles = formData.galleryFiles.filter((_, i) => i !== index);
      const newPreviews = previewGallery.filter((_, i) => i !== index);
      setFormData({ ...formData, galleryFiles: newFiles });
      setPreviewGallery(newPreviews);
    }
  };

  const handleDetailChange = (index, field, value) => {
    const newDetails = [...formData.details];
    newDetails[index][field] = value;
    setFormData({ ...formData, details: newDetails });
  };

  const addDetail = () => {
    setFormData({ ...formData, details: [...formData.details, { title: '', description: '' }] });
  };

  const removeDetail = (index) => {
    const newDetails = formData.details.filter((_, i) => i !== index);
    setFormData({ ...formData, details: newDetails });
  };

  const addAdditionalCategory = () => {
    setFormData({ 
        ...formData, 
        additionalCategories: [...(formData.additionalCategories || []), { category: '', subcategory: '' }] 
    });
  };

  const removeAdditionalCategory = (index) => {
    const newCats = formData.additionalCategories.filter((_, i) => i !== index);
    setFormData({ ...formData, additionalCategories: newCats });
  };

  const handleAdditionalCategoryChange = (index, field, value) => {
    const newCats = [...formData.additionalCategories];
    newCats[index][field] = value;
    if (field === 'category') {
        newCats[index].subcategory = ''; // Reset subcat if category changes
    }
    setFormData({ ...formData, additionalCategories: newCats });
  };

  const downloadCSV = () => {
    const headers = ['ID', 'Name', 'Category', 'Subcategory', 'Price', 'Discount Price', 'Brand', 'Model Name', 'Model Number', 'Sub Title', 'Visible', 'Show On Home', 'New Arrival', 'Hide Price', 'Stock Number', 'Availability Status', 'Main Description', 'Secondary Description'];
    
    const csvContent = [
      headers.join(','),
      ...products.map(p => [
        p.id,
        `"${(p.name || '').replace(/"/g, '""')}"`,
        p.category,
        p.subcategory || '',
        p.price,
        p.discountPrice || '',
        `"${(p.brand || '').replace(/"/g, '""')}"`,
        `"${(p.modelName || '').replace(/"/g, '""')}"`,
        `"${(p.modelNumber || '').replace(/"/g, '""')}"`,
        `"${(p.subTitle || '').replace(/"/g, '""')}"`,
        p.isVisible,
        p.showOnHome,
        p.isNewArrival,
        p.hidePrice,
        `"${(p.stockNumber || '').replace(/"/g, '""')}"`,
        p.availabilityStatus,
        `"${(p.description || '').replace(/"/g, '""')}"`,
        `"${(p.secondaryDescription || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'products_export.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
      setPreviewGallery([]);
      setIsEditing(false);
      setEditingId(null);
    } else {
      alert('Error saving product: ' + result.message);
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
      isNewArrival: product.isNewArrival,
      showOnHome: product.showOnHome,
      brand: product.brand || '',
      modelName: product.modelName || '',
      modelNumber: product.modelNumber || '',
      hidePrice: product.hidePrice || false,
      subTitle: product.subTitle || '',
      details: product.details || [],
      inStore: product.inStore || false,
      stockNumber: product.stockNumber || '',
      gallery: product.gallery || [],
      galleryFiles: [],
      additionalCategories: product.additionalCategories || []
    });
    setPreviewImage(product.image);
    setPreviewGallery([]);
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
        <div className="flex space-x-3">
            <button 
                onClick={downloadCSV}
                className="border border-black text-black px-4 py-2 rounded-md flex items-center text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors"
            >
                <Download size={16} className="mr-2" /> Export CSV
            </button>
            {!isEditing && (
            <button 
                onClick={() => setIsEditing(true)}
                className="bg-black text-white px-4 py-2 rounded-md flex items-center text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors"
            >
                <Plus size={16} className="mr-2" /> Add Product
            </button>
            )}
        </div>
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
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Sub Product Name (Optional)</label>
              <input 
                type="text" 
                name="subTitle" 
                value={formData.subTitle} 
                onChange={handleInputChange} 
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
                placeholder="e.g. 18k Gold"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Stock Number</label>
              <input 
                type="text" 
                name="stockNumber" 
                value={formData.stockNumber} 
                onChange={handleInputChange} 
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
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

            {/* Additional Categories Section */}
            <div className="md:col-span-2 bg-white p-4 rounded-md border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <label className="block text-xs uppercase tracking-wider text-gray-500">Additional Categories</label>
                    <button type="button" onClick={addAdditionalCategory} className="text-black text-[10px] uppercase tracking-wider flex items-center hover:text-gray-600">
                        <PlusCircle size={14} className="mr-1" /> Add Category
                    </button>
                </div>
                {(!formData.additionalCategories || formData.additionalCategories.length === 0) && (
                    <p className="text-sm text-gray-400 italic">No additional categories.</p>
                )}
                {formData.additionalCategories && formData.additionalCategories.map((cat, index) => (
                    <div key={index} className="flex gap-4 mb-3 items-start">
                        <div className="flex-1">
                            <select 
                                value={cat.category} 
                                onChange={(e) => handleAdditionalCategoryChange(index, 'category', e.target.value)}
                                className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:border-black"
                            >
                                <option value="">Select Category</option>
                                {categories.map(c => (
                                    <option key={c.value} value={c.value}>{c.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                             <select 
                                value={cat.subcategory} 
                                onChange={(e) => handleAdditionalCategoryChange(index, 'subcategory', e.target.value)}
                                className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:border-black"
                                disabled={!cat.category}
                            >
                                <option value="">Select Subcategory</option>
                                {subcategories[cat.category]?.map(sub => (
                                    <option key={sub.value} value={sub.value}>{sub.label}</option>
                                ))}
                            </select>
                        </div>
                        <button type="button" onClick={() => removeAdditionalCategory(index)} className="text-red-500 mt-2 hover:text-red-700">
                            <MinusCircle size={18} />
                        </button>
                    </div>
                ))}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs uppercase tracking-wider text-gray-500">Price ($)</label>
                <label className="flex items-center cursor-pointer">
                    <input 
                    type="checkbox" 
                    name="hidePrice" 
                    checked={formData.hidePrice} 
                    onChange={handleInputChange} 
                    className="mr-2 h-3 w-3"
                    />
                    <span className="text-[10px] uppercase tracking-wider text-gray-500">Hide Price</span>
                </label>
              </div>
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
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Main Description</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                rows="4"
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
              ></textarea>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Secondary Description (Displayed in "Description" tab)</label>
              <textarea 
                name="secondaryDescription" 
                value={formData.secondaryDescription} 
                onChange={handleInputChange} 
                rows="4"
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
                placeholder="Content for the 'Description' tab next to 'Details'..."
              ></textarea>
            </div>

            <div className="md:col-span-2 bg-white p-4 rounded-md border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <label className="block text-xs uppercase tracking-wider text-gray-500">Product Details</label>
                    <button type="button" onClick={addDetail} className="text-black text-[10px] uppercase tracking-wider flex items-center hover:text-gray-600">
                        <PlusCircle size={14} className="mr-1" /> Add Detail
                    </button>
                </div>
                {formData.details.length === 0 && (
                    <p className="text-sm text-gray-400 italic">No details added yet.</p>
                )}
                {formData.details.map((detail, index) => (
                    <div key={index} className="flex gap-4 mb-3 items-start">
                        <div className="flex-1">
                            <input 
                                type="text" 
                                placeholder="Title (e.g. Material)" 
                                value={detail.title}
                                onChange={(e) => handleDetailChange(index, 'title', e.target.value)}
                                className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:border-black"
                            />
                        </div>
                        <div className="flex-[2]">
                            <input 
                                type="text" 
                                placeholder="Description (e.g. 18k Gold)" 
                                value={detail.description}
                                onChange={(e) => handleDetailChange(index, 'description', e.target.value)}
                                className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:border-black"
                            />
                        </div>
                        <button type="button" onClick={() => removeDetail(index)} className="text-red-500 mt-2 hover:text-red-700">
                            <MinusCircle size={18} />
                        </button>
                    </div>
                ))}
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Main Product Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-black transition-colors">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="hidden" 
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="flex flex-col items-center cursor-pointer">
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="h-40 object-contain mb-4" />
                  ) : (
                    <Upload size={32} className="text-gray-400 mb-2" />
                  )}
                  <span className="text-sm text-gray-500">Click to upload main image</span>
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Gallery Images (Max 6)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-black transition-colors mb-4">
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple
                  onChange={handleGalleryChange} 
                  className="hidden" 
                  id="gallery-upload"
                />
                <label htmlFor="gallery-upload" className="flex flex-col items-center cursor-pointer">
                  <Upload size={32} className="text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Click to upload additional images</span>
                </label>
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-4 gap-4">
                {formData.gallery.map((url, index) => (
                  <div key={`existing-${index}`} className="relative aspect-square bg-gray-100 rounded-md overflow-hidden group">
                    <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                    <button 
                        type="button"
                        onClick={() => removeGalleryImage(index, true)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X size={12} />
                    </button>
                    {url === formData.image && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-1">
                            Main Image
                        </div>
                    )}
                  </div>
                ))}
                {previewGallery.map((url, index) => (
                  <div key={`new-${index}`} className="relative aspect-square bg-gray-100 rounded-md overflow-hidden group">
                    <img src={url} alt={`New Gallery ${index}`} className="w-full h-full object-cover" />
                    <button 
                        type="button"
                        onClick={() => removeGalleryImage(index, false)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X size={12} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-green-500/50 text-white text-[10px] text-center py-1">
                        New
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Availability Status</label>
                <div className="flex space-x-6">
                    <label className="flex items-center cursor-pointer">
                        <input 
                            type="radio" 
                            name="availabilityStatus" 
                            value="available"
                            checked={formData.availabilityStatus === 'available'} 
                            onChange={handleInputChange} 
                            className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Available</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input 
                            type="radio" 
                            name="availabilityStatus" 
                            value="special_order"
                            checked={formData.availabilityStatus === 'special_order'} 
                            onChange={handleInputChange} 
                            className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Special Order</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input 
                            type="radio" 
                            name="availabilityStatus" 
                            value="out_of_stock"
                            checked={formData.availabilityStatus === 'out_of_stock'} 
                            onChange={handleInputChange} 
                            className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Out of Stock</span>
                    </label>
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


              {formData.category === 'watches' && (
                <>
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="showOnHome" 
                      checked={formData.showOnHome} 
                      onChange={handleInputChange} 
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Show in Home Page "Watches" Section</span>
                  </label>

                  <div className="w-full mt-4 border-t border-gray-200 pt-4">
                    <h3 className="text-sm font-bold text-gray-700 mb-4">Watch Specific Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Brand</label>
                        <input 
                          type="text" 
                          name="brand" 
                          value={formData.brand} 
                          onChange={handleInputChange} 
                          className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
                          placeholder="e.g. Rolex"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Model Name</label>
                        <input 
                          type="text" 
                          name="modelName" 
                          value={formData.modelName} 
                          onChange={handleInputChange} 
                          className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
                          placeholder="e.g. Lady Datejust"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Model Number</label>
                        <input 
                          type="text" 
                          name="modelNumber" 
                          value={formData.modelNumber} 
                          onChange={handleInputChange} 
                          className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
                          placeholder="e.g. 126234"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
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
                <th className="py-3 px-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Stock #</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Name</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Category</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Price</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Availability</th>
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
                  <td className="py-3 px-4 text-xs text-gray-500">{product.stockNumber}</td>
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
                  <td className="py-3 px-4 text-xs capitalize text-gray-600">
                    {(product.availabilityStatus || 'Available').replace(/_/g, ' ')}
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
