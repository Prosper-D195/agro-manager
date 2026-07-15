import { useState } from 'react';
import api from '../../services/api';


export default function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');


    try {
      await api.post('/auth/request-reset-password', { email });
      setMessage(
        'Si cet email est associé à un compte, vous recevrez un lien de réinitialisation.'
      );
    } catch (err) {
      setError(
        'Une erreur est survenue. Veuillez réessayer plus tard.'
      );
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold text-green-700 mb-4">
          Agro Manager
        </h1>
        <h2 className="text-lg font-semibold mb-4">Mot de passe oublié</h2>


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


        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded p-2"
            />
          </div>


          <button
            type="submit"
            className="bg-green-700 text-white py-2 rounded hover:bg-green-800"
          >
            Envoyer le lien de réinitialisation
          </button>
        </form>


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