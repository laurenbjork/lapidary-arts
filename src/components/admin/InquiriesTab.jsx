import React, { useEffect, useState } from 'react';
import { useInquiries } from '../../context/InquiryContext';
import { Mail, Calendar, MessageSquare, Trash2, StickyNote, X, ChevronDown, ChevronUp, Filter, Phone, Clock, Archive, Download, History } from 'lucide-react';
import TabButton from './TabButton';
import Papa from 'papaparse';

const InquiriesTab = () => {
  const { inquiries, loading, fetchInquiries, updateInquiry, deleteInquiry, emptyArchive } = useInquiries();
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [filter, setFilter] = useState('all');
  const [noteModal, setNoteModal] = useState({ isOpen: false, id: null, note: '' });
  const [expandedDesc, setExpandedDesc] = useState({});

  useEffect(() => {
    fetchInquiries();
  }, []);

  useEffect(() => {
    let currentInquiries = [];
    if (filter === 'archived') {
      currentInquiries = inquiries.filter(i => i.status === 'archived');
    } else if (filter === 'all') {
      currentInquiries = inquiries.filter(i => i.status !== 'archived');
    } else {
      currentInquiries = inquiries.filter(i => i.type === filter && i.status !== 'archived');
    }
    setFilteredInquiries(currentInquiries);
  }, [inquiries, filter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
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

  const handleArchive = async (id) => {
      if (window.confirm('Are you sure you want to archive this inquiry?')) {
          await updateInquiry(id, { status: 'archived' });
      }
  };

  const handleRestore = async (id) => {
      await updateInquiry(id, { status: 'pending' });
  };
  
  const handleDelete = async (id) => {
      if (window.confirm('This is permanent. Are you sure you want to delete this inquiry forever?')) {
          await deleteInquiry(id);
      }
  };

  const handleEmptyArchive = async () => {
    if (window.confirm('This is permanent. Are you sure you want to delete ALL archived inquiries forever?')) {
        await emptyArchive();
    }
  }

  const downloadCSV = () => {
    if (filteredInquiries.length === 0) {
        alert("There's nothing to download.");
        return;
    }
    const csv = Papa.unparse(filteredInquiries);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `inquiries-${filter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const openNoteModal = (id, currentNote) => {
      setNoteModal({ isOpen: true, id, note: currentNote || '' });
  };

  const saveNote = async () => {
      if (noteModal.id) {
          await updateInquiry(noteModal.id, { notes: noteModal.note });
          setNoteModal({ isOpen: false, id: null, note: '' });
      }
  };

  const toggleExpand = (id) => {
    setExpandedDesc(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderIcon = (type) => {
    switch(type) {
      case 'appointment': return <Calendar size={16} className="text-gray-600" />;
      case 'contact': return <MessageSquare size={16} className="text-gray-600" />;
      case 'newsletter': return <Mail size={16} className="text-gray-600" />;
      default: return null;
    }
  }

  if (loading) {
    return <div className="text-center py-10">Loading inquiries...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-serif">Inquiries</h2>
        <button onClick={downloadCSV} className="flex items-center text-sm text-burgundy hover:text-burgundy-dark font-medium transition-colors">
            <Download size={16} className="mr-2" />
            Download CSV
        </button>
      </div>
      
      <div className="border-b border-gray-200 mb-6">
        <div className="flex justify-between items-center">
            <div className="flex space-x-2">
                <TabButton label="All" isActive={filter === 'all'} onClick={() => setFilter('all')} />
                <TabButton label="Newsletter" isActive={filter === 'newsletter'} onClick={() => setFilter('newsletter')} />
                <TabButton label="Contact" isActive={filter === 'contact'} onClick={() => setFilter('contact')} />
                <TabButton label="Appointments" isActive={filter === 'appointment'} onClick={() => setFilter('appointment')} />
                <TabButton label="Archived" isActive={filter === 'archived'} onClick={() => setFilter('archived')} />
            </div>
            {filter === 'archived' && filteredInquiries.length > 0 && (
                <button onClick={handleEmptyArchive} className="text-xs uppercase tracking-wider px-3 py-1 border border-red-500 text-red-700 rounded hover:bg-red-50">
                    Empty Archive
                </button>
            )}
        </div>
      </div>
      
      {filteredInquiries.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No inquiries found for this filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.map((inquiry) => (
            <div key={inquiry.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold ${getStatusColor(inquiry.status)}`}>
                      {inquiry.status}
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(inquiry.created_at)}</span>
                  </div>
                  <h3 className="font-serif text-lg flex items-center">
                    {renderIcon(inquiry.type)} <span className="ml-2">{inquiry.name}</span>
                  </h3>
                  <div className="text-sm text-gray-600 flex flex-col space-y-1 mt-2">
                    <div className="flex items-center">
                        <Mail size={14} className="mr-2" />
                        <a href={`mailto:${inquiry.email}`} className="hover:text-burgundy">{inquiry.email}</a>
                    </div>
                    {inquiry.phone && <div className="flex items-center">
                        <Phone size={14} className="mr-2" />
                        <a href={`tel:${inquiry.phone}`} className="hover:text-burgundy">{inquiry.phone}</a>
                    </div>}
                  </div>
                </div>
                
                <div className="text-right">
                    {inquiry.preferred_time && <div className="mt-3 flex items-center justify-end text-sm text-gray-600">
                        <Clock size={14} className="mr-1" />
                        <span className="capitalize">{inquiry.preferred_time}</span>
                    </div>}
                </div>
              </div>

              {inquiry.description && (
                <div className="mt-4">
                    <div className={`p-3 bg-gray-50 rounded-md text-sm text-gray-700 italic ${expandedDesc[inquiry.id] ? '' : 'line-clamp-2'}`}>
                        "{inquiry.description}"
                    </div>
                    {inquiry.description.length > 100 && (
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
              )}

              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                <div className="flex space-x-2">
                    <button 
                        onClick={() => openNoteModal(inquiry.id, inquiry.notes)}
                        className={`text-gray-400 hover:text-burgundy transition-colors ${inquiry.notes ? 'text-burgundy' : ''}`}
                        title="Admin Notes"
                    >
                        <StickyNote size={18} />
                    </button>
                    {filter === 'archived' ? (
                        <>
                           <button 
                                onClick={() => handleRestore(inquiry.id)}
                                className="text-gray-400 hover:text-blue-600 transition-colors"
                                title="Restore"
                            >
                                <History size={18} />
                            </button>
                            <button 
                                onClick={() => handleDelete(inquiry.id)}
                                className="text-gray-400 hover:text-red-600 transition-colors"
                                title="Delete Permanently"
                            >
                                <Trash2 size={18} />
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={() => handleArchive(inquiry.id)}
                            className="text-gray-400 hover:text-yellow-600 transition-colors"
                            title="Archive"
                        >
                            <Archive size={18} />
                        </button>
                    )}
                </div>

                <div className="flex space-x-2">
                    {inquiry.status === 'pending' && (
                        <button 
                            onClick={() => updateInquiry(inquiry.id, {status: 'reviewed'})}
                            className="text-xs uppercase tracking-wider px-3 py-1 border border-blue-500 text-blue-700 rounded hover:bg-blue-50"
                        >
                            Mark Reviewed
                        </button>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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

export default InquiriesTab;
