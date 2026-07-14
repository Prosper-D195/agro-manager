import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RoleGuard } from '../components/RoleGuard';

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-white border-r p-4 hidden md:block">
      <nav className="flex flex-col gap-2">
        <NavLink to="/dashboard" className="hover:bg-green-100 p-2 rounded">
          Tableau de bord
        </NavLink>

        <NavLink to="/cultures" className="hover:bg-green-100 p-2 rounded">
          Cultures
        </NavLink>

        <NavLink to="/recoltes" className="hover:bg-green-100 p-2 rounded">
          Récoltes
        </NavLink>

        <NavLink to="/intrants" className="hover:bg-green-100 p-2 rounded">
          Intrants
        </NavLink>

        <RoleGuard roles={['admin']} user={user}>
          <NavLink to="/users" className="hover:bg-green-100 p-2 rounded">
            Utilisateurs
          </NavLink>
        </RoleGuard>

        <NavLink to="/categories" className="hover:bg-green-100 p-2 rounded">
          Catégories
        </NavLink>

        <NavLink to="/operations" className="hover:bg-green-100 p-2 rounded">
          Opérations
        </NavLink>

        <NavLink to="/financial-dashboard" className="hover:bg-green-100 p-2 rounded">
          Dashboard financier
        </NavLink>
      </nav>
    </aside>
  );
}