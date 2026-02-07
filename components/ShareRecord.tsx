import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MY_PATIENT_RECORDS } from '../constants';
import { DisclosureTiming } from '../types';
import { Search, FileText, Calendar, CheckCircle, Database, Calculator, FileJson, AlertCircle, Hash, Briefcase, Activity } from 'lucide-react';

interface DataAttribute {
  id: string;
  label: string;
  weight: number;
  description: string;
}

const ATTRIBUTES: DataAttribute[] = [
  { id: 'diagnosis', label: 'Diagnosis', weight: 10, description: 'Primary diagnosis and ICD-10 codes.' },
  { id: 'subjective', label: 'Subjective History', weight: 15, description: 'Patient reported symptoms.' },
  { id: 'objective', label: 'Objective History', weight: 20, description: 'Physical exam data (Measurements).' },
  { id: 'proms', label: 'PROMs', weight: 15, description: 'Standardized outcome scores.' },
  { id: 'treatment', label: 'Interventions/Treatment', weight: 20, description: 'Interventions & exercises.' },
  { id: 'sessions', label: 'Total Sessions', weight: 5, description: 'Total session count and duration.' },
  { id: 'patientStatus', label: 'Patient Case Type', weight: 15, description: 'Funding source (e.g., Workcover) and case info.' },
];

const ShareRecord: React.FC = () => {
  const { shareRecord, user, calculateQualityScore, getMultiplier } = useApp();
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [disclosureTiming, setDisclosureTiming] = useState<DisclosureTiming>(DisclosureTiming.DELAYED);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for checkbox selections - Initialized with defaults from settings
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, boolean>>({
    diagnosis: user.preferences.attributes.diagnosis,
    subjective: user.preferences.attributes.subjective,
    objective: user.preferences.attributes.objective,
    proms: user.preferences.attributes.proms,
    treatment: user.preferences.attributes.treatment,
    sessions: user.preferences.attributes.sessions,
    patientStatus: user.preferences.attributes.patientStatus,
  });

  // Re-sync with preferences if user changes them in settings while staying on share page
  useEffect(() => {
    setSelectedAttributes(user.preferences.attributes);
  }, [user.preferences.attributes]);

  const selectedRecord = MY_PATIENT_RECORDS.find(r => r.id === selectedPatientId);
  
  // Filter out already shared records
  const availableRecords = MY_PATIENT_RECORDS.filter(r => 
    r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleAttribute = (id: string) => {
    setSelectedAttributes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const { score, multiplier, earnedCredits, tier, missingFields, tierStyle } = useMemo(() => {
    const s = calculateQualityScore(selectedAttributes);
    const m = getMultiplier(s);
    
    let t = 'Minimal';
    let style = {
      text: 'text-red-500',
      bg: 'bg-red-50',
      border: 'border-red-200',
      bar: 'bg-red-500',
      darkText: 'text-red-400',
      alertIcon: 'text-red-600',
      alertText: 'text-red-800'
    };

    if (s >= 90) {
      t = 'Complete';
      style = {
        text: 'text-emerald-600',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        bar: 'bg-emerald-500',
        darkText: 'text-emerald-400',
        alertIcon: 'text-emerald-600',
        alertText: 'text-emerald-800'
      };
    } else if (s >= 60) {
      t = 'Good';
      style = {
        text: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        bar: 'bg-blue-500',
        darkText: 'text-blue-400',
        alertIcon: 'text-blue-600',
        alertText: 'text-blue-800'
      };
    } else if (s >= 30) {
      t = 'Partial';
      style = {
        text: 'text-amber-500',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        bar: 'bg-amber-500',
        darkText: 'text-amber-400',
        alertIcon: 'text-amber-600',
        alertText: 'text-amber-800'
      };
    }

    const missing = ATTRIBUTES.filter(attr => !selectedAttributes[attr.id]);

    return { score: s, multiplier: m, earnedCredits: m, tier: t, missingFields: missing, tierStyle: style };
  }, [selectedAttributes, calculateQualityScore, getMultiplier]);

  const handleShare = () => {
    if (selectedPatientId) {
      shareRecord(selectedPatientId, selectedAttributes, disclosureTiming);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedPatientId(null);
      }, 3000);
    }
  };

  // Helper to render raw data content
  const renderRawContent = (text: string) => (
    <div className="bg-white border border-slate-200 p-3 rounded-md shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-1">
        <div className="bg-slate-100 text-slate-400 text-[10px] px-1 rounded">RAW</div>
      </div>
      <p className="text-slate-700 font-mono text-xs leading-relaxed whitespace-pre-wrap">{text}</p>
    </div>
  );

  if (showSuccess) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in duration-300">
        <div className="bg-teal-100 p-6 rounded-full mb-6">
           <CheckCircle className="w-16 h-16 text-teal-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Record Shared Successfully!</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-8">
          You've earned <span className="font-bold text-amber-600">{earnedCredits} Credits</span>. Your contribution helps the network grow stronger.
        </p>
        <button 
          onClick={() => setShowSuccess(false)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-bold"
        >
          Share Another Record
        </button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6">
      {/* Left Panel: Patient List */}
      <div className="w-full md:w-1/3 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 mb-3">Select Patient to Share</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or diagnosis..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 placeholder-slate-400"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {availableRecords.map(record => (
            <div 
              key={record.id}
              onClick={() => setSelectedPatientId(record.id)}
              className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors
                ${selectedPatientId === record.id ? 'bg-teal-50 border-teal-200' : ''}
              `}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-slate-900">{record.patientName}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                  ${record.status === 'Discharged' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}
                `}>{record.status}</span>
              </div>
              <p className="text-sm text-slate-600 mb-1">{record.diagnosis}</p>
              <p className="text-xs text-slate-400">{record.treatmentDate}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Middle & Right Panel Wrapper */}
      <div className="w-full md:w-2/3 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {selectedRecord ? (
          <div className="flex flex-1 flex-col md:flex-row h-full">
            {/* Middle: Preview */}
            <div className="flex-1 p-6 overflow-y-auto border-r border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2 mb-6">
                <FileText className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-lg text-slate-800">Record Preview</h3>
                <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1 font-medium ml-auto">
                  <FileJson className="w-3 h-3" /> Raw Data Only
                </span>
              </div>
              
              <div className="space-y-6 text-sm">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                  <h4 className="font-semibold text-slate-700 mb-3 uppercase text-[10px] tracking-wider border-b border-slate-100 pb-2">Base Record (Demographics)</h4>
                  <div className="grid grid-cols-2 gap-4">
                     <div><span className="text-slate-400 text-xs block">Patient</span> <span className="font-medium text-slate-900">{selectedRecord.patientName} (Anonymized)</span></div>
                     <div><span className="text-slate-400 text-xs block">DOB</span> <span className="font-medium text-slate-900">{selectedRecord.dateOfBirth} ({selectedRecord.age}y)</span></div>
                     <div><span className="text-slate-400 text-xs block">Gender</span> <span className="font-medium text-slate-900">{selectedRecord.gender}</span></div>
                     <div><span className="text-slate-400 text-xs block">Category</span> <span className="font-medium text-slate-900">{selectedRecord.diagnosisCategory}</span></div>
                  </div>
                </div>

                <div>
                   <h4 className="font-bold text-slate-800 mb-3 flex items-center justify-between">
                     Clinical Data Included
                     <span className={`text-xs font-bold px-2 py-1 rounded ${tierStyle.bg} ${tierStyle.text}`}>
                       Quality Score: {score}%
                     </span>
                   </h4>
                   <div className="space-y-4">
                     {selectedAttributes.diagnosis && (
                        <div className="pl-3 border-l-2 border-teal-400">
                          <h5 className="font-semibold text-slate-700 text-xs uppercase flex items-center gap-2 mb-2">Diagnosis</h5>
                          <div className="bg-white border border-slate-200 p-2 rounded text-slate-900 font-medium">
                            {selectedRecord.diagnosis} <span className="text-slate-400 text-xs ml-1">({selectedRecord.icd10})</span>
                          </div>
                        </div>
                     )}
                     
                     {selectedAttributes.subjective && (
                        <div className="pl-3 border-l-2 border-teal-400">
                          <h5 className="font-semibold text-slate-700 text-xs uppercase flex items-center gap-2 mb-2">Subjective History</h5>
                          {renderRawContent(selectedRecord.raw?.subjective || selectedRecord.subjectiveComplaint)}
                        </div>
                     )}
                     
                     {selectedAttributes.objective && (
                       <div className="pl-3 border-l-2 border-teal-400">
                         <h5 className="font-semibold text-slate-700 text-xs uppercase flex items-center gap-2 mb-2">Objective History</h5>
                         {renderRawContent(selectedRecord.raw?.objective || selectedRecord.objectiveFindings)}
                       </div>
                     )}
                     
                     {selectedAttributes.proms && (
                       <div className="pl-3 border-l-2 border-teal-400">
                         <h5 className="font-semibold text-slate-700 text-xs uppercase mb-2">Outcomes (PROMs)</h5>
                         {renderRawContent(selectedRecord.raw?.proms || selectedRecord.promScores)}
                       </div>
                     )}
                     
                     {selectedAttributes.treatment && (
                       <div className="pl-3 border-l-2 border-teal-400">
                         <h5 className="font-semibold text-slate-700 text-xs uppercase flex items-center gap-2 mb-2">Interventions/Treatment</h5>
                         {renderRawContent(selectedRecord.raw?.treatment || selectedRecord.treatmentPlan)}
                         {selectedRecord.raw?.notes && (
                            <div className="mt-2 bg-slate-50 p-2 rounded border border-slate-200 text-slate-500 text-xs italic font-mono">
                               Notes: {selectedRecord.raw.notes}
                            </div>
                         )}
                       </div>
                     )}

                     {selectedAttributes.sessions && (
                        <div className="pl-3 border-l-2 border-teal-400">
                          <h5 className="font-semibold text-slate-700 text-xs uppercase flex items-center gap-2 mb-2">Total Sessions</h5>
                          <div className="flex items-center gap-4">
                            <div className="bg-white border border-slate-200 px-3 py-2 rounded text-slate-800 text-sm font-medium flex items-center gap-2">
                               <Hash className="w-4 h-4 text-teal-600" />
                               {selectedRecord.sessions} Sessions
                            </div>
                            <div className="bg-white border border-slate-200 px-3 py-2 rounded text-slate-800 text-sm font-medium flex items-center gap-2">
                               <Activity className="w-4 h-4 text-teal-600" />
                               {selectedRecord.durationWeeks} Weeks
                            </div>
                          </div>
                        </div>
                     )}

                     {selectedAttributes.patientStatus && (
                        <div className="pl-3 border-l-2 border-teal-400">
                          <h5 className="font-semibold text-slate-700 text-xs uppercase flex items-center gap-2 mb-2">Patient Case Type</h5>
                          <div className="bg-white border border-slate-200 p-3 rounded flex flex-col gap-1">
                             <div className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-slate-500" />
                                <span className="text-sm font-bold text-slate-800">{selectedRecord.fundingSource || 'Private'}</span>
                             </div>
                             {selectedRecord.fundingCaseId && (
                               <div className="text-xs text-slate-500 ml-6">
                                  Case #: <span className="font-mono bg-slate-100 px-1 rounded">{selectedRecord.fundingCaseId}</span>
                               </div>
                             )}
                          </div>
                        </div>
                     )}
                     
                     {!Object.values(selectedAttributes).some(Boolean) && (
                       <p className="text-slate-400 italic text-center py-4">Select attributes on the right to include detailed clinical data.</p>
                     )}
                   </div>
                </div>
              </div>
            </div>

            {/* Right: Configuration */}
            <div className="w-full md:w-80 bg-slate-50 p-6 flex flex-col border-l border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4">Sharing Configuration</h3>
              
              <div className="flex-1 overflow-y-auto pr-1">
                
                {/* Quality Score Visualizer */}
                <div className="mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-semibold text-slate-700">Quality Score</span>
                    <span className={`text-xl font-bold ${tierStyle.text}`}>{score}%</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
                    <div 
                      className={`h-full transition-all duration-500 ${tierStyle.bar}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase tracking-wide">{tier} Tier</span>
                    <span className="font-bold">{multiplier}x Multiplier</span>
                  </div>
                </div>

                {/* Data Attributes Selection */}
                <div className="mb-6">
                  <label className="text-sm font-semibold text-slate-700 mb-3 block flex items-center gap-2">
                    <Database className="w-4 h-4" /> Data Completeness
                  </label>
                  <div className="space-y-2">
                    {ATTRIBUTES.map((attr) => (
                      <label key={attr.id} className={`flex items-start justify-between p-3 bg-white border rounded-lg cursor-pointer transition-all
                        ${selectedAttributes[attr.id] ? 'border-teal-500 ring-1 ring-teal-500' : 'border-slate-200 hover:border-teal-300'}
                      `}>
                         <div className="flex items-start gap-3">
                           <input 
                             type="checkbox" 
                             checked={selectedAttributes[attr.id]}
                             onChange={() => toggleAttribute(attr.id)}
                             className="mt-1" 
                           />
                           <div>
                             <span className="block text-sm font-medium text-slate-900">{attr.label}</span>
                             <span className="block text-[10px] text-slate-500 leading-tight mt-0.5">{attr.description}</span>
                           </div>
                         </div>
                         <span className="text-xs font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded whitespace-nowrap">
                           {attr.weight}%
                         </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Feedback Message */}
                {missingFields.length > 0 && tier !== 'Complete' && (
                  <div className={`mb-6 p-3 rounded-lg flex items-start gap-2 border ${tierStyle.bg} ${tierStyle.border}`}>
                    <AlertCircle className={`w-4 h-4 shrink-0 mt-0.5 ${tierStyle.alertIcon}`} />
                    <div className={`text-xs ${tierStyle.alertText}`}>
                      <p className="font-bold mb-1">
                        {tier === 'Minimal' ? "Minimal submission." : tier === 'Partial' ? "Partial submission." : "Good submission."}
                      </p>
                      <p>Add <span className="font-semibold">{missingFields[0].label}</span> to increase your multiplier.</p>
                    </div>
                  </div>
                )}
                {tier === 'Complete' && (
                  <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-emerald-800">
                      <p className="font-bold">Complete submission!</p>
                      <p>You are earning maximum credits.</p>
                    </div>
                  </div>
                )}

                {/* Disclosure Timing */}
                <div className="mb-4">
                  <label className="text-sm font-semibold text-slate-700 mb-3 block flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Timing
                  </label>
                   <select 
                     value={disclosureTiming}
                     onChange={(e) => setDisclosureTiming(e.target.value as DisclosureTiming)}
                     className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-lg p-2.5 focus:ring-teal-500 focus:border-teal-500"
                   >
                     <option value={DisclosureTiming.DELAYED}>Delayed (30 Days)</option>
                     <option value={DisclosureTiming.IMMEDIATE}>Immediate</option>
                   </select>
                </div>
              </div>

              {/* Reward Calculator & Action */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="bg-slate-900 rounded-xl p-4 text-white shadow-lg">
                  <div className="flex items-center gap-2 mb-3 text-slate-300 text-xs uppercase tracking-wider font-semibold">
                    <Calculator className="w-4 h-4" /> Credit Calculation
                  </div>
                  
                  <div className="flex justify-between items-end mb-2">
                    <div className="space-y-1">
                      <div className="text-xs text-slate-400">Score: {score}%</div>
                      <div className={`text-xs ${tierStyle.darkText}`}>Multiplier: {multiplier}x</div>
                    </div>
                    <div className="text-3xl font-bold leading-none">
                      {earnedCredits} <span className="text-sm font-medium text-slate-400">Credits</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleShare}
                    className="w-full mt-3 bg-teal-500 hover:bg-teal-400 text-white font-bold py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2"
                  >
                    Share Record
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8">
            <div className="bg-slate-50 p-6 rounded-full mb-4">
              <FileText className="w-12 h-12" />
            </div>
            <h3 className="text-lg font-medium text-slate-600">Select a patient record</h3>
            <p className="text-sm">Choose a patient from the list to configure data contribution and calculate rewards.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareRecord;