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
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import api from '../../services/api';

export default function CultivationsList() {
  const [cultivations, setCultivations] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCultivation, setSelectedCultivation] = useState(null);

  const [formData, setFormData] = useState({
    parcel_name: '',
    culture_name: '',
    season_name: '',
    density_per_ha: '',
    planting_date: '',
    expected_yield_kg_per_ha: '',
  });

  useEffect(() => {
    fetchCultivations();
  }, []);

  const fetchCultivations = async () => {
    try {
      const res = await api.get('/cultivations');
      const list = Array.isArray(res.data)
        ? res.data
        : res.data?.cultivations || [];
      setCultivations(list);
    } catch (err) {
      console.error('Erreur chargement cultivations', err);
    }
  };

  const handleOpenAdd = () => {
    setSelectedCultivation(null);
    setFormData({
      parcel_name: '',
      culture_name: '',
      season_name: '',
      density_per_ha: '',
      planting_date: '',
      expected_yield_kg_per_ha: '',
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = (cultivation) => {
    setSelectedCultivation(cultivation);
    setFormData({
      parcel_name: cultivation.parcel_name || '',
      culture_name: cultivation.culture_name || '',
      season_name: cultivation.season_name || '',
      density_per_ha: cultivation.density_per_ha || '',
      planting_date: cultivation.planting_date || '',
      expected_yield_kg_per_ha: cultivation.expected_yield_kg_per_ha || '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async () => {
    try {
      const dataToSend = {
        parcel_name: formData.parcel_name || null,
        culture_name: formData.culture_name || null,
        season_name: formData.season_name || null,
        density_per_ha: formData.density_per_ha ? Number(formData.density_per_ha) : null,
        planting_date: formData.planting_date || null,
        expected_yield_kg_per_ha: formData.expected_yield_kg_per_ha
          ? Number(formData.expected_yield_kg_per_ha)
          : null,
      };

      console.log('=== ENVOI À /cultivations ===');
      console.log('dataToSend (objet JS) :', dataToSend);
      console.log('JSON.stringify(dataToSend) :', JSON.stringify(dataToSend));

      if (selectedCultivation) {
        await api.put(`/cultivations/${selectedCultivation.id}`, dataToSend);
      } else {
        await api.post('/cultivations', dataToSend);
      }

      console.log('=== RÉPONSE API OK ===');

      fetchCultivations();
      handleCloseDialog();
      alert(selectedCultivation ? 'Cultivation modifiée avec succès !' : 'Cultivation ajoutée avec succès !');
    } catch (err) {
      console.error('=== ERREUR API ===');
      console.error('err.message:', err.message);
      console.error('err.response?.status:', err.response?.status);
      console.error('err.response?.data:', err.response?.data);

      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Erreur inconnue';

      alert('Erreur : ' + msg);
    }
  };

  const handleDeleteClick = (cultivation) => {
    setSelectedCultivation(cultivation);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/cultivations/${selectedCultivation.id}`);
      fetchCultivations();
      setOpenDeleteDialog(false);
      alert('Cultivation supprimée avec succès !');
    } catch (err) {
      console.error('Erreur suppression cultivation', err);
      alert('Erreur suppression : ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Gestion des cultivations
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
        >
          Ajouter une cultivation
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Parcelle</TableCell>
              <TableCell>Culture</TableCell>
              <TableCell>Saison</TableCell>
              <TableCell>Densité (par ha)</TableCell>
              <TableCell>Date de plantation</TableCell>
              <TableCell>Rendement attendu (kg/ha)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cultivations.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.parcel_name || '-'}</TableCell>
                <TableCell>{c.culture_name || '-'}</TableCell>
                <TableCell>{c.season_name || '-'}</TableCell>
                <TableCell>{c.density_per_ha ?? '-'}</TableCell>
                <TableCell>{c.planting_date ?? '-'}</TableCell>
                <TableCell>{c.expected_yield_kg_per_ha ?? '-'}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenEdit(c)}
                  >
                    Modifier
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteClick(c)}
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

      {/* Dialog ajout / modification */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedCultivation ? 'Modifier la cultivation' : 'Ajouter une cultivation'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Parcelle (texte)"
            value={formData.parcel_name}
            onChange={(e) => setFormData({ ...formData, parcel_name: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Culture (texte)"
            value={formData.culture_name}
            onChange={(e) => setFormData({ ...formData, culture_name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Saison (texte, optionnel)"
            value={formData.season_name}
            onChange={(e) => setFormData({ ...formData, season_name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Densité (par ha)"
            type="text"
            value={formData.density_per_ha}
            onChange={(e) => setFormData({ ...formData, density_per_ha: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Date de plantation"
            type="date"
            value={formData.planting_date}
            onChange={(e) => setFormData({ ...formData, planting_date: e.target.value })}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Rendement attendu (kg/ha)"
            type="text"
            value={formData.expected_yield_kg_per_ha}
            onChange={(e) =>
              setFormData({ ...formData, expected_yield_kg_per_ha: e.target.value })
            }
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedCultivation ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de suppression */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Supprimer la cultivation</DialogTitle>
        <DialogContent>
          <Typography>
            Voulez-vous vraiment supprimer cette cultivation ?
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