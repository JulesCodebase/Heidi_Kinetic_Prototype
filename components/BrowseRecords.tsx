import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SharedRecord, PrivacyLevel, DisclosureTiming } from '../types';
import { Search, Filter, Lock, Unlock, Eye, MapPin, Award, Calendar } from 'lucide-react';
import RecordDetailModal from './RecordDetailModal';

const BrowseRecords: React.FC = () => {
  const { networkRecords, user, unlockRecord } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<SharedRecord | null>(null);

  // Filter Logic
  const filteredRecords = networkRecords.filter(r => 
    r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.diagnosisCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewRecord = (record: SharedRecord) => {
    // If not participating, do nothing (should be disabled anyway)
    if (!user.isParticipating) return;

    // Logic: If already unlocked, open. If not, check tokens.
    if (user.unlockedRecordIds.includes(record.id)) {
        setSelectedRecord(record);
    } else if (user.tokens >= 1.0) {
        // Confirmation could happen here, but for prototype we just unlock on click
        const success = unlockRecord(record.id);
        if (success) setSelectedRecord(record);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search patient name, diagnosis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 placeholder-slate-400"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Filter className="w-4 h-4" /> Filters
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg text-sm font-medium text-slate-600">
               <span>{filteredRecords.length} Records Found</span>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecords.map(record => {
            const isUnlocked = user.unlockedRecordIds.includes(record.id);
            const canAfford = user.tokens >= 1.0;

            return (
              <div key={record.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-teal-50 text-teal-700 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wide">
                      {record.diagnosisCategory}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="w-3 h-3" />
                      {record.distanceKm}km
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-slate-900 text-lg mb-1 truncate">{record.diagnosis}</h3>
                  <div className="flex items-center gap-2 mb-4">
                     {record.tier === 'Gold' && <Award className="w-4 h-4 text-amber-500" />}
                     <span className="text-xs text-slate-500">by {record.sharedByClinic}</span>
                  </div>

                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex justify-between">
                      <span>Patient:</span>
                      <span className="font-medium text-slate-900">{record.patientName} ({record.age}y)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>DOB:</span>
                      <span className="font-medium text-slate-900">{record.dateOfBirth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Outcome:</span>
                      <span className="font-medium text-slate-900">{record.outcome.split('.')[0]}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer / Action */}
                <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between">
                   {isUnlocked ? (
                     <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                       <Unlock className="w-4 h-4" /> Unlocked
                     </div>
                   ) : (
                     <div className="flex items-center gap-2 text-slate-500 text-sm">
                       <div className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs font-bold">1 Credit</div>
                     </div>
                   )}

                   <button 
                     onClick={() => handleViewRecord(record)}
                     disabled={!isUnlocked && !canAfford}
                     className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors
                       ${isUnlocked 
                         ? 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50' 
                         : canAfford 
                            ? 'bg-teal-600 text-white hover:bg-teal-700'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                       }
                     `}
                   >
                     {isUnlocked ? (
                       <>View Details <Eye className="w-4 h-4" /></>
                     ) : (
                       canAfford ? <>Unlock Record <Lock className="w-4 h-4" /></> : <>Need Credits</>
                     )}
                   </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedRecord && (
        <RecordDetailModal 
          record={selectedRecord} 
          onClose={() => setSelectedRecord(null)} 
        />
      )}
    </>
  );
};

export default BrowseRecords;