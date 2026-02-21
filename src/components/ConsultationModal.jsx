import React, { useState } from 'react';
import { X, Upload, Loader } from 'lucide-react';
import { useAppointments } from '../context/AppointmentContext';

const ConsultationModal = ({ isOpen, onClose }) => {
  const { addAppointment, uploadAppointmentImage } = useAppointments();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    preferredTime: 'morning',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

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
        imageUrl = await uploadAppointmentImage(formData.image);
      }

      const newAppointment = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        preferredTime: formData.preferredTime,
        description: formData.description,
        imageUrl: imageUrl,
        status: 'pending',
        notes: ''
      };

      await addAppointment(newAppointment);
      
      setSuccess(true);
      // Reset form but keep success message for a moment or until closed
      setFormData({ name: '', email: '', phone: '', description: '', preferredTime: 'morning', image: null });
      setImagePreview(null);
      // setTimeout(() => {
      //    onClose();
      //    setSuccess(false);
      // }, 3000);
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
        {success ? (
            <div className="p-12 text-center">
                <div className="text-green-600 text-xl font-serif mb-4">Success!</div>
                <p className="text-gray-600">
                    Someone will reach out during normal business hours within 24 hours!
                </p>
                <button 
                    onClick={() => { setSuccess(false); onClose(); }}
                    className="mt-8 bg-black text-white px-8 py-2 text-xs uppercase tracking-widest rounded hover:bg-gray-800 transition-colors"
                >
                    Close
                </button>
            </div>
        ) : (
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black text-sm"
                placeholder="(555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Preferred Time to Reach Out</label>
              <select
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black text-sm bg-white"
              >
                <option value="morning">Morning (9AM - 12PM)</option>
                <option value="afternoon">Afternoon (12PM - 3PM)</option>
                <option value="evening">Evening (3PM - 6PM)</option>
              </select>
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
          <p className="text-[10px] text-center text-gray-400 mt-2">
            Someone will reach out soon during business hours.
          </p>
        </form>
        )}
      </div>
    </div>
  );
};

export default ConsultationModal;
