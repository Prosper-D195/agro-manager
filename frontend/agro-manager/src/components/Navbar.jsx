import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition ${
    isActive
      ? 'bg-[#0f2747] text-white shadow-sm'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 backdrop-blur-md bg-white/75 border-b border-white/60 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0f2747]">Agro Manager</h1>
          <p className="text-xs text-slate-500">Gestion agricole et comptable</p>
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

        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right">
            <div className="text-sm font-medium text-slate-800">{user?.nom}</div>
            <div className="text-xs text-slate-500">{user?.role}</div>
          </div>

          <button
            onClick={() => logout()}
            className="px-4 py-2 rounded-lg bg-[#0f2747] text-white text-sm font-medium hover:bg-[#17385f] transition"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
}