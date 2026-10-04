import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  LinearProgress,
  Chip,
  Divider,
  Stack
} from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PanToolIcon from "@mui/icons-material/PanTool";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function ActionsFeed({ actions, onOverride, onFeedback, selectedZoneId, onSelectZone }) {
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <SmartToyIcon sx={{ color: "#009530" }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1E293B" }}>
            AI Optimization Feed
          </Typography>
        </Box>
        <Chip
          label={`${actions.length} Recommendations`}
          size="small"
          sx={{ bgcolor: "#F1F5F9", fontWeight: 600, color: "#475569" }}
        />
      </Box>

      {actions.map((action) => {
        const isSelected = selectedZoneId === action.zoneId;

        return (
          <Card
            key={action.id}
            elevation={0}
            onClick={() => onSelectZone && onSelectZone(action.zoneId)}
            sx={{
              mb: 2.5,
              borderRadius: 3,
              cursor: "pointer",
              border: isSelected ? "2px solid #009530" : "1px solid #E2E8F0",
              borderLeft: action.overridden
                ? "5px solid #94A3B8"
                : "5px solid #009530",
              bgcolor: isSelected ? "#F0FDF4" : "#FFFFFF",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
              },
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              {/* Header row: Zone & Status */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.05rem", color: "#0F172A" }}>
                    {action.zone}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ color: "#009530", fontWeight: 700, mt: 0.2 }}>
                    {action.action}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#94A3B8", fontSize: "0.75rem" }}>
                    <AccessTimeIcon sx={{ fontSize: "0.9rem" }} />
                    <span>{action.timestamp || "Active"}</span>
                  </Box>
                  <Chip
                    size="small"
                    label={action.overridden ? "Manual Override" : "Autonomous"}
                    sx={{
                      bgcolor: action.overridden ? "#F1F5F9" : "#DCFCE7",
                      color: action.overridden ? "#64748B" : "#166534",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                    }}
                  />
                </Stack>
              </Box>

              {/* Decision Rationale */}
              <Box
                sx={{
                  bgcolor: isSelected ? "#DCFCE7" : "#F8FAFC",
                  p: 1.5,
                  borderRadius: 2,
                  my: 1.5,
                  border: "1px solid #E2E8F0",
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  AI Decision Rationale & Telemetry:
                </Typography>
                <Box component="ul" sx={{ pl: 2.5, m: 0.5, fontSize: "0.85rem", color: "#334155" }}>
                  {action.reasons.map((r, i) => (
                    <li key={i} style={{ marginBottom: "2px" }}>
                      {r}
                    </li>
                  ))}
                </Box>
              </Box>

              {/* Gauges */}
              <Box sx={{ my: 1.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: "#475569" }}>
                    Comfort Index (Predicted Mean Vote)
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: action.comfort >= 70 ? "#009530" : "#D97706" }}>
                    {action.comfort}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={action.comfort}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: "#E2E8F0",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: action.comfort >= 70 ? "#009530" : "#F59E0B",
                    },
                  }}
                />

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1.5, mb: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: "#475569" }}>
                    HVAC Power Demand
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#1E293B" }}>
                    {action.energy}% Load
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={action.energy}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: "#E2E8F0",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: "#1E293B",
                    },
                  }}
                />
              </Box>

              <Divider sx={{ my: 1.8 }} />

              {/* Action & Feedback Buttons */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.2, alignItems: "center" }}>
                <Button
                  size="small"
                  variant={action.overridden ? "outlined" : "contained"}
                  startIcon={action.overridden ? <SmartToyIcon /> : <PanToolIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOverride(action.id);
                  }}
                  sx={{
                    bgcolor: action.overridden ? "transparent" : "#009530",
                    color: action.overridden ? "#475569" : "#FFF",
                    borderColor: "#CBD5E1",
                    "&:hover": {
                      bgcolor: action.overridden ? "#F1F5F9" : "#007A27",
                    },
                  }}
                >
                  {action.overridden ? "Resume AI Control" : "Override AI"}
                </Button>

                <Button
                  size="small"
                  variant="outlined"
                  color="warning"
                  startIcon={<WhatshotIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onFeedback(action.id, "hot");
                  }}
                  sx={{ borderColor: "#FDBA74", color: "#C2410C" }}
                >
                  Too Hot ({action.feedback.hot})
                </Button>

                <Button
                  size="small"
                  variant="outlined"
                  color="info"
                  startIcon={<AcUnitIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onFeedback(action.id, "cold");
                  }}
                  sx={{ borderColor: "#BAE6FD", color: "#0369A1" }}
                >
                  Too Cold ({action.feedback.cold})
                </Button>
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}
