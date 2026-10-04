import React, { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Container, Grid } from "@mui/material";

import { schneiderTheme } from "./theme/schneiderTheme";
import {
  INITIAL_ZONES,
  INITIAL_ACTIONS,
  INITIAL_ALERTS
} from "./services/bmsService";

import Header from "./components/Header";
import KPICards from "./components/KPICards";
import ActionsFeed from "./components/ActionsFeed";
import InteractiveFloorPlan from "./components/InteractiveFloorPlan";
import SavingsTracker from "./components/SavingsTracker";
import TariffSimulator from "./components/TariffSimulator";
import AlertsManager from "./components/AlertsManager";
import ExportDialog from "./components/ExportDialog";

export default function App() {
  const [zones, setZones] = useState(INITIAL_ZONES);
  const [actions, setActions] = useState(INITIAL_ACTIONS);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [selectedZoneId, setSelectedZoneId] = useState(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [optimizationMode, setOptimizationMode] = useState("eco"); // "eco" | "comfort"

  // Handle AI Override toggle
  const handleOverride = (actionId) => {
    setActions((prev) =>
      prev.map((a) => {
        if (a.id !== actionId) return a;
        const newOverridden = !a.overridden;
        return {
          ...a,
          overridden: newOverridden,
          comfort: newOverridden ? a.comfort + 5 : a.comfort - 5,
          energy: newOverridden ? a.energy + 25 : a.energy - 25,
        };
      })
    );
  };

  // Handle Hot / Cold occupant feedback
  const handleFeedback = (actionId, type) => {
    setActions((prev) =>
      prev.map((a) => {
        if (a.id !== actionId) return a;
        const delta = type === "hot" ? -4 : -3;
        const updatedComfort = Math.max(25, Math.min(100, a.comfort + delta));
        return {
          ...a,
          feedback: {
            ...a.feedback,
            [type]: a.feedback[type] + 1
          },
          comfort: updatedComfort
        };
      })
    );
  };

  // Acknowledge Alert
  const handleAcknowledgeAlert = (alertId) => {
    setAlerts((prev) =>
      prev.map((alt) =>
        alt.id === alertId ? { ...alt, acknowledged: true } : alt
      )
    );
  };

  // Toggle optimization mode
  const handleToggleMode = () => {
    const nextMode = optimizationMode === "eco" ? "comfort" : "eco";
    setOptimizationMode(nextMode);

    // Adjust target setpoints dynamically based on policy
    setZones((prev) =>
      prev.map((z) => ({
        ...z,
        targetTemp: nextMode === "eco" ? +(z.targetTemp + 0.8).toFixed(1) : +(z.targetTemp - 0.8).toFixed(1)
      }))
    );
  };

  // Simulate refresh / telemetry tick
  const handleRefresh = () => {
    setZones((prev) =>
      prev.map((z) => {
        const jitter = (Math.random() * 0.4 - 0.2);
        return {
          ...z,
          currentTemp: +(z.currentTemp + jitter).toFixed(1),
          powerDrawKw: +(z.powerDrawKw + (Math.random() * 0.6 - 0.3)).toFixed(1)
        };
      })
    );
  };

  return (
    <ThemeProvider theme={schneiderTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "#F8FAFC", display: "flex", flexDirection: "column" }}>
        {/* Navigation & Header */}
        <Header
          onOpenExport={() => setExportOpen(true)}
          onToggleMode={handleToggleMode}
          optimizationMode={optimizationMode}
          onRefresh={handleRefresh}
        />

        {/* Main Content Area */}
        <Container maxWidth="xl" sx={{ py: 3, flex: 1 }}>
          {/* Top KPI Metric Cards */}
          <KPICards actions={actions} zones={zones} />

          {/* Core Dashboard Grid */}
          <Grid container spacing={3}>
            {/* Left Column: Actions Feed & Alerts */}
            <Grid item xs={12} lg={6}>
              <ActionsFeed
                actions={actions}
                onOverride={handleOverride}
                onFeedback={handleFeedback}
                selectedZoneId={selectedZoneId}
                onSelectZone={(id) => setSelectedZoneId(selectedZoneId === id ? null : id)}
              />

              <Box sx={{ mt: 3 }}>
                <AlertsManager
                  alerts={alerts}
                  onAcknowledge={handleAcknowledgeAlert}
                />
              </Box>
            </Grid>

            {/* Right Column: Floor Map, Savings Chart, and Tariff Simulator */}
            <Grid item xs={12} lg={6}>
              {/* Interactive Floor Plan */}
              <InteractiveFloorPlan
                zones={zones}
                selectedZoneId={selectedZoneId}
                onSelectZone={(id) => setSelectedZoneId(selectedZoneId === id ? null : id)}
              />

              {/* Savings Tracker Line/Area Chart */}
              <SavingsTracker />

              {/* Time-Of-Use Tariff Simulator */}
              <TariffSimulator />
            </Grid>
          </Grid>
        </Container>

        {/* Export Modal Dialog */}
        <ExportDialog
          open={exportOpen}
          onClose={() => setExportOpen(false)}
          zones={zones}
          actions={actions}
        />
      </Box>
    </ThemeProvider>
  );
}
