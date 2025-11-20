import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Analytics } from './pages/Analytics';
import { ToTake } from './pages/ToTake';

import { useEffect } from 'react';
import { useStore } from './store';

function App() {
  const { preferences, updatePreferences } = useStore();

  useEffect(() => {
    if (preferences.currency === 'USD') {
      updatePreferences({ currency: 'INR' });
    }
  }, [preferences.currency, updatePreferences]);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Transactions />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/to-take" element={<ToTake />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
