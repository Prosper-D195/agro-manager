import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    if (!t) {
      setError('Lien invalide : token de réinitialisation manquant.');
    } else {
      setToken(t);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Les deux mots de passe ne sont pas identiques.');
      return;
    }

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    try {
      await api.post('/auth/reset-password', {
        token,
        password,
      });
      setMessage('Mot de passe réinitialisé avec succès.');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
    } catch (err) {
      setError('Token invalide, expiré ou déjà utilisé.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold text-green-700 mb-4">
          Agro Manager
        </h1>
        <h2 className="text-lg font-semibold mb-4">Nouveau mot de passe</h2>

        {message && (
          <div className="mb-4 text-green-700 bg-green-100 p-2 rounded">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 text-red-600 bg-red-100 p-2 rounded">
            {error}
          </div>
        )}

        {!error && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm mb-1">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">
                Confirmation du mot de passe
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full border rounded p-2"
              />
            </div>

            <button
              type="submit"
              className="bg-green-700 text-white py-2 rounded hover:bg-green-800"
            >
              Réinitialiser le mot de passe
            </button>
          </form>
        )}

        <div className="mt-4 text-sm">
          <a
            href="/login"
            className="text-green-700 hover:underline"
          >
            Retour à la connexion
          </a>
        </div>
      </div>
    </div>
  );
}