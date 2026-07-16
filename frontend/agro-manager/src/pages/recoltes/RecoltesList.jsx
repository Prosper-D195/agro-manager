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

export default function RecoltesList() {
  const [recoltes, setRecoltes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRecolte, setSelectedRecolte] = useState(null);
  const [formData, setFormData] = useState({
    cultureId: '',
    culture_name: '',
    quantite: '',
    unite: '',
    date_recolte: '',
    notes: '',
  });

  // Charger les récoltes
  useEffect(() => {
    fetchRecoltes();
  }, []);

  const fetchRecoltes = async () => {
    try {
      const res = await api.get('/recoltes');
      const list = Array.isArray(res.data)
        ? res.data
        : res.data?.data
        || res.data?.results
        || res.data?.recoltes
        || [];
      setRecoltes(list);
    } catch (err) {
      console.error('Erreur lors du chargement des récoltes', err);
    }
  };

  // Ouvrir le formulaire d'ajout
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

  // Ouvrir le formulaire de modification
  const handleOpenEdit = (recolte) => {
    setSelectedRecolte(recolte);
    setFormData({
      cultureId: recolte.cultureId || recolte.culture_id || '',
      culture_name: recolte.culture_name || '',
      quantite: recolte.quantite || '',
      unite: recolte.unite || '',
      date_recolte: recolte.date_recolte || '',
      notes: recolte.notes || '',
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
        cultureId: formData.cultureId ? Number(formData.cultureId) : null,
        culture_name: formData.culture_name || null,
        quantite: Number(formData.quantite),
        unite: formData.unite,
        date_recolte: formData.date_recolte,
        notes: formData.notes || null,
      };

      if (selectedRecolte) {
        await api.put(`/recoltes/${selectedRecolte.id}`, dataToSend);
      } else {
        await api.post('/recoltes', dataToSend);
      }
      fetchRecoltes();
      handleCloseDialog();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde de la récolte', err);
    }
  };

  // Suppression
  const handleDeleteClick = (recolte) => {
    setSelectedRecolte(recolte);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/recoltes/${selectedRecolte.id}`);
      fetchRecoltes();
      setOpenDeleteDialog(false);
    } catch (err) {
      console.error('Erreur lors de la suppression de la récolte', err);
    }
  };

  const recolteList = Array.isArray(recoltes) ? recoltes : [];

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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Culture</TableCell>
              <TableCell>Quantité</TableCell>
              <TableCell>Unité</TableCell>
              <TableCell>Date de récolte</TableCell>
              <TableCell>Note</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recolteList.map((recolte) => (
              <TableRow key={recolte.id}>
                <TableCell>
                  {recolte.culture_name || recolte.culture?.name || 'Culture inconnue'}
                </TableCell>
                <TableCell>{recolte.quantite}</TableCell>
                <TableCell>{recolte.unite}</TableCell>
                <TableCell>{recolte.date_recolte}</TableCell>
                <TableCell>{recolte.notes || '-'}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenEdit(recolte)}
                  >
                    Modifier
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteClick(recolte)}
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
          {selectedRecolte ? 'Modifier la récolte' : 'Ajouter une récolte'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="ID de la culture (optionnel)"
            type="number"
            value={formData.cultureId}
            onChange={(e) => setFormData({ ...formData, cultureId: e.target.value })}
            sx={{ mb: 2 }}
            helperText="Laissez vide si vous utilisez seulement le nom de la culture"
          />
          <TextField
            fullWidth
            label="Nom de la culture (optionnel)"
            value={formData.culture_name}
            onChange={(e) => setFormData({ ...formData, culture_name: e.target.value })}
            sx={{ mb: 2 }}
            helperText="Utilisez ce champ si vous ne liez pas à une culture existante"
          />
          <TextField
            fullWidth
            label="Quantité"
            type="number"
            value={formData.quantite}
            onChange={(e) => setFormData({ ...formData, quantite: e.target.value })}
            sx={{ mb: 2 }}
            inputProps={{ step: '0.01', min: '0' }}
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

      {/* Dialog de suppression */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Supprimer la récolte</DialogTitle>
        <DialogContent>
          <Typography>
            Voulez-vous vraiment supprimer cette récolte ?
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