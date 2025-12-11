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
export const products = [
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
export const orders = [
  {
    id: 1,
    cart: [
      products[0],
      products[1],
      products[2],
      products[3],
      products[4],
      products[5],
    ],
    totalItems: 12,
    cartTotalPrice: 387, // بعد خصم العروض تقريبًا
    customer: {
      id: 101,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+20 111 234 5678",
      nationality: "Egyptian",
      address: "15 Tahrir St, Downtown, Cairo",
    },
    payment: "Card",
    shipping: "Standard",
    orderStatus: "Processing",
    orderDate: "2024-06-01T10:00:00Z",
    notes: "Please leave the package at the front door if no one is home.",
  },
  {
    id: 2,
    cart: [products[6], products[2], products[3], products[4]],
    totalItems: 6,
    cartTotalPrice: 465, // خصم 25% من 620 + شحن
    customer: {
      id: 102,
      name: "Sarah Ahmed",
      email: "sarah.ahmed@example.com",
      phone: "+20 122 678 9012",
      nationality: "Egyptian",
      address: "25 Nile Corniche, Luxor",
    },
    payment: "Cash on Delivery",
    shipping: "Express",

    orderStatus: "Shipped",
    orderDate: "2024-07-12T14:30:00Z",
    notes: "Handle with care — fragile item.",
  },
  {
    id: 3,
    cart: [products[10], products[12], products[3]],
    totalItems: 3,
    cartTotalPrice: 518,
    customer: {
      id: 103,
      name: "Mohamed Elsayed",
      email: "mohamed.elsayed@example.com",
      phone: "+20 100 555 2134",
      nationality: "Egyptian",
      address: "45 El Haram St, Giza",
    },
    payment: "Card",
    shipping: "Standard",
    orderStatus: "Delivered",
    orderDate: "2024-08-20T09:45:00Z",
    notes: "Delivered successfully to the customer.",
  },
  {
    id: 4,
    cart: [products[2], products[8], products[4], products[14]],
    totalItems: 5,
    cartTotalPrice: 573,
    customer: {
      id: 104,
      name: "Emily Brown",
      email: "emily.brown@example.com",
      phone: "+44 755 678 2221",
      nationality: "British",
      address: "Flat 3, 12 Garden Road, Alexandria",
    },
    payment: "Card",
    shipping: "Express",

    orderStatus: "Processing",
    orderDate: "2024-09-03T12:00:00Z",
    notes: "Gift wrap the items, please.",
  },
  {
    id: 5,
    cart: [products[8]],
    totalItems: 1,
    cartTotalPrice: 476,
    customer: {
      id: 105,
      name: "Omar Hassan",
      email: "omar.hassan@example.com",
      phone: "+20 114 333 9855",
      nationality: "Egyptian",
      address: "Villa 8, Rehab City, New Cairo",
    },
    payment: "Cash on Delivery",
    shipping: "Standard",
    orderStatus: "Cancelled",
    orderDate: "2024-09-28T17:10:00Z",
    notes: "Order cancelled before shipping.",
  },
  {
    id: 6,
    cart: [products[9], products[11]],
    totalItems: 2,
    cartTotalPrice: 873,
    customer: {
      id: 106,
      name: "Lina Khaled",
      email: "lina.khaled@example.com",
      phone: "+20 127 456 7893",
      nationality: "Egyptian",
      address: "12 King Farouk St, Ismailia",
    },
    payment: "Card",
    shipping: "Express",
    orderStatus: "Delivered",
    orderDate: "2024-10-10T16:20:00Z",
    notes: "Customer requested to be notified before delivery.",
  },
];
export const productCategories = [
  {
    id: 1,
    name: "Ancient Egypt",
    icon: "🏺",
  },
  {
    id: 2,
    name: "Beaches",
    icon: "🏖️",
    subcategories: [
      { id: 21, name: "Red Sea" },
      { id: 22, name: "Mediterranean" },
      { id: 23, name: "Diving Spots" },
      { id: 24, name: "Resorts" },
    ],
  },
  {
    id: 3,
    name: "Cruises",
    icon: "🚢",
    subcategories: [
      { id: 31, name: "Nile Cruises" },
      { id: 32, name: "Felucca Rides" },
      { id: 33, name: "Sea Cruises" },
    ],
  },
  {
    id: 4,
    name: "Oases & Deserts",
    icon: "🏜️",
    subcategories: [
      { id: 41, name: "Siwa Oasis" },
      { id: 42, name: "Western Desert" },
      { id: 43, name: "White Desert" },
      { id: 44, name: "Safari Tours" },
    ],
  },
  {
    id: 5,
    name: "Religious",
    icon: "🕌",
    subcategories: [
      { id: 51, name: "Islamic" },
      { id: 52, name: "Coptic" },
      { id: 53, name: "Jewish" },
      { id: 54, name: "Sacred Sites" },
    ],
  },
  {
    id: 6,
    name: "Museums",
    icon: "🏛️",
    subcategories: [
      { id: 61, name: "History Museums" },
      { id: 62, name: "Art Museums" },
      { id: 63, name: "Cultural Museums" },
      { id: 64, name: "Science Museums" },
    ],
  },
  {
    id: 7,
    name: "Outdoor Sports",
    icon: "🎯",
    subcategories: [
      { id: 71, name: "Hiking" },
      { id: 72, name: "Climbing" },
      { id: 73, name: "Water Sports" },
      { id: 74, name: "Sandboarding" },
    ],
  },
  {
    id: 8,
    name: "Shopping",
    icon: "🛍️",
    subcategories: [
      { id: 81, name: "Bazaars" },
      { id: 82, name: "Handicrafts" },
      { id: 83, name: "Malls" },
      { id: 84, name: "Souvenirs" },
    ],
  },
];
export const filterss = [
  {
    id: "products list",
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
        id: "status",
        filters: [
          {
            name: "Most Viewed",
            value: "most_viewed",
          },
          {
            name: "Top Sales",
            value: "top_sales",
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
      {
        id: "availability",
        filters: [
          {
            name: "In Stock",
            value: "1",
          },
          {
            name: "Out of Stock",
            value: "0",
          },
        ],
      },
    ],
  },
  {
    id: "main",
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
        id: "status",
        filters: [
          {
            name: "Most Viewed",
            value: "most_viewed",
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
