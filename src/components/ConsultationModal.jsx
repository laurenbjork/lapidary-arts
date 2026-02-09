import React, { useState } from 'react';
import { X, Upload, Loader } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const ConsultationModal = ({ isOpen, onClose }) => {
  const { addConsultation, uploadContentImage } = useContent();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = '';
      if (formData.image) {
        imageUrl = await uploadContentImage(formData.image);
      }

      const newConsultation = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        description: formData.description,
        imageUrl: imageUrl,
        submittedAt: new Date().toISOString()
      };

      await addConsultation(newConsultation);
      
      // Reset and close
      setFormData({ name: '', email: '', description: '', image: null });
      setImagePreview(null);
      onClose();
      alert('Thank you! Your consultation request has been received.');
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-lg rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="font-serif text-2xl text-gray-900 italic">Book A Consultation</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black text-sm"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black text-sm"
                placeholder="jane@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Description</label>
            <textarea
              name="description"
              required
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black text-sm resize-none"
              placeholder="Tell us about your vision..."
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Upload Example (Optional)</label>
            <div className="flex items-center space-x-4">
                <div className="flex-1">
                    <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 cursor-pointer transition-colors bg-gray-50">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="h-full object-contain p-2" />
                        ) : (
                            <div className="text-center">
                                <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                                <span className="text-xs text-gray-500">Click to upload image</span>
                            </div>
                        )}
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-burgundy text-white py-3 rounded-md text-xs uppercase tracking-widest hover:bg-burgundy-light transition-colors flex justify-center items-center disabled:opacity-70"
          >
            {isSubmitting ? (
                <>
                    <Loader size={16} className="animate-spin mr-2" />
                    Sending...
                </>
            ) : (
                'Submit Request'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConsultationModal;
