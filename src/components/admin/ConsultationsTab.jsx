import React from 'react';
import { useContent } from '../../context/ContentContext';
import { MessageSquare, Calendar, Download } from 'lucide-react';

const ConsultationsTab = () => {
  const { content } = useContent();
  const consultations = content.consultations || [];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-serif">Consultation Requests</h2>
        <span className="bg-burgundy text-white text-xs px-2 py-1 rounded-full">
          {consultations.length} New
        </span>
      </div>

      {consultations.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No requests yet</h3>
          <p className="text-gray-500">New consultation inquiries will appear here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Example</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {consultations.map((inquiry) => (
                <tr key={inquiry.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-2" />
                      {new Date(inquiry.submittedAt).toLocaleDateString()}
                      <span className="ml-2 text-xs text-gray-400">
                        {new Date(inquiry.submittedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">{inquiry.name}</span>
                      <a href={`mailto:${inquiry.email}`} className="text-sm text-burgundy hover:underline">
                        {inquiry.email}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                        {inquiry.phone && (
                            <a href={`tel:${inquiry.phone}`} className="text-sm text-gray-600 hover:text-gray-900 mb-1">
                                {inquiry.phone}
                            </a>
                        )}
                        <span className="text-xs text-gray-400 capitalize">
                            Pref: {inquiry.preferredTime || 'Anytime'}
                        </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-500 max-w-xs line-clamp-3">
                      {inquiry.description}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {inquiry.imageUrl ? (
                      <a 
                        href={inquiry.imageUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-burgundy hover:underline"
                      >
                        <img src={inquiry.imageUrl} alt="Ref" className="w-10 h-10 object-cover rounded mr-2" />
                        View Image
                      </a>
                    ) : (
                      <span className="text-gray-400 italic">No image</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ConsultationsTab;
