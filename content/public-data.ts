export type Project = {
  slug: string
  title: string
  summary: string
  category:
    "Robotics" | "AI" | "Space" | "Embedded Systems" | "IoT" | "Electronics"
  status: "Ongoing" | "Completed" | "Research" | "Competition"
  year: string
  stack: string[]
  team: string[]
  duration: string
  outcome: string
}

export const projects: Project[] = [
  {
    slug: "agribot-terrain-rover",
    title: "AgriBot Terrain Rover",
    summary:
      "A low-cost autonomous rover for crop-health mapping across uneven Bangladeshi farmland.",
    category: "Robotics",
    status: "Ongoing",
    year: "2026",
    stack: ["ROS 2", "LiDAR", "Jetson", "LoRa"],
    team: ["Nafis Rahman", "Tasnim Jahan", "Sakib Hasan"],
    duration: "Jan 2025 — present",
    outcome:
      "Field prototype now completes waypoint missions with live soil and canopy telemetry.",
  },
  {
    slug: "bengalsat-ground-station",
    title: "BengalSat Ground Station",
    summary:
      "An open, student-built UHF/VHF station for tracking amateur satellites from the CUET campus.",
    category: "Space",
    status: "Research",
    year: "2025",
    stack: ["SDR", "GNU Radio", "Python", "Rotator"],
    team: ["Rafiul Karim", "Samia Ahmed"],
    duration: "Aug 2024 — present",
    outcome:
      "Decoded telemetry from NOAA-19 and established a repeatable pass-prediction workflow.",
  },
  {
    slug: "cyclone-vision",
    title: "Cyclone Vision",
    summary:
      "Edge AI that identifies damaged roads and buildings from post-cyclone aerial imagery.",
    category: "AI",
    status: "Completed",
    year: "2025",
    stack: ["PyTorch", "YOLO", "ONNX", "FastAPI"],
    team: ["Farhan Kabir", "Nusaiba Islam", "Ayon Dey"],
    duration: "10 months",
    outcome:
      "Won best climate-resilience solution at the 2025 CUET Innovation Showcase.",
  },
  {
    slug: "firefly-swarm",
    title: "Firefly Swarm",
    summary:
      "Cooperative palm-sized robots exploring decentralized mapping and collision avoidance.",
    category: "Embedded Systems",
    status: "Competition",
    year: "2026",
    stack: ["ESP32", "UWB", "C++", "FreeRTOS"],
    team: ["Adnan Chowdhury", "Maliha Noor"],
    duration: "Sep 2025 — present",
    outcome:
      "Six-node swarm maintains formation under intermittent communication.",
  },
  {
    slug: "riverwatch",
    title: "RiverWatch Sensor Mesh",
    summary:
      "Solar-powered water-quality nodes for long-duration monitoring of the Karnaphuli basin.",
    category: "IoT",
    status: "Ongoing",
    year: "2026",
    stack: ["STM32", "NB-IoT", "Turbidity", "Grafana"],
    team: ["Sadman Sayeed", "Ifra Karim"],
    duration: "14 months",
    outcome:
      "Three pilot nodes transmit calibrated readings from the CUET watershed lab.",
  },
  {
    slug: "braille-cell",
    title: "Refreshable Braille Cell",
    summary:
      "A compact haptic reading cell designed around locally serviceable electromagnetic actuation.",
    category: "Electronics",
    status: "Completed",
    year: "2024",
    stack: ["KiCad", "RP2040", "Haptics", "3D Print"],
    team: ["Mehedi Hasan", "Raisa Tahsin"],
    duration: "8 months",
    outcome:
      "Reduced the projected per-cell build cost by 41% against imported assemblies.",
  },
]

export type Event = {
  slug: string
  title: string
  date: string
  endDate?: string
  month: string
  day: string
  time: string
  venue: string
  category: string
  scope: "Intra CUET" | "Divisional" | "National"
  status: "Upcoming" | "Ongoing" | "Past"
  capacity: number
  registered: number
  fee: string
  description: string
  eligibility: string
}

export const events: Event[] = [
  {
    slug: "national-rover-challenge-2026",
    title: "National Rover Challenge 2026",
    date: "18 September 2026",
    endDate: "19 September 2026",
    month: "SEP",
    day: "18",
    time: "8:30 AM — 6:00 PM",
    venue: "CUET Central Field",
    category: "Competition",
    scope: "National",
    status: "Upcoming",
    capacity: 320,
    registered: 214,
    fee: "BDT 1,500 / team",
    description:
      "Two days of terrain traversal, autonomous navigation, sample handling, and a mission-design review for university rover teams across Bangladesh.",
    eligibility: "University teams of 3–8 currently enrolled students.",
  },
  {
    slug: "satellite-data-bootcamp",
    title: "Satellite Data Bootcamp",
    date: "22 August 2026",
    month: "AUG",
    day: "22",
    time: "10:00 AM — 4:30 PM",
    venue: "IT Business Incubator, CUET",
    category: "Bootcamp",
    scope: "Divisional",
    status: "Upcoming",
    capacity: 80,
    registered: 61,
    fee: "BDT 250",
    description:
      "A hands-on introduction to accessing, processing, and interpreting open Earth-observation data for local environmental questions.",
    eligibility:
      "Students from institutions in Chattogram Division; bring a laptop.",
  },
  {
    slug: "frontier-talk-autonomous-systems",
    title: "Frontier Talk: Safe Autonomous Systems",
    date: "08 August 2026",
    month: "AUG",
    day: "08",
    time: "7:30 PM — 9:00 PM",
    venue: "Online",
    category: "Research Talk",
    scope: "National",
    status: "Upcoming",
    capacity: 500,
    registered: 388,
    fee: "Free",
    description:
      "A public research conversation on verification, human oversight, and failure-aware design in autonomous machines.",
    eligibility: "Open to everyone.",
  },
  {
    slug: "embedded-systems-sprint",
    title: "Embedded Systems Sprint",
    date: "02–04 August 2026",
    month: "AUG",
    day: "02",
    time: "9:00 AM — 5:00 PM",
    venue: "EEE Project Lab",
    category: "Training",
    scope: "Intra CUET",
    status: "Ongoing",
    capacity: 48,
    registered: 48,
    fee: "Free for members",
    description:
      "A three-day build sprint moving from bare-metal GPIO to sensor fusion and real-time scheduling.",
    eligibility: "Current CUET students with basic C programming knowledge.",
  },
  {
    slug: "robotics-for-resilience",
    title: "Robotics for Resilience Seminar",
    date: "17 May 2026",
    month: "MAY",
    day: "17",
    time: "3:00 PM — 5:00 PM",
    venue: "Council Bhaban",
    category: "Seminar",
    scope: "National",
    status: "Past",
    capacity: 220,
    registered: 196,
    fee: "Free",
    description:
      "Researchers and first responders discussed where field robotics can make disaster operations safer and faster.",
    eligibility: "Open registration.",
  },
]

export const committee = [
  {
    name: "Arafat Hossain",
    role: "President",
    department: "Mechanical Engineering",
    session: "2021–22",
    initials: "AH",
  },
  {
    name: "Tanjina Akter",
    role: "Vice President",
    department: "Electrical & Electronic Engineering",
    session: "2021–22",
    initials: "TA",
  },
  {
    name: "Mahin Chowdhury",
    role: "General Secretary",
    department: "Computer Science & Engineering",
    session: "2022–23",
    initials: "MC",
  },
  {
    name: "Nabila Rahman",
    role: "Joint General Secretary",
    department: "Electronics & Telecommunication",
    session: "2022–23",
    initials: "NR",
  },
  {
    name: "Fahim Shahriar",
    role: "Technical Secretary",
    department: "Mechatronics & Industrial Engineering",
    session: "2022–23",
    initials: "FS",
  },
  {
    name: "Sabrina Islam",
    role: "Research & Publication Secretary",
    department: "Civil Engineering",
    session: "2022–23",
    initials: "SI",
  },
  {
    name: "Samin Ahmed",
    role: "Organizing Secretary",
    department: "Mechanical Engineering",
    session: "2022–23",
    initials: "SA",
  },
  {
    name: "Rukaiya Noor",
    role: "Financial Secretary",
    department: "Urban & Regional Planning",
    session: "2022–23",
    initials: "RN",
  },
]

export const alumni = [
  {
    name: "Dr. Riad Hasan",
    department: "Mechanical Engineering",
    batch: "2014",
    year: "2019",
    workplace: "Postdoctoral Fellow, Tohoku University",
    study: "PhD, Space Robotics",
    interests: ["Telerobotics", "Haptics"],
    initials: "RH",
  },
  {
    name: "Nusrat Jahan",
    department: "Computer Science & Engineering",
    batch: "2015",
    year: "2020",
    workplace: "ML Engineer, Pathao",
    study: "MSc, BUET",
    interests: ["Computer Vision", "Mobility"],
    initials: "NJ",
  },
  {
    name: "Sazzad Hossain",
    department: "Electrical & Electronic Engineering",
    batch: "2016",
    year: "2021",
    workplace: "Research Engineer, Walton Digi-Tech",
    study: "MEng, CUET",
    interests: ["Power Electronics", "Embedded AI"],
    initials: "SH",
  },
  {
    name: "Maliha Tasnim",
    department: "Electronics & Telecommunication",
    batch: "2017",
    year: "2022",
    workplace: "Graduate Researcher, Aalto University",
    study: "MSc, Wireless Systems",
    interests: ["Satellite Links", "6G"],
    initials: "MT",
  },
  {
    name: "Raihan Kabir",
    department: "Mechanical Engineering",
    batch: "2018",
    year: "2023",
    workplace: "Robotics Engineer, TigerIT",
    study: "BSc, CUET",
    interests: ["SLAM", "Field Robotics"],
    initials: "RK",
  },
  {
    name: "Afia Anjum",
    department: "Civil Engineering",
    batch: "2019",
    year: "2024",
    workplace: "GIS Analyst, CEGIS",
    study: "BSc, CUET",
    interests: ["Remote Sensing", "Climate"],
    initials: "AA",
  },
]

export const publications = [
  {
    title: "Low-cost UWB localization for cooperative indoor robots",
    type: "Research paper",
    year: "2026",
    authors: "A. Chowdhury, M. Noor et al.",
    venue: "ICRA Student Forum",
    id: "ASRRO-RP-026",
  },
  {
    title: "Orbit: Annual research review 2025",
    type: "Annual publication",
    year: "2025",
    authors: "ASRRO Research & Publication Wing",
    venue: "Volume 04",
    id: "ASRRO-AR-004",
  },
  {
    title: "Open hardware ground station: field notes",
    type: "Technical report",
    year: "2025",
    authors: "BengalSat Ground Station Team",
    venue: "Technical Series",
    id: "ASRRO-TR-011",
  },
  {
    title: "Andromeda Magazine: Machines for monsoon country",
    type: "Magazine",
    year: "2024",
    authors: "ASRRO Editorial Board",
    venue: "Issue 07",
    id: "ASRRO-MG-007",
  },
]

export const news = [
  {
    slug: "rover-challenge-registration",
    title: "National Rover Challenge registration opens",
    date: "28 July 2026",
    category: "Announcement",
    summary:
      "University teams can now submit their mission concept and roster for Bangladesh’s student rover field challenge.",
    read: "3 min",
  },
  {
    slug: "riverwatch-pilot",
    title: "RiverWatch begins three-node watershed pilot",
    date: "14 July 2026",
    category: "Project update",
    summary:
      "The first solar sensor nodes are live, streaming turbidity, temperature, and conductivity readings.",
    read: "4 min",
  },
  {
    slug: "new-research-partnership",
    title: "ASRRO and CUET EEE Lab announce research partnership",
    date: "30 June 2026",
    category: "Organization",
    summary:
      "The collaboration gives student teams structured lab access, technical mentoring, and shared test equipment.",
    read: "2 min",
  },
  {
    slug: "alumni-field-notes-riyad",
    title: "Field notes: building robots for remote operations",
    date: "08 June 2026",
    category: "Alumni",
    summary:
      "ASRRO alumnus Dr. Riad Hasan reflects on translating student prototypes into resilient research platforms.",
    read: "6 min",
  },
]

export const gallery = [
  {
    title: "National Rover Challenge",
    year: "2025",
    count: 64,
    tag: "Competition",
    code: "NRC—25",
  },
  {
    title: "Satellite Data Bootcamp",
    year: "2025",
    count: 38,
    tag: "Bootcamp",
    code: "SDB—25",
  },
  {
    title: "Firefly Swarm test day",
    year: "2026",
    count: 21,
    tag: "Lab notes",
    code: "FSW—06",
  },
  {
    title: "Robotics for Resilience",
    year: "2026",
    count: 42,
    tag: "Seminar",
    code: "R4R—26",
  },
  {
    title: "Member orientation",
    year: "2025",
    count: 57,
    tag: "Community",
    code: "ORI—25",
  },
  {
    title: "BengalSat first signal",
    year: "2025",
    count: 18,
    tag: "Milestone",
    code: "BGS—01",
  },
]

export const searchIndex = [
  ...projects.map((item) => ({
    title: item.title,
    type: "Project",
    href: `/projects/${item.slug}`,
    keywords: [item.category, item.status, ...item.stack],
  })),
  ...events.map((item) => ({
    title: item.title,
    type: "Event",
    href: `/events/${item.slug}`,
    keywords: [item.category, item.scope, item.status],
  })),
  ...news.map((item) => ({
    title: item.title,
    type: "News",
    href: `/news/${item.slug}`,
    keywords: [item.category],
  })),
  ...alumni.map((item) => ({
    title: item.name,
    type: "Alumni",
    href: "/alumni",
    keywords: [item.department, item.batch, item.workplace],
  })),
  ...committee.map((item) => ({
    title: item.name,
    type: "Committee",
    href: "/committee",
    keywords: [item.role, item.department],
  })),
  ...publications.map((item) => ({
    title: item.title,
    type: "Publication",
    href: "/publications",
    keywords: [item.type, item.year],
  })),
]
