export type MilestoneStatus = "completed" | "in-progress" | "upcoming";
export type MilestoneColor = "red" | "blue" | "yellow" | "indigo";

export interface Milestone {
  id: number;
  step: string;
  date: string;
  title: string;
  desc: string;
  status: MilestoneStatus;
  color: MilestoneColor;
}

export const DEFAULT_MILESTONES: Milestone[] = [
  {
    id: 1,
    step: "01",
    date: "2025-09-01",
    title: "First Meeting at AluServices AS",
    desc: "Initial stakeholder alignment. Defined conference scope, goals, and preliminary budget envelope for the 19th NorCast iteration.",
    status: "completed",
    color: "red",
  },
  {
    id: 2,
    step: "02",
    date: "2025-10-15",
    title: "Finalizing the List of Invitees",
    desc: "Delegate roster confirmed. Capping strict, invite-only attendance at 130 industry professionals spanning 20 countries.",
    status: "completed",
    color: "blue",
  },
  {
    id: 3,
    step: "03",
    date: "2025-11-01",
    title: "Finalize Program and Conference Fee Decision",
    desc: "Schedule locked. Registration fee structure approved after AluServices AS steering committee review.",
    status: "completed",
    color: "yellow",
  },
  {
    id: 4,
    step: "04",
    date: "2025-12-01",
    title: "Send Invitations",
    desc: "Formal invitations dispatched with registration portal link and accommodation guidance for Clarion Hotel Tyholmen.",
    status: "upcoming",
    color: "blue",
  },
  {
    id: 5,
    step: "05",
    date: "2026-03-01",
    title: "Registration Deadline",
    desc: "All delegate registrations closed and confirmed. Final headcount submitted to the Arendal venue.",
    status: "upcoming",
    color: "indigo",
  },
  {
    id: 6,
    step: "06",
    date: "2026-05-15",
    title: "Deadline for Presentations",
    desc: "All speaker decks received, reviewed, and formatted for the main stage AV system.",
    status: "upcoming",
    color: "indigo",
  },
  {
    id: 7,
    step: "07",
    date: "2026-06-10",
    title: "NorCast Conference Execution",
    desc: "Main event executed. Panels, keynotes, and networking sessions delivered across two days at the Clarion Hotel Tyholmen.",
    status: "upcoming",
    color: "red",
  },
  {
    id: 8,
    step: "08",
    date: "2026-06-15",
    title: "Post-Conference Work",
    desc: "Thank-you communications dispatched. Proceedings compiled and distributed to all Nordic Aluminium Casthouse delegates.",
    status: "upcoming",
    color: "red",
  },
];

export const COLOR_MAP: Record<
  MilestoneColor,
  { hex: string; label: string; border: string; bg: string; glow: string }
> = {
  red: {
    hex: "#ef4444",
    label: "Red",
    border: "border-[#ef4444]",
    bg: "bg-[#ef444420]",
    glow: "239,68,68",
  },
  blue: {
    hex: "#3b82f6",
    label: "Blue",
    border: "border-[#3b82f6]",
    bg: "bg-[#3b82f620]",
    glow: "59,130,246",
  },
  yellow: {
    hex: "#eab308",
    label: "Yellow",
    border: "border-[#eab308]",
    bg: "bg-[#eab30820]",
    glow: "234,179,8",
  },
  indigo: {
    hex: "#4f6fd4",
    label: "Indigo",
    border: "border-[#4f6fd4]",
    bg: "bg-[#4f6fd420]",
    glow: "79,111,212",
  },
};

export const STATUS_LABELS: Record<MilestoneStatus, string> = {
  completed: "Completed",
  "in-progress": "In Progress",
  upcoming: "Upcoming",
};
