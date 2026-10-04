import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Chip,
  IconButton,
  Tooltip
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import RefreshIcon from "@mui/icons-material/Refresh";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import TuneIcon from "@mui/icons-material/Tune";

export default function Header({ onOpenExport, onToggleMode, optimizationMode, onRefresh }) {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E2E8F0",
        color: "#0F172A",
        px: { xs: 1, md: 3 },
      }}
    >
      <Toolbar disableGutters sx={{ justifyContent: "space-between", py: 1 }}>
        {/* Brand & Title */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* Schneider Electric Mark Icon */}
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              bgcolor: "#009530",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFF",
              boxShadow: "0 2px 8px rgba(0, 149, 48, 0.35)",
            }}
          >
            <ElectricBoltIcon fontSize="medium" />
          </Box>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#1E293B", letterSpacing: -0.3 }}>
                Schneider <span style={{ color: "#009530" }}>Electric</span>
              </Typography>
              <Chip
                label="EcoStruxure™ AI"
                size="small"
                sx={{
                  bgcolor: "#E8F5E9",
                  color: "#007A27",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  height: 22,
                }}
              />
            </Box>
            <Typography variant="caption" sx={{ color: "#64748B", display: "block" }}>
              Autonomous HVAC & Peak Tariff Optimizer
            </Typography>
          </Box>
        </Box>

        {/* Action Controls */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* Optimization Mode Toggle */}
          <Button
            size="small"
            variant="outlined"
            startIcon={<TuneIcon />}
            onClick={onToggleMode}
            sx={{
              borderColor: optimizationMode === "eco" ? "#009530" : "#2563EB",
              color: optimizationMode === "eco" ? "#009530" : "#2563EB",
              bgcolor: optimizationMode === "eco" ? "rgba(0, 149, 48, 0.05)" : "rgba(37, 99, 235, 0.05)",
              display: { xs: "none", sm: "inline-flex" }
            }}
          >
            Mode: {optimizationMode === "eco" ? "Maximum Eco (Energy)" : "Comfort Priority"}
          </Button>

          {/* Export Report */}
          <Button
            size="small"
            variant="contained"
            color="primary"
            startIcon={<FileDownloadIcon />}
            onClick={onOpenExport}
            sx={{
              bgcolor: "#009530",
              "&:hover": { bgcolor: "#007A27" },
              fontWeight: 600,
            }}
          >
            Export Logs
          </Button>

          {/* Refresh Telemetry */}
          <Tooltip title="Refresh BMS Telemetry">
            <IconButton onClick={onRefresh} size="small" sx={{ border: "1px solid #E2E8F0" }}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
