import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (isLogin) {
      const result = await login(email, password);
      if (result.success) {
        navigate('/admin');
      } else {
        setError(result.message);
      }
    } else {
      const result = await signup(email, password);
      if (result.success) {
        setMessage(result.message);
        setIsLogin(true);
      } else {
        setError(result.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#5e2b31] rounded-full mb-4">
            <Lock className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-serif text-gray-900">Admin Login</h2>
          <p className="text-gray-500 mt-2 text-sm">Please sign in to access the dashboard</p>
        </div>

        {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md mb-6 border border-red-100 text-center">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-50 text-green-600 text-sm p-3 rounded-md mb-6 border border-green-100 text-center">
              {message}
            </div>
          )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:border-[#5e2b31] transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:border-[#5e2b31] transition-colors"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#5e2b31] text-white py-3 rounded-md uppercase tracking-widest text-xs font-medium hover:bg-[#4a2226] transition-colors"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setMessage('');
            }}
            className="text-xs text-gray-500 underline hover:text-[#5e2b31]"
          >
            {isLogin ? 'First time? Create an account' : 'Already have an account? Sign in'}
          </button>
        </div>

        <div className="mt-6 text-center border-t border-gray-100 pt-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm text-gray-500 hover:text-[#5e2b31] transition-colors group"
          >
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
