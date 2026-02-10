import React, { useState } from 'react';
import { useCustomers } from '../../context/CustomerContext';
import { Plus, Download, Search, User, Trash2, Edit2, X } from 'lucide-react';

const CustomersTab = () => {
  const { customers, loading, addCustomer, updateCustomer, deleteCustomer } = useCustomers();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
      setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          description: ''
      });
      setEditingId(null);
      setIsAdding(false);
  };

  const handleEditClick = (customer) => {
      setFormData({
          firstName: customer.first_name || '',
          lastName: customer.last_name || '',
          email: customer.email || '',
          phone: customer.phone || '',
          address: customer.address || '',
          description: customer.description || ''
      });
      setEditingId(customer.id);
      setIsAdding(true);
  };

  const handleDeleteClick = async (id) => {
      if (window.confirm('Are you sure you want to delete this customer?')) {
          await deleteCustomer(id);
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const customerData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      description: formData.description
    };

    let result;
    if (editingId) {
        result = await updateCustomer(editingId, customerData);
    } else {
        result = await addCustomer(customerData);
    }

    if (result.success) {
      resetForm();
    } else {
      alert(`Error ${editingId ? 'updating' : 'adding'} customer: ` + result.message);
    }
  };

  const downloadCSV = () => {
    const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Address', 'Description', 'Created At'];
    
    const csvContent = [
      headers.join(','),
      ...customers.map(c => [
        c.id,
        `"${(c.first_name || '').replace(/"/g, '""')}"`,
        `"${(c.last_name || '').replace(/"/g, '""')}"`,
        `"${(c.email || '').replace(/"/g, '""')}"`,
        `"${(c.phone || '').replace(/"/g, '""')}"`,
        `"${(c.address || '').replace(/"/g, '""')}"`,
        `"${(c.description || '').replace(/"/g, '""')}"`,
        c.created_at
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'customers.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (customer.first_name?.toLowerCase().includes(searchLower)) ||
      (customer.last_name?.toLowerCase().includes(searchLower)) ||
      (customer.email?.toLowerCase().includes(searchLower)) ||
      (customer.phone?.toLowerCase().includes(searchLower))
    );
  });

  if (loading) return <div className="p-8 text-center">Loading customers...</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-serif">Customers</h2>
        <div className="flex space-x-3">
          <button 
            onClick={downloadCSV}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 text-sm hover:bg-gray-50"
          >
            <Download size={18} className="mr-2" />
            Export CSV
          </button>
          <button 
            onClick={() => isAdding ? resetForm() : setIsAdding(true)}
            className="flex items-center px-4 py-2 bg-burgundy text-white rounded-md text-sm hover:bg-burgundy-light"
          >
            {isAdding ? <><X size={18} className="mr-2" /> Cancel</> : <><Plus size={18} className="mr-2" /> Add Customer</>}
          </button>
        </div>
      </div>

      {isAdding ? (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium mb-4">{editingId ? 'Edit Customer' : 'New Customer'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">First Name</label>
              <input 
                type="text" 
                name="firstName" 
                value={formData.firstName} 
                onChange={handleInputChange} 
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Last Name</label>
              <input 
                type="text" 
                name="lastName" 
                value={formData.lastName} 
                onChange={handleInputChange} 
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Email</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Phone</label>
              <input 
                type="tel" 
                name="phone" 
                value={formData.phone} 
                onChange={handleInputChange} 
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Address</label>
              <input 
                type="text" 
                name="address" 
                value={formData.address} 
                onChange={handleInputChange} 
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Description / Notes</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                rows="3"
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black"
              ></textarea>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button 
              type="submit" 
              className="px-6 py-2 bg-black text-white rounded-md text-xs uppercase tracking-widest hover:bg-gray-800"
            >
              {editingId ? 'Update Customer' : 'Save Customer'}
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="mb-6 relative">
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-black"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Name</th>
                  <th className="py-3 px-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Contact</th>
                  <th className="py-3 px-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Address</th>
                  <th className="py-3 px-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Notes</th>
                  <th className="py-3 px-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Added</th>
                  <th className="py-3 px-4 text-right text-xs uppercase tracking-wider text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 text-gray-500">
                          <User size={16} />
                        </div>
                        {customer.first_name} {customer.last_name}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="text-gray-900">{customer.email}</div>
                      <div className="text-gray-500 text-xs">{customer.phone}</div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 truncate max-w-xs" title={customer.address}>
                      {customer.address || '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 truncate max-w-xs" title={customer.description}>
                      {customer.description || '-'}
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-500">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                        <div className="flex justify-end space-x-2">
                            <button 
                                onClick={() => handleEditClick(customer)}
                                className="text-gray-400 hover:text-burgundy transition-colors"
                                title="Edit"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button 
                                onClick={() => handleDeleteClick(customer.id)}
                                className="text-gray-400 hover:text-red-600 transition-colors"
                                title="Delete"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </td>
                  </tr>
                ))}
                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-500">
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomersTab;
