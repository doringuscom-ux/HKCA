/**
 * DisciplineData.js
 * Comprehensive information for each sport category supported by HKCA.
 */

export const disciplinesData = {
  'canoe-sprint': {
    title: 'Canoe Sprint',
    subtitle: 'Speed. Power. Precision.',
    iconType: 'sprint',
    keywords: ['sprint', 'racing', 'flatwater', 'canoe'],
    fallbackImg: 'https://res.cloudinary.com/dyfkf3vic/image/upload/v1775892115/hkca/assets/n4boksb44ammoowfzgg7.jpg',
    overview: 'Canoe Sprint is a race on flat water where athletes compete in kayaks (K) or canoes (C) over various distances. It is an Olympic sport held on a straight course divided into lanes. The objective is simple: reach the finish line in the shortest time possible.',
    equipment: [
      { name: 'Racing Kayak (K1/K2/K4)', desc: 'Lightweight, narrow boats designed for maximum speed and hydrodynamic efficiency.' },
      { name: 'Canoe (C1/C2)', desc: 'Open boats where the athlete kneels, requiring exceptional balance and strength.' },
      { name: 'Carbon Fiber Paddle', desc: 'Symmetrical or asymmetrical blades engineered for high-performance power transfer.' },
      { name: 'Standard Buoyancy Aid', desc: 'Mandatory safety equipment for protection during training and competitive heats.' }
    ],
    training: [
      { name: 'Strength', desc: 'Focus on cardiovascular endurance and explosive upper-body strength.' },
      { name: 'Technical', desc: 'Technical drills centered on stroke efficiency and boat balance.' },
      { name: 'HIIT', desc: 'High-intensity interval training (HIIT) on water and in the gym.' }
    ]
  },
  'canoe-slalom-kayak-cross': {
    title: 'Canoe Slalom',
    subtitle: 'Technical. Turbulent. Thrilling.',
    iconType: 'slalom',
    keywords: ['slalom', 'cross', 'whitewater', 'kayak'],
    fallbackImg: 'https://res.cloudinary.com/dyfkf3vic/image/upload/v1775892113/hkca/assets/io0bhzeqj4c7ty0x6elt.jpg',
    overview: 'Canoe Slalom is a technical whitewater sport where athletes navigate through a series of hanging gates in a turbulent river or artificial course. Kayak Cross adds a head-to-head racing element, making it one of the most exciting disciplines in paddling sports.',
    equipment: [
      { name: 'Slalom Kayak', desc: 'Highly maneuverable boats with flat hulls for quick rotations and aggressive carving.' },
      { name: 'Reinforced Helmet', desc: 'Critical protection against impacts in turbulent whitewater environments.' },
      { name: 'Spraydeck', desc: 'A flexible waterproof cover that prevents water from entering the boat cockpit.' },
      { name: 'High-Impact Life Jacket', desc: 'Specially designed buoyancy aids that allow for maximum range of arm motion.' }
    ],
    training: []
  },
  'paracanoe': {
    title: 'Paracanoe',
    subtitle: 'Inclusive. Resilient. Elite.',
    iconType: 'para',
    keywords: ['paracanoe', 'para', 'disability', 'adaptive'],
    fallbackImg: 'https://res.cloudinary.com/dyfkf3vic/image/upload/v1775892113/hkca/assets/fsknobjvh3xaiyelej13.jpg',
    overview: 'Paracanoe is the elite discipline for athletes with physical impairments. It mirrors Canoe Sprint but features adaptive equipment to allow all athletes to compete on an equal footing. It is a celebrated Paralympic sport that demonstrates incredible human resilience.',
    equipment: [
      { name: 'Adaptive Kayak', desc: 'Boats fitted with specialized seating and internal supports to match athlete needs.' },
      { name: 'Outriggers (Va)', desc: 'Stabilizing floats used in the Va category to ensure safety and balance.' },
      { name: 'Custom Grips', desc: 'Modified paddle handles for athletes with restricted hand or arm mobility.' },
      { name: 'Safety Harnesses', desc: 'Quick-release systems used to secure athletes while maintaining safe egress.' }
    ],
    training: []
  },
  'dragon-boat': {
    title: 'Dragon Boat',
    subtitle: 'Teamwork. Heritage. Pulse.',
    iconType: 'dragon',
    keywords: ['dragon', 'team', 'drummer', 'racing'],
    fallbackImg: 'https://res.cloudinary.com/dyfkf3vic/image/upload/v1775892113/hkca/assets/qj9hdj57esdmhyxetxlf.jpg',
    overview: 'Dragon Boat is a high-energy team sport rooted in ancient Chinese tradition. A standard crew consists of 20 paddlers, a drummer to lead the rhythm, and a sweep to steer. It is a sport of pure synchronized power.',
    equipment: [
      { name: 'Dragon Boat (12m)', desc: 'Long, narrow wooden or fiberglass hulls designed for high crew counts.' },
      { name: 'Steering Oar', desc: 'A long oar used by the "sweep" at the rear to guide the boat path.' },
      { name: 'The Drum', desc: 'The heartbeat of the boat, situated at the front to coordinate the paddlers.' },
      { name: 'T-Grip Paddles', desc: 'Shorter, single-blade paddles designed for rapid, shallow strokes.' }
    ],
    training: []
  },
  'canoe-marathon': {
    title: 'Canoe Marathon',
    subtitle: 'Endurance. Grit. Strategy.',
    iconType: 'marathon',
    keywords: ['marathon', 'distance', 'portage', 'long'],
    fallbackImg: 'https://res.cloudinary.com/dyfkf3vic/image/upload/v1775892115/hkca/assets/fzgpw4xpbfxnoegcgq5y.jpg',
    overview: 'Canoe Marathon is the ultimate test of endurance. Races often span over 20 kilometers and include "portages," where athletes must exit the water and run with their boats across land before re-entering.',
    equipment: [
      { name: 'Marathon Kayak', desc: 'Specially lightweight boats designed to be carried during portage sections.' },
      { name: 'Hydration Systems', desc: 'On-board water bladders for sustained performance during long hours.' },
      { name: 'Feather-weight Paddle', desc: 'Ultra-light carbon fiber paddles to minimize arm fatigue over 20km.' },
      { name: 'Quick-release Footrests', desc: 'Designed for rapid entry and exit during portages.' }
    ],
    training: []
  },
  'canoe-polo': {
    title: 'Canoe Polo',
    subtitle: 'Tactical. Explosive. Competitive.',
    iconType: 'polo',
    keywords: ['polo', 'ball', 'team', 'contact'],
    fallbackImg: 'https://res.cloudinary.com/dyfkf3vic/image/upload/v1775892114/hkca/assets/paabqefyn1kvfevowvd7.jpg',
    overview: 'Canoe Polo is a fast-paced team ball game played in kayaks on a small rectangular pitch. It combines the skills of kayaking, water polo, and basketball into a thrilling competitive experience.',
    equipment: [
      { name: 'Polo Kayak', desc: 'Short, agile boats with rounded, padded ends for safety during contact.' },
      { name: 'Face Mask Helmet', desc: 'Mandatory protection against stray paddles and high-speed balls.' },
      { name: 'Integrated Body Armor', desc: 'Internal padding within life jackets to protect against impacts.' },
      { name: 'Standard Polo Ball', desc: 'Official water-polo style ball designed for wet-grip and buoyancy.' }
    ],
    training: []
  },
  'stand-up-paddling': {
    title: 'Stand Up Paddling',
    subtitle: 'Fitness. Balance. Versatility.',
    iconType: 'sup',
    keywords: ['sup', 'stand up', 'paddling', 'board'],
    fallbackImg: 'https://res.cloudinary.com/dyfkf3vic/image/upload/v1775892114/hkca/assets/vggwmxt0mjc0pglicgqo.jpg',
    overview: 'SUP is one of the fastest-growing water sports. Athletes stand on a larger board and use a long-shafted paddle. It varies from leisurely touring to high-intensity technical and distance racing.',
    equipment: [
      { name: 'Racing SUP Board', desc: 'Narrow, sleek boards designed for tracking efficiency and glide.' },
      { name: 'Long-Shaft Paddle', desc: 'Adjustable or fixed paddles designed for the standing position.' },
      { name: 'Coiled Ankle Leash', desc: 'Crucial safety gear that keeps the board attached to the athlete.' },
      { name: 'Fin Systems', desc: 'Removable fins optimized for straight-line tracking or quick turns.' }
    ],
    training: []
  },
  'wildwater-canoeing': {
    title: 'Wildwater Canoeing',
    subtitle: 'Primal. Fast. Unstoppable.',
    iconType: 'wildwater',
    keywords: ['wildwater', 'river', 'whitewater', 'rapids'],
    fallbackImg: 'https://res.cloudinary.com/dyfkf3vic/image/upload/v1775892113/hkca/assets/ucwjzsat82mfa3wygako.jpg',
    overview: 'Wildwater Canoeing is pure racing down turbulent river sections. Athletes must choose the fastest line through rapids, waves, and obstacles, often reaching incredible speeds in natural environments.',
    equipment: [
      { name: 'Wildwater Kayak', desc: 'Boats with a high-volume "V" shaped hull to ride over large waves.' },
      { name: 'Full-Coverage Helmet', desc: 'Wraparound head protection designed for rocky river environments.' },
      { name: 'Reinforced Paddle', desc: 'Heavy-duty carbon or fiberglass blades that can withstand rock impacts.' },
      { name: 'Safety Throwbag', desc: 'Rescue equipment carried for emergency assistance in rapids.' }
    ],
    training: []
  }
};
