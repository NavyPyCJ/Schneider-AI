import React from "react";
import {
  Paper,
  Typography,
  Box,
  Chip,
  Grid,
  Tooltip
} from "@mui/material";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PersonIcon from "@mui/icons-material/Person";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";

export default function InteractiveFloorPlan({ zones, selectedZoneId, onSelectZone }) {
  const getZoneColor = (zone) => {
    if (zone.id === "zone-4") return { bg: "#FEF2F2", border: "#F87171", text: "#991B1B", label: "Cooling Max" };
    if (zone.currentTemp > zone.targetTemp + 0.5) return { bg: "#FFFBEB", border: "#FBBF24", text: "#92400E", label: "Pre-Cooling" };
    if (zone.status === "optimizing") return { bg: "#F0FDF4", border: "#4ADE80", text: "#166534", label: "Eco-Optimized" };
    return { bg: "#F8FAFC", border: "#CBD5E1", text: "#334155", label: "Stable" };
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.8,
        borderRadius: 3,
        border: "1px solid #E2E8F0",
        mb: 3,
        bgcolor: "#FFFFFF",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <MeetingRoomIcon sx={{ color: "#009530" }} />
          <div>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#1E293B" }}>
              Floor 2 Thermal Zone Map
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Real-time spatial micro-climate & occupancy topology
            </Typography>
          </div>
        </Box>
        <Chip
          label="Live BMS Telemetry"
          size="small"
          sx={{ bgcolor: "#DCFCE7", color: "#166534", fontWeight: 700 }}
        />
      </Box>

      {/* SVG Interactive Floorplan */}
      <Box
        sx={{
          width: "100%",
          height: 250,
          bgcolor: "#F8FAFC",
          borderRadius: 2.5,
          border: "1px dashed #CBD5E1",
          position: "relative",
          overflow: "hidden",
          p: 1
        }}
      >
        <svg
          viewBox="0 0 700 390"
          style={{ width: "100%", height: "100%", cursor: "pointer" }}
        >
          {/* Floor outline */}
          <rect x="20" y="20" width="660" height="350" rx="8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />

          {/* Zones */}
          {zones.map((zone) => {
            const isSelected = selectedZoneId === zone.id;
            const style = getZoneColor(zone);
            const { x, y, width, height } = zone.coordinates;

            return (
              <g
                key={zone.id}
                onClick={() => onSelectZone(zone.id)}
                style={{ transition: "all 0.2s ease" }}
              >
                {/* Zone rectangle */}
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  rx="6"
                  fill={isSelected ? "#DCFCE7" : style.bg}
                  stroke={isSelected ? "#009530" : style.border}
                  strokeWidth={isSelected ? 3 : 1.5}
                />

                {/* Zone Name */}
                <text
                  x={x + 12}
                  y={y + 24}
                  fill="#0F172A"
                  fontSize="13"
                  fontWeight="700"
                  fontFamily="Inter, sans-serif"
                >
                  {zone.name}
                </text>

                {/* Status tag */}
                <rect
                  x={x + 12}
                  y={y + 34}
                  width={style.label.length * 6.8 + 14}
                  height="18"
                  rx="9"
                  fill="#FFFFFF"
                  stroke={style.border}
                  strokeWidth="1"
                />
                <text
                  x={x + 19}
                  y={y + 46}
                  fill={style.text}
                  fontSize="9.5"
                  fontWeight="700"
                  fontFamily="Inter, sans-serif"
                >
                  {style.label}
                </text>

                {/* Current & Target Temp */}
                <text
                  x={x + 12}
                  y={y + 74}
                  fill="#1E293B"
                  fontSize="16"
                  fontWeight="800"
                  fontFamily="Inter, sans-serif"
                >
                  {zone.currentTemp}°C
                </text>
                <text
                  x={x + 72}
                  y={y + 74}
                  fill="#64748B"
                  fontSize="11"
                  fontWeight="500"
                  fontFamily="Inter, sans-serif"
                >
                  (Target: {zone.targetTemp}°C)
                </text>

                {/* Occupancy and Power */}
                <text
                  x={x + 12}
                  y={y + 100}
                  fill="#475569"
                  fontSize="11"
                  fontFamily="Inter, sans-serif"
                >
                  👥 {zone.occupancy} / {zone.capacity} occupants
                </text>
                <text
                  x={x + 12}
                  y={y + 118}
                  fill="#475569"
                  fontSize="11"
                  fontFamily="Inter, sans-serif"
                >
                  ⚡ {zone.powerDrawKw} kW draw
                </text>
              </g>
            );
          })}
        </svg>
      </Box>

      {/* Zone quick-select cards */}
      <Grid container spacing={1.5} sx={{ mt: 1 }}>
        {zones.map((zone) => {
          const isSelected = selectedZoneId === zone.id;
          return (
            <Grid item xs={6} sm={3} key={zone.id}>
              <Box
                onClick={() => onSelectZone(zone.id)}
                sx={{
                  p: 1.2,
                  borderRadius: 2,
                  border: isSelected ? "2px solid #009530" : "1px solid #E2E8F0",
                  bgcolor: isSelected ? "#F0FDF4" : "#F8FAFC",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.15s ease",
                  "&:hover": { bgcolor: "#F1F5F9" }
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 700, fontSize: "0.8rem", color: "#1E293B" }}>
                  {zone.name}
                </Typography>
                <Typography variant="caption" sx={{ color: "#009530", fontWeight: 700 }}>
                  {zone.currentTemp}°C → {zone.targetTemp}°C
                </Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
}
