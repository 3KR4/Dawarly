import { BiSolidStoreAlt } from "react-icons/bi";
import {
  FaHome,
  FaCar,
  FaTshirt,
  FaBriefcase,
  FaFootballBall,
  FaTools,
  FaIndustry,
  FaBabyCarriage,
} from "react-icons/fa";
import { FaMobileScreenButton, FaDog } from "react-icons/fa6";
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
    name: { en: "Properties", ar: "عقارات" },
    icon: BiSolidStoreAlt,
  },
  {
    id: 2,
    key: "vehicles",
    name: { en: "Vehicles", ar: "مركبات" },
    icon: FaCar,
  },
  {
    id: 3,
    key: "mobiles-tablets",
    name: { en: "Mobiles & Tablets", ar: "موبايلات وتابلت" },
    icon: FaMobileScreenButton,
  },
  {
    id: 4,
    key: "electronics",
    name: { en: "Electronics", ar: "إلكترونيات" },
    icon: SiApplearcade,
  },
  {
    id: 5,
    key: "home-office",
    name: { en: "Home & Office", ar: "المنزل والمكتب" },
    icon: FaHome,
  },
  {
    id: 6,
    key: "fashion",
    name: { en: "Fashion", ar: "أزياء" },
    icon: FaTshirt,
  },
  {
    id: 7,
    key: "jobs",
    name: { en: "Jobs", ar: "وظائف" },
    icon: FaBriefcase,
  },
  {
    id: 8,
    key: "services",
    name: { en: "Services", ar: "خدمات" },
    icon: FaTools,
  },
  {
    id: 9,
    key: "pets",
    name: { en: "Pets", ar: "حيوانات أليفة" },
    icon: FaDog,
  },
  {
    id: 10,
    key: "kids-babies",
    name: { en: "Kids & Babies", ar: "أطفال ورضع" },
    icon: FaBabyCarriage,
  },
  {
    id: 11,
    key: "sports-hobbies",
    name: { en: "Sports & Hobbies", ar: "رياضة وهوايات" },
    icon: FaFootballBall,
  },
  {
    id: 12,
    key: "business-industrial",
    name: { en: "Business & Industrial", ar: "أعمال وصناعة" },
    icon: FaIndustry,
  },
];

export const subcategories = [
  // ========= Properties =========
  { id: 101, categoryId: 1, name: { en: "Apartments for Sale", ar: "شقق للبيع" } },
  { id: 102, categoryId: 1, name: { en: "Apartments for Rent", ar: "شقق للإيجار" } },
  { id: 103, categoryId: 1, name: { en: "Villas", ar: "فيلات" } },
  { id: 104, categoryId: 1, name: { en: "Commercial", ar: "عقارات تجارية" } },
  { id: 105, categoryId: 1, name: { en: "Lands", ar: "أراضي" } },

  // ========= Vehicles =========
  { id: 201, categoryId: 2, name: { en: "Cars", ar: "سيارات" } },
  { id: 202, categoryId: 2, name: { en: "Motorcycles", ar: "دراجات نارية" } },
  { id: 203, categoryId: 2, name: { en: "Spare Parts", ar: "قطع غيار" } },
  { id: 204, categoryId: 2, name: { en: "Heavy Vehicles", ar: "مركبات ثقيلة" } },

  // ========= Mobiles & Tablets =========
  { id: 301, categoryId: 3, name: { en: "Mobile Phones", ar: "موبايلات" } },
  { id: 302, categoryId: 3, name: { en: "Tablets", ar: "تابلت" } },
  { id: 303, categoryId: 3, name: { en: "Accessories", ar: "إكسسوارات" } },

  // ========= Electronics =========
  { id: 401, categoryId: 4, name: { en: "TV & Audio", ar: "تلفزيونات وصوتيات" } },
  { id: 402, categoryId: 4, name: { en: "Computers", ar: "كمبيوتر" } },
  { id: 403, categoryId: 4, name: { en: "Video Games", ar: "ألعاب فيديو" } },
  { id: 404, categoryId: 4, name: { en: "Cameras", ar: "كاميرات" } },

  // ========= Home & Office =========
  { id: 501, categoryId: 5, name: { en: "Furniture", ar: "أثاث" } },
  { id: 502, categoryId: 5, name: { en: "Office Furniture", ar: "أثاث مكتبي" } },
  { id: 503, categoryId: 5, name: { en: "Home Decor", ar: "ديكور" } },

  // ========= Fashion =========
  { id: 601, categoryId: 6, name: { en: "Men Clothing", ar: "ملابس رجالي" } },
  { id: 602, categoryId: 6, name: { en: "Women Clothing", ar: "ملابس حريمي" } },
  { id: 603, categoryId: 6, name: { en: "Shoes & Bags", ar: "أحذية وشنط" } },

  // ========= Jobs =========
  { id: 701, categoryId: 7, name: { en: "Full Time Jobs", ar: "وظائف دوام كامل" } },
  { id: 702, categoryId: 7, name: { en: "Part Time Jobs", ar: "وظائف دوام جزئي" } },
  { id: 703, categoryId: 7, name: { en: "Freelance", ar: "عمل حر" } },

  // ========= Services =========
  { id: 801, categoryId: 8, name: { en: "Home Services", ar: "خدمات منزلية" } },
  { id: 802, categoryId: 8, name: { en: "Education", ar: "تعليم" } },
  { id: 803, categoryId: 8, name: { en: "Repair Services", ar: "صيانة" } },

  // ========= Pets =========
  { id: 901, categoryId: 9, name: { en: "Dogs", ar: "كلاب" } },
  { id: 902, categoryId: 9, name: { en: "Cats", ar: "قطط" } },
  { id: 903, categoryId: 9, name: { en: "Pet Accessories", ar: "مستلزمات حيوانات" } },

  // ========= Kids & Babies =========
  { id: 1001, categoryId: 10, name: { en: "Toys", ar: "ألعاب" } },
  { id: 1002, categoryId: 10, name: { en: "Clothes", ar: "ملابس أطفال" } },
  { id: 1003, categoryId: 10, name: { en: "Baby Gear", ar: "مستلزمات رضع" } },

  // ========= Sports & Hobbies =========
  { id: 1101, categoryId: 11, name: { en: "Sports Equipment", ar: "معدات رياضية" } },
  { id: 1102, categoryId: 11, name: { en: "Bicycles", ar: "دراجات" } },
  { id: 1103, categoryId: 11, name: { en: "Musical Instruments", ar: "آلات موسيقية" } },

  // ========= Business & Industrial =========
  { id: 1201, categoryId: 12, name: { en: "Industrial Equipment", ar: "معدات صناعية" } },
  { id: 1202, categoryId: 12, name: { en: "Office Equipment", ar: "معدات مكتبية" } },
  { id: 1203, categoryId: 12, name: { en: "Wholesale", ar: "جملة" } },
];
