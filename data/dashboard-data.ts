export type PortalRole = "member" | "executive" | "admin"

export type PortalEvent = {
  id: string
  title: string
  category: string
  date: string
  time: string
  venue: string
  scope: string
  capacity: number
  registered: number
  status: "Upcoming" | "Ongoing" | "Completed"
  registration?: "Confirmed" | "Waitlisted" | "Not registered"
}

export const currentMember = {
  name: "Seyam Rahman",
  firstName: "Seyam",
  initials: "SR",
  uuid: "AR-053",
  role: "Financial Secretary",
  access: "executive" as PortalRole,
  department: "Computer Science & Engineering",
  shortDepartment: "CSE",
  batch: "HSC 2021",
  studentId: "2104018",
  session: "2021–22",
  email: "seyam.rahman@cuet.ac.bd",
  phone: "+880 1712 345 678",
  bloodGroup: "B+",
  address: "Pahartali, Chattogram",
  joined: "18 September 2023",
  validUntil: "31 December 2026",
  completion: 86,
}

export const memberStats = [
  { label: "Events attended", value: 12, detail: "+3 this session" },
  { label: "Projects joined", value: 4, detail: "2 currently active" },
  { label: "Volunteer hours", value: 68, detail: "Top 18% of members" },
  { label: "Research credits", value: 7, detail: "+2 since March" },
]

export const events: PortalEvent[] = [
  {
    id: "EVT-2501",
    title: "Bangladesh Rover Challenge 2026",
    category: "Competition",
    date: "12 Aug 2026",
    time: "09:00–18:00",
    venue: "CUET Central Field",
    scope: "National",
    capacity: 420,
    registered: 348,
    status: "Upcoming",
    registration: "Confirmed",
  },
  {
    id: "EVT-2502",
    title: "Orbital Mechanics Research Talk",
    category: "Research talk",
    date: "19 Aug 2026",
    time: "15:30–17:00",
    venue: "ECE Seminar Hall",
    scope: "Intra CUET",
    capacity: 120,
    registered: 91,
    status: "Upcoming",
    registration: "Not registered",
  },
  {
    id: "EVT-2503",
    title: "Embedded Systems Bootcamp",
    category: "Bootcamp",
    date: "27 Aug 2026",
    time: "10:00–16:00",
    venue: "Robotics Lab",
    scope: "Divisional",
    capacity: 80,
    registered: 80,
    status: "Upcoming",
    registration: "Waitlisted",
  },
  {
    id: "EVT-2418",
    title: "Autonomous Navigation Workshop",
    category: "Workshop",
    date: "22 Jun 2026",
    time: "10:00–15:00",
    venue: "ME Lab 2",
    scope: "Intra CUET",
    capacity: 60,
    registered: 58,
    status: "Completed",
    registration: "Confirmed",
  },
]

export const notifications = [
  {
    id: "n1",
    title: "Rover Challenge registration confirmed",
    body: "Your team Andromeda-7 is on the final participant list.",
    time: "12 minutes ago",
    kind: "event",
    unread: true,
  },
  {
    id: "n2",
    title: "Committee meeting moved",
    body: "The August finance review will begin at 7:30 PM in Room 311.",
    time: "2 hours ago",
    kind: "committee",
    unread: true,
  },
  {
    id: "n3",
    title: "Profile verification complete",
    body: "Your emergency contact and student ID have been verified.",
    time: "Yesterday",
    kind: "member",
    unread: false,
  },
  {
    id: "n4",
    title: "New publication available",
    body: "ASRRO Journal, Volume 04 is now available in the publication archive.",
    time: "29 Jul 2026",
    kind: "content",
    unread: false,
  },
]

export const memberApplications = [
  {
    id: "APP-1298",
    name: "Tanzila Noor",
    department: "EEE",
    batch: "HSC 2023",
    paid: "৳500",
    submitted: "2 Aug",
    status: "Pending",
  },
  {
    id: "APP-1297",
    name: "Ayman Chowdhury",
    department: "ME",
    batch: "HSC 2022",
    paid: "৳500",
    submitted: "2 Aug",
    status: "Pending",
  },
  {
    id: "APP-1294",
    name: "Sadia Islam",
    department: "URP",
    batch: "HSC 2023",
    paid: "৳500",
    submitted: "1 Aug",
    status: "Review",
  },
  {
    id: "APP-1291",
    name: "Fahim Ahmed",
    department: "CSE",
    batch: "HSC 2021",
    paid: "৳500",
    submitted: "31 Jul",
    status: "Pending",
  },
  {
    id: "APP-1288",
    name: "Maliha Khan",
    department: "ETE",
    batch: "HSC 2022",
    paid: "৳500",
    submitted: "30 Jul",
    status: "Review",
  },
]

export const committee = [
  {
    name: "Rafsan Ahmed",
    initials: "RA",
    position: "President",
    department: "ME",
    session: "2020–21",
    status: "Active",
  },
  {
    name: "Nusrat Jahan",
    initials: "NJ",
    position: "Vice President",
    department: "EEE",
    session: "2020–21",
    status: "Active",
  },
  {
    name: "Adnan Kabir",
    initials: "AK",
    position: "General Secretary",
    department: "CSE",
    session: "2021–22",
    status: "Active",
  },
  {
    name: "Seyam Rahman",
    initials: "SR",
    position: "Financial Secretary",
    department: "CSE",
    session: "2021–22",
    status: "Active",
  },
  {
    name: "Tasnim Arefin",
    initials: "TA",
    position: "Research Secretary",
    department: "ETE",
    session: "2021–22",
    status: "Active",
  },
  {
    name: "Mehedi Hasan",
    initials: "MH",
    position: "Technical Secretary",
    department: "ME",
    session: "2021–22",
    status: "Away",
  },
]

export const financeTrend = [
  { month: "Mar", income: 148_000, expense: 93_000 },
  { month: "Apr", income: 124_000, expense: 87_000 },
  { month: "May", income: 196_000, expense: 112_000 },
  { month: "Jun", income: 172_000, expense: 156_000 },
  { month: "Jul", income: 231_000, expense: 138_000 },
  { month: "Aug", income: 184_000, expense: 121_000 },
]

export const transactions = [
  {
    id: "TX-8841",
    description: "Rover Challenge sponsor tranche",
    category: "Sponsor",
    date: "2 Aug",
    amount: 85_000,
    type: "Income",
  },
  {
    id: "TX-8836",
    description: "Lidar sensor procurement",
    category: "Equipment",
    date: "1 Aug",
    amount: -42_800,
    type: "Expense",
  },
  {
    id: "TX-8829",
    description: "July membership fees",
    category: "Membership",
    date: "31 Jul",
    amount: 37_500,
    type: "Income",
  },
  {
    id: "TX-8817",
    description: "Workshop hall booking",
    category: "Event",
    date: "29 Jul",
    amount: -18_000,
    type: "Expense",
  },
  {
    id: "TX-8808",
    description: "Dhaka travel reimbursement",
    category: "Travel",
    date: "27 Jul",
    amount: -12_350,
    type: "Expense",
  },
]

export const projects = [
  {
    title: "Astra Rover Mk IV",
    domain: "Robotics",
    lead: "Mehedi Hasan",
    team: 14,
    progress: 74,
    status: "Ongoing",
    updated: "Today",
  },
  {
    title: "CubeSat Ground Station",
    domain: "Space",
    lead: "Tasnim Arefin",
    team: 8,
    progress: 46,
    status: "Research",
    updated: "Yesterday",
  },
  {
    title: "Bengali Voice Navigation",
    domain: "AI",
    lead: "Sadia Islam",
    team: 6,
    progress: 91,
    status: "Ongoing",
    updated: "28 Jul",
  },
  {
    title: "Smart Irrigation Mesh",
    domain: "IoT",
    lead: "Ayman Chowdhury",
    team: 9,
    progress: 100,
    status: "Completed",
    updated: "18 Jul",
  },
]

export const reports = [
  {
    name: "Member directory",
    description: "All active, pending, and suspended members",
    updated: "Live data",
    formats: ["CSV", "Excel", "PDF"],
  },
  {
    name: "Event registrations",
    description: "Registration and payment status by event",
    updated: "3 Aug, 09:20",
    formats: ["CSV", "Excel"],
  },
  {
    name: "Attendance summary",
    description: "Attendance rate and participant detail",
    updated: "2 Aug, 17:40",
    formats: ["CSV", "PDF"],
  },
  {
    name: "Financial statement",
    description: "Income, expense, cash flow, and categories",
    updated: "31 Jul, 23:59",
    formats: ["Excel", "PDF"],
  },
  {
    name: "Project inventory",
    description: "Project status, ownership, and equipment",
    updated: "30 Jul, 14:10",
    formats: ["CSV", "PDF"],
  },
]
