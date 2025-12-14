import { BiSolidStoreAlt } from "react-icons/bi";
import { FaHome, FaCar } from "react-icons/fa";
import { FaMobileScreenButton } from "react-icons/fa6";
import { SiApplearcade } from "react-icons/si";

export const navLinks = [
  {
    title: "governorates",
    link: "/discover",
    departments: [
      {
        name: "Cairo",
        link: "/",
      },
      {
        name: "Alexandria",
        link: "/",
      },
      {
        name: "Giza",
        link: "/",
      },
      {
        name: "Luxor",
        link: "/",
      },
      {
        name: "Aswan",
        link: "/",
      },
    ],
  },
  {
    title: "places",
    link: "/places",
    departments: [
      {
        name: "The Egyptian Museum",
        link: "/",
      },
      {
        name: "The Pyramids of Giza",
        link: "/",
      },
      {
        name: "Abu Simbel Temples",
        link: "/",
      },
    ],
  },
  {
    title: "Masr 360 Nights",
    link: "/nights",
    departments: [
      {
        name: "Nile Parties",
        icon: "MdOutlineCelebration",
        link: "/",
      },
      {
        name: "Safari Nights",
        icon: "MdOutlineNightlife",
        link: "/",
      },
      {
        name: "Restaurants & Cafes",
        icon: "MdRestaurant",
        link: "/",
      },
      {
        name: "Cultural Events",
        icon: "MdLocalActivity",
        link: "/",
      },
    ],
  },
  {
    title: "Marketplace",
    link: "/marketplace",
    departments: [
      { name: "Souvenirs", icon: "MdShoppingBag", link: "/" },
      { name: "Local Crafts", icon: "MdHandyman", link: "/" },
      { name: "Art & Decor", icon: "MdBrush", link: "/" },
      { name: "Traditional Clothes", icon: "MdCheckroom", link: "/" },
    ],
  },
  {
    title: "games",
    link: "/games",
  },
  {
    title: "about us",
    link: "/about",
  },
];
export const slides = [
  {
    image: "/Slides/slide-003.jpg",
    small: "Discover Egypt",
    paragraph:
      "Explore hidden gems, exciting night spots, and real Egyptian culture with dawarly. Your journey starts here — fun, local, and unforgettable.",
    title: "Live the Full Experience",
    btnText: "Explore Now",
    link: "/discover",
  },
  {
    image: "/Slides/slide-005.jpg",
    small: "Play • Explore • Win",
    paragraph:
      "Complete fun challenges at iconic places, earn points, and unlock real rewards — restaurants, handcrafts, and more!",
    title: "Make Every Step a Game",
    btnText: "See Events",
    link: "/nights",
  },
  {
    image: "/Slides/slide-001.jpg",

    small: "Explore Egypt Differently",
    paragraph:
      "Find hidden gems, unique experiences, and special rewards across all Egyptian governorates. dawarly is your smart guide to explore, play, and enjoy every part of Egypt.",
    title: "Discover the Real Egypt",
    btnText: "Visit Marketplace",
    link: "/marketplace",
  },
];
export const ads = [
  {
    id: 1,
    name: "Papyrus Painting of Nefertiti",
    image: "/products/papyrus-nefertiti.jpg",
    images: [
      "/products/papyrus-nefertiti.jpg",
      "/products/siwa-bag.jpg",
      "/products/brass-camel.webp",
      "/products/palm-basket.webp",
      "/products/alabaster-lamp.webp",
    ],
    price: 250,
    sale: 15,
    category: "Souvenirs",
    rate: 4.8,
    reviewsCount: 16,
    description:
      "Hand-painted papyrus artwork depicting Queen Nefertiti, made using traditional Egyptian papyrus techniques.",
    stock: 20,
    specifications: {
      Material: "Papyrus",
      Dimensions: "12 x 16 inches",
      Origin: "Luxor, Egypt",
      Weight: "150g",
      Technique: "Hand-painted using natural pigments",
      Condition: "New – Handmade",
      Care: "Keep away from moisture and direct sunlight",
      Artist: "Crafted by local Egyptian artisans in Luxor",
      ProductionTime: "Each piece takes approximately 2 days to complete",
    },
    tags: ["papyrus", "nefertiti", "egyptian art"],
  },
  {
    id: 2,
    name: "Miniature Pyramid Statue",
    image: "/products/mini-pyramid.jpeg",
    price: 180,
    sale: 10,
    category: "Souvenirs",
    rate: 4.6,
    reviewsCount: 26,
    description:
      "A hand-carved limestone miniature pyramid, symbolizing ancient Egypt’s timeless wonders.",
    stock: 35,
    specifications: {
      Material: "Limestone",
      Dimensions: "4 x 4 inches",
      Origin: "Giza, Egypt",
      Weight: "300g",
    },
    tags: ["souvenir", "pyramid", "handmade"],
  },
  {
    id: 3,
    name: "Brass Camel Figurine",
    image: "/products/brass-camel.webp",
    price: 320,
    sale: 20,
    category: "Souvenirs",
    rate: 4.5,
    reviewsCount: 13,
    description:
      "A detailed brass figurine of a camel, representing the desert heritage of Egypt.",
    stock: 0,
    specifications: {
      Material: "Brass",
      Dimensions: "6 x 5 inches",
      Finish: "Polished",
      Origin: "Cairo, Egypt",
    },
    tags: ["camel", "brass", "egyptian souvenir"],
  },
  {
    id: 4,
    name: "Handwoven Palm Basket",
    image: "/products/palm-basket.webp",
    price: 150,
    sale: 0,
    category: "Local Crafts",
    rate: 4.2,
    reviewsCount: 4,
    description:
      "A beautiful basket made by local Egyptian artisans using natural palm leaves.",
    stock: 8,
    specifications: {
      Material: "Palm leaves",
      Dimensions: "10 x 6 inches",
      Origin: "Siwa Oasis",
      Weight: "200g",
    },
    tags: ["basket", "handmade", "eco-friendly"],
  },
  {
    id: 5,
    name: "Clay Pottery Vase",
    image: "/products/pottery-vase.jpg",
    price: 230,
    sale: 5,
    category: "Local Crafts",
    rate: 4.4,
    reviewsCount: 18,
    description:
      "Traditional clay vase with hand-painted Egyptian patterns and symbols.",
    stock: 30,
    specifications: {
      Material: "Clay",
      Dimensions: "12 x 5 inches",
      Origin: "Fayoum, Egypt",
      Weight: "1kg",
    },
    tags: ["pottery", "vase", "egyptian craft"],
  },
  {
    id: 6,
    name: "Copper Coffee Set",
    image: "/products/copper-coffee-set.jpeg",
    price: 480,
    sale: 10,
    category: "Local Crafts",
    rate: 4.9,
    reviewsCount: 9,
    description:
      "Handcrafted copper coffee set with intricate engravings, perfect for traditional Egyptian coffee serving.",
    stock: 12,
    specifications: {
      Material: "Copper",
      Pieces: "5",
      Origin: "Cairo, Egypt",
      Finish: "Polished",
    },
    tags: ["coffee", "copper", "egyptian craft"],
  },
  {
    id: 7,
    name: "Handmade Alabaster Lamp",
    image: "/products/alabaster-lamp.webp",
    price: 620,
    sale: 25,
    category: "Art & Decor",
    rate: 4.8,
    reviewsCount: 22,
    description:
      "Beautiful alabaster lamp that glows softly, handmade by artisans in Luxor.",
    stock: 0,
    specifications: {
      Material: "Alabaster",
      Dimensions: "8 x 6 inches",
      Origin: "Luxor, Egypt",
      Weight: "2kg",
    },
    tags: ["lamp", "alabaster", "decor"],
  },
  {
    id: 8,
    name: "Hand-Painted Ceramic Plate",
    image: "/products/ceramic-plate.jpeg",
    price: 210,
    sale: 0,
    category: "Art & Decor",
    rate: 4.3,
    reviewsCount: 14,
    description:
      "Colorful ceramic plate featuring traditional Egyptian geometric and floral designs.",
    stock: 22,
    specifications: {
      Material: "Ceramic",
      Dimensions: "10 inches diameter",
      Origin: "Aswan, Egypt",
      Finish: "Glossy",
    },
    tags: ["ceramic", "decor", "handmade"],
  },
  {
    id: 9,
    name: "Wooden Pharaonic Wall Art",
    image: "/products/wood-wall-art.jpg",
    price: 560,
    sale: 15,
    category: "Art & Decor",
    rate: 4.7,
    reviewsCount: 16,
    description:
      "Hand-carved wooden wall panel with ancient Egyptian hieroglyphic designs.",
    stock: 10,
    specifications: {
      Material: "Wood",
      Dimensions: "20 x 14 inches",
      Origin: "Cairo, Egypt",
      Finish: "Natural Wood",
    },
    tags: ["wood", "art", "hieroglyphics"],
  },
  {
    id: 10,
    name: "Bedouin Handwoven Rug",
    image: "/products/bedouin-rug.webp",
    price: 780,
    sale: 20,
    category: "Art & Decor",
    rate: 4.9,
    reviewsCount: 50,
    description:
      "A stunning handmade rug woven by Bedouin women using traditional desert patterns.",
    stock: 8,
    specifications: {
      Material: "Wool & Cotton",
      Dimensions: "60 x 90 inches",
      Origin: "Sinai, Egypt",
      Weight: "3kg",
    },
    tags: ["rug", "handwoven", "bedouin"],
  },
  {
    id: 11,
    name: "Galabeya (Traditional Dress)",
    image: "/products/galabeya.jpg",
    price: 340,
    sale: 5,
    category: "Traditional Clothes",
    rate: 4.6,
    reviewsCount: 8,
    description:
      "Classic Egyptian galabeya with hand embroidery, made from breathable cotton fabric.",
    stock: 25,
    specifications: {
      Material: "Cotton",
      Size: "S / M / L / XL",
      Origin: "Cairo, Egypt",
      Color: "White",
    },
    tags: ["clothes", "galabeya", "traditional"],
  },
  {
    id: 12,
    name: "Bedouin Embroidered Shawl",
    image: "/products/bedouin-shawl.jpg",
    price: 270,
    sale: 10,
    category: "Traditional Clothes",
    rate: 4.5,
    reviewsCount: 30,
    description:
      "Colorful handmade shawl embroidered with traditional Bedouin patterns.",
    stock: 28,
    specifications: {
      Material: "Wool",
      Dimensions: "70 x 30 inches",
      Origin: "Sinai, Egypt",
      Color: "Multicolor",
    },
    tags: ["shawl", "bedouin", "handmade"],
  },
  {
    id: 13,
    name: "Siwan Embroidered Bag",
    image: "/products/siwa-bag.jpg",
    price: 210,
    sale: 15,
    category: "Traditional Clothes",
    rate: 4.4,
    reviewsCount: 7,
    description:
      "Handmade shoulder bag crafted by Siwan women with colorful embroidery inspired by desert culture.",
    stock: 16,
    specifications: {
      Material: "Cotton & Leather",
      Dimensions: "12 x 10 inches",
      Origin: "Siwa Oasis",
      Strap: "Adjustable",
    },
    tags: ["bag", "siwa", "handcrafted"],
  },
  {
    id: 14,
    name: "Handcrafted Copper Bracelet",
    image: "/products/copper-bracelet.webp",
    price: 190,
    sale: 10,
    category: "Souvenirs",
    rate: 4.3,
    reviewsCount: 13,
    description:
      "Beautifully engraved copper bracelet featuring pharaonic symbols and ancient motifs.",
    stock: 40,
    specifications: {
      Material: "Copper",
      Size: "Adjustable",
      Origin: "Cairo, Egypt",
      Finish: "Polished",
    },
    tags: ["bracelet", "copper", "souvenir"],
  },
  {
    id: 15,
    name: "Handmade Clay Candle Holder",
    image: "/products/clay-candle.webp",
    price: 160,
    sale: 0,
    category: "Art & Decor",
    rate: 4.1,
    reviewsCount: 6,
    description:
      "Rustic clay candle holder with Egyptian hand-carved designs, perfect for cozy home decor.",
    stock: 32,
    specifications: {
      Material: "Clay",
      Dimensions: "5 x 4 inches",
      Origin: "Fayoum, Egypt",
      Weight: "400g",
    },
    tags: ["candle", "clay", "decor"],
  },
];
export const filterss = [
  {
    id: "properties",
    sorting: [
      {
        id: "name",
        filters: [
          {
            name: "Name: A to Z",
            value: "a_to_z",
          },
          {
            name: "Name: Z to A",
            value: "z_to_a",
          },
        ],
      },
      {
        id: "price",
        filters: [
          {
            name: "Price: Low to High",
            value: "low_to_high",
          },
          {
            name: "Price: High to Low",
            value: "high_to_low",
          },
        ],
      },

      {
        id: "date",
        filters: [
          {
            name: "Newest",
            value: "newest",
          },
          {
            name: "Oldest",
            value: "oldest",
          },
        ],
      },
    ],
  },
  {
    id: "main",
    sorting: [
      {
        id: "date",
        filters: [
          {
            name: "Newest",
            value: "newest",
          },
          {
            name: "Oldest",
            value: "oldest",
          },
        ],
      },
      {
        id: "price",
        filters: [
          {
            name: "Price: Low to High",
            value: "low_to_high",
          },
          {
            name: "Price: High to Low",
            value: "high_to_low",
          },
        ],
      },
    ],
  },
];
export const govs = [
  "Cairo",
  "Giza",
  "Alexandria",
  "Dakahlia",
  "Red Sea",
  "Beheira",
  "Fayoum",
  "Gharbia",
  "Ismailia",
  "Menofia",
  "Minya",
  "Qaliubiya",
  "New Valley",
  "Suez",
  "Aswan",
  "Assiut",
  "Bani Sweif",
  "Port Said",
  "Damietta",
  "Sharkia",
  "South Sinai",
  "Kafr El Sheikh",
  "Matrouh",
  "Luxor",
  "Qena",
  "North Sinai",
  "Sohag",
];

export const categories = [
  {
    id: 1,
    key: "properties",
    name: {
      en: "Properties",
      ar: "عقارات",
    },
    icon: BiSolidStoreAlt,
  },
  {
    id: 2,
    key: "vehicles",
    name: {
      en: "Vehicles",
      ar: "مركبات",
    },
    icon: FaCar,
  },
  {
    id: 3,
    key: "mobiles-tablets",
    name: {
      en: "Mobiles & Tablets",
      ar: "موبايلات وتابلت",
    },
    icon: FaMobileScreenButton,
  },
  {
    id: 4,
    key: "furniture-decor",
    name: {
      en: "Home & Office Furniture - Decor",
      ar: "أثاث وديكور",
    },
    icon: FaHome,
  },
  {
    id: 5,
    key: "electronics-appliances",
    name: {
      en: "Electronics & Appliances",
      ar: "إلكترونيات وأجهزة",
    },
    icon: SiApplearcade,
  },
];

export const subcategories = [
  {
    id: 101,
    categoryId: 1,
    name: { en: "Apartments for Sale", ar: "شقق للبيع" },
  },
  {
    id: 102,
    categoryId: 1,
    name: { en: "Apartments for Rent", ar: "شقق للإيجار" },
  },
  {
    id: 103,
    categoryId: 1,
    name: { en: "Villas for Sale", ar: "فيلات للبيع" },
  },
  {
    id: 104,
    categoryId: 1,
    name: { en: "Villas for Rent", ar: "فيلات للإيجار" },
  },
  {
    id: 105,
    categoryId: 1,
    name: { en: "Vacation Homes for Sale", ar: "بيوت مصيفية للبيع" },
  },
  {
    id: 106,
    categoryId: 1,
    name: { en: "Vacation Homes for Rent", ar: "بيوت مصيفية للإيجار" },
  },
  {
    id: 107,
    categoryId: 1,
    name: { en: "Commercial for Sale", ar: "تجاري للبيع" },
  },
  {
    id: 108,
    categoryId: 1,
    name: { en: "Commercial for Rent", ar: "تجاري للإيجار" },
  },
  {
    id: 109,
    categoryId: 1,
    name: { en: "Buildings & Lands", ar: "مباني وأراضي" },
  },

  // ========= Vehicles =========
  { id: 201, categoryId: 2, name: { en: "Cars for Sale", ar: "سيارات للبيع" } },
  {
    id: 202,
    categoryId: 2,
    name: { en: "Cars for Rent", ar: "سيارات للإيجار" },
  },
  {
    id: 203,
    categoryId: 2,
    name: {
      en: "Tyres, Batteries, Oils & Accessories",
      ar: "إطارات وبطاريات وإكسسوارات",
    },
  },
  {
    id: 204,
    categoryId: 2,
    name: { en: "Car Spare Parts", ar: "قطع غيار سيارات" },
  },
  {
    id: 205,
    categoryId: 2,
    name: { en: "Motorcycles & Accessories", ar: "دراجات نارية وإكسسوارات" },
  },
  {
    id: 206,
    categoryId: 2,
    name: { en: "Boats - Watercraft", ar: "قوارب ومراكب" },
  },
  {
    id: 207,
    categoryId: 2,
    name: {
      en: "Heavy Trucks, Buses & Other Vehicles",
      ar: "شاحنات وحافلات ومركبات ثقيلة",
    },
  },

  // ========= Mobiles & Tablets =========
  { id: 301, categoryId: 3, name: { en: "Mobile Phones", ar: "موبايلات" } },
  { id: 302, categoryId: 3, name: { en: "Tablets", ar: "تابلت" } },
  {
    id: 303,
    categoryId: 3,
    name: { en: "Mobile & Tablet Accessories", ar: "إكسسوارات موبايل وتابلت" },
  },
  {
    id: 304,
    categoryId: 3,
    name: { en: "Mobile Numbers", ar: "أرقام موبايل" },
  },

  // ========= Furniture & Decor =========
  { id: 401, categoryId: 4, name: { en: "Furniture", ar: "أثاث" } },
  {
    id: 402,
    categoryId: 4,
    name: { en: "Office Furniture", ar: "أثاث مكتبي" },
  },
  {
    id: 403,
    categoryId: 4,
    name: {
      en: "Home Decoration & Accessories",
      ar: "ديكور المنزل وإكسسوارات",
    },
  },
  {
    id: 404,
    categoryId: 4,
    name: { en: "Bathroom & Kitchen Tools", ar: "أدوات حمام ومطبخ" },
  },
  {
    id: 405,
    categoryId: 4,
    name: { en: "Fabric & Bedding", ar: "مفروشات وأقمشة" },
  },
  {
    id: 406,
    categoryId: 4,
    name: { en: "Garden & Outdoor", ar: "حدائق وخارجي" },
  },
  { id: 407, categoryId: 4, name: { en: "Lighting", ar: "إضاءة" } },
  {
    id: 408,
    categoryId: 4,
    name: { en: "Multiple / Other Furniture", ar: "أثاث متنوع" },
  },

  // ========= Electronics =========
  {
    id: 501,
    categoryId: 5,
    name: { en: "TV - Audio - Video", ar: "تلفزيونات وصوتيات" },
  },
  {
    id: 502,
    categoryId: 5,
    name: { en: "Computers & Accessories", ar: "كمبيوتر وإكسسوارات" },
  },
  {
    id: 503,
    categoryId: 5,
    name: { en: "Video Games & Consoles", ar: "ألعاب فيديو وبلايستيشن" },
  },
  {
    id: 504,
    categoryId: 5,
    name: { en: "Cameras & Imaging", ar: "كاميرات وتصوير" },
  },
  {
    id: 505,
    categoryId: 5,
    name: { en: "Security Cameras", ar: "كاميرات مراقبة" },
  },
  {
    id: 506,
    categoryId: 5,
    name: { en: "Camera Accessories", ar: "إكسسوارات كاميرات" },
  },
  {
    id: 507,
    categoryId: 5,
    name: { en: "Binoculars & Telescopes", ar: "مناظير وتلسكوبات" },
  },
  {
    id: 508,
    categoryId: 5,
    name: { en: "Home Appliances", ar: "أجهزة منزلية" },
  },
];
