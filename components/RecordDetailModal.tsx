import React from 'react';
import { SharedRecord, PrivacyLevel, DisclosureTiming } from '../types';
import { X, Clock, AlertTriangle, FileText, CheckCircle2, Star, MapPin } from 'lucide-react';

interface Props {
  record: SharedRecord;
  onClose: () => void;
}

const RecordDetailModal: React.FC<Props> = ({ record, onClose }) => {
  // Mock logic for "Days since shared"
  // If shareDate is recent (e.g., '2023-12-15') and today is mock '2024-01-01', diff is ~15 days.
  const today = new Date('2024-01-01').getTime();
  const shareDate = new Date(record.sharedDate).getTime();
  const daysSinceShare = Math.floor((today - shareDate) / (1000 * 60 * 60 * 24));
  
  const isDelayed = record.disclosureTiming === DisclosureTiming.DELAYED && daysSinceShare < 30;
  const isSummaryOnly = record.privacyLevel === PrivacyLevel.SUMMARY;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
           <div>
             <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-bold text-slate-900">{record.patientName}</h2>
                <span className="text-sm px-2 py-0.5 bg-slate-100 rounded-full text-slate-500 border border-slate-200">{record.patientId}</span>
             </div>
             <p className="text-lg text-slate-700 font-medium mb-1">{record.diagnosis}</p>
             <div className="flex items-center gap-3 text-sm text-slate-500">
               <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Shared by <span className="font-semibold text-slate-700">{record.sharedByClinic}</span></span>
               <span>•</span>
               <span>{record.sharedDate}</span>
             </div>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
             <X className="w-6 h-6 text-slate-600" />
           </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-white">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             
             {/* Left Column: Standard Data */}
             <div className="space-y-6">
                <section>
                  <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3">Patient Profile</h3>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="text-slate-500">Full Name</div>
                    <div className="font-medium">{record.patientName}</div>
                    <div className="text-slate-500">Demographics</div>
                    <div className="font-medium">{record.age} years / {record.gender}</div>
                    <div className="text-slate-500">Date of Birth</div>
                    <div className="font-medium">{record.dateOfBirth}</div>
                    <div className="text-slate-500">Condition Category</div>
                    <div className="font-medium">{record.diagnosisCategory}</div>
                  </div>
                </section>

                <section>
                  <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3">Clinical Assessment</h3>
                  <div className="bg-slate-50 p-4 rounded-lg text-sm space-y-3">
                    <div>
                      <span className="font-semibold block text-slate-700">Subjective:</span> 
                      <p className="text-slate-600">{record.subjectiveComplaint}</p>
                    </div>
                    <div>
                      <span className="font-semibold block text-slate-700">Objective:</span> 
                      <p className="text-slate-600">{record.objectiveFindings}</p>
                    </div>
                    <div>
                      <span className="font-semibold block text-slate-700">Outcomes (PROMs):</span> 
                      <p className="text-slate-600">{record.promScores}</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3">Treatment Summary</h3>
                  <div className="bg-slate-50 p-4 rounded-lg text-sm space-y-2">
                    <p><span className="font-semibold">Duration:</span> {record.durationWeeks} weeks ({record.sessions} sessions)</p>
                    <p><span className="font-semibold">Plan:</span> {record.treatmentPlan}</p>
                  </div>
                </section>
             </div>

             {/* Right Column: Protected/Sensitive Data */}
             <div className="space-y-6">
               <section>
                 <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3 flex items-center gap-2">
                   <FileText className="w-5 h-5 text-teal-600" />
                   Clinical Notes & Reasoning
                 </h3>
                 
                 {isSummaryOnly ? (
                   <div className="bg-slate-100 border border-slate-200 rounded-lg p-8 text-center">
                     <AlertTriangle className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                     <h4 className="font-bold text-slate-700">Summary Only</h4>
                     <p className="text-sm text-slate-500 mt-1">The sharing clinic has chosen not to disclose detailed session notes for this record.</p>
                   </div>
                 ) : isDelayed ? (
                   <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 relative overflow-hidden">
                     {/* Blurred Content Simulation */}
                     <div className="filter blur-sm select-none opacity-50 space-y-2 text-sm text-slate-800 pointer-events-none">
                       <p>Week 1: Focus on pain reduction and... lorem ipsum dolor sit amet.</p>
                       <p>Week 2: Progression to loading... consectetur adipiscing elit.</p>
                       <p>Reasoning: Initial presentation suggested... sed do eiusmod tempor.</p>
                     </div>
                     
                     <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[1px]">
                        <Clock className="w-8 h-8 text-amber-600 mb-2" />
                        <h4 className="font-bold text-amber-800">Delayed Disclosure</h4>
                        <p className="text-xs text-amber-700 mt-1 font-medium">Full details available in {30 - daysSinceShare} days.</p>
                        <p className="text-[10px] text-amber-600 mt-2 max-w-xs text-center">
                          (This delay protects the sharing clinic's competitive interests during active treatment.)
                        </p>
                     </div>
                   </div>
                 ) : (
                   <div className="bg-white border border-slate-200 rounded-lg p-4 text-sm text-slate-700 leading-relaxed shadow-sm">
                      <div className="mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Detailed Notes</span>
                        <p className="mt-1">{record.detailedNotes}</p>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Clinical Reasoning</span>
                        <p className="mt-1 italic">{record.clinicalReasoning}</p>
                      </div>
                   </div>
                 )}
               </section>

               <section>
                  <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3">Outcome</h3>
                  <div className="bg-green-50 text-green-800 p-4 rounded-lg text-sm flex items-start gap-3 mb-4">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <div>
                      <span className="font-bold block mb-1">{record.status}</span>
                      {record.outcome}
                    </div>
                  </div>
               </section>
             </div>

           </div>
        </div>

      </div>
    </div>
  );
};

export default RecordDetailModal;