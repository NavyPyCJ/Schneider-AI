import React from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import BoltIcon from "@mui/icons-material/Bolt";

export default function KPICards({ actions, zones }) {
  const activeCount = actions.filter((a) => !a.overridden).length;
  const avgComfort = Math.round(
    actions.reduce((acc, a) => acc + a.comfort, 0) / (actions.length || 1)
  );

  const kpis = [
    {
      label: "Energy Reduction (Weekly)",
      value: "85.0 kWh",
      sub: "14.2% below baseline target",
      icon: <TrendingDownIcon sx={{ color: "#009530" }} />,
      color: "#009530",
      accentBg: "#E8F5E9"
    },
    {
      label: "Net Financial Savings",
      value: "$29.75",
      sub: "Projected $124/mo on peak tariff",
      icon: <AttachMoneyIcon sx={{ color: "#0284C7" }} />,
      color: "#0284C7",
      accentBg: "#E0F2FE"
    },
    {
      label: "Occupant Comfort (PMV)",
      value: `${avgComfort}%`,
      sub: `${zones.reduce((sum, z) => sum + z.occupancy, 0)} occupants across ${zones.length} zones`,
      icon: <ThermostatIcon sx={{ color: "#8B5CF6" }} />,
      color: "#8B5CF6",
      accentBg: "#F3E8FF"
    },
    {
      label: "Autonomous AI Actions",
      value: `${activeCount} Active`,
      sub: `${actions.length - activeCount} manually overridden`,
      icon: <BoltIcon sx={{ color: "#D97706" }} />,
      color: "#D97706",
      accentBg: "#FEF3C7"
    }
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {kpis.map((kpi, idx) => (
        <Grid item xs={12} sm={6} md={3} key={idx}>
          <Paper
            elevation={0}
            sx={{
              p: 2.2,
              borderRadius: 3,
              border: "1px solid #E2E8F0",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              bgcolor: "#FFFFFF",
              transition: "transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
              }
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600 }}>
                {kpi.label}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, my: 0.5, color: kpi.color }}>
                {kpi.value}
              </Typography>
              <Typography variant="caption" sx={{ color: "#475569", display: "block" }}>
                {kpi.sub}
              </Typography>
            </Box>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2.5,
                bgcolor: kpi.accentBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {kpi.icon}
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
