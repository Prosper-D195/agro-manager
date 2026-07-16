import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import api from '../../services/api';

export default function CulturesList() {
  const [cultures, setCultures] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCulture, setSelectedCulture] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    species: '',
    variety: '',
    region: '',
    hectare: '',
    plantingDate: '',
    expectedHarvestDate: '',
    status: '',
    note: '',
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

  // Ouvrir le formulaire d'ajout
  const handleOpenAdd = () => {
    setSelectedCulture(null);
    setFormData({
      name: '',
      category: '',
      species: '',
      variety: '',
      region: '',
      hectare: '',
      plantingDate: '',
      expectedHarvestDate: '',
      status: '',
      note: '',
    });
    setOpenDialog(true);
  };

  // Ouvrir le formulaire de modification
  const handleOpenEdit = (culture) => {
    setSelectedCulture(culture);
    setFormData({
      name: culture.name || '',
      category: culture.category || '',
      species: culture.species || '',
      variety: culture.variety || '',
      region: culture.region || '',
      hectare: culture.hectare || '',
      plantingDate: culture.plantingDate || '',
      expectedHarvestDate: culture.expectedHarvestDate || '',
      status: culture.status || '',
      note: culture.note || '',
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
      if (selectedCulture) {
        await api.put(`/cultures/${selectedCulture.id}`, formData);
      } else {
        await api.post('/cultures', formData);
      }
      fetchCultures();
      handleCloseDialog();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde de la culture', err);
    }
  };

  // Suppression
  const handleDeleteClick = (culture) => {
    setSelectedCulture(culture);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/cultures/${selectedCulture.id}`);
      fetchCultures();
      setOpenDeleteDialog(false);
    } catch (err) {
      console.error('Erreur lors de la suppression de la culture', err);
    }
  };

  const cultureList = Array.isArray(cultures) ? cultures : [];

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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Catégorie</TableCell>
              <TableCell>Espèce</TableCell>
              <TableCell>Variété</TableCell>
              <TableCell>Région</TableCell>
              <TableCell>Hectare</TableCell>
              <TableCell>Date de plantation</TableCell>
              <TableCell>Date de récolte attendue</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cultureList.map((culture) => (
              <TableRow key={culture.id}>
                <TableCell>{culture.name}</TableCell>
                <TableCell>{culture.category || '-'}</TableCell>
                <TableCell>{culture.species || '-'}</TableCell>
                <TableCell>{culture.variety || '-'}</TableCell>
                <TableCell>{culture.region || '-'}</TableCell>
                <TableCell>{culture.hectare || '-'}</TableCell>
                <TableCell>{culture.plantingDate || '-'}</TableCell>
                <TableCell>{culture.expectedHarvestDate || '-'}</TableCell>
                <TableCell>{culture.status || '-'}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenEdit(culture)}
                  >
                    Modifier
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteClick(culture)}
                    sx={{ ml: 1 }}
                  >
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Formulaire d'ajout / modification */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedCulture ? 'Modifier la culture' : 'Ajouter une culture'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nom"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Catégorie"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Espèce"
            value={formData.species}
            onChange={(e) => setFormData({ ...formData, species: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Variété"
            value={formData.variety}
            onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Région"
            value={formData.region}
            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Hectare"
            value={formData.hectare}
            onChange={(e) => setFormData({ ...formData, hectare: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Date de plantation"
            type="date"
            value={formData.plantingDate}
            onChange={(e) => setFormData({ ...formData, plantingDate: e.target.value })}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Date de récolte attendue"
            type="date"
            value={formData.expectedHarvestDate}
            onChange={(e) => setFormData({ ...formData, expectedHarvestDate: e.target.value })}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Statut"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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

      {/* Dialog de suppression */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Supprimer la culture</DialogTitle>
        <DialogContent>
          <Typography>
            Voulez-vous vraiment supprimer la culture « {selectedCulture?.name} » ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Annuler</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}