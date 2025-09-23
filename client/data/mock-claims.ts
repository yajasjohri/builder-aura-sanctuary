export type ClaimStatus = "Pending" | "Claimed" | "Rejected";
export type Claim = {
  id: string;
  claimant: string;
  village: string;
  state: "Madhya Pradesh" | "Tripura" | "Odisha" | "Telangana";
  areaHa: number;
  status: ClaimStatus;
  submittedAt: string; // ISO date
};

export const claims: Claim[] = [
  {
    id: "MP-001",
    claimant: "Asha Devi",
    village: "Sehore",
    state: "Madhya Pradesh",
    areaHa: 2.3,
    status: "Pending",
    submittedAt: "2025-06-01",
  },
  {
    id: "MP-002",
    claimant: "Rakesh",
    village: "Betul",
    state: "Madhya Pradesh",
    areaHa: 1.1,
    status: "Claimed",
    submittedAt: "2025-05-15",
  },
  {
    id: "TR-101",
    claimant: "Deb",
    village: "Udaipur",
    state: "Tripura",
    areaHa: 0.8,
    status: "Rejected",
    submittedAt: "2025-04-21",
  },
  {
    id: "OD-050",
    claimant: "Sita",
    village: "Koraput",
    state: "Odisha",
    areaHa: 3.6,
    status: "Pending",
    submittedAt: "2025-06-12",
  },
  {
    id: "TG-210",
    claimant: "Ravi",
    village: "Nizamabad",
    state: "Telangana",
    areaHa: 1.9,
    status: "Claimed",
    submittedAt: "2025-05-25",
  },
  {
    id: "OD-099",
    claimant: "Manoj",
    village: "Kendujhar",
    state: "Odisha",
    areaHa: 2.0,
    status: "Rejected",
    submittedAt: "2025-05-05",
  },
  {
    id: "TR-111",
    claimant: "Rima",
    village: "Agartala",
    state: "Tripura",
    areaHa: 1.2,
    status: "Pending",
    submittedAt: "2025-06-18",
  },
  {
    id: "TG-220",
    claimant: "Lakshmi",
    village: "Warangal",
    state: "Telangana",
    areaHa: 0.9,
    status: "Pending",
    submittedAt: "2025-06-10",
  },
  {
    id: "MP-010",
    claimant: "Om",
    village: "Chhindwara",
    state: "Madhya Pradesh",
    areaHa: 4.2,
    status: "Rejected",
    submittedAt: "2025-04-30",
  },
  {
    id: "OD-120",
    claimant: "Geeta",
    village: "Mayurbhanj",
    state: "Odisha",
    areaHa: 1.5,
    status: "Claimed",
    submittedAt: "2025-06-05",
  },
];

export const STATES = [
  "Madhya Pradesh",
  "Tripura",
  "Odisha",
  "Telangana",
] as const;
export type StateName = (typeof STATES)[number];

export function statsByState(data: Claim[]) {
  const base: Record<
    StateName,
    { Pending: number; Claimed: number; Rejected: number }
  > = {
    "Madhya Pradesh": { Pending: 0, Claimed: 0, Rejected: 0 },
    Tripura: { Pending: 0, Claimed: 0, Rejected: 0 },
    Odisha: { Pending: 0, Claimed: 0, Rejected: 0 },
    Telangana: { Pending: 0, Claimed: 0, Rejected: 0 },
  };
  for (const c of data) base[c.state][c.status]++;
  return base;
}
