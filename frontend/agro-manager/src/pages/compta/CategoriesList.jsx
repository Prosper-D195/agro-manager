import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import CategoryForm from './CategoryForm';

export default function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [openForm, setOpenForm] = useState(false);

  const fetchCategories = async () => {
    const { data } = await api.get('/compta/categories');
    setCategories(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = () => {
    setEditing(null);
    setOpenForm(true);
  };

  const handleEdit = (cat) => {
    setEditing(cat);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette catégorie ?')) return;
    await api.delete(`/compta/categories/${id}`);
    fetchCategories();
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Catégories comptables</h2>
        <button onClick={handleAdd} className="px-4 py-2 bg-green-600 text-white rounded">
          Ajouter
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Nom</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="border p-2">{cat.nom}</td>
                <td className="border p-2">{cat.type}</td>
                <td className="border p-2">{cat.description || '-'}</td>
                <td className="border p-2">
                  <button onClick={() => handleEdit(cat)} className="mr-2 text-blue-600">
                    Modifier
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="text-red-600">
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {openForm && (
        <CategoryForm
          initialData={editing}
          onClose={() => setOpenForm(false)}
          onSaved={() => {
            setOpenForm(false);
            fetchCategories();
          }}
        />
      )}
    </div>
  );
}