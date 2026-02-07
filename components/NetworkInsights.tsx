import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from 'recharts';
import { Activity, Users, TrendingUp, ChevronDown, PieChart } from 'lucide-react';
import { MY_CLINIC_NAME } from '../constants';

const NetworkInsights: React.FC = () => {
  const [selectedCondition, setSelectedCondition] = useState<'Shoulder' | 'Knee' | 'Spine' | 'Hip' | 'Ankle' | 'Neck'>('Shoulder');

  // Mock Data Sets
  const DATA_SETS = {
    Shoulder: {
      modality: [
        { name: 'Manual Therapy', value: 65 },
        { name: 'Exercise', value: 85 },
        { name: 'Education', value: 45 },
        { name: 'EPA', value: 30 },
        { name: 'Dry Needling', value: 25 },
      ],
      recovery: [
        { week: 'W1', standard: 20, network: 25, clinic: 22 },
        { week: 'W2', standard: 35, network: 45, clinic: 48 },
        { week: 'W3', standard: 50, network: 65, clinic: 70 },
        { week: 'W4', standard: 65, network: 78, clinic: 82 },
        { week: 'W6', standard: 80, network: 92, clinic: 94 },
      ],
      topStat: { prevalence: '22% of Cases', growth: '+12%', avgRecovery: '5.8 Weeks' }
    },
    Knee: {
      modality: [
        { name: 'Strength', value: 90 },
        { name: 'Neuromuscular', value: 75 },
        { name: 'Manual Therapy', value: 40 },
        { name: 'Taping', value: 20 },
        { name: 'Education', value: 60 },
      ],
      recovery: [
        { week: 'W1', standard: 15, network: 22, clinic: 18 },
        { week: 'W2', standard: 30, network: 42, clinic: 38 },
        { week: 'W3', standard: 45, network: 60, clinic: 55 },
        { week: 'W4', standard: 60, network: 75, clinic: 68 },
        { week: 'W6', standard: 75, network: 88, clinic: 82 },
      ],
      topStat: { prevalence: '28% of Cases', growth: '+8%', avgRecovery: '14.2 Weeks' }
    },
    Spine: {
      modality: [
        { name: 'McKenzie', value: 80 },
        { name: 'Core Stability', value: 70 },
        { name: 'Manual Therapy', value: 60 },
        { name: 'Education', value: 85 },
        { name: 'Ergonomics', value: 50 },
      ],
      recovery: [
        { week: 'W1', standard: 10, network: 18, clinic: 20 },
        { week: 'W2', standard: 25, network: 38, clinic: 42 },
        { week: 'W3', standard: 40, network: 58, clinic: 60 },
        { week: 'W4', standard: 55, network: 72, clinic: 78 },
        { week: 'W6', standard: 70, network: 86, clinic: 90 },
      ],
      topStat: { prevalence: '35% of Cases', growth: '+15%', avgRecovery: '4.5 Weeks' }
    },
    Hip: {
      modality: [
        { name: 'Strength', value: 88 },
        { name: 'Education', value: 70 },
        { name: 'Manual Therapy', value: 55 },
        { name: 'Hydrotherapy', value: 40 },
        { name: 'Gait Training', value: 65 },
      ],
      recovery: [
        { week: 'W1', standard: 12, network: 15, clinic: 14 },
        { week: 'W2', standard: 25, network: 30, clinic: 28 },
        { week: 'W3', standard: 38, network: 45, clinic: 42 },
        { week: 'W4', standard: 50, network: 60, clinic: 58 },
        { week: 'W6', standard: 65, network: 78, clinic: 75 },
      ],
      topStat: { prevalence: '15% of Cases', growth: '+4%', avgRecovery: '9.5 Weeks' }
    },
    Ankle: {
      modality: [
        { name: 'Proprioception', value: 92 },
        { name: 'Strength', value: 75 },
        { name: 'Manual Therapy', value: 45 },
        { name: 'Taping/Bracing', value: 60 },
        { name: 'EPA', value: 30 },
      ],
      recovery: [
        { week: 'W1', standard: 25, network: 30, clinic: 28 },
        { week: 'W2', standard: 45, network: 55, clinic: 52 },
        { week: 'W3', standard: 60, network: 72, clinic: 70 },
        { week: 'W4', standard: 75, network: 85, clinic: 84 },
        { week: 'W6', standard: 88, network: 95, clinic: 96 },
      ],
      topStat: { prevalence: '18% of Cases', growth: '+2%', avgRecovery: '6.2 Weeks' }
    },
    Neck: {
      modality: [
        { name: 'Manual Therapy', value: 75 },
        { name: 'Ergonomics', value: 80 },
        { name: 'Exercise', value: 70 },
        { name: 'Education', value: 65 },
        { name: 'Dry Needling', value: 40 },
      ],
      recovery: [
        { week: 'W1', standard: 15, network: 25, clinic: 28 },
        { week: 'W2', standard: 30, network: 45, clinic: 50 },
        { week: 'W3', standard: 45, network: 60, clinic: 65 },
        { week: 'W4', standard: 60, network: 75, clinic: 80 },
        { week: 'W6', standard: 75, network: 88, clinic: 92 },
      ],
      topStat: { prevalence: '25% of Cases', growth: '+10%', avgRecovery: '5.1 Weeks' }
    }
  };

  const currentData = DATA_SETS[selectedCondition];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Network Insights</h2>
          <p className="text-slate-500">Real-time trends from 1,800+ participating clinics.</p>
        </div>
        
        {/* Global Filter */}
        <div className="relative">
          <select 
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value as any)}
            className="appearance-none bg-white border border-slate-300 hover:border-teal-500 text-slate-700 py-2 pl-4 pr-10 rounded-lg font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
          >
            <option value="Shoulder">Shoulder Condition</option>
            <option value="Knee">Knee Condition</option>
            <option value="Spine">Spine Condition</option>
            <option value="Hip">Hip Condition</option>
            <option value="Ankle">Ankle Condition</option>
            <option value="Neck">Neck Condition</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 transition-all duration-300">
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-indigo-100 rounded-lg"><PieChart className="w-5 h-5 text-indigo-600" /></div>
             <h3 className="font-semibold text-slate-700">Injury Rate</h3>
           </div>
           <p className="text-2xl font-bold text-slate-900">{currentData.topStat.prevalence}</p>
           <p className="text-sm text-green-600 font-medium">{currentData.topStat.growth} vs last month</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 transition-all duration-300">
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-teal-100 rounded-lg"><Activity className="w-5 h-5 text-teal-600" /></div>
             <h3 className="font-semibold text-slate-700">Avg. Recovery</h3>
           </div>
           <p className="text-2xl font-bold text-slate-900">{currentData.topStat.avgRecovery}</p>
           <p className="text-sm text-green-600 font-medium">Faster than industry avg</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-amber-100 rounded-lg"><Users className="w-5 h-5 text-amber-600" /></div>
             <h3 className="font-semibold text-slate-700">Contributors</h3>
           </div>
           <p className="text-2xl font-bold text-slate-900">847 Clinics</p>
           <p className="text-sm text-green-600 font-medium">24 joined this week</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Modality Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">Most Effective Modalities ({selectedCondition})</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentData.modality} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={110} tick={{fontSize: 12}} />
                <Tooltip />
                <Bar dataKey="value" fill="#0d9488" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 mt-4 text-center">Percentage of recovered cases utilizing modality</p>
        </div>

        {/* Recovery Timeline Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-6">Recovery Speed: {selectedCondition}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentData.recovery}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="standard" stroke="#94a3b8" strokeWidth={2} name="Industry Avg" dot={false} strokeDasharray="5 5" />
                <Line type="monotone" dataKey="network" stroke="#0d9488" strokeWidth={3} name="Network Average" />
                <Line type="monotone" dataKey="clinic" stroke="#8b5cf6" strokeWidth={3} name={MY_CLINIC_NAME} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 mt-4 text-center">Functional Improvement Score (%) over time</p>
        </div>
      </div>
    </div>
  );
};

export default NetworkInsights;