import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ShareRecord from './components/ShareRecord';
import BrowseRecords from './components/BrowseRecords';
import NetworkInsights from './components/NetworkInsights';
import Settings from './components/Settings';
import Membership from './components/Membership';
import RequestRecords from './components/RequestRecords';
import CreditLedger from './components/CreditLedger';

// Wrapper component to handle routing logic inside the Context Provider
const AppContent: React.FC = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const { user } = useApp();

  // Redirect to dashboard if user tries to access restricted pages while opted out
  useEffect(() => {
    if (!user.isParticipating && ['share', 'browse', 'membership', 'request', 'ledger'].includes(activePage)) {
      setActivePage('dashboard'); // Or settings
    }
  }, [user.isParticipating, activePage]);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard onNavigate={setActivePage} />;
      case 'share':
        return <ShareRecord />;
      case 'browse':
        return <BrowseRecords />;
      case 'request':
        return <RequestRecords />;
      case 'ledger':
        return <CreditLedger />;
      case 'insights':
        return <NetworkInsights />;
      case 'settings':
        return <Settings />;
      case 'membership':
        return <Membership />;
      default:
        return <Dashboard onNavigate={setActivePage} />;
    }
  };

  return (
    <Layout activePage={activePage} onNavigate={setActivePage}>
      {renderPage()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;