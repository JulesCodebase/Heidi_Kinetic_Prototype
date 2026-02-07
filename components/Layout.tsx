import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Share2, 
  Search, 
  BarChart3, 
  Settings, 
  Coins, 
  ShieldCheck, 
  Award,
  LogOut,
  Menu,
  X,
  Send,
  CreditCard
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activePage, onNavigate }) => {
  const { user } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'share', label: 'Share Record', icon: Share2 },
    { id: 'browse', label: 'Browse Network', icon: Search },
    { id: 'request', label: 'Request Data', icon: Send },
    { id: 'ledger', label: 'Credit Ledger', icon: CreditCard },
    { id: 'insights', label: 'Network Insights', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const formattedTokens = Number.isInteger(user.tokens) 
    ? user.tokens 
    : user.tokens.toFixed(1);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex md:w-64 flex-col bg-slate-900 text-white shadow-xl z-20">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="bg-teal-500 p-2 rounded-lg">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">Kinetic Network</h1>
              <p className="text-xs text-slate-400">by Heidi Health</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              disabled={!user.isParticipating && item.id !== 'dashboard' && item.id !== 'settings' && item.id !== 'insights'}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 
                ${activePage === item.id 
                  ? 'bg-teal-600 text-white font-medium shadow-md' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }
                ${!user.isParticipating && item.id !== 'dashboard' && item.id !== 'settings' && item.id !== 'insights' ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
              {!user.isParticipating && item.id !== 'dashboard' && item.id !== 'settings' && item.id !== 'insights' && (
                <span className="ml-auto text-xs bg-slate-700 px-1.5 py-0.5 rounded text-slate-400">Locked</span>
              )}
            </button>
          ))}
        </nav>

        {/* User Status Footer */}
        <div 
          onClick={() => user.isParticipating && onNavigate('membership')}
          className={`p-4 bg-slate-800 border-t border-slate-700 transition-colors 
            ${user.isParticipating ? 'hover:bg-slate-750 cursor-pointer' : ''}`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-teal-500 flex items-center justify-center font-bold text-white">
              {user.clinicName.substring(0, 2).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user.clinicName}</p>
              <p className="text-xs text-slate-400">{user.isParticipating ? 'Network Member' : 'Not Participating'}</p>
            </div>
          </div>
          {user.isParticipating && (
             <div className="flex gap-2">
              {user.badges.includes('network_verified') && (
                <div className="tooltip" title="Network Verified">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                </div>
              )}
              {user.badges.includes('top_contributor') && (
                 <div className="tooltip" title="Top Contributor">
                   <Award className="w-4 h-4 text-amber-400" />
                 </div>
              )}
             </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 z-10">
           <div className="flex items-center md:hidden">
             <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-slate-600">
               <Menu className="w-6 h-6" />
             </button>
           </div>
           
           <div className="hidden md:block">
             <h2 className="text-xl font-semibold text-slate-800">
                {activePage === 'membership' ? 'Account & Membership' : navItems.find(n => n.id === activePage)?.label}
             </h2>
           </div>

           {/* Token Wallet Display */}
           <div className="flex items-center gap-4">
             {user.isParticipating ? (
               <div 
                  onClick={() => onNavigate('ledger')}
                  className="flex items-center gap-3 bg-white border border-slate-200 rounded-full px-4 py-1.5 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
                >
                 <div className="bg-amber-100 p-1.5 rounded-full">
                    <Coins className="w-5 h-5 text-amber-600" />
                 </div>
                 <div className="flex flex-col">
                   <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Balance</span>
                   <span className="text-lg font-bold text-slate-900 leading-none">{formattedTokens} Tokens</span>
                 </div>
               </div>
             ) : (
                <div className="text-sm text-slate-500 italic">
                  Join network to earn tokens
                </div>
             )}
           </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-auto bg-slate-50 p-6">
          <div className="max-w-7xl mx-auto">
             {children}
          </div>
        </main>
      </div>

      {/* Mobile Menu (simplified) */}
      {mobileMenuOpen && (
        <div className="absolute inset-0 bg-slate-900/90 z-50 flex flex-col p-6 md:hidden">
           <div className="flex justify-between items-center mb-8">
             <span className="text-white font-bold text-xl">Kinetic Network</span>
             <button onClick={() => setMobileMenuOpen(false)} className="text-white">
               <X className="w-6 h-6" />
             </button>
           </div>
           <nav className="space-y-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-4 rounded-lg text-lg
                  ${activePage === item.id ? 'bg-teal-600 text-white' : 'text-slate-300'}
                `}
              >
                <item.icon className="w-6 h-6" />
                {item.label}
              </button>
            ))}
            {user.isParticipating && (
              <button
                onClick={() => { onNavigate('membership'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-4 rounded-lg text-lg
                  ${activePage === 'membership' ? 'bg-teal-600 text-white' : 'text-slate-300'}
                `}
              >
                <ShieldCheck className="w-6 h-6" />
                Membership
              </button>
            )}
           </nav>
        </div>
      )}
    </div>
  );
};

export default Layout;