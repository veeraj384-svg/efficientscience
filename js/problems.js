const PROBLEMS = [
  // ── PHYSICS ──────────────────────────────────────────────────────────────
  {
    id: 1, subject: "Physics", topic: "Mechanics", difficulty: "Easy",
    question: "A ball is dropped from a height of 20 m. How long does it take to reach the ground? (g = 10 m/s²)",
    options: ["1 s", "2 s", "4 s", "√2 s"],
    answer: 1,
    explanation: "Using h = ½gt², we get 20 = ½ × 10 × t², so t² = 4, giving t = 2 s."
  },
  {
    id: 2, subject: "Physics", topic: "Newton's Laws", difficulty: "Easy",
    question: "A 5 kg object experiences a net force of 20 N. What is its acceleration?",
    options: ["1 m/s²", "2 m/s²", "4 m/s²", "100 m/s²"],
    answer: 2,
    explanation: "Newton's second law: F = ma → a = F/m = 20/5 = 4 m/s²."
  },
  {
    id: 3, subject: "Physics", topic: "Energy", difficulty: "Medium",
    question: "A 2 kg block slides down a frictionless ramp of height 5 m. What is its speed at the bottom? (g = 10 m/s²)",
    options: ["5 m/s", "10 m/s", "√50 m/s", "√100 m/s"],
    answer: 1,
    explanation: "Conservation of energy: mgh = ½mv² → v = √(2gh) = √(2×10×5) = √100 = 10 m/s."
  },
  {
    id: 4, subject: "Physics", topic: "Waves", difficulty: "Medium",
    question: "A wave has frequency 440 Hz and wavelength 0.75 m. What is its speed?",
    options: ["330 m/s", "440 m/s", "586.7 m/s", "0.75 m/s"],
    answer: 0,
    explanation: "Wave speed v = fλ = 440 × 0.75 = 330 m/s (speed of sound in air at room temperature)."
  },
  {
    id: 5, subject: "Physics", topic: "Electricity", difficulty: "Medium",
    question: "Three resistors of 2Ω, 3Ω, and 6Ω are connected in parallel. What is the equivalent resistance?",
    options: ["11 Ω", "1 Ω", "3.67 Ω", "0.5 Ω"],
    answer: 1,
    explanation: "1/R = 1/2 + 1/3 + 1/6 = 3/6 + 2/6 + 1/6 = 6/6 = 1. So R = 1 Ω."
  },
  {
    id: 6, subject: "Physics", topic: "Optics", difficulty: "Hard",
    question: "Light passes from glass (n = 1.5) into water (n = 1.33). What is the critical angle for total internal reflection?",
    options: ["62.5°", "48.4°", "41.8°", "27.3°"],
    answer: 0,
    explanation: "sin(θc) = n₂/n₁ = 1.33/1.5 = 0.887. θc = arcsin(0.887) ≈ 62.5°."
  },
  {
    id: 7, subject: "Physics", topic: "Quantum", difficulty: "Olympiad",
    question: "An electron in a hydrogen atom transitions from n=4 to n=2. Using E_n = -13.6/n² eV, what is the photon energy?",
    options: ["1.89 eV", "2.55 eV", "0.85 eV", "3.40 eV"],
    answer: 1,
    explanation: "ΔE = E₄ - E₂ = -13.6/16 - (-13.6/4) = -0.85 + 3.40 = 2.55 eV. This is the Hα line."
  },
  {
    id: 8, subject: "Physics", topic: "Thermodynamics", difficulty: "Hard",
    question: "An ideal gas undergoes an isothermal expansion from 2 L to 4 L at 300 K. What happens to its internal energy?",
    options: ["It doubles", "It halves", "It remains constant", "It increases by nRT ln 2"],
    answer: 2,
    explanation: "For an ideal gas, internal energy depends only on temperature. Isothermal means constant temperature, so ΔU = 0."
  },

  // ── CHEMISTRY ────────────────────────────────────────────────────────────
  {
    id: 9, subject: "Chemistry", topic: "Stoichiometry", difficulty: "Easy",
    question: "How many moles are in 44 g of CO₂? (M = 44 g/mol)",
    options: ["0.5 mol", "1 mol", "2 mol", "44 mol"],
    answer: 1,
    explanation: "n = mass/molar mass = 44/44 = 1 mol."
  },
  {
    id: 10, subject: "Chemistry", topic: "Acids & Bases", difficulty: "Easy",
    question: "What is the pH of a solution with [H⁺] = 10⁻³ M?",
    options: ["3", "7", "11", "-3"],
    answer: 0,
    explanation: "pH = -log[H⁺] = -log(10⁻³) = 3. The solution is acidic."
  },
  {
    id: 11, subject: "Chemistry", topic: "Periodic Table", difficulty: "Medium",
    question: "Which element has the highest electronegativity on the Pauling scale?",
    options: ["Oxygen", "Nitrogen", "Chlorine", "Fluorine"],
    answer: 3,
    explanation: "Fluorine has the highest electronegativity (3.98 on the Pauling scale) due to its small atomic radius and high nuclear charge."
  },
  {
    id: 12, subject: "Chemistry", topic: "Equilibrium", difficulty: "Medium",
    question: "For N₂(g) + 3H₂(g) ⇌ 2NH₃(g), what happens to equilibrium if pressure is increased?",
    options: ["Shifts left (more N₂ and H₂)", "Shifts right (more NH₃)", "No change", "Depends on temperature"],
    answer: 1,
    explanation: "By Le Chatelier's principle, increased pressure shifts equilibrium toward fewer moles of gas. Left has 4 moles, right has 2 — equilibrium shifts right."
  },
  {
    id: 13, subject: "Chemistry", topic: "Redox", difficulty: "Hard",
    question: "In the reaction: MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O, what is the oxidation state change of Mn?",
    options: ["+7 to +2", "+2 to +7", "+7 to 0", "+4 to +2"],
    answer: 0,
    explanation: "In MnO₄⁻, oxygen is -2 (×4 = -8), so Mn must be +7 to give overall -1. In Mn²⁺, Mn is +2. Change: +7 → +2 (gain of 5 electrons)."
  },
  {
    id: 14, subject: "Chemistry", topic: "Organic", difficulty: "Hard",
    question: "Which reaction mechanism produces an inversion of configuration (Walden inversion)?",
    options: ["SN1", "SN2", "E1", "E2"],
    answer: 1,
    explanation: "SN2 (bimolecular nucleophilic substitution) proceeds via a backside attack, causing 100% inversion of configuration at the stereocenter."
  },
  {
    id: 15, subject: "Chemistry", topic: "Thermodynamics", difficulty: "Olympiad",
    question: "The Gibbs free energy change for a reaction is -120 kJ/mol at 298 K. What is the equilibrium constant K?",
    options: ["≈ e⁴⁸", "≈ e⁻⁴⁸", "≈ 1.0", "≈ e²⁴"],
    answer: 0,
    explanation: "ΔG° = -RT ln K → ln K = -ΔG°/RT = 120000/(8.314×298) ≈ 48.4. So K ≈ e⁴⁸ ≈ 10²¹."
  },

  // ── BIOLOGY ──────────────────────────────────────────────────────────────
  {
    id: 16, subject: "Biology", topic: "Cell Biology", difficulty: "Easy",
    question: "Which organelle is known as the 'powerhouse of the cell'?",
    options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi apparatus"],
    answer: 2,
    explanation: "Mitochondria produce ATP through cellular respiration (oxidative phosphorylation), earning the 'powerhouse' title."
  },
  {
    id: 17, subject: "Biology", topic: "Genetics", difficulty: "Easy",
    question: "In a monohybrid cross between two Aa parents, what fraction of offspring is homozygous recessive?",
    options: ["1/4", "1/2", "3/4", "0"],
    answer: 0,
    explanation: "Aa × Aa gives 1/4 AA : 2/4 Aa : 1/4 aa. The homozygous recessive (aa) proportion is 1/4."
  },
  {
    id: 18, subject: "Biology", topic: "Photosynthesis", difficulty: "Medium",
    question: "Which molecule is the primary electron donor in the light reactions of photosynthesis?",
    options: ["NADPH", "Water (H₂O)", "CO₂", "Glucose"],
    answer: 1,
    explanation: "In the light reactions, water is split (photolysis) at Photosystem II, releasing O₂ and providing electrons to the electron transport chain."
  },
  {
    id: 19, subject: "Biology", topic: "Molecular Biology", difficulty: "Medium",
    question: "Which enzyme synthesizes RNA from a DNA template?",
    options: ["DNA polymerase", "Reverse transcriptase", "RNA polymerase", "Helicase"],
    answer: 2,
    explanation: "RNA polymerase transcribes DNA into mRNA by reading the template strand 3'→5' and synthesizing RNA 5'→3'."
  },
  {
    id: 20, subject: "Biology", topic: "Evolution", difficulty: "Hard",
    question: "Which of the following is NOT a condition required for Hardy-Weinberg equilibrium?",
    options: ["Large population size", "Random mating", "Natural selection occurring", "No gene flow"],
    answer: 2,
    explanation: "Hardy-Weinberg equilibrium requires: large population, random mating, NO natural selection, no mutation, and no gene flow. Natural selection violates this assumption."
  },
  {
    id: 21, subject: "Biology", topic: "Neuroscience", difficulty: "Olympiad",
    question: "The resting membrane potential of a neuron is approximately -70 mV. Which ions are primarily responsible?",
    options: ["High K⁺ inside, high Na⁺ outside", "High Na⁺ inside, high K⁺ outside", "High Ca²⁺ inside, high Cl⁻ outside", "High H⁺ inside, high HCO₃⁻ outside"],
    answer: 0,
    explanation: "The resting potential is maintained by K⁺ concentration gradient (high inside) and Na⁺/K⁺-ATPase pumping. K⁺ leaks out making the inside negative."
  },

  // ── ASTRONOMY ────────────────────────────────────────────────────────────
  {
    id: 22, subject: "Astronomy", topic: "Solar System", difficulty: "Easy",
    question: "What is the name of the largest moon of Saturn?",
    options: ["Europa", "Ganymede", "Titan", "Callisto"],
    answer: 2,
    explanation: "Titan is Saturn's largest moon and the only moon in the solar system with a dense atmosphere, primarily composed of nitrogen."
  },
  {
    id: 23, subject: "Astronomy", topic: "Stellar Physics", difficulty: "Medium",
    question: "A star has a surface temperature twice that of the Sun but the same radius. How does its luminosity compare to the Sun's?",
    options: ["2× brighter", "4× brighter", "8× brighter", "16× brighter"],
    answer: 3,
    explanation: "Luminosity L = 4πR²σT⁴. If T doubles with same R, L increases by 2⁴ = 16. The star is 16× more luminous."
  },
  {
    id: 24, subject: "Astronomy", topic: "Cosmology", difficulty: "Medium",
    question: "What is the approximate age of the universe according to current measurements?",
    options: ["4.5 billion years", "8.0 billion years", "13.8 billion years", "20.0 billion years"],
    answer: 2,
    explanation: "Based on CMB measurements (Planck mission) and Hubble constant estimates, the universe is approximately 13.8 billion years old."
  },
  {
    id: 25, subject: "Astronomy", topic: "Orbital Mechanics", difficulty: "Hard",
    question: "Using Kepler's third law, if Earth's orbital period is 1 year at 1 AU, what is the orbital period of a planet at 4 AU?",
    options: ["4 years", "8 years", "16 years", "2 years"],
    answer: 1,
    explanation: "T² ∝ a³ → T² = a³ (in AU and years). For a = 4: T² = 4³ = 64, T = √64 = 8 years."
  },
  {
    id: 26, subject: "Astronomy", topic: "Black Holes", difficulty: "Olympiad",
    question: "What is the Schwarzschild radius of an object with mass M?",
    options: ["r = GM/c²", "r = 2GM/c²", "r = GM/c", "r = 4GM/c²"],
    answer: 1,
    explanation: "The Schwarzschild radius is r_s = 2GM/c², derived by setting the escape velocity equal to c. For the Sun, r_s ≈ 3 km."
  },

  // ── EARTH SCIENCE ────────────────────────────────────────────────────────
  {
    id: 27, subject: "Earth Science", topic: "Plate Tectonics", difficulty: "Easy",
    question: "What type of boundary forms when two plates move away from each other?",
    options: ["Convergent", "Transform", "Divergent", "Subduction"],
    answer: 2,
    explanation: "Divergent boundaries occur where plates move apart, creating rift zones (e.g., Mid-Atlantic Ridge) and new oceanic crust via seafloor spreading."
  },
  {
    id: 28, subject: "Earth Science", topic: "Rocks & Minerals", difficulty: "Easy",
    question: "Which rock type forms from the cooling of magma?",
    options: ["Sedimentary", "Metamorphic", "Igneous", "Limestone"],
    answer: 2,
    explanation: "Igneous rocks form from cooling and solidification of magma (underground) or lava (surface). Examples include granite and basalt."
  },
  {
    id: 29, subject: "Earth Science", topic: "Atmosphere", difficulty: "Medium",
    question: "What gas makes up approximately 78% of Earth's atmosphere?",
    options: ["Oxygen", "Carbon dioxide", "Argon", "Nitrogen"],
    answer: 3,
    explanation: "Earth's atmosphere is ~78% N₂, ~21% O₂, ~0.93% Ar, and ~0.04% CO₂ by volume."
  },
  {
    id: 30, subject: "Earth Science", topic: "Seismology", difficulty: "Hard",
    question: "What is the Mohorovičić discontinuity?",
    options: ["The boundary between inner and outer core", "The boundary between crust and mantle", "The boundary between lithosphere and asthenosphere", "The boundary between outer core and mantle"],
    answer: 1,
    explanation: "The Moho is the seismic discontinuity marking the boundary between Earth's crust and mantle, at ~5-70 km depth, where P-wave velocity jumps sharply."
  },

  // ── ENVIRONMENTAL SCIENCE ─────────────────────────────────────────────────
  {
    id: 31, subject: "Environmental", topic: "Climate", difficulty: "Easy",
    question: "Which greenhouse gas has increased most significantly due to human activity since 1750?",
    options: ["Methane (CH₄)", "Carbon dioxide (CO₂)", "Nitrous oxide (N₂O)", "Water vapor"],
    answer: 1,
    explanation: "Atmospheric CO₂ has increased from ~280 ppm (pre-industrial) to over 420 ppm, primarily from fossil fuel combustion and deforestation."
  },
  {
    id: 32, subject: "Environmental", topic: "Ecology", difficulty: "Medium",
    question: "At which trophic level is the most energy available in an ecosystem?",
    options: ["Top predators", "Secondary consumers", "Primary consumers", "Producers"],
    answer: 3,
    explanation: "By the 10% rule, energy is lost at each trophic level. Producers (plants) capture solar energy and have the most energy available — typically 10× that of primary consumers."
  },
  {
    id: 33, subject: "Environmental", topic: "Biogeochemical Cycles", difficulty: "Hard",
    question: "Which process converts atmospheric N₂ into ammonia (NH₃) that plants can use?",
    options: ["Nitrification", "Denitrification", "Nitrogen fixation", "Ammonification"],
    answer: 2,
    explanation: "Nitrogen fixation, carried out by bacteria like Rhizobium and Azotobacter, converts N₂ to NH₃ using the enzyme nitrogenase, requiring significant energy."
  },
  {
    id: 34, subject: "Environmental", topic: "Pollution", difficulty: "Medium",
    question: "Acid rain is primarily caused by emissions of which two gases?",
    options: ["CO₂ and CH₄", "SO₂ and NOₓ", "O₃ and CO", "HCl and HF"],
    answer: 1,
    explanation: "SO₂ (from coal burning) and NOₓ (from vehicles and industry) react with water vapor to form H₂SO₄ and HNO₃, producing acid rain (pH < 5.6)."
  },
  {
    id: 35, subject: "Environmental", topic: "Biodiversity", difficulty: "Olympiad",
    question: "The species-area relationship is described by the equation S = cA^z, where typical z for oceanic islands is approximately:",
    options: ["0.05-0.10", "0.20-0.35", "0.60-0.80", "1.0-1.2"],
    answer: 1,
    explanation: "For oceanic islands, z typically ranges from 0.20 to 0.35 (Preston 1962, MacArthur & Wilson 1967). Continental areas have lower z (~0.12-0.17), isolated habitats have higher z."
  }
];

const SUBJECTS = [
  { id: "all", label: "All Subjects" },
  { id: "Physics",       label: "Physics" },
  { id: "Chemistry",     label: "Chemistry" },
  { id: "Biology",       label: "Biology" },
  { id: "Astronomy",     label: "Astronomy" },
  { id: "Earth Science", label: "Earth Science" },
  { id: "Environmental", label: "Environmental" }
];

const DIFFICULTIES = [
  { id: "all",      label: "All Levels",  color: "#94a3b8" },
  { id: "Easy",     label: "Easy",        color: "#22c55e" },
  { id: "Medium",   label: "Medium",      color: "#f59e0b" },
  { id: "Hard",     label: "Hard",        color: "#f43f5e" },
  { id: "Olympiad", label: "Olympiad",    color: "#a855f7" }
];
