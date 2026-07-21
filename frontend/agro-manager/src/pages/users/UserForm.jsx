import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const ROLES = ['admin', 'gestionnaire', 'operateur'];

export default function UserForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'operateur',
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/users/${id}`)
      .then((res) => {
        const u = res.data;
        setForm({
          name: u.name || '',
          email: u.email || '',
          password: '',
          role: u.role || 'operateur',
        });
      })
      .catch((err) => {
        console.error('Error fetching user', err);
        alert('Erreur lors du chargement de l’utilisateur');
        navigate('/users');
      })
      .finally(() => setLoading(false));
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/users/${id}`, {
          name: form.name,
          email: form.email,
          role: form.role,
        });
      } else {
        await api.post('/users', form);
      }
      navigate('/users');
    } catch (err) {
      console.error('Error saving user', err);
      alert('Erreur lors de l’enregistrement');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-600">Chargement...</div>;
  }

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
        {isEdit ? 'Modifier l’utilisateur' : 'Ajouter un utilisateur'}
      </h1>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-4 bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg border-gray-300 focus:border-[#0f2747] focus:ring-[#0f2747]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full rounded-lg border-gray-300 focus:border-[#0f2747] focus:ring-[#0f2747]"
          />
        </div>
        {!isEdit && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required={!isEdit}
              className="w-full rounded-lg border-gray-300 focus:border-[#0f2747] focus:ring-[#0f2747]"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 focus:border-[#0f2747] focus:ring-[#0f2747]"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-[#0f2747] text-white text-sm font-medium hover:bg-[#17385f] disabled:opacity-50"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/users')}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}