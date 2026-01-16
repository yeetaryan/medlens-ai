
import React, { useState } from 'react';
import { UserSession } from '../types';

interface AuthProps {
  onLogin: (user: UserSession) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API delay for a robust feel
    setTimeout(() => {
      onLogin({
        id: Math.random().toString(36).substr(2, 9),
        email: email || 'demo@medlens.ai'
      });
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-white to-indigo-50">
      <div className="max-w-md w-full glass-card rounded-[2.5rem] shadow-2xl p-8 sm:p-12 border border-white/50 relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-400/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex flex-col items-center mb-10">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-xl shadow-blue-200 mb-4 transform hover:rotate-12 transition-transform">
              <i className="fa-solid fa-microscope text-white text-2xl"></i>
            </div>
            <h1 className="heading-font text-3xl font-extrabold text-slate-800 tracking-tight">
              MedLens <span className="text-blue-600">AI</span>
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-2">Secure Clinical Intelligence</p>
          </div>

          <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
              <input 
                type="email" 
                required
                placeholder="name@company.com"
                className="w-full bg-white/50 border border-slate-200 rounded-2xl px-5 py-3.5 text-slate-700 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className="w-full bg-white/50 border border-slate-200 rounded-2xl px-5 py-3.5 text-slate-700 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <button 
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <i className="fa-solid fa-arrow-right text-sm opacity-70"></i>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-slate-500 hover:text-blue-600 transition-colors"
            >
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span className="font-bold text-blue-600 underline underline-offset-4 decoration-blue-200 hover:decoration-blue-600">
                {isLogin ? 'Join MedLens' : 'Sign In'}
              </span>
            </button>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
            <i className="fa-solid fa-shield-halved text-xs text-slate-400"></i>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hippa Compliant Architecture</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
