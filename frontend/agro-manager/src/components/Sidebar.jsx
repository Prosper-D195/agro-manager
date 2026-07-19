import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RoleGuard } from '../components/RoleGuard';

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
    isActive
      ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
      : 'text-slate-200 hover:bg-white/10 hover:text-white'
  }`;

export default function Sidebar() {
  const { user } = useAuth();

  return (
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
      </nav>
    </aside>
  );
}