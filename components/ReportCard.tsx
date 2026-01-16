
import React, { useState } from 'react';
import { LabReport, LabStatus } from '../types';

interface ReportCardProps {
  report: LabReport;
  onSaveNotes: (id: string, notes: string) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onSaveNotes }) => {
  const [isNotesEditing, setIsNotesEditing] = useState(false);
  const [noteValue, setNoteValue] = useState(report.notes || '');

  const getStatusColor = (status: LabStatus) => {
    switch (status) {
      case LabStatus.NORMAL: return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case LabStatus.ABNORMAL: return 'text-amber-600 bg-amber-50 border-amber-100';
      case LabStatus.CRITICAL: return 'text-rose-600 bg-rose-50 border-rose-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="glass-card rounded-3xl shadow-xl overflow-hidden border border-white">
      {/* Header */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="heading-font text-xl font-bold text-slate-800">{report.fileName}</h2>
            <p className="text-sm text-slate-500 mt-1">
              <i className="fa-regular fa-calendar-check mr-2"></i>
              Analyzed on {new Date(report.uploadDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold text-blue-600 shadow-sm border border-blue-100 uppercase tracking-wider">
              AI Processed
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        {/* Summary Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <i className="fa-solid fa-wand-magic-sparkles text-blue-500"></i>
            <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Executive Summary</h3>
          </div>
          <p className="text-slate-600 leading-relaxed bg-white/50 p-4 rounded-2xl border border-slate-100 italic">
            "{report.summary}"
          </p>
        </section>

        {/* Results Table */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <i className="fa-solid fa-list-check text-blue-500"></i>
            <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Extracted Results</h3>
          </div>
          <div className="overflow-x-auto -mx-6 sm:mx-0">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-xs font-bold uppercase tracking-widest border-b border-slate-100">
                  <th className="px-4 py-3">Test</th>
                  <th className="px-4 py-3">Value</th>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {report.results.map((res, i) => (
                  <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-700">{res.testName}</div>
                      <div className="text-xs text-slate-400 mt-0.5 max-w-xs">{res.explanation}</div>
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-900">
                      {res.value} <span className="text-xs text-slate-400 font-normal ml-1">{res.unit}</span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-500 font-mono">{res.referenceRange}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-tighter ${getStatusColor(res.status)}`}>
                        {res.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Notes & Security Section */}
        <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
          <section className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-bold text-slate-700 text-xs uppercase tracking-widest flex items-center gap-2">
                <i className="fa-solid fa-user-shield text-slate-400"></i>
                Private Notes
              </h4>
              <button 
                onClick={() => {
                  if (isNotesEditing) onSaveNotes(report.id, noteValue);
                  setIsNotesEditing(!isNotesEditing);
                }}
                className="text-[10px] font-bold text-blue-600 uppercase hover:underline"
              >
                {isNotesEditing ? 'Save Changes' : 'Edit Notes'}
              </button>
            </div>
            {isNotesEditing ? (
              <textarea 
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                rows={4}
                value={noteValue}
                onChange={(e) => setNoteValue(e.target.value)}
                placeholder="Add your own comments or reminders here..."
              />
            ) : (
              <p className="text-sm text-slate-600 min-h-[100px]">
                {report.notes || 'No private notes yet. Click edit to add sensitive reminders.'}
              </p>
            )}
          </section>

          <section className="bg-amber-50/30 rounded-2xl p-5 border border-amber-100/50">
            <h4 className="font-bold text-amber-700 text-xs uppercase tracking-widest flex items-center gap-2 mb-3">
              <i className="fa-solid fa-triangle-exclamation"></i>
              Medical Disclaimer
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed italic">
              {report.disclaimer || "This AI-generated summary is for educational purposes only. It is not a clinical diagnosis. Laboratory results should always be interpreted by a licensed healthcare provider in the context of your complete medical history."}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
