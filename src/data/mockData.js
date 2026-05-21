export const initialActionItems = [
  {
    id: 1,
    client: "Stripe Enterprise",
    context: "APAC Payment Gateway outage affecting users - requires instant backup routing escalation.",
    timestamp: "08:42 AM",
    priority: "CRITICAL",
    risk: "HIGH",
    team: "Payments API",
    status: "PENDING"
  },
  {
    id: 2,
    client: "Tesla Logistics",
    context: "Gigafactory Berlin fleet telemetry delayed by 1500ms - requires temporary routing override.",
    timestamp: "08:51 AM",
    priority: "MEDIUM",
    risk: "MEDIUM",
    team: "Telemetry Grid",
    status: "PENDING"
  },
  {
    id: 3,
    client: "Linear Sync",
    context: "Database replica lagging by 8.4GB - requires manual checkpoint approval.",
    timestamp: "08:55 AM",
    priority: "HIGH",
    risk: "HIGH",
    team: "DB Core",
    status: "PENDING"
  },
  {
    id: 4,
    client: "Notion Enterprise",
    context: "S3 asset upload rate limit reached for premium workspace - request 5x quota expansion.",
    timestamp: "08:58 AM",
    priority: "LOW",
    risk: "LOW",
    team: "Infra Allocations",
    status: "PENDING"
  },
  {
    id: 5,
    client: "Palantir Foundry",
    context: "AI ingestion pipeline anomaly in data lineage graph - approve node exclusion.",
    timestamp: "09:02 AM",
    priority: "HIGH",
    risk: "MEDIUM",
    team: "Foundry Ops",
    status: "PENDING"
  }
];

export const mockAnomalies = [
  {
    id: 1,
    system: "Failed Transactions Ingress",
    severity: "CRITICAL",
    confidence: 98.4,
    time: "08:45 AM",
    status: "UNRESOLVED",
    trend: [12, 19, 35, 62, 85, 120, 185],
    details: "Sudden spike in declined credit card checkouts from APAC banks (error code 402/3DS). Potential gateway timeout or merchant credentials corruption."
  },
  {
    id: 2,
    system: "Auth Server Rate Ingress",
    severity: "WARNING",
    confidence: 89.2,
    time: "08:50 AM",
    status: "INVESTIGATING",
    trend: [5, 4, 6, 8, 20, 45, 30],
    details: "Unusual burst of brute-force-like login requests on endpoint `/api/auth/v2/login` coming from clustered IP range in Frankfurt region."
  },
  {
    id: 3,
    system: "API Ingress Latency",
    severity: "WARNING",
    confidence: 91.5,
    time: "08:53 AM",
    status: "MONITORING",
    trend: [200, 210, 205, 350, 480, 560, 520],
    details: "Average response latency at `/v1/charges` surged from standard 180ms to 540ms. Redis cache connection saturation detected."
  },
  {
    id: 4,
    system: "Inventory Sync Service",
    severity: "MINOR",
    confidence: 76.8,
    time: "08:59 AM",
    status: "RESOLVED",
    trend: [10, 8, 12, 14, 11, 8, 3],
    details: "Sync mismatch in global SKU repository. Secondary database replica failed to parse incoming delta events, causing a 12-minute stale state."
  }
];
