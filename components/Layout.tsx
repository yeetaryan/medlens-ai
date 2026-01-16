
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
            <i className="fa-solid fa-microscope text-white text-xl"></i>
          </div>
          <div>
            <h1 className="heading-font text-2xl font-bold text-slate-800 tracking-tight">MedLens <span className="text-blue-600">AI</span></h1>
            <p className="text-xs text-slate-500 font-medium">Lab Report Intelligence</p>
          </div>
        </div>
        
        {user && (
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-sm text-slate-600">{user.email}</span>
            <button 
              onClick={onLogout}
              className="text-slate-400 hover:text-red-500 transition-colors p-2"
              title="Logout"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        )}
      </nav>
      
      <main className="space-y-12">
        {children}
      </main>

      <footer className="mt-24 pt-8 border-t border-slate-100 text-center pb-12">
        <p className="text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} MedLens AI. For informational purposes only. Always consult a healthcare professional.
        </p>
      </footer>
    </div>
  );
};

export default Layout;
