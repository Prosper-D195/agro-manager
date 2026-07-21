import { useState } from 'react';
import api from '../../services/api';

const ROLES = ['admin', 'gestionnaire', 'operateur'];

export default function SettingsPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'operateur',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await api.post('/users', form);
      setMessage('Utilisateur ajouté avec succès');
      setForm({
        name: '',
        email: '',
        password: '',
        role: 'operateur',
      });
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          "Erreur lors de l'ajout de l'utilisateur"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-slate-900">Paramètres</h1>
        <p className="mt-2 text-slate-600">
          Ajoute un nouvel utilisateur depuis cette page.
        </p>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Ajouter un utilisateur
          </h2>

          {message && (
            <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-green-700 text-sm">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Nom
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-cyan-500"
                placeholder="Nom complet"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-cyan-500"
                placeholder="exemple@agro.com"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Mot de passe
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-cyan-500"
                placeholder="Mot de passe"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Rôle
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-cyan-500"
              >
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-cyan-600 px-4 py-2 text-white font-medium hover:bg-cyan-700 disabled:opacity-50"
            >
              {loading ? 'Enregistrement...' : 'Ajouter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}