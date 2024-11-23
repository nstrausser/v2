import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutGrid,
  Package,
  BarChart3,
  Settings as SettingsIcon,
  Users,
  Scissors,
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';

export type View =
  | 'dashboard'
  | 'inventory'
  | 'installers'
  | 'installations'
  | 'analytics'
  | 'settings';

const navigation = [
  { name: 'Dashboard', icon: LayoutGrid, view: 'dashboard', path: '/' },
  { name: 'Inventory', icon: Package, view: 'inventory', path: '/inventory' },
  {
    name: 'Installers',
    icon: Users,
    view: 'installers',
    path: '/installers',
  },
  {
    name: 'Installations',
    icon: Scissors,
    view: 'installations',
    path: '/installations',
  },
  {
    name: 'Analytics',
    icon: BarChart3,
    view: 'analytics',
    path: '/analytics',
  },
  {
    name: 'Settings',
    icon: SettingsIcon,
    view: 'settings',
    path: '/settings',
  },
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentView = navigation.find(
    (item) => item.path === location.pathname
  )?.view as View;

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        <Sidebar
          navigation={navigation}
          currentView={currentView}
          setCurrentView={(view) => {
            const path = navigation.find((item) => item.view === view)?.path;
            if (path) navigate(path);
          }}
        />
        <main className="flex-1 overflow-y-auto pl-[72px]">
          <div className={`${currentView === 'analytics' ? 'p-4' : 'p-8'}`}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}