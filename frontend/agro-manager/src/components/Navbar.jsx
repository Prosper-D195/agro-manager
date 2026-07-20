import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition ${
    isActive
      ? 'bg-[#0f2747] text-white shadow-sm'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`;

const mobileLinkClass = ({ isActive }) =>
  `block px-4 py-3 rounded-xl text-base font-medium transition ${
    isActive
      ? 'bg-[#0f2747] text-white shadow'
      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 backdrop-blur-md bg-white/80 border-b border-white/60 px-4 sm:px-6 py-3 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100"
            aria-label="Ouvrir le menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div>
            <h1 className="text-lg sm:text-xl font-bold text-[#0f2747]">Agro Manager</h1>
            <p className="text-xs text-slate-500 hidden sm:block">Gestion agricole et comptable</p>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-2">
          <NavLink to="/dashboard" className={linkClass}>Tableau de bord</NavLink>
          <NavLink to="/cultures" className={linkClass}>Cultures</NavLink>
          <NavLink to="/recoltes" className={linkClass}>Récoltes</NavLink>
          <NavLink to="/intrants" className={linkClass}>Intrants</NavLink>
          <NavLink to="/categories" className={linkClass}>Catégories</NavLink>
          <NavLink to="/operations" className={linkClass}>Opérations</NavLink>
          <NavLink to="/financial-dashboard" className={linkClass}>Compta</NavLink>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => logout()}
            className="px-3 sm:px-4 py-2 rounded-lg bg-[#0f2747] text-white text-sm font-medium hover:bg-[#17385f] transition"
          >
            Déconnexion
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden absolute left-0 right-0 top-[52px] bg-white border-b border-slate-200 shadow-lg z-30 p-4">
          <div className="flex flex-col gap-2">
            <NavLink to="/dashboard" className={mobileLinkClass} onClick={() => setOpen(false)}>Tableau de bord</NavLink>
            <NavLink to="/cultures" className={mobileLinkClass} onClick={() => setOpen(false)}>Cultures</NavLink>
            <NavLink to="/recoltes" className={mobileLinkClass} onClick={() => setOpen(false)}>Récoltes</NavLink>
            <NavLink to="/intrants" className={mobileLinkClass} onClick={() => setOpen(false)}>Intrants</NavLink>
            <NavLink to="/categories" className={mobileLinkClass} onClick={() => setOpen(false)}>Catégories</NavLink>
            <NavLink to="/operations" className={mobileLinkClass} onClick={() => setOpen(false)}>Opérations</NavLink>
            <NavLink to="/financial-dashboard" className={mobileLinkClass} onClick={() => setOpen(false)}>Compta</NavLink>
          </div>
        </div>
      )}
    </header>
  );
}