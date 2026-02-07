import React from 'react';
import { useApp } from '../context/AppContext';
import { Share2, Search, ArrowRight, Activity, Users, FileText, CheckCircle2, Trophy } from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user } = useApp();

  const formattedTokens = Number.isInteger(user.tokens) 
    ? user.tokens 
    : user.tokens.toFixed(2);

  // Calculate simulated percentile based on monthly shares
  // Using an exponential decay model where ~5 shares is median, ~20 shares is 95th percentile
  const calculatePercentile = (shares: number) => {
    if (shares === 0) return 0;
    const p = Math.round((1 - Math.exp(-0.15 * shares)) * 100);
    return Math.min(99, p);
  };

  const percentile = calculatePercentile(user.monthlyShares);

  return (
    <div className="space-y-8">
      {/* Hero / Welcome Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -mr-16 -mt-16"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user.clinicName}</h1>
            <p className="text-slate-300 max-w-xl">
              {user.isParticipating 
                ? "You're participating in the network. Contribute high-quality data to earn credits."
                : "Join 1,800+ clinics sharing patient history. Contribute data to unlock the network."
              }
            </p>
          </div>
          
          {!user.isParticipating ? (
             <button 
               onClick={() => onNavigate('settings')}
               className="bg-teal-500 hover:bg-teal-400 text-white px-6 py-3 rounded-lg font-bold shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
             >
               Start Participating
               <ArrowRight className="w-5 h-5" />
             </button>
          ) : (
            <div className="flex gap-4">
              <button 
                onClick={() => onNavigate('share')}
                className="bg-white text-slate-900 hover:bg-slate-100 px-6 py-3 rounded-lg font-bold shadow-lg flex items-center gap-2 transition-colors"
              >
                <Share2 className="w-5 h-5 text-teal-600" />
                Share Record
              </button>
              <button 
                onClick={() => onNavigate('browse')}
                className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg flex items-center gap-2 transition-colors"
              >
                <Search className="w-5 h-5" />
                Browse
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Token Balance */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <div className="flex items-center justify-between mb-4">
             <div className="bg-amber-100 p-3 rounded-lg">
               <Activity className="w-6 h-6 text-amber-600" />
             </div>
             <span className="text-xs font-semibold text-slate-400 uppercase">Current Balance</span>
           </div>
           <div className="text-4xl font-bold text-slate-900 mb-1">{formattedTokens}</div>
           <p className="text-sm text-slate-500">Available Credits</p>
           {user.tokens < 1.0 && user.isParticipating && (
             <p className="text-xs text-red-500 mt-2 font-medium">Earn more credits to unlock records.</p>
           )}
        </div>

        {/* Monthly Activity & Ranking */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
           <div>
             <div className="flex items-center justify-between mb-4">
               <div className="bg-teal-100 p-3 rounded-lg">
                 <FileText className="w-6 h-6 text-teal-600" />
               </div>
               <span className="text-xs font-semibold text-slate-400 uppercase">Monthly Activity</span>
             </div>
             <div className="flex items-end gap-2 mb-1">
               <div className="text-4xl font-bold text-slate-900">{user.monthlyShares}</div>
               <span className="text-sm text-slate-500 font-medium mb-1.5">Records Shared</span>
             </div>
           </div>

           <div className="mt-4 pt-3 border-t border-slate-100">
             <div className="flex justify-between items-center mb-2">
               <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                 <Trophy className="w-3 h-3" /> Network Ranking
               </span>
               <span className={`text-xs font-bold ${percentile > 0 ? 'text-teal-600' : 'text-slate-400'}`}>
                 {percentile > 0 ? `${percentile}th Percentile` : 'Unranked'}
               </span>
             </div>
             
             {/* Visual Percentile Bar */}
             <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden relative">
               <div 
                 className={`h-full rounded-full transition-all duration-1000 ease-out ${percentile > 0 ? 'bg-teal-500' : 'bg-slate-300'}`} 
                 style={{ width: `${Math.max(percentile, 5)}%` }} // Minimum width for visual cues
               ></div>
             </div>
             
             <p className="text-[10px] text-slate-500 mt-2">
               {percentile > 0 
                 ? `You are contributing more than ${percentile}% of clinics.` 
                 : "Share your first record to see your network ranking."}
             </p>
           </div>
        </div>

        {/* Network Impact */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <div className="flex items-center justify-between mb-4">
             <div className="bg-indigo-100 p-3 rounded-lg">
               <Users className="w-6 h-6 text-indigo-600" />
             </div>
             <span className="text-xs font-semibold text-slate-400 uppercase">Your Impact</span>
           </div>
           <div className="text-4xl font-bold text-slate-900 mb-1">{user.totalContributions}</div>
           <p className="text-sm text-slate-500">Total Lifetime Contributions</p>
           {user.totalContributions > 0 ? (
             <p className="text-xs text-indigo-500 mt-2 font-medium">Helping {Math.floor(user.totalContributions * 3.5)} patients</p>
           ) : (
             <p className="text-xs text-slate-400 mt-2 italic">Start sharing to track impact</p>
           )}
        </div>
      </div>

      {/* Network Health Widget */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-lg text-slate-800">Network Health</h3>
          <span className="text-sm text-green-600 font-medium flex items-center gap-1">
             <Activity className="w-4 h-4" /> Growing Fast
          </span>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-x divide-slate-100">
             <div>
               <div className="text-3xl font-bold text-slate-900 mb-1">847</div>
               <div className="text-sm text-slate-500">Participating Clinics</div>
             </div>
             <div>
               <div className="text-3xl font-bold text-slate-900 mb-1">12,403</div>
               <div className="text-sm text-slate-500">Total Records Shared</div>
             </div>
             <div>
               <div className="text-3xl font-bold text-teal-600 mb-1">38%</div>
               <div className="text-sm text-slate-500">Avg. Intake Time Reduction</div>
             </div>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      {user.isParticipating && user.badges.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4">Your Achievements</h3>
          <div className="flex gap-4">
            {user.badges.includes('network_verified') && (
              <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-teal-100 shadow-sm">
                <div className="bg-teal-50 p-2 rounded-full">
                  <CheckCircle2 className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">Network Verified</p>
                  <p className="text-xs text-slate-500">Trusted Member</p>
                </div>
              </div>
            )}
             {user.badges.includes('top_contributor') && (
              <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-amber-100 shadow-sm">
                <div className="bg-amber-50 p-2 rounded-full">
                  <Activity className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">Top Contributor</p>
                  <p className="text-xs text-slate-500">15+ Shares/Month</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;