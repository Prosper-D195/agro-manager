import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RoleGuard } from './RoleGuard';
import { useState } from 'react';
import { Settings } from 'lucide-react';

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
    isActive
      ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
      : 'text-slate-200 hover:bg-white/10 hover:text-white'
  }`;

const mobileLinkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition ${
    isActive
      ? 'bg-cyan-500 text-white shadow'
      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
  }`;

export default function Sidebar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside className="w-72 bg-[#0f2747] text-white border-r border-white/10 hidden md:flex md:flex-col min-h-screen shadow-xl">
        <div className="p-6 border-b border-white/10">
          <div className="text-lg font-bold text-white">Agro Manager</div>
          <div className="text-xs text-slate-300 mt-1">Menu de navigation</div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavLink to="/dashboard" className={linkClass}>
            <span>Tableau de bord</span>
          </NavLink>

          <NavLink to="/cultures" className={linkClass}>
            <span>Cultures</span>
          </NavLink>

          <NavLink to="/cultivations" className={linkClass}>
            <span>Cultivations</span>
          </NavLink>

          <NavLink to="/recoltes" className={linkClass}>
            <span>Récoltes</span>
          </NavLink>

          <NavLink to="/intrants" className={linkClass}>
            <span>Intrants</span>
          </NavLink>

          <RoleGuard roles={['admin']} user={user}>
            <NavLink to="/users" className={linkClass}>
              <span>Utilisateurs</span>
            </NavLink>
          </RoleGuard>

          <NavLink to="/operations" className={linkClass}>
            <span>Opérations</span>
          </NavLink>

          <NavLink to="/financial-dashboard" className={linkClass}>
            <span>Dashboard financier</span>
          </NavLink>

          <NavLink to="/settings" className={linkClass}>
            <Settings size={18} />
            <span>Paramètres</span>
          </NavLink>
        </nav>
      </aside>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-[#0f2747] text-white shadow-xl z-50 transform transition-transform duration-200 ease-in-out md:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="font-bold text-lg">Agro Manager</div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg border border-white/20 text-white hover:bg-white/10"
            aria-label="Fermer le menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>

        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100%-64px)]">
          <NavLink to="/dashboard" className={mobileLinkClass} onClick={() => setOpen(false)}>
            <span>Tableau de bord</span>
          </NavLink>

          <NavLink to="/cultures" className={mobileLinkClass} onClick={() => setOpen(false)}>
            <span>Cultures</span>
          </NavLink>

          <NavLink to="/cultivations" className={mobileLinkClass} onClick={() => setOpen(false)}>
            <span>Cultivations</span>
          </NavLink>

          <NavLink to="/recoltes" className={mobileLinkClass} onClick={() => setOpen(false)}>
            <span>Récoltes</span>
          </NavLink>

          <NavLink to="/intrants" className={mobileLinkClass} onClick={() => setOpen(false)}>
            <span>Intrants</span>
          </NavLink>

          <RoleGuard roles={['admin']} user={user}>
            <NavLink to="/users" className={mobileLinkClass} onClick={() => setOpen(false)}>
              <span>Utilisateurs</span>
            </NavLink>
          </RoleGuard>

          <NavLink to="/operations" className={mobileLinkClass} onClick={() => setOpen(false)}>
            <span>Opérations</span>
          </NavLink>

          <NavLink to="/financial-dashboard" className={mobileLinkClass} onClick={() => setOpen(false)}>
            <span>Dashboard financier</span>
          </NavLink>

          <NavLink to="/settings" className={mobileLinkClass} onClick={() => setOpen(false)}>
            <Settings size={18} />
            <span>Paramètres</span>
          </NavLink>
        </nav>
      </aside>
    </>
  );
}