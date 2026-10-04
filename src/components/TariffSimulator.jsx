import React, { useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Slider,
  Grid,
  Chip,
  Divider,
  Stack
} from "@mui/material";
import CalculateIcon from "@mui/icons-material/Calculate";
import SavingsIcon from "@mui/icons-material/Savings";
import Co2Icon from "@mui/icons-material/Co2";
import SpeedIcon from "@mui/icons-material/Speed";

export default function TariffSimulator() {
  const [precoolHours, setPrecoolHours] = useState(1.5);
  const [tempDrift, setTempDrift] = useState(1.5);
  const [peakRate, setPeakRate] = useState(0.42); // $ / kWh

  const offPeakRate = 0.12; // $ / kWh
  const rateDelta = peakRate - offPeakRate;

  // Realistic HVAC thermodynamic calculation
  const shiftedKwh = ((precoolHours * 3.8) + (tempDrift * 2.2)).toFixed(1);
  const dailySavings = (shiftedKwh * rateDelta).toFixed(2);
  const monthlySavings = (dailySavings * 22).toFixed(2); // 22 work days
  const co2AvoidedKg = (shiftedKwh * 0.417 * 22).toFixed(1); // 0.417 kg CO2/kWh

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
          <CalculateIcon sx={{ color: "#009530" }} />
          <div>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#1E293B" }}>
              Time-of-Use (TOU) Tariff & Load Shifting Simulator
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Model financial impact of pre-cooling building thermal mass before peak tariff windows
            </Typography>
          </div>
        </Box>
        <Chip
          label="Optimization Engine"
          size="small"
          sx={{ bgcolor: "#E0F2FE", color: "#0369A1", fontWeight: 700 }}
        />
      </Box>

      <Grid container spacing={3}>
        {/* Controls Column */}
        <Grid item xs={12} md={7}>
          <Box sx={{ mb: 2.5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155" }}>
                Pre-Cooling Duration Ahead of Peak
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: "#009530" }}>
                {precoolHours} hrs (starts at 10:30 AM)
              </Typography>
            </Box>
            <Slider
              value={precoolHours}
              min={0.5}
              max={3.0}
              step={0.5}
              marks
              onChange={(e, val) => setPrecoolHours(val)}
              sx={{ color: "#009530" }}
            />
          </Box>

          <Box sx={{ mb: 2.5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155" }}>
                Allowed Afternoon Setpoint Drift
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: "#009530" }}>
                +{tempDrift}°C (Max allowable by ASHRAE 55)
              </Typography>
            </Box>
            <Slider
              value={tempDrift}
              min={0.5}
              max={3.0}
              step={0.5}
              marks
              onChange={(e, val) => setTempDrift(val)}
              sx={{ color: "#009530" }}
            />
          </Box>

          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155" }}>
                Utility Peak Demand Tariff
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: "#009530" }}>
                ${peakRate.toFixed(2)} / kWh (Off-Peak: ${offPeakRate}/kWh)
              </Typography>
            </Box>
            <Slider
              value={peakRate}
              min={0.25}
              max={0.75}
              step={0.05}
              marks
              onChange={(e, val) => setPeakRate(val)}
              sx={{ color: "#009530" }}
            />
          </Box>
        </Grid>

        {/* Projected Outcome Cards */}
        <Grid item xs={12} md={5}>
          <Box
            sx={{
              p: 2.2,
              borderRadius: 2.5,
              bgcolor: "#F8FAFC",
              border: "1px solid #E2E8F0",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <div>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>
                Projected AI Returns
              </Typography>

              <Box sx={{ my: 1.5 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <SavingsIcon sx={{ color: "#009530", fontSize: 28 }} />
                  <div>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: "#009530" }}>
                      ${monthlySavings} / mo
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Estimated monthly utility bill reduction (${dailySavings}/day)
                    </Typography>
                  </div>
                </Stack>
              </Box>

              <Divider sx={{ my: 1.5 }} />

              <Stack spacing={1}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body2" sx={{ color: "#475569", display: "flex", alignItems: "center", gap: 0.5 }}>
                    <SpeedIcon fontSize="small" sx={{ color: "#0284C7" }} /> Peak Load Shifted:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "#1E293B" }}>
                    {shiftedKwh} kWh / cycle
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body2" sx={{ color: "#475569", display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Co2Icon fontSize="medium" sx={{ color: "#166534" }} /> Avoided Carbon:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "#166534" }}>
                    {co2AvoidedKg} kg CO₂e / mo
                  </Typography>
                </Box>
              </Stack>
            </div>

            <Chip
              label="Schneider Electric EcoStruxure Validated"
              size="small"
              sx={{ bgcolor: "#DCFCE7", color: "#166534", fontWeight: 700, mt: 1.5 }}
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
