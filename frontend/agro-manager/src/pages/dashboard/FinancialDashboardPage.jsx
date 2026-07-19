import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export default function FinancialDashboardPage() {
  const [dashboard, setDashboard] = useState({
    total_recettes: 0,
    total_depenses: 0,
    resultat: 0,
    by_category: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get('/compta/dashboard');
      setDashboard({
        total_recettes: Number(data?.total_recettes || 0),
        total_depenses: Number(data?.total_depenses || 0),
        resultat: Number(data?.resultat || 0),
        by_category: Array.isArray(data?.by_category) ? data.by_category : []
      });
    } catch (err) {
      console.error('Erreur chargement dashboard comptable', err);
      setError(err.response?.data?.message || err.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const money = (value) =>
    new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(value || 0));

  const cardStyle = (bg) => ({
    background: bg,
    color: '#fff',
    borderRadius: '14px',
    padding: '18px',
    boxShadow: '0 4px 14px rgba(0,0,0,0.08)'
  });

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard financier</h1>
          <p className="text-gray-500">Vue globale des recettes, dépenses et résultats.</p>
        </div>
      </div>

      {loading && (
        <div className="p-4 bg-white rounded border">
          Chargement du dashboard...
        </div>
      )}

      {error && (
        <div className="p-4 mb-4 bg-red-50 text-red-700 border border-red-200 rounded">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div style={cardStyle('linear-gradient(135deg, #16a34a, #22c55e)')}>
              <div className="text-sm opacity-90">Total recettes</div>
              <div className="text-3xl font-bold mt-2">{money(dashboard.total_recettes)} FCFA</div>
            </div>

            <div style={cardStyle('linear-gradient(135deg, #dc2626, #ef4444)')}>
              <div className="text-sm opacity-90">Total dépenses</div>
              <div className="text-3xl font-bold mt-2">{money(dashboard.total_depenses)} FCFA</div>
            </div>

            <div
              style={cardStyle(
                dashboard.resultat >= 0
                  ? 'linear-gradient(135deg, #0f766e, #14b8a6)'
                  : 'linear-gradient(135deg, #7c2d12, #ea580c)'
              )}
            >
              <div className="text-sm opacity-90">Résultat</div>
              <div className="text-3xl font-bold mt-2">{money(dashboard.resultat)} FCFA</div>
            </div>
          </div>

          <div className="bg-white border rounded p-4">
            <h2 className="text-lg font-semibold mb-4">Répartition par catégorie</h2>

            {dashboard.by_category.length === 0 ? (
              <div className="text-gray-500">Aucune donnée disponible.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">Catégorie</th>
                      <th className="border p-2 text-left">Type</th>
                      <th className="border p-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.by_category.map((item) => (
                      <tr key={`${item.id}-${item.type}`}>
                        <td className="border p-2">{item.nom}</td>
                        <td className="border p-2">{item.type}</td>
                        <td className="border p-2 text-right">{money(item.total)} FCFA</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}