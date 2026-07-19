import React, { useState } from 'react';
import api from '../../services/api';

export default function CategoryForm({ initialData, onClose, onSaved }) {
  const [form, setForm] = useState({
    nom: initialData?.nom || '',
    type: initialData?.type || 'PRODUIT',
    description: initialData?.description || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (initialData?.id) {
      await api.put(`/compta/categories/${initialData.id}`, form);
    } else {
      await api.post('/compta/categories', form);
    }

    onSaved();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">
          {initialData ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Nom</label>
            <input
              className="w-full border p-2 rounded"
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
            />
          </div>

          <div>
            <label className="block mb-1">Type</label>
            <select
              className="w-full border p-2 rounded"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="PRODUIT">PRODUIT</option>
              <option value="CHARGE">CHARGE</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Description</label>
            <textarea
              className="w-full border p-2 rounded"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
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