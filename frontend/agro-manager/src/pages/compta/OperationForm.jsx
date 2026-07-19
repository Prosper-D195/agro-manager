import React, { useState } from 'react';
import api from '../../services/api';

export default function OperationForm({ initialData, categories, onClose, onSaved }) {
  const [form, setForm] = useState({
    type: initialData?.type || 'RECETTE',
    date: initialData?.date ? initialData.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
    libelle: initialData?.libelle || '',
    montant: initialData?.montant?.toString() || '',
    categorie_id: initialData?.categorie_id?.toString() || '',
    culture_id: initialData?.culture_id?.toString() || '',
    recolte_id: initialData?.recolte_id?.toString() || '',
    intrant_id: initialData?.intrant_id?.toString() || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      montant: Number(form.montant || 0),
      categorie_id: form.categorie_id ? Number(form.categorie_id) : null,
      culture_id: form.culture_id ? Number(form.culture_id) : null,
      recolte_id: form.recolte_id ? Number(form.recolte_id) : null,
      intrant_id: form.intrant_id ? Number(form.intrant_id) : null
    };

    try {
      if (initialData?.id) {
        await api.put(`/compta/operations/${initialData.id}`, payload);
      } else {
        await api.post('/compta/operations', payload);
      }
      onSaved();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Erreur lors de l\'enregistrement');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center overflow-auto">
      <div className="bg-white p-6 rounded w-full max-w-2xl my-8">
        <h3 className="text-lg font-bold mb-4">
          {initialData ? 'Modifier l\'opération' : 'Nouvelle opération'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Type</label>
              <select
                className="w-full border p-2 rounded"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="RECETTE">RECETTE</option>
                <option value="DEPENSE">DEPENSE</option>
              </select>
            </div>

            <div>
              <label className="block mb-1">Date</label>
              <input
                type="date"
                className="w-full border p-2 rounded"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Libellé</label>
            <input
              className="w-full border p-2 rounded"
              value={form.libelle}
              onChange={(e) => setForm({ ...form, libelle: e.target.value })}
            />
          </div>

          <div>
            <label className="block mb-1">Montant</label>
            <input
              type="number"
              step="0.01"
              className="w-full border p-2 rounded"
              value={form.montant}
              onChange={(e) => setForm({ ...form, montant: e.target.value })}
            />
          </div>

          <div>
            <label className="block mb-1">Catégorie</label>
            <select
              className="w-full border p-2 rounded"
              value={form.categorie_id}
              onChange={(e) => setForm({ ...form, categorie_id: e.target.value })}
            >
              <option value="">-- Aucune --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nom} ({c.type})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Culture (optionnel)</label>
              <input
                className="w-full border p-2 rounded"
                value={form.culture_id}
                onChange={(e) => setForm({ ...form, culture_id: e.target.value })}
                placeholder="ID culture"
              />
            </div>

            <div>
              <label className="block mb-1">Récolte (optionnel)</label>
              <input
                className="w-full border p-2 rounded"
                value={form.recolte_id}
                onChange={(e) => setForm({ ...form, recolte_id: e.target.value })}
                placeholder="ID récolte"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Intrant (optionnel)</label>
            <input
              className="w-full border p-2 rounded"
              value={form.intrant_id}
              onChange={(e) => setForm({ ...form, intrant_id: e.target.value })}
              placeholder="ID intrant"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
              Annuler
            </button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}