import React, { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { MessageSquare, Calendar, Trash2, StickyNote, ChevronDown, ChevronUp, X } from 'lucide-react';

const ConsultationsTab = () => {
  const { content, deleteConsultation, updateConsultationNote } = useContent();
  const consultations = content.consultations || [];

  const [expandedDesc, setExpandedDesc] = useState({});
  const [noteModal, setNoteModal] = useState({ isOpen: false, id: null, note: '' });

  const toggleExpand = (id) => {
    setExpandedDesc(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDelete = async (id) => {
      if (window.confirm('Are you sure you want to delete this consultation request?')) {
          await deleteConsultation(id);
      }
  };

  const openNoteModal = (id, currentNote) => {
      setNoteModal({ isOpen: true, id, note: currentNote || '' });
  };

  const saveNote = async () => {
      if (noteModal.id) {
          await updateConsultationNote(noteModal.id, noteModal.note);
          setNoteModal({ isOpen: false, id: null, note: '' });
      }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 relative">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ref Image</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {consultations.map((inquiry) => (
                <tr key={inquiry.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 align-top">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-2" />
                      {new Date(inquiry.submittedAt).toLocaleDateString()}
                      <span className="ml-2 text-xs text-gray-400">
                        {new Date(inquiry.submittedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-top">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">{inquiry.name}</span>
                      <a href={`mailto:${inquiry.email}`} className="text-sm text-burgundy hover:underline">
                        {inquiry.email}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-top">
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
                  <td className="px-6 py-4 align-top">
                    <div className="max-w-xs">
                        <p className={`text-sm text-gray-500 ${expandedDesc[inquiry.id] ? '' : 'line-clamp-2'}`}>
                        {inquiry.description}
                        </p>
                        {inquiry.description && inquiry.description.length > 60 && (
                            <button 
                                onClick={() => toggleExpand(inquiry.id)}
                                className="text-xs text-burgundy hover:underline mt-1 flex items-center"
                            >
                                {expandedDesc[inquiry.id] ? (
                                    <><ChevronUp size={12} className="mr-1"/> Show Less</>
                                ) : (
                                    <><ChevronDown size={12} className="mr-1"/> Show More</>
                                )}
                            </button>
                        )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 align-top">
                    {inquiry.imageUrl ? (
                      <a 
                        href={inquiry.imageUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-burgundy hover:underline"
                      >
                        <img src={inquiry.imageUrl} alt="Ref" className="w-10 h-10 object-cover rounded mr-2" />
                        View
                      </a>
                    ) : (
                      <span className="text-gray-400 italic">No image</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium align-top">
                      <div className="flex items-center justify-end space-x-3">
                          <button 
                              onClick={() => openNoteModal(inquiry.id, inquiry.adminNotes)}
                              className={`text-gray-400 hover:text-burgundy transition-colors ${inquiry.adminNotes ? 'text-burgundy' : ''}`}
                              title="Admin Notes"
                          >
                              <StickyNote size={18} />
                          </button>
                          <button 
                              onClick={() => handleDelete(inquiry.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors"
                              title="Delete"
                          >
                              <Trash2 size={18} />
                          </button>
                      </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Admin Note Modal */}
      {noteModal.isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-serif">Admin Notes</h3>
                      <button onClick={() => setNoteModal({ ...noteModal, isOpen: false })} className="text-gray-400 hover:text-gray-600">
                          <X size={20} />
                      </button>
                  </div>
                  <textarea
                      value={noteModal.note}
                      onChange={(e) => setNoteModal({ ...noteModal, note: e.target.value })}
                      className="w-full border border-gray-300 rounded-md p-3 h-32 focus:outline-none focus:border-black mb-4 text-sm"
                      placeholder="Write internal notes here..."
                  />
                  <div className="flex justify-end space-x-3">
                      <button 
                          onClick={() => setNoteModal({ ...noteModal, isOpen: false })}
                          className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                      >
                          Cancel
                      </button>
                      <button 
                          onClick={saveNote}
                          className="px-4 py-2 bg-burgundy text-white rounded-md text-sm hover:bg-burgundy-light"
                      >
                          Save Note
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default ConsultationsTab;
