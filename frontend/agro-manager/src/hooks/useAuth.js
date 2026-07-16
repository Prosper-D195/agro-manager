import { useState, useEffect } from 'react';
import api from '../services/api';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifier si on a un token déjà présent
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      setUser(null);
      return;
    }

    // Vérifier si le token est valide
    api.get('/auth/me')
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur /auth/me:', err);
        // Token invalide → on le retire
        localStorage.removeItem('token');
        setUser(null);
        setLoading(false);
      });
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const token = res.data.token;

    // Stocker le token dans localStorage
    localStorage.setItem('token', token);

    // Mettre à jour l’utilisateur immédiatement
    const meRes = await api.get('/auth/me');
    setUser(meRes.data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return { user, loading, login, logout };
}