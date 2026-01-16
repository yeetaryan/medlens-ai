
import React, { useState, useEffect } from 'react';
import { LabReport, UserSession } from './types';
import { analyzeLabReport } from './services/geminiService';
import Layout from './components/Layout';
import ReportCard from './components/ReportCard';
import Auth from './components/Auth';

const App: React.FC = () => {
  // Authentication State (defaults to null to show Auth gate)
  const [user, setUser] = useState<UserSession | null>(null);
  const [reports, setReports] = useState<LabReport[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user from session storage for persistence within tab
  useEffect(() => {
    const savedUser = sessionStorage.getItem('medlens_session');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Load user reports once logged in
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`medlens_reports_${user.id}`);
      if (saved) {
        setReports(JSON.parse(saved));
      } else {
        setReports([]);
      }
    }
  }, [user]);

  const handleLogin = (userData: UserSession) => {
    setUser(userData);
    sessionStorage.setItem('medlens_session', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('medlens_session');
  };

  const saveReportsToStorage = (updated: LabReport[]) => {
    if (user) {
      localStorage.setItem(`medlens_reports_${user.id}`, JSON.stringify(updated));
      setReports(updated);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const analysis = await analyzeLabReport(base64, file.type);
        
        const newReport: LabReport = {
          id: Math.random().toString(36).substr(2, 9),
          fileName: file.name,
          uploadDate: new Date().toISOString(),
          summary: analysis.summary || 'No summary available.',
          results: (analysis.results as any) || [],
          disclaimer: analysis.disclaimer || '',
          notes: ''
        };

        const updated = [newReport, ...reports];
        saveReportsToStorage(updated);
        setIsUploading(false);
      };
    } catch (err: any) {
      console.error(err);
      setError("Failed to analyze the report. Please ensure it is a clear image or PDF.");
      setIsUploading(false);
    }
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    const updated = reports.map(r => r.id === id ? { ...r, notes } : r);
    saveReportsToStorage(updated);
  };

  // Auth Gate
  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      {/* Upload Section */}
      <section className="relative">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-block px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-sm font-semibold mb-2">
            AI-Powered Medical Intelligence
          </div>
          <h2 className="heading-font text-4xl sm:text-5xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
            Decode your medical labs <br/> 
            <span className="text-blue-600">in seconds.</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Upload a PDF or photo of your lab results. Our clinical-grade AI translates complex data into clear, actionable explanations.
          </p>

          <div className="pt-8">
            <label className={`
              flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-[2rem] 
              cursor-pointer transition-all duration-300
              ${isUploading ? 'bg-slate-50 border-slate-200' : 'bg-white border-blue-100 hover:border-blue-400 hover:bg-blue-50/30'}
            `}>
              {isUploading ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                  <p className="text-sm font-medium text-slate-600">Analyzing biological markers...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="bg-blue-50 p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-cloud-arrow-up text-blue-600 text-3xl"></i>
                  </div>
                  <p className="mb-2 text-sm text-slate-700 font-semibold">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-400">PDF, PNG, JPG (Max 10MB)</p>
                </div>
              )}
              <input 
                type="file" 
                className="hidden" 
                onChange={handleFileUpload} 
                disabled={isUploading}
                accept=".pdf,image/*"
              />
            </label>
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-2">
                <i className="fa-solid fa-circle-exclamation"></i>
                {error}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Reports History */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="heading-font text-xl font-bold text-slate-800 flex items-center gap-3">
            Your Medical History
            <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">{reports.length} Reports</span>
          </h3>
          <div className="text-xs font-semibold text-slate-400 flex items-center gap-2">
             <i className="fa-solid fa-shield-halved"></i>
             256-BIT ENCRYPTION
          </div>
        </div>

        {reports.length === 0 ? (
          <div className="text-center py-24 bg-white/50 rounded-[2rem] border border-dashed border-slate-200">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-folder-open text-slate-400 text-2xl"></i>
            </div>
            <p className="text-slate-500 font-medium">No reports decoded yet.</p>
            <p className="text-slate-400 text-sm mt-1">Uploaded reports will securely appear here.</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {reports.map((report) => (
              <ReportCard 
                key={report.id} 
                report={report} 
                onSaveNotes={handleUpdateNotes} 
              />
            ))}
          </div>
        )}
      </section>

      {/* Feature Section: Veo Animation Placeholder */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-[2.5rem] p-8 sm:p-12 text-white overflow-hidden relative">
         <div className="relative z-10 max-w-2xl">
            <span className="text-blue-300 text-xs font-bold uppercase tracking-widest mb-4 block">Enhanced Insights</span>
            <h2 className="heading-font text-3xl font-bold mb-4">Visualize Trends with AI Motion</h2>
            <p className="text-blue-100/80 leading-relaxed mb-8">
              Transform your reports into subtle animated sequences that highlight historical health trends visually using Google Veo intelligence.
            </p>
            <button className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-blue-50 transition-colors flex items-center gap-2">
              <i className="fa-solid fa-play"></i>
              Unlock Features
            </button>
         </div>
         <div className="absolute right-[-10%] top-[-20%] w-2/3 h-[140%] opacity-20 pointer-events-none">
            <i className="fa-solid fa-heart-pulse text-[20rem] text-white"></i>
         </div>
      </section>
    </Layout>
  );
};

export default App;
