import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Check, ShieldCheck, AlertOctagon, ToggleRight, ToggleLeft, Database, FileText, Settings as SettingsIcon } from 'lucide-react';

const Settings: React.FC = () => {
  const { user, optIn, optOut, updateSharingPreferences } = useApp();
  const [showConfirmOptOut, setShowConfirmOptOut] = useState(false);

  const handleToggle = () => {
    if (user.isParticipating) {
      setShowConfirmOptOut(true);
    } else {
      optIn();
    }
  };

  const confirmOptOut = () => {
    optOut();
    setShowConfirmOptOut(false);
  };

  const toggleAttribute = (key: keyof typeof user.preferences.attributes) => {
    updateSharingPreferences({
      attributes: {
        ...user.preferences.attributes,
        [key]: !user.preferences.attributes[key]
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Participation Settings</h2>
        <p className="text-slate-500">Manage your clinic's contribution status and preferences.</p>
      </div>

      {/* Main Participation Card */}
      <div className={`rounded-xl shadow-md border overflow-hidden transition-all
        ${user.isParticipating ? 'bg-white border-teal-200' : 'bg-slate-800 border-slate-700 text-white'}
      `}>
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
             <div>
               <h3 className={`text-xl font-bold mb-2 ${user.isParticipating ? 'text-slate-900' : 'text-white'}`}>
                 {user.isParticipating ? 'Network Participation Active' : 'Join the Kinetic Network'}
               </h3>
               <p className={`text-sm max-w-lg ${user.isParticipating ? 'text-slate-500' : 'text-slate-300'}`}>
                 {user.isParticipating 
                   ? "You are currently earning credits and accessing network records."
                   : "Unlock access to collective clinical knowledge. Share records to earn credits."
                 }
               </p>
             </div>
             
             {/* Toggle Switch */}
             <button 
               onClick={handleToggle}
               className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
                 ${user.isParticipating ? 'bg-teal-600' : 'bg-slate-600'}
               `}
             >
               <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform
                 ${user.isParticipating ? 'translate-x-7' : 'translate-x-1'}
               `} />
             </button>
          </div>

          {!user.isParticipating && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
               <div className="bg-slate-700/50 p-4 rounded-lg">
                 <div className="font-bold text-teal-400 mb-1">1. Share</div>
                 <p className="text-xs text-slate-300">Contribute 1 record to earn up to 1 credit.</p>
               </div>
               <div className="bg-slate-700/50 p-4 rounded-lg">
                 <div className="font-bold text-teal-400 mb-1">2. Earn</div>
                 <p className="text-xs text-slate-300">Start with 0 credits. Contribution is required to retrieve.</p>
               </div>
               <div className="bg-slate-700/50 p-4 rounded-lg">
                 <div className="font-bold text-teal-400 mb-1">3. Learn</div>
                 <p className="text-xs text-slate-300">Use 1.0 credit to unlock any peer record.</p>
               </div>
            </div>
          )}
          
          {user.isParticipating && (
             <div className="mt-4 flex items-center gap-2 text-sm text-green-600 font-medium">
               <Check className="w-4 h-4" /> Participation verified. Earning enabled.
             </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Opt Out */}
      {showConfirmOptOut && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 animate-in zoom-in-95">
             <div className="flex items-center gap-3 text-red-600 mb-4">
               <AlertOctagon className="w-8 h-8" />
               <h3 className="text-xl font-bold">Stop Participating?</h3>
             </div>
             <p className="text-slate-600 mb-4">
               If you opt out now, you will lose access to:
             </p>
             <ul className="space-y-2 mb-6 text-sm text-slate-700">
               <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> 847 Participating Clinics</li>
               <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Network Insights Dashboard</li>
               <li className="flex items-center gap-2 font-bold"><span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Your current balance of {user.tokens} Credits</li>
             </ul>
             
             <div className="flex gap-3">
               <button 
                 onClick={() => setShowConfirmOptOut(false)}
                 className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200"
               >
                 Cancel
               </button>
               <button 
                 onClick={confirmOptOut}
                 className="flex-1 px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700"
               >
                 I Understand, Opt Out
               </button>
             </div>
          </div>
        </div>
      )}

      {/* Enhanced Default Sharing Preferences */}
      <div className={`bg-white rounded-xl shadow-sm border border-slate-200 transition-opacity duration-300 ${!user.isParticipating ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
           <SettingsIcon className="w-5 h-5 text-slate-500" />
           <h3 className="font-bold text-slate-800">Default Sharing Preferences</h3>
        </div>
        
        <div className="p-6 space-y-8">
          
          {/* Default Data Attributes */}
          <div>
            <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <Database className="w-4 h-4 text-teal-600" /> Default Data Attributes
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Selected items will be automatically checked when sharing a new record. You can override these per record.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { key: 'diagnosis', label: 'Diagnosis' },
                { key: 'subjective', label: 'Subjective History' },
                { key: 'objective', label: 'Objective History' },
                { key: 'proms', label: 'Patient Reported Outcomes' },
                { key: 'treatment', label: 'Interventions/Treatment' },
                { key: 'sessions', label: 'Total Sessions' },
                { key: 'patientStatus', label: 'Patient Case Type' },
              ].map((item) => (
                <label key={item.key} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                   <div 
                     className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${user.preferences.attributes[item.key as keyof typeof user.preferences.attributes] ? 'bg-teal-600 border-teal-600 text-white' : 'bg-white border-slate-300'}`}
                   >
                     {user.preferences.attributes[item.key as keyof typeof user.preferences.attributes] && <Check className="w-3.5 h-3.5" />}
                   </div>
                   <input 
                     type="checkbox" 
                     className="hidden"
                     checked={user.preferences.attributes[item.key as keyof typeof user.preferences.attributes]}
                     onChange={() => toggleAttribute(item.key as any)}
                   />
                   <span className="text-sm font-medium text-slate-700">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Privacy Settings */}
          <div>
            <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" /> Privacy & Data
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-200">
                 <div>
                    <span className="block text-sm font-semibold text-slate-800">Anonymize Patient Names</span>
                    <span className="block text-xs text-slate-500 mt-1">Automatically remove patient PII from base records.</span>
                 </div>
                 <div className="flex items-center gap-2 text-teal-600 bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100">
                   <ShieldCheck className="w-4 h-4" />
                   <span className="text-xs font-bold uppercase tracking-wide">Always On</span>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;