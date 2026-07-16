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
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import api from '../../services/api';

const TYPES = ['Engrais', 'Traitement', 'Outil', 'Autre'];

const statusColors = {
  OK: 'success',
  alerte: 'warning',
  critique: 'error',
};

export default function IntrantsList() {
  const [intrants, setIntrants] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedIntrant, setSelectedIntrant] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    type: '',
    culture_cible: '',
    stock_actuel: '',
    seuil_alerte: '',
    unite_stock: '',
  });

  useEffect(() => {
    fetchIntrants();
  }, []);

  const fetchIntrants = async () => {
    try {
      const res = await api.get('/intrants');
      const list = Array.isArray(res.data)
        ? res.data
        : res.data?.intrants
        || [];
      setIntrants(list);
    } catch (err) {
      console.error('Erreur lors du chargement des intrants', err);
    }
  };

  const handleOpenAdd = () => {
    setSelectedIntrant(null);
    setFormData({
      nom: '',
      type: '',
      culture_cible: '',
      stock_actuel: '',
      seuil_alerte: '',
      unite_stock: '',
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = (intrant) => {
    setSelectedIntrant(intrant);
    setFormData({
      nom: intrant.nom || '',
      type: intrant.type || '',
      culture_cible: intrant.culture_cible || '',
      stock_actuel: intrant.stock_actuel || '',
      seuil_alerte: intrant.seuil_alerte || '',
      unite_stock: intrant.unite_stock || '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async () => {
    try {
      const dataToSend = {
        nom: formData.nom,
        type: formData.type,
        culture_cible: formData.culture_cible || 'universel',
        stock_actuel: Number(formData.stock_actuel) || 0,
        seuil_alerte: Number(formData.seuil_alerte) || 0,
        unite_stock: formData.unite_stock,
      };

      if (selectedIntrant) {
        await api.put(`/intrants/${selectedIntrant.id}`, dataToSend);
      } else {
        await api.post('/intrants', dataToSend);
      }
      fetchIntrants();
      handleCloseDialog();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde de l’intrant', err);
    }
  };

  const handleDeleteClick = (intrant) => {
    setSelectedIntrant(intrant);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/intrants/${selectedIntrant.id}`);
      fetchIntrants();
      setOpenDeleteDialog(false);
    } catch (err) {
      console.error('Erreur lors de la suppression de l’intrant', err);
    }
  };

  const intrantList = Array.isArray(intrants) ? intrants : [];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Gestion des intrants
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
        >
          Ajouter un intrant
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Culture cible</TableCell>
              <TableCell>Stock actuel</TableCell>
              <TableCell>Seuil alerte</TableCell>
              <TableCell>Unité</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {intrantList.map((intrant) => (
              <TableRow key={intrant.id}>
                <TableCell>{intrant.nom}</TableCell>
                <TableCell>{intrant.type}</TableCell>
                <TableCell>{intrant.culture_cible}</TableCell>
                <TableCell>{intrant.stock_actuel}</TableCell>
                <TableCell>{intrant.seuil_alerte}</TableCell>
                <TableCell>{intrant.unite_stock}</TableCell>
                <TableCell>
                  <Chip
                    label={intrant.status || 'OK'}
                    color={statusColors[intrant.status || 'OK']}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenEdit(intrant)}
                  >
                    Modifier
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteClick(intrant)}
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
          {selectedIntrant ? 'Modifier l’intrant' : 'Ajouter un intrant'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nom"
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Type"
            select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            sx={{ mb: 2 }}
          >
            {TYPES.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Culture cible"
            value={formData.culture_cible}
            onChange={(e) => setFormData({ ...formData, culture_cible: e.target.value })}
            sx={{ mb: 2 }}
            placeholder="universel"
          />
          <TextField
            fullWidth
            label="Stock actuel"
            type="number"
            value={formData.stock_actuel}
            onChange={(e) => setFormData({ ...formData, stock_actuel: e.target.value })}
            sx={{ mb: 2 }}
            inputProps={{ step: '0.01', min: '0' }}
          />
          <TextField
            fullWidth
            label="Seuil d'alerte"
            type="number"
            value={formData.seuil_alerte}
            onChange={(e) => setFormData({ ...formData, seuil_alerte: e.target.value })}
            sx={{ mb: 2 }}
            inputProps={{ step: '0.01', min: '0' }}
          />
          <TextField
            fullWidth
            label="Unité de stock"
            value={formData.unite_stock}
            onChange={(e) => setFormData({ ...formData, unite_stock: e.target.value })}
            sx={{ mb: 2 }}
            placeholder="kg, L, unité, etc."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedIntrant ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de suppression */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Supprimer l’intrant</DialogTitle>
        <DialogContent>
          <Typography>
            Voulez-vous vraiment supprimer l’intrant « {selectedIntrant?.nom} » ?
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