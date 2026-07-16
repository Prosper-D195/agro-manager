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
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import api from '../../services/api';


export default function CultureForm() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCulture, setSelectedCulture] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    variete: '',
    date_semis: '',
    superficie: '',
    note: '',
  });


  // Ouvrir le formulaire
  const handleOpenAdd = () => {
    setSelectedCulture(null);
    setFormData({
      nom: '',
      variete: '',
      date_semis: '',
      superficie: '',
      note: '',
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
        nom: formData.nom,
        variete: formData.variete,
        date_semis: formData.date_semis || null,
        superficie: formData.superficie ? parseFloat(formData.superficie) : null,
        note: formData.note || null,
      };

      if (selectedCulture) {
        await api.put(`/cultures/${selectedCulture.id}`, dataToSend);
      } else {
        await api.post('/cultures', dataToSend);
      }
      // Ici, tu pourrais recharger la liste des cultures si besoin
      setOpenDialog(false);
      alert('Culture enregistrée avec succès');
    } catch (err) {
      console.error('Erreur lors de la sauvegarde de la culture', err);
      alert('Erreur lors de la sauvegarde de la culture');
    }
  };


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Gestion des cultures
      </Typography>


      <Box sx={{ display: 'flex', justifyContent: 'end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
        >
          Ajouter une culture
        </Button>
      </Box>


      {/* Formulaire d'ajout / modification */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedCulture ? 'Modifier la culture' : 'Ajouter une culture'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nom de la culture"
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Variété"
            value={formData.variete}
            onChange={(e) => setFormData({ ...formData, variete: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Date de semis"
            type="date"
            value={formData.date_semis}
            onChange={(e) => setFormData({ ...formData, date_semis: e.target.value })}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Superficie (ha)"
            type="number"
            value={formData.superficie}
            onChange={(e) => setFormData({ ...formData, superficie: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Note"
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedCulture ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}