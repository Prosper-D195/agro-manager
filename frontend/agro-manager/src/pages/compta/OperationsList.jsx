import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import OperationForm from './OperationForm';

export default function OperationsList() {
  const [operations, setOperations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filtres
  const [filters, setFilters] = useState({
    type: 'TOUS',
    categorie_id: '',
    date_debut: '',
    date_fin: '',
    culture_id: '',
    recolte_id: '',
    intrant_id: ''
  });

  const fetchData = async () => {
    const [opsRes, catRes] = await Promise.all([
      api.get('/compta/operations'),
      api.get('/compta/categories')
    ]);
    setOperations(Array.isArray(opsRes.data) ? opsRes.data : []);
    setCategories(Array.isArray(catRes.data) ? catRes.data : []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setEditing(null);
    setOpenForm(true);
  };

  const handleEdit = (op) => {
    setEditing(op);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette opération ?')) return;
    await api.delete(`/compta/operations/${id}`);
    fetchData();
  };

  const resetFilters = () => {
    setFilters({
      type: 'TOUS',
      categorie_id: '',
      date_debut: '',
      date_fin: '',
      culture_id: '',
      recolte_id: '',
      intrant_id: ''
    });
  };

  // Filtrage côté front
  const filteredOperations = operations.filter((op) => {
    if (filters.type !== 'TOUS' && op.type !== filters.type) return false;
    if (filters.categorie_id && op.categorie_id?.toString() !== filters.categorie_id) return false;
    if (filters.date_debut && op.date < filters.date_debut) return false;
    if (filters.date_fin && op.date > filters.date_fin) return false;
    if (filters.culture_id && op.culture_id?.toString() !== filters.culture_id) return false;
    if (filters.recolte_id && op.recolte_id?.toString() !== filters.recolte_id) return false;
    if (filters.intrant_id && op.intrant_id?.toString() !== filters.intrant_id) return false;
    return true;
  });

  return (
    <div className="p-6">
      {/* En-tête */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-800">Opérations comptables</h2>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow text-sm font-medium transition"
          >
            {showFilters ? 'Masquer filtres' : 'Filtres'}
          </button>
        </div>

        <button
          onClick={handleAdd}
          className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow text-sm font-medium transition"
        >
          Nouvelle opération
        </button>
      </div>

      {/* Zone de filtres */}
      {showFilters && (
        <div className="bg-white border rounded-xl p-5 mb-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Filtres</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <option value="TOUS">TOUS</option>
                <option value="RECETTE">RECETTE</option>
                <option value="DEPENSE">DEPENSE</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={filters.categorie_id}
                onChange={(e) => setFilters({ ...filters, categorie_id: e.target.value })}
              >
                <option value="">Toutes</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nom} ({c.type})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Du</label>
              <input
                type="date"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={filters.date_debut}
                onChange={(e) => setFilters({ ...filters, date_debut: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Au</label>
              <input
                type="date"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={filters.date_fin}
                onChange={(e) => setFilters({ ...filters, date_fin: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Culture</label>
              <input
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={filters.culture_id}
                onChange={(e) => setFilters({ ...filters, culture_id: e.target.value })}
                placeholder="ID culture"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Récolte</label>
              <input
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={filters.recolte_id}
                onChange={(e) => setFilters({ ...filters, recolte_id: e.target.value })}
                placeholder="ID récolte"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Intrant</label>
              <input
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={filters.intrant_id}
                onChange={(e) => setFilters({ ...filters, intrant_id: e.target.value })}
                placeholder="ID intrant"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={resetFilters}
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg border transition"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tableau */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">Libellé</th>
                <th className="border-b px-4 py-3 text-right text-sm font-semibold text-gray-700">Montant</th>
                <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">Catégorie</th>
                <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">Culture</th>
                <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">Récolte</th>
                <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">Intrant</th>
                <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOperations.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-6 text-center text-gray-500">
                    Aucune opération trouvée avec ces filtres.
                  </td>
                </tr>
              ) : (
                filteredOperations.map((op) => (
                  <tr key={op.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border-b text-sm">{op.type}</td>
                    <td className="px-4 py-3 border-b text-sm">{op.date}</td>
                    <td className="px-4 py-3 border-b text-sm">{op.libelle}</td>
                    <td className="px-4 py-3 border-b text-sm text-right">{op.montant}</td>
                    <td className="px-4 py-3 border-b text-sm">{op.categorie_nom || '-'}</td>
                    <td className="px-4 py-3 border-b text-sm">{op.culture_nom || '-'}</td>
                    <td className="px-4 py-3 border-b text-sm">{op.recolte_nom || '-'}</td>
                    <td className="px-4 py-3 border-b text-sm">{op.intrant_nom || '-'}</td>
                    <td className="px-4 py-3 border-b text-sm">
                      <button
                        onClick={() => handleEdit(op)}
                        className="mr-3 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(op.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {openForm && (
        <OperationForm
          initialData={editing}
          categories={categories}
          onClose={() => setOpenForm(false)}
          onSaved={() => {
            setOpenForm(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
}