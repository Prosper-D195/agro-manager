import React, { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import {
  Grain as CropIcon,
  SpaceDashboard as AreaIcon,
  LocalShipping as HarvestIcon,
  Receipt as InputsIcon,
} from "@mui/icons-material";
import StatCard from "../../components/StatCard";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";

const AgriculturalDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/dashboard/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching dashboard stats", err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Chargement du dashboard...</Typography>
      </Box>
    );
  }

  const statCards = [
    {
      title: "Cultures",
      value: stats.totalCrops,
      icon: <CropIcon sx={{ color: "#4caf50", fontSize: 40 }} />,
    },
    {
      title: "Surface totale (ha)",
      value: stats.totalArea,
      icon: <AreaIcon sx={{ color: "#1976d2", fontSize: 40 }} />,
    },
    {
      title: "Récolte estimée",
      value: stats.expectedHarvest,
      icon: <HarvestIcon sx={{ color: "#ff9800", fontSize: 40 }} />,
    },
    {
      title: "Intrants utilisés",
      value: stats.totalInputs,
      icon: <InputsIcon sx={{ color: "#e91e63", fontSize: 40 }} />,
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Tableau de bord agricole
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        Bienvenue, {user?.name || "Admin"}. Voici les indicateurs de votre exploitation.
      </Typography>

      <Grid container spacing={3}>
        {statCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <StatCard title={card.title} value={card.value} icon={card.icon} />
          </Grid>
        ))}
      </Grid>

      <Box className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-6">
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Pilotage intelligent de l’exploitation
        </Typography>
        <Typography variant="body1" sx={{ color: '#4b5563', lineHeight: 1.8 }}>
          Ce tableau de bord centralise les informations essentielles de l’exploitation agricole
          pour offrir une vision claire des cultures, récoltes, intrants, opérations et résultats
          financiers. Il aide l’entreprise à suivre sa performance, mieux utiliser ses ressources,
          anticiper les besoins et prendre des décisions rapides et rentables.
        </Typography>
      </Box>
    </Box>
  );
};

export default AgriculturalDashboard;