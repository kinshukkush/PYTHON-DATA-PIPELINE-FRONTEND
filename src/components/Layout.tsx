import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { BarChart3, Package, ShoppingCart, Sparkles } from 'lucide-react';
import { getHealth } from '../services/api';

export default function Layout() {
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const location = useLocation();

  useEffect(() => {
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      await getHealth();
      setApiStatus('online');
    } catch {
      setApiStatus('offline');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: BarChart3 },
    { path: '/products', label: 'Products', icon: Package },
    { path: '/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/add-product', label: 'Add Product', icon: Sparkles },
    { path: '/add-order', label: 'Add Order', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <header className="relative glass border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3 animate-fadeInUp">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur-lg opacity-50"></div>
                <div className="relative bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-lg">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text flex items-center gap-2">
                  E-Commerce Analytics
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </h1>
                <p className="text-xs text-slate-400">Real-time Data Pipeline</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 animate-fadeInUp delay-100">
              <span className="text-sm text-slate-400">API Status:</span>
              {apiStatus === 'checking' && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-yellow-400">Checking...</span>
                </div>
              )}
              {apiStatus === 'online' && (
                <div className="flex items-center space-x-2 glass px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full pulse-glow"></div>
                  <span className="text-sm text-green-400 font-medium">Online</span>
                </div>
              )}
              {apiStatus === 'offline' && (
                <div className="flex items-center space-x-2 glass px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-sm text-red-400 font-medium">Offline</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <nav className="relative glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2">
            {navLinks.map(({ path, label, icon: Icon }, index) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-all duration-300 animate-fadeInUp ${isActive(path)
                    ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
