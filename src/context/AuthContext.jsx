import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../supabase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check active session on startup
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
      setLoading(false);
    });

    // 2. Listen for changes (login, logout, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error("Login error:", error.message);
      return { success: false, message: error.message };
    }
  };

  const signup = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      
      return { success: true, message: "Check your email for the confirmation link!" };
    } catch (error) {
      console.error("Signup error:", error.message);
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  // Note: For security, creating new admins should be done via Supabase Dashboard
  // or a secure server-side endpoint, not directly from the client.
  // We will keep these placeholders to prevent breaking the UI, but they won't write to DB yet.
  const addAdmin = async (email, password) => {
     // Optional: Implement logic to invite user via Supabase
     return { success: false, message: "Please add new users via Supabase Dashboard > Authentication" };
  };

  const updateAdmin = (id, newUsername, newPassword) => {
    // Supabase handles password updates differently
    return { success: false, message: "Please update password via Supabase Dashboard" };
  };

  const deleteAdmin = (id) => {
    return { success: false, message: "Please remove users via Supabase Dashboard" };
  };

  const value = {
    currentUser,
    // Provide dummy list for UI compatibility if needed, or update UI to remove list
    admins: [], 
    login,
    signup,
    logout,
    addAdmin,
    updateAdmin,
    deleteAdmin,
    isAuthenticated: !!currentUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div className="h-screen w-full flex items-center justify-center">Loading...</div>}
    </AuthContext.Provider>
  );
};
