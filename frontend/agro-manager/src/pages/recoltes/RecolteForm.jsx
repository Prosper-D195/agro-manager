import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import api from '../../services/api';


export default function RecolteForm() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecolte, setSelectedRecolte] = useState(null);
  const [cultures, setCultures] = useState([]);
  const [formData, setFormData] = useState({
    cultureId: '',
    culture_name: '',
    quantite: '',
    unite: '',
    date_recolte: '',
    notes: '',
  });


  // Charger les cultures
  useEffect(() => {
    fetchCultures();
  }, []);


  const fetchCultures = async () => {
    try {
      const res = await api.get('/cultures');
      const list = Array.isArray(res.data)
        ? res.data
        : res.data?.data
        || res.data?.results
        || res.data?.cultures
        || [];
      setCultures(list);
    } catch (err) {
      console.error('Erreur lors du chargement des cultures', err);
    }
  };


  // Ouvrir le formulaire
  const handleOpenAdd = () => {
    setSelectedRecolte(null);
    setFormData({
      cultureId: '',
      culture_name: '',
      quantite: '',
      unite: '',
      date_recolte: '',
      notes: '',
    });
    setOpenDialog(true);
  };


  // Fermer le formulaire
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };


  // Submit formulaire
  const handleSubmit = async () => {
    try {
      const dataToSend = {
        cultureId: formData.cultureId,
        culture_name: formData.culture_name,
        date_recolte: formData.date_recolte,
        quantite: formData.quantite,
        unite: formData.unite,
        notes: formData.notes || null,
      };

      if (selectedRecolte) {
        await api.put(`/recoltes/${selectedRecolte.id}`, dataToSend);
      } else {
        await api.post('/recoltes', dataToSend);
      }
      // Ici, tu pourrais recharger la liste des récoltes si besoin
      setOpenDialog(false);
      alert('Récolte enregistrée avec succès');
    } catch (err) {
      console.error('Erreur lors de la sauvegarde de la récolte', err);
      alert('Erreur lors de la sauvegarde de la récolte');
    }
  };


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Gestion des récoltes
      </Typography>


      <Box sx={{ display: 'flex', justifyContent: 'end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
        >
          Ajouter une récolte
        </Button>
      </Box>


      {/* Formulaire d'ajout / modification */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedRecolte ? 'Modifier la récolte' : 'Ajouter une récolte'}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Culture</InputLabel>
            <Select
              value={formData.cultureId}
              onChange={(e) => setFormData({ ...formData, cultureId: e.target.value })}
              label="Culture"
            >
              {cultures.map((culture) => (
                <MenuItem
                  key={culture.id}
                  value={culture.id}
                >
                  {culture.nom || culture.name || `Culture ${culture.id}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Nom de la culture (optionnel)"
            value={formData.culture_name}
            onChange={(e) => setFormData({ ...formData, culture_name: e.target.value })}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Quantité"
            type="number"
            value={formData.quantite}
            onChange={(e) => setFormData({ ...formData, quantite: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Unité"
            value={formData.unite}
            onChange={(e) => setFormData({ ...formData, unite: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Date de récolte"
            type="date"
            value={formData.date_recolte}
            onChange={(e) => setFormData({ ...formData, date_recolte: e.target.value })}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Note"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedRecolte ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}