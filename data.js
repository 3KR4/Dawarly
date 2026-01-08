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
    link: "/discover",
  },
  {
    image: "/Slides/slide-005.jpg",
    link: "/nights",
  },
  {
    image: "/Slides/slide-001.jpg",
    link: "/marketplace",
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
  { id: 1, name: "properties", icon: BiSolidStoreAlt },
  { id: 2, name: "vehicles", icon: FaCar },
  { id: 3, name: "mobilesTablets", icon: FaMobileScreenButton },
  { id: 4, name: "electronics", icon: SiApplearcade },
  { id: 5, name: "homeOffice", icon: FaHome },
  { id: 6, name: "fashion", icon: FaTshirt },
  { id: 7, name: "jobs", icon: FaBriefcase },
  { id: 8, name: "services", icon: FaTools },
  { id: 9, name: "pets", icon: FaDog },
  { id: 10, name: "kidsBabies", icon: FaBabyCarriage },
  { id: 11, name: "sportsHobbies", icon: FaFootballBall },
  { id: 12, name: "businessIndustrial", icon: FaIndustry },
];
export const subcategories = [
  { id: 101, categoryId: 1, name: "apartmentsSale" },
  { id: 102, categoryId: 1, name: "apartmentsRent" },
  { id: 103, categoryId: 1, name: "villas" },
  { id: 104, categoryId: 1, name: "commercial" }, // 3
  { id: 105, categoryId: 1, name: "lands" },

  { id: 201, categoryId: 2, name: "cars" },
  { id: 202, categoryId: 2, name: "motorcycles" },
  { id: 203, categoryId: 2, name: "spareParts" },
  { id: 204, categoryId: 2, name: "heavyVehicles" },

  { id: 301, categoryId: 3, name: "mobilePhones" }, // 9
  { id: 302, categoryId: 3, name: "tablets" },
  { id: 303, categoryId: 3, name: "accessories" },

  { id: 401, categoryId: 4, name: "tvAudio" },
  { id: 402, categoryId: 4, name: "computers" },
  { id: 403, categoryId: 4, name: "videoGames" },
  { id: 404, categoryId: 4, name: "cameras" },

  { id: 501, categoryId: 5, name: "furniture" }, // 16
  { id: 502, categoryId: 5, name: "officeFurniture" },
  { id: 503, categoryId: 5, name: "homeDecor" },

  { id: 601, categoryId: 6, name: "menClothing" },
  { id: 602, categoryId: 6, name: "womenClothing" },
  { id: 603, categoryId: 6, name: "shoesBags" },

  { id: 701, categoryId: 7, name: "fullTime" },
  { id: 702, categoryId: 7, name: "partTime" }, // 23
  { id: 703, categoryId: 7, name: "freelance" },

  { id: 801, categoryId: 8, name: "homeServices" },
  { id: 802, categoryId: 8, name: "education" },  // 26
  { id: 803, categoryId: 8, name: "repairServices" },

  { id: 901, categoryId: 9, name: "dogs" },
  { id: 902, categoryId: 9, name: "cats" }, // 29
  { id: 903, categoryId: 9, name: "petAccessories" },

  { id: 1001, categoryId: 10, name: "toys" },
  { id: 1002, categoryId: 10, name: "kidsClothes" },
  { id: 1003, categoryId: 10, name: "babyGear" }, // 33

  { id: 1101, categoryId: 11, name: "sportsEquipment" },
  { id: 1102, categoryId: 11, name: "bicycles" },
  { id: 1103, categoryId: 11, name: "musicalInstruments" },

  { id: 1201, categoryId: 12, name: "industrialEquipment" },
  { id: 1202, categoryId: 12, name: "officeEquipment" },
  { id: 1203, categoryId: 12, name: "wholesale" },
];

// =============================
// Users (15 Egyptian fake users)
// =============================

export const users = [
  {
    id: "u_001",
    first_name: "محمد",
    last_name: "علي",
    email: "m.ali@gmail.com",
    phone: "+201001112233",
    image: "/images/users/u1.png",
    settings: { language: "ar", theme: "dark" },
    saved_listings: [101, 105],
    region: { governorate: "Cairo", city: "Nasr City" },
  },
  {
    id: "u_002",
    first_name: "Ahmed",
    last_name: "Hassan",
    email: "ahmed.hassan@gmail.com",
    phone: "+201022334455",
    image: "/images/users/u2.png",
    settings: { language: "en", theme: "light" },
    saved_listings: [102, 110],
    region: { governorate: "Giza", city: "Dokki" },
  },
  {
    id: "u_003",
    first_name: "محمود",
    last_name: "السيد",
    email: "mahmoud@gmail.com",
    phone: "+201055667788",
    image: "/images/users/u3.png",
    settings: { language: "ar", theme: "dark" },
    saved_listings: [],
    region: { governorate: "Alexandria", city: "Smouha" },
  },
  {
    id: "u_004",
    first_name: "Sara",
    last_name: "Mostafa",
    email: "sara@gmail.com",
    phone: "+201066778899",
    image: "/images/users/u4.png",
    settings: { language: "en", theme: "light" },
    saved_listings: [103],
    region: { governorate: "Cairo", city: "Heliopolis" },
  },
  {
    id: "u_005",
    first_name: "يوسف",
    last_name: "إبراهيم",
    email: "yousef@gmail.com",
    phone: "+201099887766",
    image: "/images/users/u5.png",
    settings: { language: "ar", theme: "dark" },
    saved_listings: [104, 106],
    region: { governorate: "Giza", city: "Sheikh Zayed" },
  },
  {
    id: "u_006",
    first_name: "Omar",
    last_name: "Fathy",
    email: "omar@gmail.com",
    phone: "+201011223344",
    image: "/images/users/u6.png",
    settings: { language: "en", theme: "dark" },
    saved_listings: [107],
    region: { governorate: "Cairo", city: "Maadi" },
  },
  {
    id: "u_007",
    first_name: "منى",
    last_name: "حسين",
    email: "mona@gmail.com",
    phone: "+201044556677",
    image: "/images/users/u7.png",
    settings: { language: "ar", theme: "light" },
    saved_listings: [],
    region: { governorate: "Giza", city: "Haram" },
  },
  {
    id: "u_008",
    first_name: "Khaled",
    last_name: "Samir",
    email: "khaled@gmail.com",
    phone: "+201077889900",
    image: "/images/users/u8.png",
    settings: { language: "en", theme: "dark" },
    saved_listings: [108],
    region: { governorate: "Cairo", city: "New Cairo" },
  },
  {
    id: "u_009",
    first_name: "Heba",
    last_name: "Nasser",
    email: "heba@gmail.com",
    phone: "+201088776655",
    image: "/images/users/u9.png",
    settings: { language: "en", theme: "light" },
    saved_listings: [109],
    region: { governorate: "Alexandria", city: "Stanley" },
  },
  {
    id: "u_010",
    first_name: "عبدالله",
    last_name: "سعيد",
    email: "abdullah@gmail.com",
    phone: "+201033221100",
    image: "/images/users/u10.png",
    settings: { language: "ar", theme: "dark" },
    saved_listings: [],
    region: { governorate: "Dakahlia", city: "Mansoura" },
  },
  {
    id: "u_011",
    first_name: "Nour",
    last_name: "Adel",
    email: "nour@gmail.com",
    phone: "+201055443322",
    image: "/images/users/u11.png",
    settings: { language: "en", theme: "light" },
    saved_listings: [111],
    region: { governorate: "Cairo", city: "Shubra" },
  },
  {
    id: "u_012",
    first_name: "ريم",
    last_name: "فتحي",
    email: "reem@gmail.com",
    phone: "+201066554433",
    image: "/images/users/u12.png",
    settings: { language: "ar", theme: "light" },
    saved_listings: [],
    region: { governorate: "Giza", city: "Faisal" },
  },
  {
    id: "u_013",
    first_name: "Tamer",
    last_name: "Youssef",
    email: "tamer@gmail.com",
    phone: "+201077665544",
    image: "/images/users/u13.png",
    settings: { language: "en", theme: "dark" },
    saved_listings: [112],
    region: { governorate: "Sharqia", city: "Zagazig" },
  },
  {
    id: "u_014",
    first_name: "إيمان",
    last_name: "عبدالرحمن",
    email: "eman@gmail.com",
    phone: "+201088990011",
    image: "/images/users/u14.png",
    settings: { language: "ar", theme: "light" },
    saved_listings: [],
    region: { governorate: "Cairo", city: "Ain Shams" },
  },
  {
    id: "u_015",
    first_name: "Mahmoud",
    last_name: "Kamel",
    email: "mkamel@gmail.com",
    phone: "+201099001122",
    image: "/images/users/u15.png",
    settings: { language: "en", theme: "dark" },
    saved_listings: [113, 114],
    region: { governorate: "Ismailia", city: "Ismailia" },
  },
];

// =============================
// Amenities (Shared objects)
// =============================

export const amenities = [
  { id: 1, name: { ar: "تكييف", en: "air conditioning" } },
  { id: 2, name: { ar: "تدفئة مركزية", en: "central heating" } },
  { id: 3, name: { ar: "انترنت", en: "internet" } },
  { id: 4, name: { ar: "جراج", en: "garage" } },
  { id: 5, name: { ar: "أمن", en: "security" } },
  { id: 6, name: { ar: "مسبح", en: "swimming pool" } },
];
// =============================
// Ads / Listings (15 ads | owned by 5 users)
// =============================

export const ads = [
  // ===== الإعلانات المعدلة من الأصلية (15 إعلان) =====
  {
    id: 101,
    user_id: "u_001",
    title: "شقة للبيع في مدينة نصر",
    description: "شقة 110 متر قريبة من الخدمات",
    price: 1850000,
    category: categories[0], // properties
    sub_category: subcategories[0], // apartmentsSale
    area: {
      governorate: { ar: "القاهرة", en: "Cairo" },
      city: { ar: "مدينة نصر", en: "Nasr City" },
    },
    specs: {
      negotiable: true,
      condition: null,
      area_m2: 110,
      bedrooms: 2,
      bathrooms: 2,
      furnished: false,
      status: "for sale",
      location: "https://maps.app.goo.gl/yjMxu9toMPVHXP7x6",
      amenities: [amenities[4]], // أمن
    },
    images: ["/ads/ap1.jpg"],
    tags: ["شقة", "تمليك"],
    creation_date: "2025-12-05T14:30:00Z",
  },
  {
    id: 102,
    user_id: "u_001",
    title: "iPhone 13 Pro Max",
    description: "256GB – حالة ممتازة",
    price: 28500,
    category: categories[2], // mobilesTablets
    sub_category: subcategories[9], // mobilePhones
    area: {
      governorate: { ar: "القاهرة", en: "Cairo" },
      city: { ar: "مدينة نصر", en: "Nasr City" },
    },
    specs: {
      negotiable: false,
      condition: "used",
      storage_gb: 256,
      battery_health_percent: 92,
      status: null,
      location: "https://maps.app.goo.gl/yjMxu9toMPVHXP7x6",
      amenities: [],
    },
    images: ["/ads/iphone3.jpeg"],
    tags: ["iphone", "apple"],
    creation_date: "2025-12-10T09:15:00Z",
  },
  {
    id: 103,
    user_id: "u_001",
    title: "كنبة مودرن 3 مقاعد",
    description: "خشب زان – حالة جيدة",
    price: 7500,
    category: categories[4], // homeOffice
    sub_category: subcategories[16], // furniture
    area: {
      governorate: { ar: "القاهرة", en: "Cairo" },
      city: { ar: "مدينة نصر", en: "Nasr City" },
    },
    specs: {
      negotiable: true,
      condition: "used",
      material: "wood",
      seats: 3,
      status: null,
      location: "https://maps.app.goo.gl/yjMxu9toMPVHXP7x6",
      amenities: [],
    },
    images: ["/ads/sofa1.jpg"],
    tags: ["كنبة", "أثاث"],
    creation_date: "2025-12-12T16:45:00Z",
  },
  {
    id: 104,
    user_id: "u_002",
    title: "Hyundai Elantra 2019",
    description: "فابريكا بالكامل",
    price: 720000,
    category: categories[1], // vehicles
    sub_category: subcategories[5], // cars
    area: {
      governorate: { ar: "الجيزة", en: "Giza" },
      city: { ar: "الدقي", en: "Dokki" },
    },
    specs: {
      negotiable: true,
      condition: null,
      model_year: 2019,
      km: 85000,
      transmission: "automatic",
      status: "for sale",
      location: "https://maps.app.goo.gl/yjMxu9toMPVHXP7x6",
      amenities: [],
    },
    images: ["/ads/car1.jpg"],
    tags: ["hyundai", "car"],
    creation_date: "2025-12-03T11:20:00Z",
  },
  {
    id: 105,
    user_id: "u_002",
    title: "موتوسيكل هوجن 200",
    description: "جاهز للاستخدام",
    price: 68000,
    category: categories[1], // vehicles
    sub_category: subcategories[6], // motorcycles
    area: {
      governorate: { ar: "الجيزة", en: "Giza" },
      city: { ar: "الدقي", en: "Dokki" },
    },
    specs: {
      negotiable: true,
      condition: null,
      engine_cc: 200,
      status: "for sale",
      location: "https://maps.app.goo.gl/yjMxu9toMPVHXP7x6",
      amenities: [],
    },
    images: ["/ads/bike1.jpg"],
    tags: ["motorcycle"],
    creation_date: "2025-12-04T13:10:00Z",
  },
  {
    id: 106,
    user_id: "u_002",
    title: "لابتوب Dell Latitude",
    description: "i7 – رام 16 جيجا",
    price: 19500,
    category: categories[3], // electronics
    sub_category: subcategories[13], // computers
    area: {
      governorate: { ar: "الجيزة", en: "Giza" },
      city: { ar: "الدقي", en: "Dokki" },
    },
    specs: {
      negotiable: false,
      condition: "used",
      cpu: "i7",
      ram_gb: 16,
      status: null,
      location: "https://maps.app.goo.gl/yjMxu9toMPVHXP7x6",
      amenities: [],
    },
    images: ["/ads/laptop1.webp"],
    tags: ["dell", "laptop"],
    creation_date: "2025-12-07T10:05:00Z",
  },
  {
    id: 107,
    user_id: "u_003",
    title: "شقة للإيجار في سموحة",
    description: "تشطيب سوبر لوكس",
    price: 12000,
    category: categories[0], // properties
    sub_category: subcategories[1], // apartmentsRent
    area: {
      governorate: { ar: "الإسكندرية", en: "Alexandria" },
      city: { ar: "سموحة", en: "Smouha" },
    },
    specs: {
      negotiable: false,
      condition: null,
      area_m2: 95,
      bedrooms: 2,
      bathrooms: 1,
      furnished: true,
      status: "for rent",
      location: "https://maps.app.goo.gl/yjMxu9toMPVHXP7x6",
      amenities: [amenities[0], amenities[4]], // تكييف وأمن
    },
    images: ["/ads/ap2.webp"],
    tags: ["إيجار", "سموحة"],
    creation_date: "2025-12-02T15:40:00Z",
  },
  {
    id: 108,
    user_id: "u_003",
    title: "Samsung Galaxy S22",
    description: "زي الجديد",
    price: 19000,
    category: categories[2], // mobilesTablets
    sub_category: subcategories[9], // mobilePhones
    area: {
      governorate: { ar: "الإسكندرية", en: "Alexandria" },
      city: { ar: "سموحة", en: "Smouha" },
    },
    specs: {
      negotiable: false,
      condition: "like new",
      storage_gb: 128,
      status: null,
      location: "https://maps.app.goo.gl/yjMxu9toMPVHXP7x6",
      amenities: [],
    },
    images: ["/ads/mobile1.jpg"],
    tags: ["samsung"],
    creation_date: "2025-12-06T12:25:00Z",
  },
  {
    id: 109,
    user_id: "u_003",
    title: "ترابيزة سفرة 6 كراسي",
    description: "خشب طبيعي",
    price: 9800,
    category: categories[5], // homeOffice
    sub_category: subcategories[16], // furniture
    area: {
      governorate: { ar: "الإسكندرية", en: "Alexandria" },
      city: { ar: "سموحة", en: "Smouha" },
    },
    specs: {
      negotiable: true,
      condition: "used",
      seats: 6,
      status: null,
      location: "https://maps.app.goo.gl/yjMxu9toMPVHXP7x6",
      amenities: [],
    },
    images: ["/ads/table1.jpeg"],
    tags: ["سفرة"],
    creation_date: "2025-12-08T17:50:00Z",
  },
  {
    id: 110,
    user_id: "u_004",
    title: "فستان سواريه",
    description: "لبسة واحدة",
    price: 3500,
    category: categories[6], // fashion
    sub_category: subcategories[20], // womenClothing
    area: {
      governorate: { ar: "القاهرة", en: "Cairo" },
      city: { ar: "هليوبوليس", en: "Heliopolis" },
    },
    specs: {
      negotiable: true,
      condition: "like new",
      size: "M",
      status: null,
      location: "https://maps.app.goo.gl/yjMxu9toMPVHXP7x6",
      amenities: [],
    },
    images: ["/ads/dress1.jpg"],
    tags: ["فستان"],
    creation_date: "2025-12-01T14:15:00Z",
  },
  {
    id: 111,
    user_id: "u_004",
    title: "قط شيرازي",
    description: "مطعم وجاهز",
    price: 2500,
    category: categories[9], // pets
    sub_category: subcategories[29], // cats
    area: {
      governorate: { ar: "القاهرة", en: "Cairo" },
      city: { ar: "هليوبوليس", en: "Heliopolis" },
    },
    specs: {
      negotiable: false,
      condition: "new",
      age_months: 3,
      status: null,
      location: "https://maps.app.goo.gl/yjMxu9toMPVHXP7x6",
      amenities: [],
    },
    images: ["/ads/cat1.webp"],
    tags: ["قطط"],
    creation_date: "2025-12-04T09:30:00Z",
  },
  {
    id: 112,
    user_id: "u_004",
    title: "وظيفة خدمة عملاء",
    description: "دوام كامل",
    price: 0,
    category: categories[7], // jobs
    sub_category: subcategories[23], // fullTime
    area: {
      governorate: { ar: "القاهرة", en: "Cairo" },
      city: { ar: "هليوبوليس", en: "Heliopolis" },
    },
    specs: {
      negotiable: false,
      condition: null,
      salary_range: "6000-8000",
      status: null,
      location: "https://maps.app.goo.gl/yjMxu9toMPVHXP7x6",
      amenities: [],
    },
    images: ["/ads/jop1.jpg"],
    tags: ["وظيفة"],
    creation_date: "2025-12-07T11:45:00Z",
  },
  {
    id: 113,
    user_id: "u_005",
    title: "محل للإيجار",
    description: "موقع مميز",
    price: 15000,
    category: categories[0], // properties
    sub_category: subcategories[3], // commercial
    area: {
      governorate: { ar: "الجيزة", en: "Giza" },
      city: { ar: "الشيخ زايد", en: "Sheikh Zayed" },
    },
    specs: {
      negotiable: true,
      condition: null,
      area_m2: 60,
      status: "for rent",
      location: "https://maps.app.goo.gl/yjMxu9toMPVHXP7x6",
      amenities: [amenities[4]], // أمن
    },
    images: ["/ads/shop1.jpg"],
    tags: ["محل"],
    creation_date: "2025-12-03T16:20:00Z",
  },
  {
    id: 114,
    user_id: "u_005",
    title: "PlayStation 5",
    description: "بحالة ممتازة",
    price: 24000,
    category: categories[3], // electronics
    sub_category: subcategories[14], // videoGames
    area: {
      governorate: { ar: "الجيزة", en: "Giza" },
      city: { ar: "الشيخ زايد", en: "Sheikh Zayed" },
    },
    specs: {
      negotiable: false,
      condition: "used",
      storage_gb: 825,
      status: null,
      location: "https://maps.app.goo.gl/yjMxu9toMPVHXP7x6",
      amenities: [],
    },
    images: ["/ads/ps5.jpg"],
    tags: ["ps5"],
    creation_date: "2025-12-09T13:55:00Z",
  },
  {
    id: 115,
    user_id: "u_005",
    title: "خدمة تنظيف منازل",
    description: "خبرة 5 سنوات",
    price: 300,
    category: categories[7], // services
    sub_category: subcategories[27], // homeServices
    area: {
      governorate: { ar: "الجيزة", en: "Giza" },
      city: { ar: "الشيخ زايد", en: "Sheikh Zayed" },
    },
    specs: {
      negotiable: true,
      condition: null,
      service_type: "cleaning",
      status: null,
      location: "https://maps.app.goo.gl/yjMxu9toMPVHXP7x6",
      amenities: [],
    },
    images: ["/ads/service1.jpg"],
    tags: ["تنظيف"],
    creation_date: "2025-12-11T08:40:00Z",
  },

  // ===== الإعلانات الجديدة من تأليفي (15 إعلان) =====
  {
    id: 201,
    user_id: "u_006",
    title: "شقة دوبلكس للبيع في التجمع",
    description: "دوبلكس 160 متر رووف خاص",
    price: 3200000,
    category: categories[0], // properties
    sub_category: subcategories[0], // apartmentsSale
    area: {
      governorate: { ar: "القاهرة", en: "Cairo" },
      city: { ar: "التجمع الخامس", en: "Fifth Settlement" },
    },
    specs: {
      negotiable: true,
      condition: null,
      area_m2: 160,
      bedrooms: 3,
      bathrooms: 3,
      furnished: false,
      status: "for sale",
      location: "https://maps.app.goo.gl/abc123",
      amenities: [amenities[0], amenities[4], amenities[6]], // تكييف، أمن، مسبح
    },
    images: ["/ads/duplex1.jpg"],
    tags: ["دوبلكس", "تجمع"],
    creation_date: "2025-12-14T10:20:00Z",
  },
  {
    id: 202,
    user_id: "u_007",
    title: "مرسيدس E200 2020",
    description: "فل أوتوماتيك – كاملة المواصفات",
    price: 1850000,
    category: categories[1], // vehicles
    sub_category: subcategories[5], // cars
    area: {
      governorate: { ar: "القاهرة", en: "Cairo" },
      city: { ar: "المعادي", en: "Maadi" },
    },
    specs: {
      negotiable: true,
      condition: null,
      model_year: 2020,
      km: 45000,
      transmission: "automatic",
      status: "for sale",
      location: "https://maps.app.goo.gl/def456",
      amenities: [],
    },
    images: ["/ads/mercedes1.jpg"],
    tags: ["مرسيدس", "سيارة فاخرة"],
    creation_date: "2025-12-15T14:35:00Z",
  },
  {
    id: 203,
    user_id: "u_008",
    title: "iPad Pro 12.9 2022",
    description: "جيل جديد – شاشة كبيرة",
    price: 32000,
    category: categories[2], // mobilesTablets
    sub_category: subcategories[9], // tablets
    area: {
      governorate: { ar: "الجيزة", en: "Giza" },
      city: { ar: "6 أكتوبر", en: "6th October" },
    },
    specs: {
      negotiable: false,
      condition: "like new",
      storage_gb: 256,
      screen_size: "12.9",
      status: null,
      location: "https://maps.app.goo.gl/ghi789",
      amenities: [],
    },
    images: ["/ads/ipad1.jpg"],
    tags: ["ipad", "apple", "تابلت"],
    creation_date: "2025-12-16T11:10:00Z",
  },
  {
    id: 204,
    user_id: "u_009",
    title: "كاميرا Canon EOS R6",
    description: "كاميرا احترافية للمحترفين",
    price: 65000,
    category: categories[3], // electronics
    sub_category: subcategories[15], // cameras
    area: {
      governorate: { ar: "القاهرة", en: "Cairo" },
      city: { ar: "مصر الجديدة", en: "New Cairo" },
    },
    specs: {
      negotiable: true,
      condition: "used",
      megapixels: 20,
      lens_included: true,
      status: null,
      location: "https://maps.app.goo.gl/jkl012",
      amenities: [],
    },
    images: ["/ads/camera1.webp"],
    tags: ["كانون", "كاميرا", "تصوير"],
    creation_date: "2025-12-17T15:45:00Z",
  },
  {
    id: 205,
    user_id: "u_010",
    title: "كرسي مكتب مريح",
    description: "كرسي مكتب إيرغونوميك",
    price: 4500,
    category: categories[4], // homeOffice
    sub_category: subcategories[17], // officeFurniture
    area: {
      governorate: { ar: "الإسكندرية", en: "Alexandria" },
      city: { ar: "ستانلي", en: "Stanley" },
    },
    specs: {
      negotiable: true,
      condition: "new",
      material: "mesh",
      adjustable: true,
      status: null,
      location: "https://maps.app.goo.gl/mno345",
      amenities: [],
    },
    images: ["/ads/chair1.webp"],
    tags: ["كرسي", "مكتب", "مريح"],
    creation_date: "2025-12-18T09:25:00Z",
  },
  {
    id: 206,
    user_id: "u_011",
    title: "حذاء رياضي Nike",
    description: "مقاس 43 – جديد",
    price: 1200,
    category: categories[5], // fashion
    sub_category: subcategories[21], // shoesBags
    area: {
      governorate: { ar: "القاهرة", en: "Cairo" },
      city: { ar: "العتبة", en: "Attaba" },
    },
    specs: {
      negotiable: false,
      condition: "new",
      size: "43",
      brand: "Nike",
      status: null,
      location: "https://maps.app.goo.gl/pqr678",
      amenities: [],
    },
    images: ["/ads/shoes1.webp"],
    tags: ["نايكي", "حذاء رياضي"],
    creation_date: "2025-12-19T13:15:00Z",
  },
  {
    id: 207,
    user_id: "u_012",
    title: "مصمم جرافيك",
    description: "وظيفة مصمم بدوام جزئي",
    price: 0,
    category: categories[6], // jobs
    sub_category: subcategories[23], // partTime
    area: {
      governorate: { ar: "الجيزة", en: "Giza" },
      city: { ar: "المهندسين", en: "Mohandessin" },
    },
    specs: {
      negotiable: false,
      condition: null,
      salary_range: "4000-6000",
      experience: "2+ سنوات",
      status: null,
      location: "https://maps.app.goo.gl/stu901",
      amenities: [],
    },
    images: ["/ads/designer_job.jpg"],
    tags: ["تصميم", "جرافيك", "وظيفة"],
    creation_date: "2025-12-20T10:50:00Z",
  },
  {
    id: 208,
    user_id: "u_013",
    title: "خدمات تصميم مواقع",
    description: "تصميم مواقع احترافية",
    price: 5000,
    category: categories[7], // services
    sub_category: subcategories[26], // education
    area: {
      governorate: { ar: "القاهرة", en: "Cairo" },
      city: { ar: "وسط البلد", en: "Downtown" },
    },
    specs: {
      negotiable: true,
      condition: null,
      service_type: "web_design",
      delivery_time: "7 أيام",
      status: null,
      location: "https://maps.app.goo.gl/vwx234",
      amenities: [],
    },
    images: ["/ads/web_service.webp"],
    tags: ["تصميم مواقع", "ويب"],
    creation_date: "2025-12-21T16:30:00Z",
  },
  {
    id: 209,
    user_id: "u_014",
    title: "جرو جيرمن شيبرد",
    description: "عمر 3 شهور – مطعم",
    price: 8000,
    category: categories[8], // pets
    sub_category: subcategories[28], // dogs
    area: {
      governorate: { ar: "الجيزة", en: "Giza" },
      city: { ar: "الهرم", en: "Haram" },
    },
    specs: {
      negotiable: false,
      condition: "new",
      age_months: 3,
      breed: "German Shepherd",
      status: null,
      location: "https://maps.app.goo.gl/yza567",
      amenities: [],
    },
    images: ["/ads/dog1.jpeg"],
    tags: ["كلاب", "جيرمن شيبرد"],
    creation_date: "2025-12-22T11:40:00Z",
  },
  {
    id: 210,
    user_id: "u_015",
    title: "عربية أطفال جديدة",
    description: "ماركة عالمية – لم تستخدم",
    price: 2200,
    category: categories[9], // kidsBabies
    sub_category: subcategories[33], // babyGear
    area: {
      governorate: { ar: "القاهرة", en: "Cairo" },
      city: { ar: "الزمالك", en: "Zamalek" },
    },
    specs: {
      negotiable: true,
      condition: "new",
      brand: "Chicco",
      color: "أزرق",
      status: null,
      location: "https://maps.app.goo.gl/bcd890",
      amenities: [],
    },
    images: ["/ads/stroller1.jpg"],
    tags: ["عربية أطفال", "مستلزمات أطفال"],
    creation_date: "2025-12-23T14:20:00Z",
  },
  {
    id: 211,
    user_id: "u_016",
    title: "دراجة جبلية Trek",
    description: "سرعة 21 – حالة ممتازة",
    price: 7500,
    category: categories[10], // sportsHobbies
    sub_category: subcategories[35], // bicycles
    area: {
      governorate: { ar: "الإسكندرية", en: "Alexandria" },
      city: { ar: "المنتزه", en: "Montaza" },
    },
    specs: {
      negotiable: true,
      condition: "used",
      speeds: 21,
      frame_size: "19 inch",
      status: null,
      location: "https://maps.app.goo.gl/efg123",
      amenities: [],
    },
    images: ["/ads/bike2.webp"],
    tags: ["دراجة", "رياضة"],
    creation_date: "2025-12-24T09:55:00Z",
  },
  {
    id: 212,
    user_id: "u_017",
    title: "معدات مطعم للبيع",
    description: "كاملة – حالة جيدة",
    price: 85000,
    category: categories[11], // businessIndustrial
    sub_category: subcategories[37], // industrialEquipment
    area: {
      governorate: { ar: "القاهرة", en: "Cairo" },
      city: { ar: "المطرية", en: "Mataria" },
    },
    specs: {
      negotiable: true,
      condition: "used",
      equipment_type: "kitchen",
      includes: ["فرن", "ثلاجة", "معدات طبخ"],
      status: null,
      location: "https://maps.app.goo.gl/hij456",
      amenities: [],
    },
    images: ["/ads/restaurant_equipment.jpg"],
    tags: ["معدات مطعم", "تجاري"],
    creation_date: "2025-12-25T12:10:00Z",
  },
  {
    id: 213,
    user_id: "u_018",
    title: "فيلا للإيجار بالساحل الشمالي",
    description: "4 غرف – على البحر مباشرة",
    price: 25000,
    category: categories[0], // properties
    sub_category: subcategories[2], // villas
    area: {
      governorate: { ar: "الساحل الشمالي", en: "North Coast" },
      city: { ar: "مارينا", en: "Marina" },
    },
    specs: {
      negotiable: false,
      condition: null,
      area_m2: 280,
      bedrooms: 4,
      bathrooms: 5,
      furnished: true,
      status: "for rent",
      location: "https://maps.app.goo.gl/klm789",
      amenities: [amenities[0], amenities[4], amenities[6], amenities[3]], // تكييف، أمن، مسبح، جراج
    },
    images: ["/ads/villa1.jpg"],
    tags: ["فيلا", "ساحل", "إيجار"],
    creation_date: "2025-12-26T17:25:00Z",
  },
  {
    id: 214,
    user_id: "u_019",
    title: "Xbox Series X",
    description: "بحالتها – مع 2 ألعاب",
    price: 21000,
    category: categories[3], // electronics
    sub_category: subcategories[14], // videoGames
    area: {
      governorate: { ar: "الجيزة", en: "Giza" },
      city: { ar: "فيصل", en: "Faisal" },
    },
    specs: {
      negotiable: true,
      condition: "used",
      storage_gb: 1024,
      games_included: 2,
      status: null,
      location: "https://maps.app.goo.gl/nop012",
      amenities: [],
    },
    images: ["/ads/xbox1.jpg"],
    tags: ["اكس بوكس", "ألعاب"],
    creation_date: "2025-12-27T14:45:00Z",
  },
  {
    id: 215,
    user_id: "u_020",
    title: "جيتار كهربائي",
    description: "ماركة فندر – للمحترفين",
    price: 12000,
    category: categories[10], // sportsHobbies
    sub_category: subcategories[36], // musicalInstruments
    area: {
      governorate: { ar: "القاهرة", en: "Cairo" },
      city: { ar: "المعادي", en: "Maadi" },
    },
    specs: {
      negotiable: false,
      condition: "like new",
      brand: "Fender",
      type: "electric",
      status: null,
      location: "https://maps.app.goo.gl/qrs345",
      amenities: [],
    },
    images: ["/ads/guitar1.jpg"],
    tags: ["جيتار", "موسيقى"],
    creation_date: "2025-12-28T11:30:00Z",
  },
];
export const apartmentForSaleFields = [
  {
    key: "type",
    uiType: "select",
    required: true,
    label: {
      ar: "نوع العقار",
      en: "Type",
    },
    placeholder: {
      ar: "اختر النوع",
      en: "Select type",
    },
    requiredMessage: {
      ar: "نوع العقار مطلوب",
      en: "Type is required",
    },
    noTranslate: false,
    options: [
      {
        id: 1,
        name: {
          en: "apartment",
          ar: "شقة",
        },
      },
      {
        id: 2,
        name: {
          en: "duplex",
          ar: "دوبلكس",
        },
      },
      {
        id: 3,
        name: {
          en: "penthouse",
          ar: "بنتهاوس",
        },
      },
      {
        id: 4,
        name: {
          en: "studio",
          ar: "استوديو",
        },
      },
    ],
    tPath: "apartmentTypes",
  },
  {
    key: "area",
    uiType: "input",
    inputType: "number",
    required: true,
    label: {
      ar: "المساحة (م²)",
      en: "Area (m²)",
    },
    placeholder: {
      ar: "ادخل المساحة",
      en: "Enter area",
    },
    requiredMessage: {
      ar: "المساحة مطلوبة",
      en: "Area is required",
    },
    validation: {
      pattern: {
        value: /^[0-9]+$/,
        message: {
          ar: "المساحة يجب أن تكون رقم",
          en: "Area must be a number",
        },
      },
    },
  },
  {
    key: "bedrooms",
    uiType: "select",
    required: true,
    noTranslate: true,
    label: {
      ar: "عدد الغرف",
      en: "Bedrooms",
    },
    placeholder: {
      ar: "اختر عدد الغرف",
      en: "Select bedrooms",
    },
    requiredMessage: {
      ar: "عدد الغرف مطلوب",
      en: "Bedrooms is required",
    },
    options: [
      ...Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: {
          en: `${i + 1}`,
          ar: `${i + 1}`,
        },
      })),
      {
        id: 11,
        name: {
          en: "+10",
          ar: "+10",
        },
      },
    ],
  },
  {
    key: "bathrooms",
    uiType: "select",
    required: true,
    noTranslate: true,
    label: {
      ar: "عدد الحمامات",
      en: "Bathrooms",
    },
    placeholder: {
      ar: "اختر عدد الحمامات",
      en: "Select bathrooms",
    },
    requiredMessage: {
      ar: "عدد الحمامات مطلوب",
      en: "Bathrooms is required",
    },
    options: [
      ...Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: {
          en: `${i + 1}`,
          ar: `${i + 1}`,
        },
      })),
      {
        id: 11,
        name: {
          en: "+10",
          ar: "+10",
        },
      },
    ],
  },
  {
    key: "price",
    uiType: "input",
    inputType: "number",
    required: true,
    label: {
      ar: "السعر",
      en: "Price",
    },
    placeholder: {
      ar: "ادخل السعر",
      en: "Enter price",
    },
    requiredMessage: {
      ar: "السعر مطلوب",
      en: "Price is required",
    },
  },
  {
    key: "paymentOption",
    uiType: "radio",
    required: true,
    label: {
      ar: "طريقة الدفع",
      en: "Payment Option",
    },
    placeholder: {
      ar: "اختر طريقة الدفع",
      en: "Select payment option",
    },
    requiredMessage: {
      ar: "طريقة الدفع مطلوبة",
      en: "Payment option is required",
    },
    options: [
      {
        id: 1,
        value: "Cash",
        label: {
          ar: "نقداً",
          en: "Cash",
        },
      },
      {
        id: 2,
        value: "Installment",
        label: {
          ar: "تقسيط",
          en: "Installment",
        },
      },
      {
        id: 3,
        value: "Cash or Installment",
        label: {
          ar: "نقداً أو تقسيط",
          en: "Cash or Installment",
        },
      },
    ],
  },
  {
    key: "furnished",
    uiType: "boolean",
    required: false,
    label: {
      ar: "مفروش",
      en: "Furnished",
    },
    options: [
      {
        value: true,
        label: {
          ar: "نعم",
          en: "Yes",
        },
      },
      {
        value: false,
        label: {
          ar: "لا",
          en: "No",
        },
      },
    ],
  },
  {
    key: "negotiable",
    uiType: "boolean",
    required: false,
    label: {
      ar: "قابل للتفاوض",
      en: "Negotiable",
    },
    options: [
      {
        value: true,
        label: {
          ar: "نعم",
          en: "Yes",
        },
      },
      {
        value: false,
        label: {
          ar: "لا",
          en: "No",
        },
      },
    ],
  },
  {
    key: "amenities",
    uiType: "multiSelect",
    required: false,
    label: {
      ar: "المميزات",
      en: "Amenities",
    },
    placeholder: {
      ar: "اختر المميزات",
      en: "Select amenities",
    },
    options: [
      {
        id: 1,
        value: "Balcony",
        label: {
          ar: "بلكونة",
          en: "Balcony",
        },
      },
      {
        id: 2,
        value: "Private Garden",
        label: {
          ar: "حديقة خاصة",
          en: "Private Garden",
        },
      },
      {
        id: 3,
        value: "Covered Parking",
        label: {
          ar: "جراج مغطى",
          en: "Covered Parking",
        },
      },
      {
        id: 4,
        value: "Elevator",
        label: {
          ar: "مصعد",
          en: "Elevator",
        },
      },
      {
        id: 5,
        value: "Security",
        label: {
          ar: "أمن",
          en: "Security",
        },
      },
      {
        id: 6,
        value: "Pool",
        label: {
          ar: "حمام سباحة",
          en: "Pool",
        },
      },
      {
        id: 7,
        value: "Natural Gas",
        label: {
          ar: "غاز طبيعي",
          en: "Natural Gas",
        },
      },
    ],
  },
];
