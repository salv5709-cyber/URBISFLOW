import React, { useState } from 'react';
import { User } from '../types';
import { 
  Building2, 
  Sun, 
  Moon, 
  User as UserIcon, 
  Shield, 
  Wrench, 
  ChevronDown, 
  LogOut, 
  RotateCcw,
  Menu,
  X
} from 'lucide-react';
import { db } from '../services/db';

interface HeaderProps {
  currentUser: User;
  activeView: 'dashboard' | 'citizen' | 'admin' | 'simulator' | 'report';
  setActiveView: (view: 'dashboard' | 'citizen' | 'admin' | 'simulator' | 'report') => void;
  onOpenAuth: () => void;
  onResetDb: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeView,
  setActiveView,
  onOpenAuth,
  onResetDb,
  isDarkMode,
  onToggleTheme
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getRoleLabel = (role: User['role']) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'citizen': return 'Cidadão';
      case 'technician': return 'Piquete Técnico';
    }
  };

  const navLinks: { id: HeaderProps['activeView']; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'citizen', label: 'Reporte Cidadão' },
    { id: 'admin', label: 'Gestão Municipal' },
    { id: 'simulator', label: 'Simulador IoT' },
    { id: 'report', label: 'Relatório PAP' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-8 h-16">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap group text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-cyan-400 text-slate-950 flex items-center justify-center font-extrabold shadow-sm group-hover:scale-105 transition-transform">
              U
            </div>
            <span>UrbisFlow</span>
          </button>
        </div>

        {/* Zone 2: 4-5 single-line clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => setActiveView(link.id)}
              className={`hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeView === link.id
                  ? 'border-cyan-500 text-slate-900 dark:text-white font-semibold'
                  : 'border-transparent text-slate-600 dark:text-slate-400'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1 primary action cluster (Theme toggle + User profile) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Theme Switcher */}
          <button
            onClick={onToggleTheme}
            aria-label="Alternar modo claro e escuro"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Account / Role Badge with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="hidden lg:block text-left text-xs leading-tight pr-1">
                <div className="font-semibold text-slate-900 dark:text-white max-w-[110px] truncate">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-cyan-600 dark:text-cyan-400 font-medium">
                  {getRoleLabel(currentUser.role)}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50 text-xs text-slate-700 dark:text-slate-200 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-white">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-500">{currentUser.email}</div>
                  <div className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 mt-0.5">
                    Freguesia: {currentUser.district}
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      onOpenAuth();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-800 dark:text-slate-200"
                  >
                    <UserIcon className="w-4 h-4 text-cyan-500" />
                    Trocar Perfil (Modo Demo PAP)
                  </button>

                  <button
                    onClick={() => {
                      onResetDb();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-600 dark:text-slate-400"
                  >
                    <RotateCcw className="w-4 h-4 text-amber-500" />
                    Restaurar Dados da Demo
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-1">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => {
                setActiveView(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeView === link.id
                  ? 'bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
