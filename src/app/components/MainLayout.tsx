import { Outlet, Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function MainLayout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isAdmin = location.pathname === '/admin';

  const navItems = [
    { path: '/', label: '홈' },
    { path: '/portfolio', label: '포트폴리오' },
    { path: '/estimate', label: '견적 요청' },
    { path: '/admin', label: '관리자' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl ${isAdmin ? 'bg-[#0a0a0a]/95 border-b border-white/10' : 'bg-white/80 border-b border-black/5'} transition-all`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <span className={`text-2xl tracking-tight ${isAdmin ? 'text-white' : 'text-black'}`}>
                Interior<span className="inline-block px-2.5 py-1 ml-2 bg-gradient-to-r from-yellow-400 to-amber-400 text-black rounded-md text-sm font-semibold shadow-lg shadow-yellow-400/25 group-hover:shadow-yellow-400/40 transition-shadow">PRO</span>
              </span>
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    location.pathname === item.path
                      ? isAdmin 
                        ? 'bg-white/10 text-white' 
                        : 'bg-black text-white'
                      : isAdmin 
                        ? 'text-gray-400 hover:text-white hover:bg-white/5' 
                        : 'text-gray-600 hover:text-black hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className={`md:hidden p-2 ${isAdmin ? 'text-white' : 'text-black'}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pt-6 pb-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-4 py-3 rounded-lg transition-all ${
                    location.pathname === item.path
                      ? isAdmin 
                        ? 'bg-white/10 text-white' 
                        : 'bg-black text-white'
                      : isAdmin 
                        ? 'text-gray-400 hover:bg-white/5' 
                        : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Page Content */}
      <main className="pt-[73px]">
        <Outlet />
      </main>
    </div>
  );
}