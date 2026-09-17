export interface SubjectTopicPreset {
  id: string;
  name: string;
  iconName: string;
  topics: string[];
  color: string;
}

export const PRESET_SUBJECTS: SubjectTopicPreset[] = [
  {
    id: "math",
    name: "Mathematics",
    iconName: "Calculator",
    color: "from-blue-600 to-indigo-600",
    topics: [
      "Calculus: Derivatives & Integrals",
      "Probability & Statistics",
      "Quadratic Equations",
      "Trigonometric Identities",
      "Linear Algebra & Matrices",
    ],
  },
  {
    id: "physics",
    name: "Physics",
    iconName: "Zap",
    color: "from-violet-600 to-purple-600",
    topics: [
      "Newton's Laws of Motion",
      "Thermodynamics & Heat Transfer",
      "Electromagnetism & Faraday's Law",
      "Wave Optics & Diffraction",
      "Work, Energy and Power",
    ],
  },
  {
    id: "chemistry",
    name: "Chemistry",
    iconName: "FlaskConical",
    color: "from-sky-500 to-blue-600",
    topics: [
      "Chemical Bonding & Molecular Structure",
      "Periodic Trends & Electron Config",
      "Acid-Base Equilibria & pH",
      "Organic Reaction Mechanisms",
      "Stoichiometry & Mole Concept",
    ],
  },
  {
    id: "biology",
    name: "Biology",
    iconName: "Dna",
    color: "from-emerald-500 to-teal-600",
    topics: [
      "Photosynthesis & Light Reactions",
      "Cellular Respiration & ATP Cycle",
      "Mendelian Genetics & DNA Replication",
      "Human Circulatory & Cardiac Cycle",
      "Immune System & Antibody Defense",
    ],
  },
  {
    id: "cs",
    name: "Computer Science",
    iconName: "Code2",
    color: "from-indigo-600 to-cyan-600",
    topics: [
      "Binary Search Trees & Traversal",
      "Big-O Notation & Complexity",
      "Object-Oriented Programming (OOP)",
      "Recursion & Dynamic Programming",
      "Relational Databases & SQL Queries",
    ],
  },
  {
    id: "economics",
    name: "Economics",
    iconName: "TrendingUp",
    color: "from-amber-500 to-orange-600",
    topics: [
      "Supply, Demand and Market Equilibrium",
      "Monetary Policy & Central Banking",
      "Inflation, GDP & Unemployment",
      "Opportunity Cost & Trade-offs",
      "Game Theory & Nash Equilibrium",
    ],
  },
];

export const GRADE_LEVELS = [
  "Middle School (Grades 6-8)",
  "High School (Grades 9-10)",
  "Senior Secondary / Pre-University (Grades 11-12)",
  "Undergraduate / College",
  "Competitive Exam / Standardized Test",
];

export const QUESTION_TYPES_CONFIG = [
  { id: "mcq", label: "Multiple Choice (MCQ)", desc: "Interactive 4-choice questions with instant scoring" },
  { id: "short", label: "Short Answer", desc: "Crisp 2-3 mark conceptual questions" },
  { id: "long", label: "Long Answer", desc: "In-depth 5+ mark analytical questions" },
  { id: "hots", label: "HOTS Questions", desc: "Higher Order Thinking Skills questions" },
  { id: "competency", label: "Competency Based", desc: "Real-world scenario and case evaluations" },
  { id: "application", label: "Application Based", desc: "Practical problem-solving scenarios" },
];
