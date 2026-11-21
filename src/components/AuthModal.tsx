import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { db, INITIAL_USERS } from '../services/db';
import { Shield, User as UserIcon, Wrench, Lock, Mail, MapPin, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserChanged: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onUserChanged
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('citizen');
  const [district, setDistrict] = useState('Baixa-Chiado');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleQuickLogin = (targetRole: UserRole) => {
    const user = db.switchRole(targetRole);
    onUserChanged(user);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (isRegister) {
      if (!name || !email) {
        setErrorMsg('Preencha todos os campos obrigatórios.');
        return;
      }
      const newUser = db.registerUser(name, email, role, district, phone);
      onUserChanged(newUser);
      onClose();
    } else {
      // Login check
      const users = db.getUsers();
      const found = users.find(u => u.email.toLowerCase() === email.toLowerCase()) || users[0];
      db.setCurrentUser(found);
      onUserChanged(found);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {isRegister ? 'Registo de Nova Conta' : 'Acesso ao UrbisFlow'}
            </h3>
            <p className="text-xs text-slate-500">
              Sistema de Autenticação e Perfis de Acesso
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Quick Demo Switcher for the Jury */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
          <div className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
            Acesso Rápido para Avaliação do Júri da PAP:
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-cyan-500 text-center transition-colors text-xs"
            >
              <Shield className="w-4 h-4 text-cyan-600 dark:text-cyan-400 mx-auto mb-1" />
              <div className="font-semibold text-slate-900 dark:text-white">Administrador</div>
              <div className="text-[10px] text-slate-500">Gestor Urbano</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('citizen')}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-cyan-500 text-center transition-colors text-xs"
            >
              <UserIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
              <div className="font-semibold text-slate-900 dark:text-white">Cidadão</div>
              <div className="text-[10px] text-slate-500">Ana Silva</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('technician')}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-cyan-500 text-center transition-colors text-xs"
            >
              <Wrench className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mx-auto mb-1" />
              <div className="font-semibold text-slate-900 dark:text-white">Técnico</div>
              <div className="text-[10px] text-slate-500">Piquete Campo</div>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2 rounded-lg">
            {errorMsg}
          </div>
        )}

        {/* Regular Login / Register Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {isRegister && (
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nome Completo</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: João Ferreira"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="utilizador@email.pt"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Palavra-passe</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {isRegister && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Perfil</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="citizen">Cidadão</option>
                  <option value="admin">Administrador</option>
                  <option value="technician">Técnico Piquete</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Freguesia</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Baixa-Chiado">Baixa-Chiado</option>
                  <option value="Alvalade">Alvalade</option>
                  <option value="Parque das Nações">Parque das Nações</option>
                  <option value="Belém">Belém</option>
                  <option value="Lumiar">Lumiar</option>
                </select>
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
            >
              {isRegister ? 'Criar Conta' : 'Iniciar Sessão'}
            </button>
          </div>
        </form>

        <div className="text-center pt-1 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          {isRegister ? 'Já tem conta no sistema?' : 'Novo utilizador?'}{' '}
          <button
            type="button"
            onClick={() => { setIsRegister(!isRegister); setErrorMsg(''); }}
            className="text-cyan-600 dark:text-cyan-400 font-semibold hover:underline"
          >
            {isRegister ? 'Iniciar Sessão' : 'Criar Nova Conta'}
          </button>
        </div>
      </div>
    </div>
  );
};
