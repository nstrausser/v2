import { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider, useAuth } from '@/components/auth/AuthProvider';
import LoginPage from '@/components/auth/LoginPage';
import Dashboard from '@/components/Dashboard';
import Inventory from '@/components/Inventory';
import Analytics from '@/components/Analytics';
import SettingsPanel from '@/components/Settings';
import InstallersView from '@/components/installers/InstallersView';
import InstallationsView from '@/components/installations/InstallationsView';
import Layout from '@/components/Layout';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="installers" element={<InstallersView />} />
              <Route path="installations" element={<InstallationsView />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<SettingsPanel />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}