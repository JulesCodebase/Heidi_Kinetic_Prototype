import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RequestStatus } from '../types';
import { MOCK_GLOBAL_INDEX, NETWORK_RECORDS } from '../constants';
import { Search, Send, Clock, CheckCircle, XCircle, AlertCircle, FileText, Lock, Globe, Info, Eye } from 'lucide-react';
import RecordDetailModal from './RecordDetailModal';

const RequestRecords: React.FC = () => {
  const { user, requestRecord, networkRecords } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'search' | 'history'>('search');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Combine Global Index (Unshared) and Network Records (Shared) for search
  // Mapping Network Records to match the search result shape
  const networkAsSearchResults = NETWORK_RECORDS.map(record => ({
    id: record.id,
    patientName: record.patientName,
    dateOfBirth: record.dateOfBirth,
    clinicName: record.sharedByClinic,
    location: `${record.distanceKm}km away`,
    isNetworkRecord: true // Flag to identify origin
  }));

  const combinedIndex = [...MOCK_GLOBAL_INDEX, ...networkAsSearchResults];

  const searchResults = searchTerm.length > 2 
    ? combinedIndex.filter(p => 
        p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.clinicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.dateOfBirth.includes(searchTerm) // DOB Search logic
      )
    : [];

  const handleRequest = (patientName: string, dob: string, clinicName: string, existingId?: string) => {
    // Action is immediate - no confirm dialog
    const success = requestRecord(patientName, dob, clinicName, existingId);
    
    if (success) {
      setNotification({
        message: `Request for ${patientName} sent to ${clinicName}.`,
        type: 'success'
      });
      setActiveTab('history');
      setSearchTerm('');
      
      // Clear notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);
    } else {
      setNotification({
        message: "Insufficient credits. Please contribute data to earn more.",
        type: 'error'
      });
      
      // Clear error after 5 seconds
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleViewApproved = (recordId: string | undefined) => {
    if (recordId) {
      setSelectedRecordId(recordId);
    }
  };

  // Find the full record object if viewing an approved request
  const viewedRecord = selectedRecordId 
    ? networkRecords.find(r => r.id === selectedRecordId) 
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-900">Request Records</h2>
           <p className="text-slate-500">Find and request patient data from the global network index.</p>
        </div>
        <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
           <button 
             onClick={() => setActiveTab('search')}
             className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
               activeTab === 'search' ? 'bg-teal-100 text-teal-800' : 'text-slate-600 hover:bg-slate-50'
             }`}
           >
             Make a Request
           </button>
           <button 
             onClick={() => setActiveTab('history')}
             className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
               activeTab === 'history' ? 'bg-teal-100 text-teal-800' : 'text-slate-600 hover:bg-slate-50'
             }`}
           >
             Request History
             {user.sentRequests.length > 0 && (
               <span className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-full text-xs">
                 {user.sentRequests.length}
               </span>
             )}
           </button>
        </div>
      </div>

      {notification && (
        <div className={`p-4 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300
          ${notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}
        `}>
           {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
           <span className="font-medium text-sm">{notification.message}</span>
        </div>
      )}

      {activeTab === 'search' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Search Bar */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <div className="max-w-xl mx-auto">
               <label className="block text-sm font-medium text-slate-700 mb-2">Search Global Patient Index</label>
               <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                 <input 
                   type="text" 
                   placeholder="Enter patient name, clinic name, or DOB (YYYY-MM-DD)..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-900 placeholder-slate-400"
                 />
               </div>
               <p className="text-xs text-slate-500 mt-2">
                 *Searching across 847 connected clinics. Results are anonymized until request is approved.
               </p>
             </div>
          </div>

          {/* Results */}
          {searchTerm.length > 2 && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {searchResults.length > 0 ? searchResults.map((result, index) => {
                 // Check if we already have access to this record
                 const isUnlocked = user.unlockedRecordIds.includes(result.id);
                 const isNetworkRecord = (result as any).isNetworkRecord;

                 return (
                 <div key={`${result.id}-${index}`} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
                    {/* Badge for Network Records */}
                    {isNetworkRecord && (
                      <div className="absolute top-0 right-0 bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                        NETWORK MATCH
                      </div>
                    )}

                    <div>
                      <div className="flex justify-between items-start mb-2">
                         <h3 className="font-bold text-slate-800 text-lg">{result.patientName}</h3>
                         <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">{result.location}</span>
                      </div>
                      <p className="text-sm text-slate-500 mb-1">DOB: <span className="font-medium text-slate-700">{result.dateOfBirth}</span></p>
                      <p className="text-sm text-slate-500">Clinic: <span className="font-medium text-slate-700">{result.clinicName}</span></p>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                       {isUnlocked && isNetworkRecord ? (
                         <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                           <CheckCircle className="w-3 h-3" />
                           Unlocked
                         </div>
                       ) : (
                         <div className="flex items-center gap-1.5 text-xs text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded">
                           <Lock className="w-3 h-3" />
                           Cost: 1 Credit
                         </div>
                       )}

                       {isUnlocked && isNetworkRecord ? (
                         <button 
                           onClick={() => handleViewApproved(result.id)}
                           className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                         >
                           View Record
                           <Eye className="w-4 h-4" />
                         </button>
                       ) : (
                         <button 
                           onClick={() => handleRequest(result.patientName, result.dateOfBirth, result.clinicName, result.id)}
                           className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                         >
                           {isNetworkRecord ? 'Unlock Record' : 'Request Record'}
                           <Send className="w-4 h-4" />
                         </button>
                       )}
                    </div>
                 </div>
                 );
               }) : (
                 <div className="col-span-full text-center py-10 text-slate-400">
                    No patients found matching "{searchTerm}" in the global index.
                 </div>
               )}
             </div>
          )}
          
          {searchTerm.length > 0 && searchTerm.length <= 2 && (
            <div className="text-center py-10 text-slate-400">
               Type at least 3 characters to search.
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Target Clinic</th>
                  <th className="px-6 py-4">Date Sent</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {user.sentRequests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      No requests sent yet. Go to the search tab to find patients.
                    </td>
                  </tr>
                ) : (
                  user.sentRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {req.patientName}
                        <span className="block text-xs text-slate-500 font-normal">{req.patientDob}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{req.targetClinicName}</td>
                      <td className="px-6 py-4 text-slate-600">{req.requestDate}</td>
                      <td className="px-6 py-4">
                        {req.status === RequestStatus.PENDING && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 animate-pulse">
                            <Clock className="w-3.5 h-3.5" /> Pending
                          </span>
                        )}
                        {req.status === RequestStatus.APPROVED && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <CheckCircle className="w-3.5 h-3.5" /> Approved
                          </span>
                        )}
                        {req.status === RequestStatus.REJECTED && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            <XCircle className="w-3.5 h-3.5" /> Rejected
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {req.status === RequestStatus.APPROVED && req.responseRecordId ? (
                           <button 
                             onClick={() => handleViewApproved(req.responseRecordId)}
                             className="text-teal-600 font-bold hover:text-teal-800 flex items-center gap-1 ml-auto"
                           >
                             <FileText className="w-4 h-4" /> View Data
                           </button>
                        ) : (
                          <span className="text-slate-400 italic">Waiting...</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Re-use existing modal for viewing data */}
      {viewedRecord && (
        <RecordDetailModal 
          record={viewedRecord} 
          onClose={() => setSelectedRecordId(null)} 
        />
      )}
    </div>
  );
};

export default RequestRecords;