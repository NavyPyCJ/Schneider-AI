// BMS & HVAC AI Service Layer
// Designed to connect to Python FastAPI / BACnet server in Phase 2

export const INITIAL_ZONES = [
  {
    id: "zone-1",
    name: "Conference Room B",
    currentTemp: 24.8,
    targetTemp: 26.0,
    humidity: 48,
    occupancy: 3,
    capacity: 18,
    status: "optimizing", // "optimizing" | "stable" | "warning" | "overridden"
    powerDrawKw: 4.2,
    comfortScore: 74,
    thermalMassMins: 40,
    coordinates: { x: 50, y: 40, width: 200, height: 140 }
  },
  {
    id: "zone-2",
    name: "Executive Suite 4",
    currentTemp: 23.2,
    targetTemp: 23.5,
    humidity: 45,
    occupancy: 2,
    capacity: 6,
    status: "stable",
    powerDrawKw: 2.1,
    comfortScore: 88,
    thermalMassMins: 55,
    coordinates: { x: 280, y: 40, width: 170, height: 140 }
  },
  {
    id: "zone-3",
    name: "Open Workspace West",
    currentTemp: 25.1,
    targetTemp: 24.5,
    humidity: 52,
    occupancy: 24,
    capacity: 35,
    status: "optimizing",
    powerDrawKw: 11.8,
    comfortScore: 81,
    thermalMassMins: 25,
    coordinates: { x: 50, y: 210, width: 400, height: 160 }
  },
  {
    id: "zone-4",
    name: "Server Room A",
    currentTemp: 21.0,
    targetTemp: 20.5,
    humidity: 40,
    occupancy: 0,
    capacity: 2,
    status: "warning",
    powerDrawKw: 18.5,
    comfortScore: 95,
    thermalMassMins: 15,
    coordinates: { x: 480, y: 40, width: 180, height: 330 }
  }
];

export const INITIAL_ACTIONS = [
  {
    id: 1,
    zoneId: "zone-1",
    zone: "Conference Room B",
    action: "Temp set 24°C → 26°C",
    reasons: [
      "Only 3 people present (17% capacity)",
      "Room thermal inertia retains cool ~40 mins",
      "Peak tariff period begins at 12:00",
      "Projected savings: 1.8 kWh ($0.58)"
    ],
    overridden: false,
    feedback: { hot: 0, cold: 0 },
    comfort: 74,
    energy: 40,
    timestamp: "10:15 AM"
  },
  {
    id: 2,
    zoneId: "zone-3",
    zone: "Open Workspace West",
    action: "Pre-cooling activated: 25°C → 23°C",
    reasons: [
      "Solar radiation peak forecast at 13:00",
      "Pre-cooling prior to $0.42/kWh peak tariff",
      "Expected load shift: 3.4 kWh",
      "Avoids $1.43 demand surcharge"
    ],
    overridden: false,
    feedback: { hot: 1, cold: 0 },
    comfort: 83,
    energy: 65,
    timestamp: "10:20 AM"
  },
  {
    id: 3,
    zoneId: "zone-2",
    zone: "Executive Suite 4",
    action: "Airflow CFM modulated: 80% → 55%",
    reasons: [
      "Target setpoint reached (23.5°C)",
      "VAV damper stepped down for static pressure efficiency",
      "Expected savings: 0.9 kWh"
    ],
    overridden: false,
    feedback: { hot: 0, cold: 0 },
    comfort: 88,
    energy: 30,
    timestamp: "10:25 AM"
  }
];

export const INITIAL_ALERTS = [
  {
    id: "alt-101",
    severity: "error", // "error" | "warning" | "info"
    title: "Server Room A Temp Threshold Approaching",
    message: "Rack ambient temperature reached 21.0°C (Limit: 22.0°C). CRAC Unit 2 duty cycle at 85%.",
    time: "10:28 AM",
    acknowledged: false
  },
  {
    id: "alt-102",
    severity: "warning",
    title: "Conference Room B Humidity Fluctuation",
    message: "Zone RH measured 48%. Economizer cycle dampening outdoor intake.",
    time: "09:50 AM",
    acknowledged: false
  },
  {
    id: "alt-103",
    severity: "info",
    title: "Automated Demand Response (ADR) Armed",
    message: "Utility peak event signaled for 14:00 - 17:00. Pre-conditioning thermal load active.",
    time: "09:00 AM",
    acknowledged: true
  }
];

export const SAVINGS_CHART_DATA = {
  daily: {
    labels: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"],
    baseline: [42, 58, 75, 82, 68, 45],
    actual: [36, 44, 52, 61, 50, 38],
    costBaseline: [8.4, 11.6, 26.2, 34.4, 23.8, 9.0],
    costActual: [7.2, 8.8, 18.2, 25.6, 17.5, 7.6]
  },
  weekly: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    baseline: [120, 115, 130, 125, 140],
    actual: [100, 95, 110, 105, 115],
    costBaseline: [42.0, 40.25, 45.5, 43.75, 49.0],
    costActual: [35.0, 33.25, 38.5, 36.75, 40.25]
  },
  monthly: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    baseline: [630, 650, 620, 680],
    actual: [520, 535, 510, 560],
    costBaseline: [220.5, 227.5, 217.0, 238.0],
    costActual: [182.0, 187.25, 178.5, 196.0]
  }
};

// Export helper for CSV download
export function exportSavingsCSV(data, period = "weekly") {
  const dataset = data[period];
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Timeframe,Baseline_kWh,Actual_kWh,Savings_kWh,Baseline_Cost_USD,Actual_Cost_USD,Savings_USD\n";

  dataset.labels.forEach((label, i) => {
    const kwhBase = dataset.baseline[i];
    const kwhAct = dataset.actual[i];
    const kwhSave = (kwhBase - kwhAct).toFixed(1);
    const costBase = dataset.costBaseline[i].toFixed(2);
    const costAct = dataset.costActual[i].toFixed(2);
    const costSave = (costBase - costAct).toFixed(2);
    csvContent += `${label},${kwhBase},${kwhAct},${kwhSave},${costBase},${costAct},${costSave}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Schneider_AI_Energy_Report_${period}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export helper for BACnet / BMS JSON format
export function exportBACnetJSON(zones, actions) {
  const bacnetPayload = {
    protocol: "BACnet/IP (ISO 16484-5)",
    system: "Schneider Electric EcoStruxure Building Operation",
    generatedAt: new Date().toISOString(),
    objects: zones.map((z, idx) => ({
      objectIdentifier: `device:${1000 + idx}`,
      objectName: z.name,
      analogValues: [
        { id: "AV:1", description: "Space Temperature", presentValue: z.currentTemp, units: "degreesCelsius" },
        { id: "AV:2", description: "Active Setpoint", presentValue: z.targetTemp, units: "degreesCelsius" },
        { id: "AV:3", description: "Power Demand", presentValue: z.powerDrawKw, units: "kilowatts" },
        { id: "AV:4", description: "Relative Humidity", presentValue: z.humidity, units: "percentRelativeHumidity" },
        { id: "AV:5", description: "Comfort PMV Index", presentValue: z.comfortScore, units: "percent" }
      ],
      binaryValues: [
        {
          id: "BV:1",
          description: "AI Autonomous Mode",
          presentValue: actions.find(a => a.zoneId === z.id)?.overridden ? "INACTIVE" : "ACTIVE"
        }
      ]
    }))
  };

  const jsonString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bacnetPayload, null, 2));
  const link = document.createElement("a");
  link.setAttribute("href", jsonString);
  link.setAttribute("download", `BACnet_BMS_Telemetry_${Date.now()}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
