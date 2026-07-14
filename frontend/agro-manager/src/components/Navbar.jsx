import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-green-700 text-white p-4 flex items-center justify-between">
      <div className="font-bold text-lg">Agro Manager</div>
      <nav className="flex gap-4">
        <NavLink to="/dashboard" className="hover:underline">Tableau de bord</NavLink>
        <NavLink to="/cultures" className="hover:underline">Cultures</NavLink>
        <NavLink to="/recoltes" className="hover:underline">Récoltes</NavLink>
        <NavLink to="/intrants" className="hover:underline">Intrants</NavLink>
        <NavLink to="/categories" className="hover:underline">Catégories</NavLink>
        <NavLink to="/operations" className="hover:underline">Opérations</NavLink>
        <NavLink to="/financial-dashboard" className="hover:underline">Compta</NavLink>
      </nav>
      <div className="flex items-center gap-4">
        <div className="text-sm">
          {user?.nom} ({user?.role})
        </div>
        <button
          onClick={() => logout()}
          className="bg-white text-green-700 px-3 py-1 rounded hover:bg-green-100"
        >
          Déconnexion
        </button>
      </div>
    </header>
  );
}