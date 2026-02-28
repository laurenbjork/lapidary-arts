import React, { createContext, useState, useContext, useEffect } from 'react' ; 
 import { supabase } from '../supabase' ; 
 
 const  AuthContext = createContext(); 
 
 export const useAuth = () =>  useContext(AuthContext); 
 
 export const AuthProvider = ({ children }) =>  { 
   const [currentUser, setCurrentUser] = useState(null ); 
   const [loading, setLoading] = useState(true ); 
 
   useEffect(() =>  { 
     // v2: Get initial session securely 
     const initializeAuth = async  () => { 
       const { data: { session }, error } = await  supabase.auth.getSession(); 
       setCurrentUser(session?.user ?? null ); 
       setLoading(false ); 
     }; 
     
     initializeAuth(); 
 
     // v2: Listen for auth state changes 
     const { data : { subscription } } = supabase.auth.onAuthStateChange( 
       (_event, session) =>  { 
         setCurrentUser(session?.user ?? null ); 
         setLoading(false ); 
       } 
     ); 
 
     // v2: Cleanup subscription on unmount 
     return () =>  { 
       subscription?.unsubscribe(); 
     }; 
   }, []); 
 
   const login = async  (email, password) => { 
     try  { 
       // v2: signInWithPassword instead of signIn 
       const { data, error } = await  supabase.auth.signInWithPassword({ 
         email, 
         password, 
       }); 
 
       if (error) throw  error; 
       
       return { success: true  }; 
     } catch  (error) { 
       console.error("Login error:" , error.message); 
       return { success: false, message : error.message }; 
     } 
   }; 
 
   const signup = async  (email, password) => { 
     try  { 
       const { data, error } = await  supabase.auth.signUp({ 
         email, 
         password, 
       }); 
 
       if (error) throw  error; 
       
       return { success: true, message: "Check your email for the confirmation link!"  }; 
     } catch  (error) { 
       console.error("Signup error:" , error.message); 
       return { success: false, message : error.message }; 
     } 
   }; 
 
   const logout = async  () => { 
     await  supabase.auth.signOut(); 
   }; 
 
   const addAdmin = async  (email, password) => { 
      return { success: false, message: "Please add new users via Supabase Dashboard > Authentication"  }; 
   }; 
 
   const updateAdmin = (id, newUsername, newPassword) =>  { 
     return { success: false, message: "Please update password via Supabase Dashboard"  }; 
   }; 
 
   const deleteAdmin = (id) =>  { 
     return { success: false, message: "Please remove users via Supabase Dashboard"  }; 
   }; 
 
   const  value = { 
     currentUser, 
     admins : [], 
     login, 
     signup, 
     logout, 
     addAdmin, 
     updateAdmin, 
     deleteAdmin, 
     isAuthenticated : !!currentUser, 
     loading 
   }; 
 
   return  ( 
     <AuthContext.Provider value={value}> 
       {!loading ? children : <div className="h-screen w-full flex items-center justify-center">Loading...</div> } 
     </AuthContext.Provider> 
   ); 
 };