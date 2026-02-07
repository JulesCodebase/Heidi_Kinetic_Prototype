import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Transaction } from '../types';
import { CreditCard, UploadCloud, DownloadCloud, Star, Filter, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';

const CreditLedger: React.FC = () => {
  const { user } = useApp();
  const [filter, setFilter] = useState<'all' | 'contribution' | 'retrieval' | 'request'>('all');

  // Calculate Stats
  const stats = useMemo(() => {
    const contributions = user.transactions.filter(t => t.type === 'contribution');
    const retrievals = user.transactions.filter(t => t.type === 'retrieval' || t.type === 'request');
    
    const totalEarned = contributions.reduce((acc, curr) => acc + curr.creditsChange, 0);
    const totalSpent = Math.abs(retrievals.reduce((acc, curr) => acc + curr.creditsChange, 0));
    
    // Average Quality Score
    const totalScore = contributions.reduce((acc, curr) => acc + (curr.qualityScore || 0), 0);
    const avgScore = contributions.length > 0 ? Math.round(totalScore / contributions.length) : 0;

    return {
      totalContributions: contributions.length,
      totalRetrievals: retrievals.length,
      totalEarned: totalEarned.toFixed(1),
      totalSpent: totalSpent.toFixed(1),
      avgScore
    };
  }, [user.transactions]);

  // Filter Transactions
  const filteredTransactions = user.transactions.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'retrieval') return t.type === 'retrieval' || t.type === 'request'; // Group spending together
    return t.type === filter;
  });

  const getBadgeStyles = (type: string) => {
    switch (type) {
      case 'contribution':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'retrieval':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'request':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getLabel = (type: string) => {
    switch (type) {
      case 'contribution': return 'Shared Record';
      case 'retrieval': return 'Unlocked Record';
      case 'request': return 'Request';
      default: return type;
    }
  };

  const getQualityColor = (score?: number) => {
    if (score === undefined) return 'text-slate-400 bg-slate-50';
    if (score >= 90) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-blue-700 bg-blue-50 border-blue-200';
    if (score >= 30) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Credit Ledger</h2>
        <p className="text-slate-500">Track your shared records, unlocked records, and credit balance.</p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-amber-100 rounded-lg">
            <CreditCard className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{user.tokens.toFixed(1)}</div>
            <div className="text-sm text-slate-500">Current Balance</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-emerald-100 rounded-lg">
            <UploadCloud className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{stats.totalContributions}</div>
            <div className="text-sm text-slate-500">Shared Records</div>
            <div className="text-xs text-emerald-600 font-medium">+{stats.totalEarned} credits earned</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-indigo-100 rounded-lg">
            <DownloadCloud className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{stats.totalRetrievals}</div>
            <div className="text-sm text-slate-500">Unlocked Records</div>
            <div className="text-xs text-red-500 font-medium">-{stats.totalSpent} credits spent</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Star className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{stats.avgScore}%</div>
            <div className="text-sm text-slate-500">Avg Quality Score</div>
            <div className="text-xs text-blue-600 font-medium">
              {stats.avgScore >= 90 ? 'Excellent' : stats.avgScore >= 60 ? 'Good quality' : 'Needs improvement'}
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="font-bold text-lg text-slate-800">Transaction History</h3>
          
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${filter === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('contribution')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${filter === 'contribution' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Shared Records
            </button>
            <button 
              onClick={() => setFilter('retrieval')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${filter === 'retrieval' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Unlocked
            </button>
            <button 
              onClick={() => setFilter('request')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${filter === 'request' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Requests
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 w-32">Date</th>
                <th className="px-6 py-4 w-40">Type</th>
                <th className="px-6 py-4 w-48">Reference</th>
                <th className="px-6 py-4">Details</th>
                <th className="px-6 py-4 w-24 text-center">Quality</th>
                <th className="px-6 py-4 w-24 text-right">Credits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 italic">
                    No transactions found. Start sharing records to build your history.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                      {tx.date.split('T')[0]}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getBadgeStyles(tx.type)}`}>
                        {tx.type === 'contribution' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                        {getLabel(tx.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-900 font-medium">
                       {/* Extract patient name from details string roughly if possible, or just ID */}
                       {tx.type === 'contribution' ? 'Network Upload' : 'Network Retrieval'}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {tx.details}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {tx.type === 'contribution' ? (
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold border ${getQualityColor(tx.qualityScore)}`}>
                          {tx.qualityScore}%
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className={`px-6 py-4 text-right font-bold ${tx.creditsChange > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {tx.creditsChange > 0 ? '+' : ''}{tx.creditsChange.toFixed(1)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Credit Multiplier Reference (Moved from ShareRecord) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="font-bold text-slate-800 mb-6">Credit Multiplier Reference</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center p-6 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">90-100% Quality</span>
            <span className="text-lg font-bold text-emerald-600">Complete</span>
            <span className="text-3xl font-extrabold text-emerald-700 mt-2">1.0x</span>
          </div>
          <div className="flex flex-col items-center p-6 rounded-xl bg-blue-50 border border-blue-100 text-center">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">60-89% Quality</span>
            <span className="text-lg font-bold text-blue-600">Good</span>
            <span className="text-3xl font-extrabold text-blue-700 mt-2">0.7x</span>
          </div>
          <div className="flex flex-col items-center p-6 rounded-xl bg-amber-50 border border-amber-100 text-center">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">30-59% Quality</span>
              <span className="text-lg font-bold text-amber-600">Partial</span>
              <span className="text-3xl font-extrabold text-amber-700 mt-2">0.4x</span>
          </div>
          <div className="flex flex-col items-center p-6 rounded-xl bg-red-50 border border-red-100 text-center">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">0-29% Quality</span>
              <span className="text-lg font-bold text-red-600">Minimal</span>
              <span className="text-3xl font-extrabold text-red-700 mt-2">0.3x</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditLedger;