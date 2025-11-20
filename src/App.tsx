import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Analytics } from './pages/Analytics';
import { ToTake } from './pages/ToTake';

import { useEffect } from 'react';
import { useStore } from './store';
import { supabase } from './lib/supabase';

import { Login } from './pages/auth/Login';
import { SignUp } from './pages/auth/SignUp';

function App() {
  const { preferences, updatePreferences, setUser, fetchData } = useStore();

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchData();
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchData();
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, fetchData]);

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
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
