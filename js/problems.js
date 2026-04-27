const PROBLEMS = [

  // ══════════════════════════════════════════════════════════════════════════
  //  ELEMENTARY (Grades 3–5)
  // ══════════════════════════════════════════════════════════════════════════

  // ── Elementary · Science Basics ──────────────────────────────────────────
  {
    id: 101, subject: "Physics", topic: "States of Matter", difficulty: "Easy", grade: "Elementary",
    question: "Which of these is an example of a liquid?",
    options: ["Ice cube", "Orange juice", "Steam", "Rock"],
    answer: 1,
    explanation: "Orange juice flows and takes the shape of its container — that's what makes it a liquid! Ice is solid, steam is a gas, and a rock is solid."
  },
  {
    id: 102, subject: "Physics", topic: "Simple Machines", difficulty: "Easy", grade: "Elementary",
    question: "A seesaw on a playground is an example of which simple machine?",
    options: ["Wheel and axle", "Pulley", "Lever", "Inclined plane"],
    answer: 2,
    explanation: "A seesaw is a lever! It has a beam that rests on a fulcrum (the middle pivot point). Levers help us lift or move things more easily."
  },
  {
    id: 103, subject: "Physics", topic: "Sound", difficulty: "Easy", grade: "Elementary",
    question: "What must happen for sound to travel?",
    options: ["There must be light", "There must be matter (like air or water)", "There must be electricity", "There must be heat"],
    answer: 1,
    explanation: "Sound is a vibration that travels through matter — like air, water, or a desk. Sound cannot travel through empty space (a vacuum)."
  },
  {
    id: 104, subject: "Physics", topic: "Magnets", difficulty: "Easy", grade: "Elementary",
    question: "Which of these objects will a magnet attract?",
    options: ["A wooden stick", "A plastic bottle", "A steel nail", "A rubber eraser"],
    answer: 2,
    explanation: "Magnets attract materials made of iron, nickel, or cobalt. Steel contains iron, so a steel nail is attracted to a magnet."
  },
  {
    id: 105, subject: "Biology", topic: "Plants", difficulty: "Easy", grade: "Elementary",
    question: "What do plants need to make their own food through photosynthesis?",
    options: ["Soil, water, and darkness", "Sunlight, water, and carbon dioxide", "Rain, oxygen, and sugar", "Sunlight, sand, and nitrogen"],
    answer: 1,
    explanation: "Plants are amazing — they make their own food using sunlight (energy), water (from roots), and carbon dioxide (from the air). They release oxygen as a bonus!"
  },
  {
    id: 106, subject: "Biology", topic: "Animal Groups", difficulty: "Easy", grade: "Elementary",
    question: "Which of these animals is a mammal?",
    options: ["Goldfish", "Frog", "Dolphin", "Eagle"],
    answer: 2,
    explanation: "Dolphins are mammals! Mammals breathe air, are warm-blooded, have hair or fur, and feed their babies milk. Even though dolphins live in the ocean, they are not fish."
  },
  {
    id: 107, subject: "Biology", topic: "Food Chains", difficulty: "Easy", grade: "Elementary",
    question: "In the food chain: Grass → Rabbit → Fox, what is the grass called?",
    options: ["Consumer", "Predator", "Producer", "Decomposer"],
    answer: 2,
    explanation: "Grass is a producer because it makes its own food using sunlight. Rabbits and foxes are consumers because they eat other organisms."
  },
  {
    id: 108, subject: "Biology", topic: "Life Cycles", difficulty: "Easy", grade: "Elementary",
    question: "What is the correct order of a butterfly's life cycle?",
    options: ["Egg → Butterfly → Caterpillar → Chrysalis", "Egg → Caterpillar → Chrysalis → Butterfly", "Chrysalis → Egg → Caterpillar → Butterfly", "Caterpillar → Egg → Butterfly → Chrysalis"],
    answer: 1,
    explanation: "A butterfly goes through metamorphosis: Egg → Caterpillar (larva) → Chrysalis (pupa) → Butterfly (adult). This complete change in body form is called metamorphosis."
  },
  {
    id: 109, subject: "Earth Science", topic: "Earth Structure", difficulty: "Easy", grade: "Elementary",
    question: "Which layer of the Earth do we live on?",
    options: ["Inner core", "Outer core", "Mantle", "Crust"],
    answer: 3,
    explanation: "We live on the crust — the thin, rocky outer layer of Earth. Below the crust is the mantle, and at the very center are the outer and inner cores."
  },
  {
    id: 110, subject: "Earth Science", topic: "Water Cycle", difficulty: "Easy", grade: "Elementary",
    question: "When water from a puddle disappears on a sunny day, what process is happening?",
    options: ["Condensation", "Precipitation", "Evaporation", "Runoff"],
    answer: 2,
    explanation: "Evaporation! The sun's heat turns liquid water into water vapor (an invisible gas) that rises into the air. Later it cools and condenses to form clouds."
  },
  {
    id: 111, subject: "Earth Science", topic: "Day and Night", difficulty: "Easy", grade: "Elementary",
    question: "What causes day and night on Earth?",
    options: ["The Moon moving around Earth", "Earth moving around the Sun", "Earth spinning on its axis", "The Sun turning on and off"],
    answer: 2,
    explanation: "Earth spins (rotates) on its axis once every 24 hours. The side facing the Sun has daytime; the side facing away has nighttime."
  },
  {
    id: 112, subject: "Astronomy", topic: "Solar System", difficulty: "Easy", grade: "Elementary",
    question: "Which planet is closest to the Sun?",
    options: ["Venus", "Earth", "Mars", "Mercury"],
    answer: 3,
    explanation: "Mercury is the closest planet to the Sun! Even though it's closest, it's not the hottest — that's Venus, because Venus has a thick atmosphere that traps heat."
  },
  {
    id: 113, subject: "Astronomy", topic: "Stars", difficulty: "Easy", grade: "Elementary",
    question: "What is the closest star to Earth?",
    options: ["Sirius", "Polaris (the North Star)", "The Sun", "Alpha Centauri"],
    answer: 2,
    explanation: "The Sun is our closest star — only about 150 million km away! It looks much bigger and brighter than other stars because it's so much closer to us."
  },
  {
    id: 114, subject: "Environmental", topic: "Ecosystems", difficulty: "Easy", grade: "Elementary",
    question: "Which of these is a non-living part of an ecosystem?",
    options: ["A pine tree", "A deer", "A mushroom", "A river"],
    answer: 3,
    explanation: "A river is non-living (abiotic). Living things (biotic) include plants, animals, and fungi. Ecosystems include both living and non-living things working together."
  },
  {
    id: 115, subject: "Environmental", topic: "Recycling", difficulty: "Easy", grade: "Elementary",
    question: "Which of the following is a renewable energy source?",
    options: ["Coal", "Natural gas", "Oil", "Solar power"],
    answer: 3,
    explanation: "Solar power is renewable — the Sun won't run out for billions of years! Coal, natural gas, and oil are fossil fuels that take millions of years to form and will eventually run out."
  },

  // ── Elementary · Chemistry (fills the missing subject gap) ───────────────
  {
    id: 116, subject: "Chemistry", topic: "States of Matter", difficulty: "Easy", grade: "Elementary",
    question: "What are the three main states of matter?",
    options: ["Hot, warm, and cold", "Solid, liquid, and gas", "Hard, soft, and squishy", "Metal, wood, and plastic"],
    answer: 1,
    explanation: "Matter exists in three states: solid (keeps its shape), liquid (flows and takes the shape of its container), and gas (spreads out to fill all available space). Water is a great example — ice is solid, water is liquid, and steam is gas!"
  },
  {
    id: 117, subject: "Chemistry", topic: "Mixtures & Solutions", difficulty: "Easy", grade: "Elementary",
    question: "What happens when you stir sugar into warm water?",
    options: ["The sugar burns away", "The sugar dissolves — spreading evenly through the water", "The water turns into a solid", "The water evaporates instantly"],
    answer: 1,
    explanation: "Sugar dissolves in water to make a solution. The sugar hasn't disappeared — it breaks into tiny invisible pieces mixed evenly through the water. If you boil off the water, the sugar reappears!"
  },
  {
    id: 118, subject: "Chemistry", topic: "Physical vs Chemical Change", difficulty: "Easy", grade: "Elementary",
    question: "Which is the best clue that a CHEMICAL change has happened?",
    options: ["The object changes shape (like clay being molded)", "Ice melts into liquid water", "A new substance is produced — like bubbles of gas or a new smell", "A ball rolls down a hill"],
    answer: 2,
    explanation: "Chemical changes make brand-new substances. Signs include: gas bubbles forming, a new smell, light or heat being released, or a color change you didn't cause. Melting ice and molding clay are physical changes — the same material is still there, just in a different form."
  },

  // ══════════════════════════════════════════════════════════════════════════
  //  MIDDLE SCHOOL (Grades 6–8)
  // ══════════════════════════════════════════════════════════════════════════

  // ── Middle School · Physics ───────────────────────────────────────────────
  {
    id: 201, subject: "Physics", topic: "Speed & Motion", difficulty: "Easy", grade: "Middle",
    question: "A cyclist travels 60 km in 2 hours. What is her average speed?",
    options: ["20 km/h", "30 km/h", "120 km/h", "60 km/h"],
    answer: 1,
    explanation: "Speed = distance ÷ time = 60 km ÷ 2 h = 30 km/h. Speed tells us how fast something moves."
  },
  {
    id: 202, subject: "Physics", topic: "Newton's Laws", difficulty: "Easy", grade: "Middle",
    question: "A book sits still on a table. What does Newton's first law say about this?",
    options: ["The book has no forces acting on it", "The forces on the book are balanced (net force = 0)", "The table is pushing the book sideways", "Gravity only works on moving objects"],
    answer: 1,
    explanation: "Newton's first law: an object at rest stays at rest if net force = 0. Gravity pulls the book down; the table pushes up with equal normal force. These forces balance, so the book doesn't move."
  },
  {
    id: 203, subject: "Physics", topic: "Density", difficulty: "Medium", grade: "Middle",
    question: "An object has a mass of 150 g and a volume of 50 cm³. What is its density?",
    options: ["3 g/cm³", "0.33 g/cm³", "7500 g/cm³", "100 g/cm³"],
    answer: 0,
    explanation: "Density = mass ÷ volume = 150 g ÷ 50 cm³ = 3 g/cm³. Since water has a density of 1 g/cm³, this object would sink."
  },
  {
    id: 204, subject: "Physics", topic: "Light", difficulty: "Easy", grade: "Middle",
    question: "When white light passes through a prism, it separates into colors. What is this called?",
    options: ["Reflection", "Dispersion", "Refraction", "Absorption"],
    answer: 1,
    explanation: "Dispersion! A prism separates white light into its spectrum (red, orange, yellow, green, blue, indigo, violet) because each color bends at a slightly different angle."
  },
  {
    id: 205, subject: "Physics", topic: "Energy", difficulty: "Medium", grade: "Middle",
    question: "A rollercoaster car is at the top of a hill, not yet moving. What type of energy does it have?",
    options: ["Kinetic energy only", "Thermal energy only", "Potential energy only", "Kinetic and potential energy equally"],
    answer: 2,
    explanation: "At the top of the hill with no motion, the car has gravitational potential energy (PE = mgh). As it rolls down, potential energy converts to kinetic energy."
  },
  // ── Middle School · Chemistry ─────────────────────────────────────────────
  {
    id: 206, subject: "Chemistry", topic: "Atoms & Elements", difficulty: "Easy", grade: "Middle",
    question: "What two particles are found in the nucleus of an atom?",
    options: ["Protons and electrons", "Neutrons and electrons", "Protons and neutrons", "Electrons and quarks"],
    answer: 2,
    explanation: "The nucleus contains protons (positive charge) and neutrons (no charge). Electrons (negative charge) orbit the nucleus in electron shells. The number of protons determines what element it is."
  },
  {
    id: 207, subject: "Chemistry", topic: "Physical vs Chemical Change", difficulty: "Easy", grade: "Middle",
    question: "Which of these is a CHEMICAL change?",
    options: ["Cutting paper", "Melting ice", "Dissolving sugar in water", "Burning wood"],
    answer: 3,
    explanation: "Burning wood is a chemical change — new substances are formed (carbon dioxide, water vapor, ash) and the process cannot easily be reversed. The other options are physical changes."
  },
  {
    id: 208, subject: "Chemistry", topic: "Periodic Table", difficulty: "Easy", grade: "Middle",
    question: "On the periodic table, what does the atomic number of an element represent?",
    options: ["Number of neutrons", "Number of protons", "Atomic mass in grams", "Number of electrons in the outer shell"],
    answer: 1,
    explanation: "The atomic number equals the number of protons in the nucleus. It uniquely identifies each element — carbon always has 6 protons, oxygen always has 8."
  },
  {
    id: 209, subject: "Chemistry", topic: "Acids & Bases", difficulty: "Medium", grade: "Middle",
    question: "A substance has a pH of 7. What is it?",
    options: ["Acidic", "Neutral", "Basic (alkaline)", "Cannot tell from pH alone"],
    answer: 1,
    explanation: "pH 7 is neutral — like pure water. pH below 7 is acidic (like lemon juice, pH ≈ 2). pH above 7 is basic (like baking soda, pH ≈ 9)."
  },
  // ── Middle School · Biology ───────────────────────────────────────────────
  {
    id: 210, subject: "Biology", topic: "Cells", difficulty: "Easy", grade: "Middle",
    question: "Which organelle is found in plant cells but NOT in animal cells?",
    options: ["Mitochondria", "Cell membrane", "Nucleus", "Cell wall"],
    answer: 3,
    explanation: "Plant cells have a rigid cell wall (made of cellulose) that gives them structure and support. Animal cells do not have a cell wall — only a flexible cell membrane."
  },
  {
    id: 211, subject: "Biology", topic: "Cells", difficulty: "Easy", grade: "Middle",
    question: "What is the main difference between a prokaryotic cell and a eukaryotic cell?",
    options: ["Prokaryotes are bigger", "Eukaryotes have a true nucleus; prokaryotes do not", "Prokaryotes have mitochondria; eukaryotes do not", "Eukaryotes are always single-celled"],
    answer: 1,
    explanation: "Eukaryotic cells (animals, plants, fungi) have DNA enclosed in a true membrane-bound nucleus. Prokaryotic cells (bacteria) have no nucleus — their DNA floats in the cytoplasm."
  },
  {
    id: 212, subject: "Biology", topic: "Photosynthesis", difficulty: "Medium", grade: "Middle",
    question: "What is the correct equation for photosynthesis?",
    options: [
      "CO₂ + H₂O → C₆H₁₂O₆ + O₂ (using light energy)",
      "C₆H₁₂O₆ + O₂ → CO₂ + H₂O + energy",
      "CO₂ + O₂ → C₆H₁₂O₆ + H₂O",
      "H₂O → H₂ + O₂ (using light)"
    ],
    answer: 0,
    explanation: "Photosynthesis: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂. Plants take in carbon dioxide and water, use sunlight, and produce glucose (food) and oxygen."
  },
  {
    id: 213, subject: "Biology", topic: "Genetics", difficulty: "Medium", grade: "Middle",
    question: "In pea plants, tall (T) is dominant over short (t). If a Tt plant self-pollinates, what fraction of offspring will be short?",
    options: ["0%", "25%", "50%", "75%"],
    answer: 1,
    explanation: "Tt × Tt gives: TT (25%), Tt (50%), tt (25%). Only tt plants are short (homozygous recessive) = 25% of offspring."
  },
  // ── Middle School · Earth Science ─────────────────────────────────────────
  {
    id: 214, subject: "Earth Science", topic: "Rock Cycle", difficulty: "Easy", grade: "Middle",
    question: "Which type of rock forms from compressed layers of sediment over millions of years?",
    options: ["Igneous", "Metamorphic", "Sedimentary", "Magmatic"],
    answer: 2,
    explanation: "Sedimentary rocks form when sediments (sand, mud, shells) are deposited in layers and slowly compacted and cemented together. Examples: limestone, sandstone, shale."
  },
  {
    id: 215, subject: "Earth Science", topic: "Plate Tectonics", difficulty: "Medium", grade: "Middle",
    question: "Where do most earthquakes and volcanoes occur?",
    options: ["In the middle of continents", "At the centers of tectonic plates", "Along the boundaries between tectonic plates", "Only in the Pacific Ocean"],
    answer: 2,
    explanation: "Most earthquakes and volcanoes happen at plate boundaries where plates meet, collide, or slide past each other. The 'Ring of Fire' around the Pacific is a famous example."
  },
  // ── Middle School · Astronomy ─────────────────────────────────────────────
  {
    id: 216, subject: "Astronomy", topic: "Moon Phases", difficulty: "Easy", grade: "Middle",
    question: "How long does it take the Moon to complete one orbit around Earth?",
    options: ["24 hours", "1 week", "About 27–29 days", "365 days"],
    answer: 2,
    explanation: "The Moon orbits Earth in about 27.3 days (sidereal period). The lunar cycle of phases takes about 29.5 days (synodic period) because Earth is also moving around the Sun."
  },
  {
    id: 217, subject: "Astronomy", topic: "Solar System", difficulty: "Medium", grade: "Middle",
    question: "Which planet has the most moons in our solar system?",
    options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
    answer: 1,
    explanation: "Saturn currently holds the record with 146 confirmed moons (as of recent counts), edging out Jupiter. Both are gas giants with massive gravitational pulls that capture many moons."
  },
  // ── Middle School · Environmental ─────────────────────────────────────────
  {
    id: 218, subject: "Environmental", topic: "Ecosystems", difficulty: "Easy", grade: "Middle",
    question: "Which level of a food pyramid contains the most available energy?",
    options: ["Top predators", "Secondary consumers", "Primary consumers (herbivores)", "Producers (plants)"],
    answer: 3,
    explanation: "Producers contain the most energy. Only about 10% of energy transfers to the next trophic level — the rest is lost as heat. This is why ecosystems can support many more plants than top predators."
  },
  {
    id: 219, subject: "Environmental", topic: "Climate", difficulty: "Medium", grade: "Middle",
    question: "What is the greenhouse effect?",
    options: [
      "The reflection of sunlight back into space by clouds",
      "Gases in the atmosphere trapping heat and warming Earth's surface",
      "The cooling of Earth by plants releasing water vapor",
      "Heat generated by human factories warming cities"
    ],
    answer: 1,
    explanation: "Greenhouse gases (CO₂, CH₄, H₂O vapor) in the atmosphere absorb infrared radiation from Earth's surface and re-emit it, trapping heat like a blanket around the planet."
  },
  {
    id: 220, subject: "Chemistry", topic: "Mixtures", difficulty: "Medium", grade: "Middle",
    question: "What is the best method to separate sand from salt water?",
    options: [
      "Filtration only",
      "Evaporation only",
      "Filtration (to remove sand), then evaporation (to recover salt)",
      "Use a magnet"
    ],
    answer: 2,
    explanation: "Sand doesn't dissolve, so filtration removes it. The salt is dissolved in water — you can't filter it out, but evaporating the water leaves the salt behind."
  },

  // ══════════════════════════════════════════════════════════════════════════
  //  HIGH SCHOOL / COMPETITION (original problems — grade field added)
  // ══════════════════════════════════════════════════════════════════════════

  // ── PHYSICS ──────────────────────────────────────────────────────────────
  {
    id: 1, subject: "Physics", topic: "Mechanics", difficulty: "Easy", grade: "High School",
    question: "A ball is dropped from a height of 20 m. How long does it take to reach the ground? (g = 10 m/s²)",
    options: ["1 s", "2 s", "4 s", "√2 s"],
    answer: 1,
    explanation: "Using h = ½gt², we get 20 = ½ × 10 × t², so t² = 4, giving t = 2 s."
  },
  {
    id: 2, subject: "Physics", topic: "Newton's Laws", difficulty: "Easy", grade: "High School",
    question: "A 5 kg object experiences a net force of 20 N. What is its acceleration?",
    options: ["1 m/s²", "2 m/s²", "4 m/s²", "100 m/s²"],
    answer: 2,
    explanation: "Newton's second law: F = ma → a = F/m = 20/5 = 4 m/s²."
  },
  {
    id: 3, subject: "Physics", topic: "Energy", difficulty: "Medium", grade: "High School",
    question: "A 2 kg block slides down a frictionless ramp of height 5 m. What is its speed at the bottom? (g = 10 m/s²)",
    options: ["5 m/s", "10 m/s", "√50 m/s", "√100 m/s"],
    answer: 1,
    explanation: "Conservation of energy: mgh = ½mv² → v = √(2gh) = √(2×10×5) = √100 = 10 m/s."
  },
  {
    id: 4, subject: "Physics", topic: "Waves", difficulty: "Medium", grade: "High School",
    question: "A wave has frequency 440 Hz and wavelength 0.75 m. What is its speed?",
    options: ["330 m/s", "440 m/s", "586.7 m/s", "0.75 m/s"],
    answer: 0,
    explanation: "Wave speed v = fλ = 440 × 0.75 = 330 m/s (speed of sound in air at room temperature)."
  },
  {
    id: 5, subject: "Physics", topic: "Electricity", difficulty: "Medium", grade: "High School",
    question: "Three resistors of 2Ω, 3Ω, and 6Ω are connected in parallel. What is the equivalent resistance?",
    options: ["11 Ω", "1 Ω", "3.67 Ω", "0.5 Ω"],
    answer: 1,
    explanation: "1/R = 1/2 + 1/3 + 1/6 = 3/6 + 2/6 + 1/6 = 6/6 = 1. So R = 1 Ω."
  },
  {
    id: 6, subject: "Physics", topic: "Optics", difficulty: "Hard", grade: "High School",
    question: "Light passes from glass (n = 1.5) into water (n = 1.33). What is the critical angle for total internal reflection?",
    options: ["62.5°", "48.4°", "41.8°", "27.3°"],
    answer: 0,
    explanation: "sin(θc) = n₂/n₁ = 1.33/1.5 = 0.887. θc = arcsin(0.887) ≈ 62.5°."
  },
  {
    id: 7, subject: "Physics", topic: "Quantum", difficulty: "Olympiad", grade: "High School",
    question: "An electron in a hydrogen atom transitions from n=4 to n=2. Using E_n = -13.6/n² eV, what is the photon energy?",
    options: ["1.89 eV", "2.55 eV", "0.85 eV", "3.40 eV"],
    answer: 1,
    explanation: "ΔE = E₄ - E₂ = -13.6/16 - (-13.6/4) = -0.85 + 3.40 = 2.55 eV. This is the Hα line."
  },
  {
    id: 8, subject: "Physics", topic: "Thermodynamics", difficulty: "Hard", grade: "High School",
    question: "An ideal gas undergoes an isothermal expansion from 2 L to 4 L at 300 K. What happens to its internal energy?",
    options: ["It doubles", "It halves", "It remains constant", "It increases by nRT ln 2"],
    answer: 2,
    explanation: "For an ideal gas, internal energy depends only on temperature. Isothermal means constant temperature, so ΔU = 0."
  },

  // ── CHEMISTRY ────────────────────────────────────────────────────────────
  {
    id: 9, subject: "Chemistry", topic: "Stoichiometry", difficulty: "Easy", grade: "High School",
    question: "How many moles are in 44 g of CO₂? (M = 44 g/mol)",
    options: ["0.5 mol", "1 mol", "2 mol", "44 mol"],
    answer: 1,
    explanation: "n = mass/molar mass = 44/44 = 1 mol."
  },
  {
    id: 10, subject: "Chemistry", topic: "Acids & Bases", difficulty: "Easy", grade: "High School",
    question: "What is the pH of a solution with [H⁺] = 10⁻³ M?",
    options: ["3", "7", "11", "-3"],
    answer: 0,
    explanation: "pH = -log[H⁺] = -log(10⁻³) = 3. The solution is acidic."
  },
  {
    id: 11, subject: "Chemistry", topic: "Periodic Table", difficulty: "Medium", grade: "High School",
    question: "Which element has the highest electronegativity on the Pauling scale?",
    options: ["Oxygen", "Nitrogen", "Chlorine", "Fluorine"],
    answer: 3,
    explanation: "Fluorine has the highest electronegativity (3.98 on the Pauling scale) due to its small atomic radius and high nuclear charge."
  },
  {
    id: 12, subject: "Chemistry", topic: "Equilibrium", difficulty: "Medium", grade: "High School",
    question: "For N₂(g) + 3H₂(g) ⇌ 2NH₃(g), what happens to equilibrium if pressure is increased?",
    options: ["Shifts left (more N₂ and H₂)", "Shifts right (more NH₃)", "No change", "Depends on temperature"],
    answer: 1,
    explanation: "By Le Chatelier's principle, increased pressure shifts equilibrium toward fewer moles of gas. Left has 4 moles, right has 2 — equilibrium shifts right."
  },
  {
    id: 13, subject: "Chemistry", topic: "Redox", difficulty: "Hard", grade: "High School",
    question: "In the reaction: MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O, what is the oxidation state change of Mn?",
    options: ["+7 to +2", "+2 to +7", "+7 to 0", "+4 to +2"],
    answer: 0,
    explanation: "In MnO₄⁻, oxygen is -2 (×4 = -8), so Mn must be +7 to give overall -1. In Mn²⁺, Mn is +2. Change: +7 → +2 (gain of 5 electrons)."
  },
  {
    id: 14, subject: "Chemistry", topic: "Organic", difficulty: "Hard", grade: "High School",
    question: "Which reaction mechanism produces an inversion of configuration (Walden inversion)?",
    options: ["SN1", "SN2", "E1", "E2"],
    answer: 1,
    explanation: "SN2 (bimolecular nucleophilic substitution) proceeds via a backside attack, causing 100% inversion of configuration at the stereocenter."
  },
  {
    id: 15, subject: "Chemistry", topic: "Thermodynamics", difficulty: "Olympiad", grade: "High School",
    question: "The Gibbs free energy change for a reaction is -120 kJ/mol at 298 K. What is the equilibrium constant K?",
    options: ["≈ e⁴⁸", "≈ e⁻⁴⁸", "≈ 1.0", "≈ e²⁴"],
    answer: 0,
    explanation: "ΔG° = -RT ln K → ln K = -ΔG°/RT = 120000/(8.314×298) ≈ 48.4. So K ≈ e⁴⁸ ≈ 10²¹."
  },

  // ── BIOLOGY ──────────────────────────────────────────────────────────────
  {
    id: 16, subject: "Biology", topic: "Cell Biology", difficulty: "Easy", grade: "High School",
    question: "Which organelle is known as the 'powerhouse of the cell'?",
    options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi apparatus"],
    answer: 2,
    explanation: "Mitochondria produce ATP through cellular respiration (oxidative phosphorylation), earning the 'powerhouse' title."
  },
  {
    id: 17, subject: "Biology", topic: "Genetics", difficulty: "Easy", grade: "High School",
    question: "In a monohybrid cross between two Aa parents, what fraction of offspring is homozygous recessive?",
    options: ["1/4", "1/2", "3/4", "0"],
    answer: 0,
    explanation: "Aa × Aa gives 1/4 AA : 2/4 Aa : 1/4 aa. The homozygous recessive (aa) proportion is 1/4."
  },
  {
    id: 18, subject: "Biology", topic: "Photosynthesis", difficulty: "Medium", grade: "High School",
    question: "Which molecule is the primary electron donor in the light reactions of photosynthesis?",
    options: ["NADPH", "Water (H₂O)", "CO₂", "Glucose"],
    answer: 1,
    explanation: "In the light reactions, water is split (photolysis) at Photosystem II, releasing O₂ and providing electrons to the electron transport chain."
  },
  {
    id: 19, subject: "Biology", topic: "Molecular Biology", difficulty: "Medium", grade: "High School",
    question: "Which enzyme synthesizes RNA from a DNA template?",
    options: ["DNA polymerase", "Reverse transcriptase", "RNA polymerase", "Helicase"],
    answer: 2,
    explanation: "RNA polymerase transcribes DNA into mRNA by reading the template strand 3'→5' and synthesizing RNA 5'→3'."
  },
  {
    id: 20, subject: "Biology", topic: "Evolution", difficulty: "Hard", grade: "High School",
    question: "Which of the following is NOT a condition required for Hardy-Weinberg equilibrium?",
    options: ["Large population size", "Random mating", "Natural selection occurring", "No gene flow"],
    answer: 2,
    explanation: "Hardy-Weinberg equilibrium requires: large population, random mating, NO natural selection, no mutation, and no gene flow. Natural selection violates this assumption."
  },
  {
    id: 21, subject: "Biology", topic: "Neuroscience", difficulty: "Olympiad", grade: "High School",
    question: "The resting membrane potential of a neuron is approximately -70 mV. Which ions are primarily responsible?",
    options: ["High K⁺ inside, high Na⁺ outside", "High Na⁺ inside, high K⁺ outside", "High Ca²⁺ inside, high Cl⁻ outside", "High H⁺ inside, high HCO₃⁻ outside"],
    answer: 0,
    explanation: "The resting potential is maintained by K⁺ concentration gradient (high inside) and Na⁺/K⁺-ATPase pumping. K⁺ leaks out making the inside negative."
  },

  // ── ASTRONOMY ────────────────────────────────────────────────────────────
  {
    id: 22, subject: "Astronomy", topic: "Solar System", difficulty: "Easy", grade: "High School",
    question: "What is the name of the largest moon of Saturn?",
    options: ["Europa", "Ganymede", "Titan", "Callisto"],
    answer: 2,
    explanation: "Titan is Saturn's largest moon and the only moon in the solar system with a dense atmosphere, primarily composed of nitrogen."
  },
  {
    id: 23, subject: "Astronomy", topic: "Stellar Physics", difficulty: "Medium", grade: "High School",
    question: "A star has a surface temperature twice that of the Sun but the same radius. How does its luminosity compare to the Sun's?",
    options: ["2× brighter", "4× brighter", "8× brighter", "16× brighter"],
    answer: 3,
    explanation: "Luminosity L = 4πR²σT⁴. If T doubles with same R, L increases by 2⁴ = 16. The star is 16× more luminous."
  },
  {
    id: 24, subject: "Astronomy", topic: "Cosmology", difficulty: "Medium", grade: "High School",
    question: "What is the approximate age of the universe according to current measurements?",
    options: ["4.5 billion years", "8.0 billion years", "13.8 billion years", "20.0 billion years"],
    answer: 2,
    explanation: "Based on CMB measurements (Planck mission) and Hubble constant estimates, the universe is approximately 13.8 billion years old."
  },
  {
    id: 25, subject: "Astronomy", topic: "Orbital Mechanics", difficulty: "Hard", grade: "High School",
    question: "Using Kepler's third law, if Earth's orbital period is 1 year at 1 AU, what is the orbital period of a planet at 4 AU?",
    options: ["4 years", "8 years", "16 years", "2 years"],
    answer: 1,
    explanation: "T² ∝ a³ → T² = a³ (in AU and years). For a = 4: T² = 4³ = 64, T = √64 = 8 years."
  },
  {
    id: 26, subject: "Astronomy", topic: "Black Holes", difficulty: "Olympiad", grade: "High School",
    question: "What is the Schwarzschild radius of an object with mass M?",
    options: ["r = GM/c²", "r = 2GM/c²", "r = GM/c", "r = 4GM/c²"],
    answer: 1,
    explanation: "The Schwarzschild radius is r_s = 2GM/c², derived by setting the escape velocity equal to c. For the Sun, r_s ≈ 3 km."
  },

  // ── EARTH SCIENCE ────────────────────────────────────────────────────────
  {
    id: 27, subject: "Earth Science", topic: "Plate Tectonics", difficulty: "Easy", grade: "High School",
    question: "What type of boundary forms when two plates move away from each other?",
    options: ["Convergent", "Transform", "Divergent", "Subduction"],
    answer: 2,
    explanation: "Divergent boundaries occur where plates move apart, creating rift zones (e.g., Mid-Atlantic Ridge) and new oceanic crust via seafloor spreading."
  },
  {
    id: 28, subject: "Earth Science", topic: "Rocks & Minerals", difficulty: "Easy", grade: "High School",
    question: "Which rock type forms from the cooling of magma?",
    options: ["Sedimentary", "Metamorphic", "Igneous", "Limestone"],
    answer: 2,
    explanation: "Igneous rocks form from cooling and solidification of magma (underground) or lava (surface). Examples include granite and basalt."
  },
  {
    id: 29, subject: "Earth Science", topic: "Atmosphere", difficulty: "Medium", grade: "High School",
    question: "What gas makes up approximately 78% of Earth's atmosphere?",
    options: ["Oxygen", "Carbon dioxide", "Argon", "Nitrogen"],
    answer: 3,
    explanation: "Earth's atmosphere is ~78% N₂, ~21% O₂, ~0.93% Ar, and ~0.04% CO₂ by volume."
  },
  {
    id: 30, subject: "Earth Science", topic: "Seismology", difficulty: "Hard", grade: "High School",
    question: "What is the Mohorovičić discontinuity?",
    options: ["The boundary between inner and outer core", "The boundary between crust and mantle", "The boundary between lithosphere and asthenosphere", "The boundary between outer core and mantle"],
    answer: 1,
    explanation: "The Moho is the seismic discontinuity marking the boundary between Earth's crust and mantle, at ~5-70 km depth, where P-wave velocity jumps sharply."
  },

  {
    id: 36, subject: "Earth Science", topic: "Geophysics", difficulty: "Olympiad", grade: "High School",
    question: "Earth's magnetic field is primarily generated by which mechanism?",
    options: [
      "Permanent magnetism of iron in the solid inner core",
      "Convective flow of conducting liquid iron in the outer core coupled with Earth's rotation (geodynamo)",
      "Solar wind interacting with ionized gases in the upper atmosphere",
      "Tidal deformation of the iron-rich lower mantle by the Moon"
    ],
    answer: 1,
    explanation: "The geodynamo: convective motion of the liquid iron-nickel outer core, amplified by the Coriolis effect from Earth's rotation, drives electrical currents that sustain the magnetic field via electromagnetic induction. The solid inner core is above its Curie temperature so cannot be permanently magnetized."
  },

  // ── ENVIRONMENTAL SCIENCE ─────────────────────────────────────────────────
  {
    id: 31, subject: "Environmental", topic: "Climate", difficulty: "Easy", grade: "High School",
    question: "Which greenhouse gas has increased most significantly due to human activity since 1750?",
    options: ["Methane (CH₄)", "Carbon dioxide (CO₂)", "Nitrous oxide (N₂O)", "Water vapor"],
    answer: 1,
    explanation: "Atmospheric CO₂ has increased from ~280 ppm (pre-industrial) to over 420 ppm, primarily from fossil fuel combustion and deforestation."
  },
  {
    id: 32, subject: "Environmental", topic: "Ecology", difficulty: "Medium", grade: "High School",
    question: "At which trophic level is the most energy available in an ecosystem?",
    options: ["Top predators", "Secondary consumers", "Primary consumers", "Producers"],
    answer: 3,
    explanation: "By the 10% rule, energy is lost at each trophic level. Producers (plants) capture solar energy and have the most energy available — typically 10× that of primary consumers."
  },
  {
    id: 33, subject: "Environmental", topic: "Biogeochemical Cycles", difficulty: "Hard", grade: "High School",
    question: "Which process converts atmospheric N₂ into ammonia (NH₃) that plants can use?",
    options: ["Nitrification", "Denitrification", "Nitrogen fixation", "Ammonification"],
    answer: 2,
    explanation: "Nitrogen fixation, carried out by bacteria like Rhizobium and Azotobacter, converts N₂ to NH₃ using the enzyme nitrogenase, requiring significant energy."
  },
  {
    id: 34, subject: "Environmental", topic: "Pollution", difficulty: "Medium", grade: "High School",
    question: "Acid rain is primarily caused by emissions of which two gases?",
    options: ["CO₂ and CH₄", "SO₂ and NOₓ", "O₃ and CO", "HCl and HF"],
    answer: 1,
    explanation: "SO₂ (from coal burning) and NOₓ (from vehicles and industry) react with water vapor to form H₂SO₄ and HNO₃, producing acid rain (pH < 5.6)."
  },
  {
    id: 35, subject: "Environmental", topic: "Biodiversity", difficulty: "Olympiad", grade: "High School",
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
