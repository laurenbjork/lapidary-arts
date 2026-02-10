import React, { useEffect, useState } from 'react';
import { useAppointments } from '../../context/AppointmentContext';
import { Calendar, Phone, Mail, Clock, Trash2, StickyNote, X, ChevronDown, ChevronUp } from 'lucide-react';

const AppointmentsTab = () => {
  const { appointments, loading, fetchAppointments, updateAppointmentStatus, deleteAppointment, updateAppointmentNote } = useAppointments();
  
  const [noteModal, setNoteModal] = useState({ isOpen: false, id: null, note: '' });
  const [expandedDesc, setExpandedDesc] = useState({});

  useEffect(() => {
    fetchAppointments();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = async (id) => {
      if (window.confirm('Are you sure you want to delete this appointment request?')) {
          await deleteAppointment(id);
      }
  };

  const openNoteModal = (id, currentNote) => {
      setNoteModal({ isOpen: true, id, note: currentNote || '' });
  };

  const saveNote = async () => {
      if (noteModal.id) {
          await updateAppointmentNote(noteModal.id, noteModal.note);
          setNoteModal({ isOpen: false, id: null, note: '' });
      }
  };

  const toggleExpand = (id) => {
    setExpandedDesc(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return <div className="text-center py-10">Loading appointments...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm relative">
      <h2 className="text-xl font-serif mb-6">Appointment Requests</h2>
      
      {appointments.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No appointment requests yet.
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((apt) => (
            <div key={apt.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold ${getStatusColor(apt.status)}`}>
                      {apt.status}
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(apt.created_at)}</span>
                  </div>
                  <h3 className="font-serif text-lg">{apt.name}</h3>
                  <div className="text-sm text-gray-600 flex flex-col space-y-1 mt-2">
                    <div className="flex items-center">
                        <Mail size={14} className="mr-2" />
                        <a href={`mailto:${apt.email}`} className="hover:text-burgundy">{apt.email}</a>
                    </div>
                    <div className="flex items-center">
                        <Phone size={14} className="mr-2" />
                        <a href={`tel:${apt.phone}`} className="hover:text-burgundy">{apt.phone}</a>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                    <div className="text-sm font-medium mb-1">
                        Product Interest:
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                        {apt.product_name || 'Unknown Product'}
                    </div>
                    {apt.stock_number && (
                        <div className="text-xs text-gray-500 font-mono">
                            Stock #: {apt.stock_number}
                        </div>
                    )}
                    <div className="mt-3 flex items-center justify-end text-sm text-gray-600">
                        <Clock size={14} className="mr-1" />
                        <span className="capitalize">{apt.preferred_time || 'Any time'}</span>
                    </div>
                </div>
              </div>

              {apt.description && (
                <div className="mt-4">
                    <div className={`p-3 bg-gray-50 rounded-md text-sm text-gray-700 italic ${expandedDesc[apt.id] ? '' : 'line-clamp-2'}`}>
                        "{apt.description}"
                    </div>
                    {apt.description.length > 100 && (
                         <button 
                            onClick={() => toggleExpand(apt.id)}
                            className="text-xs text-burgundy hover:underline mt-1 flex items-center"
                        >
                            {expandedDesc[apt.id] ? (
                                <><ChevronUp size={12} className="mr-1"/> Show Less</>
                            ) : (
                                <><ChevronDown size={12} className="mr-1"/> Show More</>
                            )}
                        </button>
                    )}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                <div className="flex space-x-2">
                    <button 
                        onClick={() => openNoteModal(apt.id, apt.admin_notes)}
                        className={`text-gray-400 hover:text-burgundy transition-colors ${apt.admin_notes ? 'text-burgundy' : ''}`}
                        title="Admin Notes"
                    >
                        <StickyNote size={18} />
                    </button>
                    <button 
                        onClick={() => handleDelete(apt.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>

                <div className="flex space-x-2">
                    {apt.status === 'new' && (
                        <button 
                            onClick={() => updateAppointmentStatus(apt.id, 'contacted')}
                            className="text-xs uppercase tracking-wider px-3 py-1 border border-yellow-500 text-yellow-700 rounded hover:bg-yellow-50"
                        >
                            Mark Contacted
                        </button>
                    )}
                    {apt.status !== 'closed' && (
                        <button 
                            onClick={() => updateAppointmentStatus(apt.id, 'closed')}
                            className="text-xs uppercase tracking-wider px-3 py-1 border border-green-500 text-green-700 rounded hover:bg-green-50"
                        >
                            Mark Closed
                        </button>
                    )}
                </div>
              </div>
            </div>
          ))}
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

export default AppointmentsTab;
