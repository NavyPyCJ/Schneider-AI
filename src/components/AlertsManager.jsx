import React, { useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Alert,
  AlertTitle,
  Button,
  Chip,
  Stack,
  IconButton
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DoneAllIcon from "@mui/icons-material/DoneAll";

export default function AlertsManager({ alerts, onAcknowledge, onDismiss }) {
  const [filter, setFilter] = useState("all"); // "all" | "active"

  const filteredAlerts = alerts.filter(a => {
    if (filter === "active") return !a.acknowledged;
    return true;
  });

  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.8,
        borderRadius: 3,
        border: "1px solid #E2E8F0",
        bgcolor: "#FFFFFF",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <NotificationsActiveIcon sx={{ color: unacknowledgedCount > 0 ? "#EF4444" : "#009530" }} />
          <div>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#1E293B" }}>
              BMS Building Alarms & Events
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Real-time threshold telemetry and demand response signals
            </Typography>
          </div>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            label={unacknowledgedCount > 0 ? `${unacknowledgedCount} Unacknowledged` : "All Clear"}
            color={unacknowledgedCount > 0 ? "error" : "success"}
            size="small"
            sx={{ fontWeight: 700 }}
          />
          <Button
            size="small"
            variant="text"
            onClick={() => setFilter(filter === "all" ? "active" : "all")}
            sx={{ fontSize: "0.75rem", color: "#64748B" }}
          >
            {filter === "all" ? "Show Active Only" : "Show All"}
          </Button>
        </Stack>
      </Box>

      {filteredAlerts.length === 0 ? (
        <Box sx={{ py: 3, textAlign: "center", color: "#94A3B8" }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 40, color: "#10B981", mb: 1 }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            No unacknowledged building alarms.
          </Typography>
        </Box>
      ) : (
        <Stack spacing={1.5}>
          {filteredAlerts.map((alert) => (
            <Alert
              key={alert.id}
              severity={alert.severity}
              variant="outlined"
              sx={{
                borderRadius: 2,
                bgcolor: alert.acknowledged ? "#F8FAFC" : undefined,
                opacity: alert.acknowledged ? 0.75 : 1,
                border: "1px solid",
                borderColor:
                  alert.severity === "error"
                    ? "#FCA5A5"
                    : alert.severity === "warning"
                    ? "#FCD34D"
                    : "#BAE6FD"
              }}
              action={
                !alert.acknowledged ? (
                  <Button
                    color="inherit"
                    size="small"
                    startIcon={<DoneAllIcon />}
                    onClick={() => onAcknowledge(alert.id)}
                    sx={{ fontSize: "0.75rem", fontWeight: 700 }}
                  >
                    Acknowledge
                  </Button>
                ) : (
                  <Chip label="Acknowledged" size="small" variant="outlined" sx={{ fontSize: "0.7rem", height: 20 }} />
                )
              }
            >
              <AlertTitle sx={{ fontWeight: 700, fontSize: "0.9rem", mb: 0.2 }}>
                {alert.title}
                <Typography component="span" variant="caption" sx={{ ml: 1, color: "text.secondary" }}>
                  • {alert.time}
                </Typography>
              </AlertTitle>
              <Typography variant="body2" sx={{ fontSize: "0.825rem", color: "#334155" }}>
                {alert.message}
              </Typography>
            </Alert>
          ))}
        </Stack>
      )}
    </Paper>
  );
}
