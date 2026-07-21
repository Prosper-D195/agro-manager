import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users');
        setUsers(res.data);
      } catch (err) {
        console.error('Error fetching users', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error('Error deleting user', err);
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-600">Chargement des utilisateurs...</div>;
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Utilisateurs</h1>
        <button
          onClick={() => navigate('/users/new')}
          className="px-4 py-2 rounded-lg bg-[#0f2747] text-white text-sm font-medium hover:bg-[#17385f] transition"
        >
          Ajouter un utilisateur
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Nom</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Rôle</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900">{u.name}</td>
                <td className="px-4 py-3 text-gray-700">{u.email}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => navigate(`/users/${u.id}/edit`)}
                    className="mr-2 text-sm font-medium text-[#0f2747] hover:underline"
                  >
                    Éditer
                  </button>
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="text-sm font-medium text-red-600 hover:underline"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}