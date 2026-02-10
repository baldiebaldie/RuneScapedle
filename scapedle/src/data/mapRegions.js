// Region definitions for OSRS interactive map
// Each region has a bounding box defined in percentage coordinates (0-100)
// This allows the regions to scale with the map image

// Categories for hot/cold feedback
export const REGION_CATEGORIES = {
  OVERWORLD: 'overworld',
  RAIDS: 'raids',
  BOSSES: 'bosses',
  MINIGAMES: 'minigames',
  OTHER: 'other'
};

// Temperature levels for feedback
export const TEMPERATURE = {
  CORRECT: 'correct',      // Exact match
  HOT: 'hot',              // Same category, nearby region
  WARM: 'warm',            // Same category, different region
  COLD: 'cold',            // Different category
  FROZEN: 'frozen'         // Very far (e.g., overworld vs raids)
};

export const mapRegions = {
  // Tutorial Island
  tutorial_island: {
    id: "tutorial_island",
    name: "Tutorial Island",
    category: REGION_CATEGORIES.OVERWORLD,
    bounds: { x: 18, y: 72, width: 6, height: 5 },
    // Nearby regions for "hot" detection
    nearbyRegions: ["lumbridge", "port_sarim"]
  },

  // Lumbridge Area
  lumbridge: {
    id: "lumbridge",
    name: "Lumbridge",
    category: REGION_CATEGORIES.OVERWORLD,
    bounds: { x: 25, y: 58, width: 8, height: 10 },
    nearbyRegions: ["draynor", "varrock", "al_kharid", "tutorial_island"]
  },

  // Draynor
  draynor: {
    id: "draynor",
    name: "Draynor",
    category: REGION_CATEGORIES.OVERWORLD,
    bounds: { x: 19, y: 55, width: 6, height: 8 },
    nearbyRegions: ["lumbridge", "port_sarim", "falador"]
  },

  // Varrock
  varrock: {
    id: "varrock",
    name: "Varrock",
    category: REGION_CATEGORIES.OVERWORLD,
    bounds: { x: 28, y: 42, width: 10, height: 12 },
    nearbyRegions: ["lumbridge", "wilderness", "morytania"]
  },

  // Falador
  falador: {
    id: "falador",
    name: "Falador",
    category: REGION_CATEGORIES.OVERWORLD,
    bounds: { x: 16, y: 47, width: 9, height: 10 },
    nearbyRegions: ["draynor", "port_sarim", "camelot", "troll_country"]
  },

  // Port Sarim
  port_sarim: {
    id: "port_sarim",
    name: "Port Sarim",
    category: REGION_CATEGORIES.OVERWORLD,
    bounds: { x: 17, y: 59, width: 6, height: 7 },
    nearbyRegions: ["draynor", "falador", "karamja", "tutorial_island"]
  },

  // Karamja
  karamja: {
    id: "karamja",
    name: "Karamja",
    category: REGION_CATEGORIES.OVERWORLD,
    bounds: { x: 14, y: 68, width: 12, height: 15 },
    nearbyRegions: ["port_sarim", "ape_atoll"]
  },

  // Al Kharid
  al_kharid: {
    id: "al_kharid",
    name: "Al Kharid",
    category: REGION_CATEGORIES.OVERWORLD,
    bounds: { x: 32, y: 58, width: 8, height: 12 },
    nearbyRegions: ["lumbridge", "desert"]
  },

  // Kharidian Desert
  desert: {
    id: "desert",
    name: "Kharidian Desert",
    category: REGION_CATEGORIES.OVERWORLD,
    bounds: { x: 28, y: 70, width: 16, height: 18 },
    nearbyRegions: ["al_kharid"]
  },

  // Wilderness
  wilderness: {
    id: "wilderness",
    name: "Wilderness",
    category: REGION_CATEGORIES.OVERWORLD,
    bounds: { x: 18, y: 12, width: 22, height: 30 },
    nearbyRegions: ["varrock", "fremennik"]
  },

  // Ardougne
  ardougne: {
    id: "ardougne",
    name: "Ardougne",
    category: REGION_CATEGORIES.OVERWORLD,
    bounds: { x: 8, y: 48, width: 8, height: 10 },
    nearbyRegions: ["yanille", "camelot", "tirannwn"]
  },

  // Yanille
  yanille: {
    id: "yanille",
    name: "Yanille",
    category: REGION_CATEGORIES.OVERWORLD,
    bounds: { x: 6, y: 60, width: 6, height: 6 },
    nearbyRegions: ["ardougne"]
  },

  // Camelot/Catherby
  camelot: {
    id: "camelot",
    name: "Camelot",
    category: REGION_CATEGORIES.OVERWORLD,
    bounds: { x: 10, y: 42, width: 8, height: 8 },
    nearbyRegions: ["ardougne", "fremennik", "falador"]
  },

  // Morytania
  morytania: {
    id: "morytania",
    name: "Morytania",
    category: REGION_CATEGORIES.OVERWORLD,
    bounds: { x: 40, y: 42, width: 16, height: 22 },
    nearbyRegions: ["varrock"]
  },

  // Fremennik
  fremennik: {
    id: "fremennik",
    name: "Fremennik Province",
    category: REGION_CATEGORIES.OVERWORLD,
    bounds: { x: 8, y: 22, width: 12, height: 16 },
    nearbyRegions: ["camelot", "wilderness", "troll_country"]
  },

  // Tirannwn (Elven lands)
  tirannwn: {
    id: "tirannwn",
    name: "Tirannwn",
    category: REGION_CATEGORIES.OVERWORLD,
    bounds: { x: 2, y: 50, width: 8, height: 18 },
    nearbyRegions: ["ardougne"]
  },

  // Troll Country
  troll_country: {
    id: "troll_country",
    name: "Troll Country",
    category: REGION_CATEGORIES.OVERWORLD,
    bounds: { x: 14, y: 32, width: 8, height: 10 },
    nearbyRegions: ["fremennik", "falador", "weiss"]
  },

  // Ape Atoll
  ape_atoll: {
    id: "ape_atoll",
    name: "Ape Atoll",
    category: REGION_CATEGORIES.OVERWORLD,
    bounds: { x: 10, y: 82, width: 6, height: 6 },
    nearbyRegions: ["karamja"]
  },

  // Kourend - Hosidius
  hosidius: {
    id: "hosidius",
    name: "Hosidius",
    category: REGION_CATEGORIES.OVERWORLD,
    bounds: { x: 60, y: 48, width: 8, height: 10 },
    nearbyRegions: ["shayzien", "piscarilius", "arceuus", "lovakengj"]
  },

  // Kourend - Arceuus
  arceuus: {
    id: "arceuus",
    name: "Arceuus",
    category: REGION_CATEGORIES.OVERWORLD,
    bounds: { x: 58, y: 36, width: 8, height: 8 },
    nearbyRegions: ["hosidius", "lovakengj", "piscarilius"]
  },

  // Kourend - Lovakengj
  lovakengj: {
    id: "lovakengj",
    name: "Lovakengj",
    category: REGION_CATEGORIES.OVERWORLD,
    bounds: { x: 52, y: 32, width: 8, height: 10 },
    nearbyRegions: ["shayzien", "arceuus"]
  },

  // Kourend - Shayzien
  shayzien: {
    id: "shayzien",
    name: "Shayzien",
    category: REGION_CATEGORIES.OVERWORLD,
    bounds: { x: 52, y: 44, width: 8, height: 10 },
    nearbyRegions: ["hosidius", "lovakengj"]
  },

  // Kourend - Piscarilius
  piscarilius: {
    id: "piscarilius",
    name: "Piscarilius",
    category: REGION_CATEGORIES.OVERWORLD,
    bounds: { x: 66, y: 36, width: 8, height: 8 },
    nearbyRegions: ["hosidius", "arceuus"]
  },

  // Weiss
  weiss: {
    id: "weiss",
    name: "Weiss",
    category: REGION_CATEGORIES.OVERWORLD,
    bounds: { x: 18, y: 8, width: 6, height: 6 },
    nearbyRegions: ["troll_country", "fremennik"]
  }
};

// Special locations that appear in the side panel (not on map)
export const specialLocations = {
  // Raids
  chambers_of_xeric: {
    id: "chambers_of_xeric",
    name: "Chambers of Xeric",
    category: REGION_CATEGORIES.RAIDS,
    nearbyRegions: ["theatre_of_blood", "tombs_of_amascut"]
  },
  theatre_of_blood: {
    id: "theatre_of_blood",
    name: "Theatre of Blood",
    category: REGION_CATEGORIES.RAIDS,
    nearbyRegions: ["chambers_of_xeric", "tombs_of_amascut"]
  },
  tombs_of_amascut: {
    id: "tombs_of_amascut",
    name: "Tombs of Amascut",
    category: REGION_CATEGORIES.RAIDS,
    nearbyRegions: ["chambers_of_xeric", "theatre_of_blood"]
  },

  // Bosses
  god_wars_dungeon: {
    id: "god_wars_dungeon",
    name: "God Wars Dungeon",
    category: REGION_CATEGORIES.BOSSES,
    nearbyRegions: ["zulrah", "vorkath", "corporeal_beast", "the_nightmare"]
  },
  zulrah: {
    id: "zulrah",
    name: "Zulrah",
    category: REGION_CATEGORIES.BOSSES,
    nearbyRegions: ["god_wars_dungeon", "vorkath"]
  },
  vorkath: {
    id: "vorkath",
    name: "Vorkath",
    category: REGION_CATEGORIES.BOSSES,
    nearbyRegions: ["zulrah", "god_wars_dungeon"]
  },
  corporeal_beast: {
    id: "corporeal_beast",
    name: "Corporeal Beast",
    category: REGION_CATEGORIES.BOSSES,
    nearbyRegions: ["god_wars_dungeon", "the_nightmare"]
  },
  the_nightmare: {
    id: "the_nightmare",
    name: "The Nightmare",
    category: REGION_CATEGORIES.BOSSES,
    nearbyRegions: ["corporeal_beast", "god_wars_dungeon"]
  },
  the_gauntlet: {
    id: "the_gauntlet",
    name: "The Gauntlet",
    category: REGION_CATEGORIES.BOSSES,
    nearbyRegions: ["zulrah", "vorkath"]
  },

  // Minigames
  fight_caves: {
    id: "fight_caves",
    name: "Fight Caves",
    category: REGION_CATEGORIES.MINIGAMES,
    nearbyRegions: ["inferno"]
  },
  inferno: {
    id: "inferno",
    name: "The Inferno",
    category: REGION_CATEGORIES.MINIGAMES,
    nearbyRegions: ["fight_caves"]
  },
  pest_control: {
    id: "pest_control",
    name: "Pest Control",
    category: REGION_CATEGORIES.MINIGAMES,
    nearbyRegions: ["castle_wars", "barbarian_assault"]
  },
  castle_wars: {
    id: "castle_wars",
    name: "Castle Wars",
    category: REGION_CATEGORIES.MINIGAMES,
    nearbyRegions: ["pest_control", "soul_wars"]
  },
  barbarian_assault: {
    id: "barbarian_assault",
    name: "Barbarian Assault",
    category: REGION_CATEGORIES.MINIGAMES,
    nearbyRegions: ["pest_control"]
  },
  trouble_brewing: {
    id: "trouble_brewing",
    name: "Trouble Brewing",
    category: REGION_CATEGORIES.MINIGAMES,
    nearbyRegions: ["tempoross"]
  },
  wintertodt: {
    id: "wintertodt",
    name: "Wintertodt",
    category: REGION_CATEGORIES.MINIGAMES,
    nearbyRegions: ["tempoross", "guardians_of_the_rift"]
  },
  tempoross: {
    id: "tempoross",
    name: "Tempoross",
    category: REGION_CATEGORIES.MINIGAMES,
    nearbyRegions: ["wintertodt", "trouble_brewing"]
  },
  soul_wars: {
    id: "soul_wars",
    name: "Soul Wars",
    category: REGION_CATEGORIES.MINIGAMES,
    nearbyRegions: ["castle_wars"]
  },
  guardians_of_the_rift: {
    id: "guardians_of_the_rift",
    name: "Guardians of the Rift",
    category: REGION_CATEGORIES.MINIGAMES,
    nearbyRegions: ["wintertodt"]
  },

  // Other
  login_screen: {
    id: "login_screen",
    name: "Login Screen",
    category: REGION_CATEGORIES.OTHER,
    nearbyRegions: []
  },
  player_owned_house: {
    id: "player_owned_house",
    name: "Player-Owned House",
    category: REGION_CATEGORIES.OTHER,
    nearbyRegions: []
  },
  underground: {
    id: "underground",
    name: "Underground/Dungeons",
    category: REGION_CATEGORIES.OTHER,
    nearbyRegions: ["catacombs_of_kourend"]
  },
  catacombs_of_kourend: {
    id: "catacombs_of_kourend",
    name: "Catacombs of Kourend",
    category: REGION_CATEGORIES.OTHER,
    nearbyRegions: ["underground"]
  },
  various: {
    id: "various",
    name: "Various Locations",
    category: REGION_CATEGORIES.OTHER,
    nearbyRegions: []
  }
};

// Mapping from music track locations to region IDs
export const locationToRegion = {
  // Tutorial Island & Lumbridge area
  "Tutorial Island": "tutorial_island",
  "Lumbridge": "lumbridge",
  "Lumbridge Castle": "lumbridge",
  "Lumbridge Swamp": "lumbridge",
  "Lumbridge farms": "lumbridge",
  "Draynor Manor": "draynor",

  // Varrock & Wilderness
  "Varrock": "varrock",
  "Varrock Palace": "varrock",
  "Wilderness": "wilderness",
  "Deep Wilderness": "wilderness",

  // Falador
  "Falador": "falador",

  // Port Sarim & Karamja
  "Port Sarim": "port_sarim",
  "Karamja": "karamja",
  "Ship to Karamja": "port_sarim",
  "Brimhaven": "karamja",

  // Al Kharid & Desert
  "Al Kharid": "al_kharid",
  "Kharidian Desert": "desert",
  "Duel Arena": "al_kharid",

  // Ardougne & Yanille
  "Ardougne": "ardougne",
  "Yanille": "yanille",

  // Camelot & Catherby
  "Camelot": "camelot",
  "Catherby": "camelot",

  // Morytania
  "Morytania": "morytania",
  "Canifis": "morytania",
  "Slayer Tower": "morytania",
  "Mort Myre Swamp": "morytania",
  "Barrows": "morytania",

  // Fremennik
  "Rellekka": "fremennik",
  "Fremennik Province": "fremennik",
  "Miscellania": "fremennik",

  // Tirannwn & Elves
  "Tirannwn": "tirannwn",
  "Lletya": "tirannwn",
  "Prifddinas": "tirannwn",

  // Troll Country
  "Troll Stronghold": "troll_country",
  "Troll Country": "troll_country",
  "Ice Path": "weiss",
  "Weiss": "weiss",

  // Ape Atoll
  "Ape Atoll": "ape_atoll",

  // Kourend
  "Hosidius": "hosidius",
  "Arceuus": "arceuus",
  "Lovakengj": "lovakengj",
  "Shayzien": "shayzien",
  "Piscarilius": "piscarilius",
  "Catacombs of Kourend": "catacombs_of_kourend",

  // Raids
  "Chambers of Xeric": "chambers_of_xeric",
  "Theatre of Blood": "theatre_of_blood",
  "Tombs of Amascut": "tombs_of_amascut",

  // Bosses
  "God Wars Dungeon": "god_wars_dungeon",
  "Zulrah": "zulrah",
  "Vorkath": "vorkath",
  "Corporeal Beast": "corporeal_beast",
  "The Nightmare": "the_nightmare",
  "The Gauntlet": "the_gauntlet",
  "Basilisk Knights": "morytania",

  // Minigames
  "Fight Caves": "fight_caves",
  "The Inferno": "inferno",
  "Pest Control": "pest_control",
  "Castle Wars": "castle_wars",
  "Barbarian Assault": "barbarian_assault",
  "Trouble Brewing": "trouble_brewing",
  "Wintertodt": "wintertodt",
  "Tempoross": "tempoross",
  "Soul Wars": "soul_wars",
  "Guardians of the Rift": "guardians_of_the_rift",

  // Other/Special
  "Login screen": "login_screen",
  "Player-owned house": "player_owned_house",
  "Underground areas": "underground",
  "Various dungeons": "underground",
  "Various temples": "various",
  "Various quest areas": "various",
  "Quest complete": "various",
  "Combat areas": "various",
  "Starting areas": "lumbridge",
  "Various": "various",
  "Mining areas": "various",
  "Farming Guild": "hosidius",
  "Christmas event": "login_screen"
};

// Get all regions (both map and special)
export const getAllRegions = () => {
  return {
    ...mapRegions,
    ...specialLocations
  };
};

// Get region by ID
export const getRegionById = (id) => {
  return mapRegions[id] || specialLocations[id] || null;
};

// Get region for a track location
export const getRegionForLocation = (location) => {
  const regionId = locationToRegion[location];
  if (!regionId) return null;
  return getRegionById(regionId);
};

// Check if a location is a special (side panel) location
export const isSpecialLocation = (regionId) => {
  return !!specialLocations[regionId];
};

// Get special locations by category
export const getSpecialLocationsByCategory = () => {
  const categories = {
    raids: [],
    bosses: [],
    minigames: [],
    other: []
  };

  Object.values(specialLocations).forEach(loc => {
    if (categories[loc.category]) {
      categories[loc.category].push(loc);
    }
  });

  return categories;
};

/**
 * Calculate the "temperature" of a guess
 * Returns a temperature level indicating how close the guess is to the correct answer
 *
 * @param {string} guessedRegionId - The ID of the guessed region
 * @param {string} correctRegionId - The ID of the correct region
 * @returns {object} - { temperature: string, message: string, categoryMatch: boolean }
 */
export const calculateTemperature = (guessedRegionId, correctRegionId) => {
  // Exact match
  if (guessedRegionId === correctRegionId) {
    return {
      temperature: TEMPERATURE.CORRECT,
      message: "Correct!",
      categoryMatch: true
    };
  }

  const guessedRegion = getRegionById(guessedRegionId);
  const correctRegion = getRegionById(correctRegionId);

  if (!guessedRegion || !correctRegion) {
    return {
      temperature: TEMPERATURE.FROZEN,
      message: "Ice cold!",
      categoryMatch: false
    };
  }

  const sameCategory = guessedRegion.category === correctRegion.category;

  // Check if guessed region is nearby the correct one
  const isNearby = correctRegion.nearbyRegions?.includes(guessedRegionId) ||
                   guessedRegion.nearbyRegions?.includes(correctRegionId);

  if (sameCategory && isNearby) {
    return {
      temperature: TEMPERATURE.HOT,
      message: "Hot! Very close!",
      categoryMatch: true
    };
  }

  if (sameCategory) {
    return {
      temperature: TEMPERATURE.WARM,
      message: "Warm - right category!",
      categoryMatch: true
    };
  }

  // Different category
  return {
    temperature: TEMPERATURE.COLD,
    message: "Cold - wrong category",
    categoryMatch: false
  };
};

/**
 * Get the category display name
 */
export const getCategoryDisplayName = (category) => {
  const names = {
    [REGION_CATEGORIES.OVERWORLD]: 'Overworld',
    [REGION_CATEGORIES.RAIDS]: 'Raids',
    [REGION_CATEGORIES.BOSSES]: 'Bosses',
    [REGION_CATEGORIES.MINIGAMES]: 'Minigames',
    [REGION_CATEGORIES.OTHER]: 'Other'
  };
  return names[category] || category;
};

/**
 * Get color for temperature level
 */
export const getTemperatureColor = (temperature) => {
  const colors = {
    [TEMPERATURE.CORRECT]: '#4caf50',  // Green
    [TEMPERATURE.HOT]: '#ff5722',      // Deep orange
    [TEMPERATURE.WARM]: '#ff9800',     // Orange
    [TEMPERATURE.COLD]: '#2196f3',     // Blue
    [TEMPERATURE.FROZEN]: '#9c27b0'    // Purple (ice cold)
  };
  return colors[temperature] || '#666';
};
