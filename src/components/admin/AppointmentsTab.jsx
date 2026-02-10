import React, { useEffect } from 'react';
import { useAppointments } from '../../context/AppointmentContext';
import { Calendar, Phone, Mail, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const AppointmentsTab = () => {
  const { appointments, loading, fetchAppointments, updateAppointmentStatus } = useAppointments();

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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="text-center py-10">Loading appointments...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
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
                <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm text-gray-700 italic">
                    "{apt.description}"
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-2">
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
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentsTab;
