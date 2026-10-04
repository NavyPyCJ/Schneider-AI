import React, { useState } from "react";
import {
  Paper,
  Typography,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
  Chip
} from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";
import InsightsIcon from "@mui/icons-material/Insights";
import { SAVINGS_CHART_DATA } from "../services/bmsService";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function SavingsTracker() {
  const [period, setPeriod] = useState("weekly");
  const [metric, setMetric] = useState("kwh"); // "kwh" | "cost"

  const rawData = SAVINGS_CHART_DATA[period];

  const isKwh = metric === "kwh";
  const baselineData = isKwh ? rawData.baseline : rawData.costBaseline;
  const actualData = isKwh ? rawData.actual : rawData.costActual;
  const unit = isKwh ? "kWh" : "$";

  const totalBaseline = baselineData.reduce((a, b) => a + b, 0);
  const totalActual = actualData.reduce((a, b) => a + b, 0);
  const totalSaved = (totalBaseline - totalActual).toFixed(1);
  const percentSaved = ((totalSaved / totalBaseline) * 100).toFixed(1);

  const chartData = {
    labels: rawData.labels,
    datasets: [
      {
        label: isKwh ? "Baseline Model (kWh)" : "Standard Tariff Cost ($)",
        data: baselineData,
        borderColor: "#94A3B8",
        borderDash: [5, 5],
        borderWidth: 2,
        backgroundColor: "transparent",
        pointBackgroundColor: "#94A3B8",
        tension: 0.35,
      },
      {
        label: isKwh ? "AI-Optimized Actual (kWh)" : "Optimized Cost ($)",
        data: actualData,
        borderColor: "#009530",
        borderWidth: 2.5,
        backgroundColor: "rgba(0, 149, 48, 0.12)",
        fill: true,
        pointBackgroundColor: "#009530",
        pointHoverRadius: 6,
        tension: 0.35,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { family: "Inter", size: 12, weight: "500" },
          usePointStyle: true,
        }
      },
      tooltip: {
        backgroundColor: "#1E293B",
        titleFont: { family: "Inter", weight: "700" },
        bodyFont: { family: "Inter" },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => ` ${context.dataset.label}: ${isKwh ? "" : "$"}${context.raw} ${isKwh ? "kWh" : ""}`
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: isKwh ? "Energy Consumption (kWh)" : "Cost (USD $)",
          font: { family: "Inter", weight: "600", size: 11 },
          color: "#64748B"
        },
        grid: { color: "#F1F5F9" },
        ticks: { font: { family: "Inter", size: 11 }, color: "#64748B" }
      },
      x: {
        grid: { display: false },
        ticks: { font: { family: "Inter", size: 11 }, color: "#64748B" }
      }
    }
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
      {/* Title & Controls */}
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 1.5, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <InsightsIcon sx={{ color: "#009530" }} />
          <div>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#1E293B" }}>
              Savings Tracker
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Comparing thermodynamic baseline vs. autonomous AI setpoints
            </Typography>
          </div>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          {/* Metric Toggle */}
          <ToggleButtonGroup
            size="small"
            value={metric}
            exclusive
            onChange={(e, val) => val && setMetric(val)}
            sx={{ height: 32 }}
          >
            <ToggleButton value="kwh" sx={{ px: 1.5, fontSize: "0.75rem", fontWeight: 700 }}>
              Energy (kWh)
            </ToggleButton>
            <ToggleButton value="cost" sx={{ px: 1.5, fontSize: "0.75rem", fontWeight: 700 }}>
              Cost ($)
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Period Toggle */}
          <ToggleButtonGroup
            size="small"
            value={period}
            exclusive
            onChange={(e, val) => val && setPeriod(val)}
            sx={{ height: 32 }}
          >
            <ToggleButton value="daily" sx={{ px: 1.2, fontSize: "0.75rem" }}>Day</ToggleButton>
            <ToggleButton value="weekly" sx={{ px: 1.2, fontSize: "0.75rem" }}>Week</ToggleButton>
            <ToggleButton value="monthly" sx={{ px: 1.2, fontSize: "0.75rem" }}>Month</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Box>

      {/* Summary Highlight Pill */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 1.2,
          px: 2,
          borderRadius: 2,
          bgcolor: "#F0FDF4",
          border: "1px solid #DCFCE7",
          mb: 2,
        }}
      >
        <Typography variant="body2" sx={{ color: "#166534", fontWeight: 600 }}>
          Cumulative Net Savings:
        </Typography>
        <Chip
          label={`${isKwh ? "" : "$"}${totalSaved} ${isKwh ? "kWh" : ""}`}
          size="small"
          sx={{ bgcolor: "#009530", color: "#FFF", fontWeight: 800 }}
        />
        <Typography variant="caption" sx={{ color: "#166534" }}>
          ({percentSaved}% reduction against baseline)
        </Typography>
      </Box>

      {/* Chart Canvas */}
      <Box sx={{ height: 260, position: "relative" }}>
        <Line data={chartData} options={chartOptions} />
      </Box>
    </Paper>
  );
}
