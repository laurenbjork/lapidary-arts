import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

const CustomerContext = createContext();

export const useCustomers = () => useContext(CustomerContext);

export const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (customerData) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([customerData])
        .select()
        .single();

      if (error) throw error;

      setCustomers((prev) => [data, ...prev]);
      return { success: true };
    } catch (error) {
      console.error('Error adding customer:', error.message);
      return { success: false, message: error.message };
    }
  };

  return (
    <CustomerContext.Provider value={{ customers, loading, addCustomer, fetchCustomers }}>
      {children}
    </CustomerContext.Provider>
  );
};
