import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  Tabs,
  Tab,
  Paper,
  Divider,
  Stack,
  Chip
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import TableChartIcon from "@mui/icons-material/TableChart";
import DataObjectIcon from "@mui/icons-material/DataObject";
import { exportSavingsCSV, exportBACnetJSON, SAVINGS_CHART_DATA } from "../services/bmsService";

export default function ExportDialog({ open, onClose, zones, actions }) {
  const [format, setFormat] = useState("csv"); // "csv" | "bacnet"
  const [period, setPeriod] = useState("weekly");

  const handleExport = () => {
    if (format === "csv") {
      exportSavingsCSV(SAVINGS_CHART_DATA, period);
    } else {
      exportBACnetJSON(zones, actions);
    }
    onClose();
  };

  const previewCSV = `Timeframe,Baseline_kWh,Actual_kWh,Savings_kWh,Baseline_Cost,Actual_Cost,Savings_USD
Mon,120,100,20.0,$42.00,$35.00,$7.00
Tue,115,95,20.0,$40.25,$33.25,$7.00
Wed,130,110,20.0,$45.50,$38.50,$7.00
Thu,125,105,20.0,$43.75,$36.75,$7.00
Fri,140,115,25.0,$49.00,$40.25,$8.75`;

  const previewBACnet = JSON.stringify({
    protocol: "BACnet/IP (ISO 16484-5)",
    system: "Schneider Electric EcoStruxure Building Operation",
    zone: zones[0]?.name || "Conference Room B",
    points: [
      { id: "AV:1", description: "Space Temperature", value: zones[0]?.currentTemp, unit: "°C" },
      { id: "AV:2", description: "Active Setpoint", value: zones[0]?.targetTemp, unit: "°C" },
      { id: "BV:1", description: "AI Autonomous Mode", state: "ACTIVE" }
    ]
  }, null, 2);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
      <DialogTitle sx={{ fontWeight: 800, pb: 1, color: "#1E293B" }}>
        Export Energy Telemetry & BMS Data
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Generate auditable reports for corporate ESG compliance or export BACnet point bindings for BMS controller integration.
        </Typography>

        {/* Format Selector */}
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            Select Output Format:
          </Typography>
          <RadioGroup row value={format} onChange={(e) => setFormat(e.target.value)}>
            <Paper
              variant="outlined"
              sx={{
                p: 1.5,
                mr: 2,
                borderRadius: 2,
                cursor: "pointer",
                border: format === "csv" ? "2px solid #009530" : "1px solid #E2E8F0",
                bgcolor: format === "csv" ? "#F0FDF4" : "#FFFFFF"
              }}
              onClick={() => setFormat("csv")}
            >
              <FormControlLabel
                value="csv"
                control={<Radio size="small" sx={{ color: "#009530", "&.Mui-checked": { color: "#009530" } }} />}
                label={
                  <Box>
                    <Typography variant="body2" fontWeight={700}>CSV Spreadsheet</Typography>
                    <Typography variant="caption" color="text.secondary">Facility energy & financial audit log</Typography>
                  </Box>
                }
              />
            </Paper>

            <Paper
              variant="outlined"
              sx={{
                p: 1.5,
                borderRadius: 2,
                cursor: "pointer",
                border: format === "bacnet" ? "2px solid #009530" : "1px solid #E2E8F0",
                bgcolor: format === "bacnet" ? "#F0FDF4" : "#FFFFFF"
              }}
              onClick={() => setFormat("bacnet")}
            >
              <FormControlLabel
                value="bacnet"
                control={<Radio size="small" sx={{ color: "#009530", "&.Mui-checked": { color: "#009530" } }} />}
                label={
                  <Box>
                    <Typography variant="body2" fontWeight={700}>BACnet / IP JSON</Typography>
                    <Typography variant="caption" color="text.secondary">Building Automation System payload</Typography>
                  </Box>
                }
              />
            </Paper>
          </RadioGroup>
        </Box>

        {format === "csv" && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.8 }}>
              Time Aggregation:
            </Typography>
            <Stack direction="row" spacing={1}>
              {["daily", "weekly", "monthly"].map((p) => (
                <Chip
                  key={p}
                  label={p.charAt(0).toUpperCase() + p.slice(1)}
                  clickable
                  onClick={() => setPeriod(p)}
                  color={period === p ? "primary" : "default"}
                  variant={period === p ? "filled" : "outlined"}
                  sx={{
                    bgcolor: period === p ? "#009530" : undefined,
                    fontWeight: 600,
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}

        {/* Payload Preview */}
        <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", textTransform: "uppercase" }}>
          Payload Preview:
        </Typography>
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            mt: 0.5,
            bgcolor: "#0F172A",
            color: "#38BDF8",
            fontFamily: "monospace",
            fontSize: "0.78rem",
            borderRadius: 2,
            maxHeight: 140,
            overflowY: "auto",
            whiteSpace: "pre"
          }}
        >
          {format === "csv" ? previewCSV : previewBACnet}
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<FileDownloadIcon />}
          onClick={handleExport}
          sx={{
            bgcolor: "#009530",
            "&:hover": { bgcolor: "#007A27" },
            fontWeight: 700,
            px: 2.5
          }}
        >
          Download {format.toUpperCase()}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
