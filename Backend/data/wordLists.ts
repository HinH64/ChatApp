export interface WordList {
  category: string;
  difficulty: "easy" | "medium" | "hard";
  words: string[];
}

export const wordLists: WordList[] = [
  // EASY - Common, everyday objects and concepts
  {
    category: "animals",
    difficulty: "easy",
    words: [
      "dog", "cat", "bird", "fish", "horse", "cow", "pig", "chicken",
      "duck", "rabbit", "mouse", "elephant", "lion", "tiger", "bear",
      "monkey", "snake", "frog", "turtle", "butterfly", "bee", "ant",
      "spider", "dolphin", "whale", "shark", "penguin", "owl", "eagle"
    ],
  },
  {
    category: "food",
    difficulty: "easy",
    words: [
      "pizza", "burger", "apple", "banana", "orange", "bread", "cheese",
      "milk", "egg", "rice", "pasta", "chicken", "fish", "cake", "cookie",
      "ice cream", "chocolate", "candy", "soup", "salad", "sandwich",
      "hot dog", "french fries", "popcorn", "watermelon", "strawberry"
    ],
  },
  {
    category: "household",
    difficulty: "easy",
    words: [
      "chair", "table", "bed", "door", "window", "lamp", "clock", "phone",
      "television", "computer", "book", "pen", "cup", "plate", "spoon",
      "fork", "knife", "towel", "pillow", "blanket", "mirror", "soap",
      "toothbrush", "key", "shoe", "hat", "bag", "umbrella", "camera"
    ],
  },
  {
    category: "nature",
    difficulty: "easy",
    words: [
      "sun", "moon", "star", "cloud", "rain", "snow", "tree", "flower",
      "grass", "mountain", "river", "ocean", "beach", "forest", "sky",
      "rainbow", "fire", "water", "rock", "sand", "leaf", "wind"
    ],
  },

  // MEDIUM - More specific concepts
  {
    category: "animals",
    difficulty: "medium",
    words: [
      "giraffe", "zebra", "kangaroo", "koala", "panda", "gorilla",
      "cheetah", "leopard", "rhino", "hippo", "crocodile", "alligator",
      "octopus", "jellyfish", "seahorse", "lobster", "crab", "peacock",
      "flamingo", "parrot", "vulture", "bat", "hedgehog", "squirrel",
      "beaver", "otter", "seal", "walrus", "moose", "deer", "wolf"
    ],
  },
  {
    category: "food",
    difficulty: "medium",
    words: [
      "spaghetti", "lasagna", "burrito", "taco", "sushi", "ramen",
      "pancake", "waffle", "donut", "muffin", "croissant", "bagel",
      "pretzel", "nachos", "quesadilla", "hummus", "guacamole", "yogurt",
      "oatmeal", "cereal", "bacon", "sausage", "steak", "lobster",
      "shrimp", "avocado", "broccoli", "cauliflower", "asparagus"
    ],
  },
  {
    category: "places",
    difficulty: "medium",
    words: [
      "hospital", "airport", "museum", "library", "stadium", "theater",
      "restaurant", "hotel", "castle", "palace", "temple", "church",
      "mosque", "pyramid", "lighthouse", "windmill", "bridge", "tunnel",
      "fountain", "statue", "park", "zoo", "aquarium", "carnival",
      "circus", "mall", "supermarket", "bakery", "pharmacy", "gym"
    ],
  },
  {
    category: "occupations",
    difficulty: "medium",
    words: [
      "doctor", "nurse", "teacher", "engineer", "lawyer", "chef",
      "pilot", "astronaut", "firefighter", "police", "detective",
      "scientist", "artist", "musician", "actor", "photographer",
      "journalist", "architect", "dentist", "veterinarian", "plumber",
      "electrician", "carpenter", "farmer", "fisherman", "mechanic"
    ],
  },
  {
    category: "sports",
    difficulty: "medium",
    words: [
      "basketball", "football", "soccer", "baseball", "tennis", "golf",
      "hockey", "volleyball", "swimming", "boxing", "wrestling", "karate",
      "gymnastics", "skating", "skiing", "snowboarding", "surfing",
      "cycling", "marathon", "archery", "fencing", "bowling", "cricket"
    ],
  },

  // HARD - Abstract concepts, less common items
  {
    category: "concepts",
    difficulty: "hard",
    words: [
      "democracy", "freedom", "justice", "equality", "harmony", "wisdom",
      "courage", "patience", "gratitude", "empathy", "ambition", "destiny",
      "nostalgia", "serenity", "chaos", "paradox", "illusion", "intuition",
      "conscience", "imagination", "inspiration", "perseverance"
    ],
  },
  {
    category: "science",
    difficulty: "hard",
    words: [
      "photosynthesis", "evolution", "gravity", "magnetism", "electricity",
      "radiation", "chromosome", "molecule", "atom", "neutron", "proton",
      "electron", "velocity", "acceleration", "friction", "momentum",
      "wavelength", "frequency", "amplitude", "ecosystem", "organism"
    ],
  },
  {
    category: "mythology",
    difficulty: "hard",
    words: [
      "unicorn", "dragon", "phoenix", "mermaid", "centaur", "griffin",
      "pegasus", "minotaur", "cyclops", "sphinx", "kraken", "hydra",
      "werewolf", "vampire", "zombie", "ghost", "goblin", "troll",
      "ogre", "fairy", "elf", "dwarf", "wizard", "witch", "sorcerer"
    ],
  },
  {
    category: "technology",
    difficulty: "hard",
    words: [
      "algorithm", "database", "encryption", "bandwidth", "firewall",
      "malware", "cryptocurrency", "blockchain", "virtual reality",
      "artificial intelligence", "machine learning", "quantum computer",
      "hologram", "nanotechnology", "biotechnology", "robotics"
    ],
  },
  {
    category: "history",
    difficulty: "hard",
    words: [
      "renaissance", "revolution", "colonization", "industrialization",
      "monarchy", "empire", "dynasty", "civilization", "archaeology",
      "artifact", "hieroglyphics", "gladiator", "samurai", "viking",
      "crusade", "plague", "medieval", "prehistoric", "ancient"
    ],
  },

  // GENERAL category with mixed difficulty
  {
    category: "general",
    difficulty: "easy",
    words: [
      "birthday", "party", "gift", "balloon", "candle", "music", "dance",
      "game", "toy", "friend", "family", "love", "happy", "smile", "laugh",
      "sleep", "dream", "morning", "night", "day", "week", "month", "year"
    ],
  },
  {
    category: "general",
    difficulty: "medium",
    words: [
      "adventure", "mystery", "treasure", "secret", "journey", "discovery",
      "challenge", "victory", "celebration", "tradition", "memory",
      "experience", "opportunity", "achievement", "competition", "teamwork",
      "creativity", "innovation", "communication", "relationship"
    ],
  },
  {
    category: "general",
    difficulty: "hard",
    words: [
      "philosophy", "psychology", "sociology", "anthropology", "metaphor",
      "hypothesis", "phenomenon", "perspective", "consciousness", "existence",
      "authenticity", "vulnerability", "resilience", "sustainability",
      "globalization", "bureaucracy", "infrastructure", "entrepreneur"
    ],
  },
];

/**
 * Get words filtered by category and/or difficulty
 */
export function getWords(
  category?: string,
  difficulty?: "easy" | "medium" | "hard"
): string[] {
  let filtered = wordLists;

  if (category) {
    filtered = filtered.filter((list) => list.category === category);
  }

  if (difficulty) {
    filtered = filtered.filter((list) => list.difficulty === difficulty);
  }

  return filtered.flatMap((list) => list.words);
}

/**
 * Get random words for mayor selection
 */
export function getRandomWordOptions(
  count: number = 5,
  category: string = "general",
  difficulty: "easy" | "medium" | "hard" = "medium"
): string[] {
  const words = getWords(category, difficulty);

  // If not enough words in specific category/difficulty, fall back to all words
  const wordPool = words.length >= count ? words : getWords();

  // Shuffle and pick random words
  const shuffled = [...wordPool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Get all available categories
 */
export function getCategories(): string[] {
  const categories = new Set(wordLists.map((list) => list.category));
  return Array.from(categories);
}

export default wordLists;
