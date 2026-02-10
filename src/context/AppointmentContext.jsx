import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabase';

const AppointmentContext = createContext();

export const useAppointments = () => useContext(AppointmentContext);

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Only fetch if user is admin (authenticated) - but we don't have auth state here explicitly yet.
  // We'll just try to fetch, if RLS fails, we get error or empty.
  // Actually, for public site, we only need 'createAppointment'.
  // For admin, we need 'fetchAppointments'.

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async (appointmentData) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating appointment:', error.message);
      return { success: false, message: error.message };
    }
  };

  const updateAppointmentStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      setAppointments(prev => prev.map(app => 
        app.id === id ? { ...app, status } : app
      ));
      return { success: true };
    } catch (error) {
      console.error('Error updating appointment:', error.message);
      return { success: false, message: error.message };
    }
  };

  return (
    <AppointmentContext.Provider value={{ 
      appointments, 
      loading, 
      fetchAppointments, 
      createAppointment,
      updateAppointmentStatus
    }}>
      {children}
    </AppointmentContext.Provider>
  );
};
