import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

const StatCard = ({ title, value, icon, color }) => {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {icon}
          <Box>
            <Typography variant="h6">{value}</Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;