// beirutBitesData.js
// Curated, hand-written dataset of authentic Lebanese dishes.
// No placeholder/Lorem Ipsum content — every entry is a real dish
// with an original description.

const BEIRUT_BITES = [
  {
    id: 1,
    name: "Kibbeh",
    arabicName: "كبة",
    category: "Main Course",
    icon: "🥘",
    tags: ["fried", "meat", "bulgur", "classic"],
    description:
      "Torpedo-shaped shells of fine bulgur and minced beef or lamb, stuffed with spiced ground meat, pine nuts, and onions, then deep-fried until golden and crisp."
  },
  {
    id: 2,
    name: "Tabbouleh",
    arabicName: "تبولة",
    category: "Salad",
    icon: "🥗",
    tags: ["vegan", "fresh", "salad", "parsley"],
    description:
      "A finely chopped parsley salad brightened with tomato, mint, and lemon juice, with just enough soaked bulgur to bind it — parsley is the star, not a garnish."
  },
  {
    id: 3,
    name: "Fattoush",
    arabicName: "فتوش",
    category: "Salad",
    icon: "🥬",
    tags: ["vegan", "fresh", "salad", "sumac"],
    description:
      "A crunchy mixed salad of romaine, radish, cucumber, and tomato, tossed with crisp toasted pita chips and a tart sumac-lemon dressing."
  },
  {
    id: 4,
    name: "Hummus",
    arabicName: "حمص",
    category: "Mezze",
    icon: "🫘",
    tags: ["vegan", "dip", "chickpea", "mezze"],
    description:
      "Silky pureed chickpeas whipped with tahini, garlic, and lemon, finished with a swirl of olive oil — a mezze table staple served with warm pita."
  },
  {
    id: 5,
    name: "Moutabal (Baba Ghanouj)",
    arabicName: "متبل",
    category: "Mezze",
    icon: "🍆",
    tags: ["vegan", "dip", "eggplant", "smoky", "mezze"],
    description:
      "Charcoal-grilled eggplant mashed with tahini, garlic, and lemon, carrying a distinct smokiness you can't get from an oven-roasted version."
  },
  {
    id: 6,
    name: "Mujadara",
    arabicName: "مجدرة",
    category: "Main Course",
    icon: "🍚",
    tags: ["vegan", "lentils", "rice", "comfort food"],
    description:
      "A humble but beloved dish of stewed lentils and rice, crowned with deeply caramelized onions fried until nearly sweet."
  },
  {
    id: 7,
    name: "Kafta",
    arabicName: "كفتة",
    category: "Main Course",
    icon: "🍢",
    tags: ["grilled", "meat", "skewers"],
    description:
      "Ground beef or lamb hand-mixed with parsley, onion, and seven-spice, shaped onto skewers and grilled over charcoal until charred at the edges."
  },
  {
    id: 8,
    name: "Shawarma",
    arabicName: "شاورما",
    category: "Street Food",
    icon: "🌯",
    tags: ["street food", "meat", "wrap"],
    description:
      "Thinly stacked marinated chicken or beef, slow-roasted on a vertical spit and shaved to order into a wrap with garlic sauce or tahini and pickles."
  },
  {
    id: 9,
    name: "Manakish",
    arabicName: "مناقيش",
    category: "Street Food",
    icon: "🫓",
    tags: ["street food", "breakfast", "za'atar"],
    description:
      "Lebanon's everyday breakfast flatbread, baked fresh and topped with za'atar and olive oil, or melted cheese, straight from a neighborhood oven."
  },
  {
    id: 10,
    name: "Warak Enab",
    arabicName: "ورق عنب",
    category: "Mezze",
    icon: "🍇",
    tags: ["vegan option", "stuffed", "grape leaves", "mezze"],
    description:
      "Grape leaves hand-rolled tightly around a filling of rice, tomato, and herbs (or rice and minced meat), simmered slowly until tender."
  },
  {
    id: 11,
    name: "Kibbeh Nayeh",
    arabicName: "كبة نية",
    category: "Mezze",
    icon: "🥩",
    tags: ["raw", "meat", "traditional", "mezze"],
    description:
      "Finely pounded raw lamb or beef blended with fine bulgur and spices, traditionally worked by hand until smooth, served with olive oil and mint."
  },
  {
    id: 12,
    name: "Fatteh",
    arabicName: "فتة",
    category: "Main Course",
    icon: "🍞",
    tags: ["yogurt", "chickpea", "layered", "comfort food"],
    description:
      "Layers of toasted or fried pita topped with warm chickpeas, garlicky yogurt, and toasted pine nuts — a warming, textural favorite."
  },
  {
    id: 13,
    name: "Sfouf",
    arabicName: "صفوف",
    category: "Dessert",
    icon: "🟨",
    tags: ["dessert", "cake", "vegan option"],
    description:
      "A golden semolina and turmeric cake, lightly sweet and studded with pine nuts or almonds, with a soft, slightly grainy crumb."
  },
  {
    id: 14,
    name: "Knafeh",
    arabicName: "كنافة",
    category: "Dessert",
    icon: "🧀",
    tags: ["dessert", "cheese", "syrup"],
    description:
      "A layer of stretchy, salty cheese sandwiched under crisp shredded kataifi or semolina crust, soaked in rose-scented sugar syrup and served warm."
  },
  {
    id: 15,
    name: "Baklava",
    arabicName: "بقلاوة",
    category: "Dessert",
    icon: "🥮",
    tags: ["dessert", "nuts", "phyllo", "syrup"],
    description:
      "Paper-thin layers of buttered phyllo stacked with crushed pistachios or walnuts, cut into diamonds and drenched in fragrant sugar syrup."
  },
  {
    id: 16,
    name: "Labneh",
    arabicName: "لبنة",
    category: "Mezze",
    icon: "🥣",
    tags: ["vegan option", "yogurt", "breakfast", "mezze"],
    description:
      "Yogurt strained until thick and tangy, spread on a plate with a pool of olive oil and a scatter of mint — equally at home at breakfast or mezze."
  },
  {
    id: 17,
    name: "Batata Harra",
    arabicName: "بطاطا حرة",
    category: "Mezze",
    icon: "🌶️",
    tags: ["vegan", "spicy", "potatoes", "mezze"],
    description:
      "Cubed fried potatoes tossed hot with garlic, cilantro, and chili, delivering a punchy, garlicky heat that cuts through a rich mezze spread."
  },
  {
    id: 18,
    name: "Sayadieh",
    arabicName: "صيادية",
    category: "Main Course",
    icon: "🐟",
    tags: ["fish", "rice", "coastal"],
    description:
      "A coastal specialty of spiced rice cooked in a deeply browned onion stock, topped with pan-seared fish and toasted almonds."
  }
];
