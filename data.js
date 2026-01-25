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
  FaHandshake,
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
export const categoriesEn = [
  { id: 1, name: "Properties for Sale", icon: BiSolidStoreAlt },
  { id: 2, name: "Properties for Rent", icon: FaHandshake },
  { id: 3, name: "Vehicles", icon: FaCar },
  { id: 5, name: "Mobiles & Tablets", icon: FaMobileScreenButton },
  { id: 6, name: "Electronics", icon: SiApplearcade },
  { id: 7, name: "Home & Office", icon: FaHome },
  { id: 8, name: "Fashion", icon: FaTshirt },
  { id: 9, name: "Jobs", icon: FaBriefcase },
  { id: 10, name: "Services", icon: FaTools },
  { id: 11, name: "Pets", icon: FaDog },
  { id: 12, name: "Kids & Babies", icon: FaBabyCarriage },
  { id: 13, name: "Sports & Hobbies", icon: FaFootballBall },
  { id: 14, name: "Business & Industrial", icon: FaIndustry },
];
export const categoriesAr = [
  { id: 1, name: "عقارات للبيع", icon: BiSolidStoreAlt },
  { id: 2, name: "عقارات للإيجار", icon: FaHandshake },
  { id: 3, name: "مركبات", icon: FaCar },
  { id: 5, name: "هواتف وأجهزة لوحية", icon: FaMobileScreenButton },
  { id: 6, name: "إلكترونيات", icon: SiApplearcade },
  { id: 7, name: "المنزل والمكتب", icon: FaHome },
  { id: 8, name: "أزياء", icon: FaTshirt },
  { id: 9, name: "وظائف", icon: FaBriefcase },
  { id: 10, name: "خدمات", icon: FaTools },
  { id: 11, name: "حيوانات أليفة", icon: FaDog },
  { id: 12, name: "أطفال ورضع", icon: FaBabyCarriage },
  { id: 13, name: "رياضة وهوايات", icon: FaFootballBall },
  { id: 14, name: "أعمال وصناعة", icon: FaIndustry },
];
export const subcategoriesEn = [
  // Properties (categoryId 1,2 → category 0,1 في النظام)
  { id: 0, categoryId: 1, name: "Apartments" }, // للبيع
  { id: 1, categoryId: 2, name: "Apartments" }, // للإيجار

  { id: 2, categoryId: 1, name: "Villas" }, // للبيع
  { id: 3, categoryId: 2, name: "Villas" }, // للإيجار

  { id: 4, categoryId: 1, name: "Vacation Homes" }, // للبيع
  { id: 5, categoryId: 2, name: "Vacation Homes" }, // للإيجار

  { id: 6, categoryId: 1, name: "Commercial" }, // للبيع
  { id: 7, categoryId: 2, name: "Commercial" }, // للإيجار

  { id: 8, categoryId: 1, name: "Buildings & Lands" }, // للبيع
  { id: 9, categoryId: 2, name: "Buildings & Lands" }, // للإيجار

  // Vehicles (categoryId 3,4 → category 2 في النظام)
  { id: 10, categoryId: 3, name: "Cars" },
  { id: 11, categoryId: 3, name: "Motorcycles" },
  { id: 12, categoryId: 3, name: "Spare Parts" },
  { id: 13, categoryId: 3, name: "Heavy Vehicles" },

  // Mobiles & Tablets (categoryId 5 → category 3 في النظام)
  { id: 14, categoryId: 5, name: "Mobile Phones" },
  { id: 15, categoryId: 5, name: "Tablets" },
  { id: 16, categoryId: 5, name: "Accessories" },

  // Electronics (categoryId 6 → category 4 في النظام)
  { id: 17, categoryId: 6, name: "TV & Audio" },
  { id: 18, categoryId: 6, name: "Computers" },
  { id: 19, categoryId: 6, name: "Video Games" },
  { id: 20, categoryId: 6, name: "Cameras" },

  // Home & Office (categoryId 7 → category 5 في النظام)
  { id: 21, categoryId: 8, name: "Furniture" },
  { id: 22, categoryId: 8, name: "Office Furniture" },
  { id: 23, categoryId: 8, name: "Home Decor" },

  // Fashion (categoryId 8 → category 6 في النظام)
  { id: 24, categoryId: 8, name: "Men Clothing" },
  { id: 25, categoryId: 8, name: "Women Clothing" },
  { id: 26, categoryId: 8, name: "Shoes & Bags" },

  // Jobs (categoryId 9 → category 7 في النظام)
  { id: 27, categoryId: 9, name: "Full Time" },
  { id: 28, categoryId: 9, name: "Part Time" },
  { id: 29, categoryId: 9, name: "Freelance" },

  // Services (categoryId 10 → category 8 في النظام)
  { id: 30, categoryId: 10, name: "Home Services" },
  { id: 31, categoryId: 10, name: "Education" },
  { id: 32, categoryId: 10, name: "Repair Services" },

  // Pets (categoryId 11 → category 9 في النظام)
  { id: 33, categoryId: 11, name: "Dogs" },
  { id: 34, categoryId: 11, name: "Cats" },
  { id: 35, categoryId: 11, name: "Pet Accessories" },

  // Kids & Babies (categoryId 12 → category 10 في النظام)
  { id: 36, categoryId: 12, name: "Toys" },
  { id: 37, categoryId: 12, name: "Kids Clothes" },
  { id: 38, categoryId: 12, name: "Baby Gear" },

  // Sports & Hobbies (categoryId 13 → category 11 في النظام)
  { id: 39, categoryId: 13, name: "Sports Equipment" },
  { id: 40, categoryId: 13, name: "Bicycles" },
  { id: 41, categoryId: 13, name: "Musical Instruments" },

  // Business & Industrial (categoryId 14 → category 12 في النظام)
  { id: 42, categoryId: 14, name: "Industrial Equipment" },
  { id: 43, categoryId: 14, name: "Office Equipment" },
  { id: 44, categoryId: 14, name: "Wholesale" },
];
export const subcategoriesAr = [
  // Properties (categoryId 1,2 → category 0,1 في النظام)
  { id: 0, categoryId: 0, name: "شقق" }, // للبيع
  { id: 1, categoryId: 1, name: "شقق" }, // للإيجار

  { id: 2, categoryId: 0, name: "فلل" }, // للبيع
  { id: 3, categoryId: 1, name: "فلل" }, // للإيجار

  { id: 4, categoryId: 0, name: "منازل العطلات" }, // للبيع
  { id: 5, categoryId: 1, name: "منازل العطلات" }, // للإيجار

  { id: 6, categoryId: 0, name: "تجاري" }, // للبيع
  { id: 7, categoryId: 1, name: "تجاري" }, // للإيجار

  { id: 8, categoryId: 0, name: "مباني وأراضي" }, // للبيع
  { id: 9, categoryId: 1, name: "مباني وأراضي" }, // للإيجار

  // Vehicles (categoryId 3,4 → category 2 في النظام)
  { id: 10, categoryId: 2, name: "سيارات" },
  { id: 11, categoryId: 2, name: "دراجات نارية" },
  { id: 12, categoryId: 2, name: "قطع غيار" },
  { id: 13, categoryId: 2, name: "مركبات ثقيلة" },

  // Mobiles & Tablets (categoryId 5 → category 3 في النظام)
  { id: 14, categoryId: 3, name: "موبايلات" },
  { id: 15, categoryId: 3, name: "أجهزة لوحية" },
  { id: 16, categoryId: 3, name: "إكسسوارات" },

  // Electronics (categoryId 6 → category 4 في النظام)
  { id: 17, categoryId: 4, name: "تلفزيون وصوتيات" },
  { id: 18, categoryId: 4, name: "كمبيوترات" },
  { id: 19, categoryId: 4, name: "ألعاب فيديو" },
  { id: 20, categoryId: 4, name: "كاميرات" },

  // Home & Office (categoryId 7 → category 5 في النظام)
  { id: 21, categoryId: 5, name: "أثاث" },
  { id: 22, categoryId: 5, name: "أثاث مكتب" },
  { id: 23, categoryId: 5, name: "ديكور منزلي" },

  // Fashion (categoryId 8 → category 6 في النظام)
  { id: 24, categoryId: 6, name: "ملابس رجالية" },
  { id: 25, categoryId: 6, name: "ملابس نسائية" },
  { id: 26, categoryId: 6, name: "أحذية وحقائب" },

  // Jobs (categoryId 9 → category 7 في النظام)
  { id: 27, categoryId: 7, name: "دوام كامل" },
  { id: 28, categoryId: 7, name: "دوام جزئي" },
  { id: 29, categoryId: 7, name: "عمل حر" },

  // Services (categoryId 10 → category 8 في النظام)
  { id: 30, categoryId: 8, name: "خدمات منزلية" },
  { id: 31, categoryId: 8, name: "تعليم" },
  { id: 32, categoryId: 8, name: "خدمات صيانة" },

  // Pets (categoryId 11 → category 9 في النظام)
  { id: 33, categoryId: 9, name: "كلاب" },
  { id: 34, categoryId: 9, name: "قطط" },
  { id: 35, categoryId: 9, name: "إكسسوارات حيوانات" },

  // Kids & Babies (categoryId 12 → category 10 في النظام)
  { id: 36, categoryId: 10, name: "ألعاب" },
  { id: 37, categoryId: 10, name: "ملابس أطفال" },
  { id: 38, categoryId: 10, name: "معدات أطفال" },

  // Sports & Hobbies (categoryId 13 → category 11 في النظام)
  { id: 39, categoryId: 11, name: "معدات رياضية" },
  { id: 40, categoryId: 11, name: "دراجات" },
  { id: 41, categoryId: 11, name: "آلات موسيقية" },

  // Business & Industrial (categoryId 14 → category 12 في النظام)
  { id: 42, categoryId: 12, name: "معدات صناعية" },
  { id: 43, categoryId: 12, name: "معدات مكتبية" },
  { id: 44, categoryId: 12, name: "جملة" },
];
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
export const ads = [
  // ===== الإعلانات المعدلة من الأصلية (15 إعلان) =====
  {
    id: 101,
    user_id: "u_001",
    title: "شقة للبيع في مدينة نصر",
    description:
      "شقة للبيع في مدينة نصر للبيع في مدينة نصر للبيع في مدينة نصر للبيع في مدينة نصر  للبيع في مدينة نصر للبيع في مدينة نصر للبيع في  للبيع في مدينة نصر للبيع في مدينة نصر للبيع في  للبيع في مدينة نصر للبيع في مدينة نصر للبيع في  للبيع في مدينة نصر للبيع في مدينة نصر للبيع في  للبيع في مدينة نصر للبيع في مدينة نصر للبيع في ",
    price: 1850000,
    category: 1, // properties للبيع
    sub_category: 0, // apartmentsSale
    area: {
      governorate: { ar: "القاهرة", en: "Cairo" },
      city: { ar: "مدينة نصر", en: "Nasr City" },
    },
    specs: {
      type: { id: 1, name: "Apartment" },
      area_m2: 110,
      bedrooms: 2,
      bathrooms: 2,
      paymentOption: { id: 1, value: "cash", label: "Cash" },
      paymentOption: { id: 1, value: "cash", label: "Cash" },
      furnished: { value: true, label: "Yes" },
      negotiable: { value: false, label: "No" },
    },
    location: "https://maps.app.goo.gl/yjMxu9toMPVHXP7x6",
    amenities: [
      { id: 1, value: "garden", label: "Garden" },
      { id: 2, value: "roof", label: "Has roof" },
      { id: 6, value: "outdoor-pools", label: "Outdoor pools" },
      { id: 11, value: "medical-center", label: "Medical center" },
      { id: 12, value: "schools", label: "Schools" },
    ],
    images: [
      "/ads/ap1.jpg",
      "/ads/iphone3.jpeg",
      "/ads/sofa1.jpg",
      "/ads/car1.jpg",
      "/ads/ap1.jpg",
      "/ads/iphone3.jpeg",
      "/ads/sofa1.jpg",
      "/ads/car1.jpg",
      "/ads/ap1.jpg",
      "/ads/iphone3.jpeg",
      "/ads/sofa1.jpg",
      "/ads/car1.jpg",
    ],
    tags: ["شقة", "تمليك"],
    creation_date: "2025-12-05T14:30:00Z",
  },
  {
    id: 102,
    user_id: "u_001",
    title: "iPhone 13 Pro Max",
    description: "256GB – حالة ممتازة",
    price: 28500,
    category: 5, // mobilesTablets
    sub_category: 14, // mobilePhones
    area: {
      governorate: { ar: "القاهرة", en: "Cairo" },
      city: { ar: "مدينة نصر", en: "Nasr City" },
    },
    specs: {
      negotiable: false,
      condition: "used",
      storage_gb: 256,
      memory: 8,
      battery_health_percent: 92,
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
    category: 7, // homeOffice
    sub_category: 21, // furniture
    area: {
      governorate: { ar: "القاهرة", en: "Cairo" },
      city: { ar: "مدينة نصر", en: "Nasr City" },
    },
    specs: {
      negotiable: true,
      condition: "used",
      material: "wood",
      seats: 3,
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
    category: 3, // vehicles
    sub_category: 10, // cars
    area: {
      governorate: { ar: "الجيزة", en: "Giza" },
      city: { ar: "الدقي", en: "Dokki" },
    },
    specs: {
      negotiable: true,
      condition: null,
      model_year: 2019,
      km: 85000,
      engine_cc: 2000,
      transmission: "automatic",
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
    category: 3, // vehicles
    sub_category: 11, // motorcycles
    area: {
      governorate: { ar: "الجيزة", en: "Giza" },
      city: { ar: "الدقي", en: "Dokki" },
    },
    specs: {
      negotiable: true,
      condition: null,
      model_year: 2016,
      engine_cc: 200,
      km: 36000,
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
    category: 6, // electronics
    sub_category: 18, // computers
    area: {
      governorate: { ar: "الجيزة", en: "Giza" },
      city: { ar: "الدقي", en: "Dokki" },
    },
    specs: {
      negotiable: false,
      condition: "used",
      cpu: "i7",
      ram_gb: 16,
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
    category: 2, // properties للإيجار
    sub_category: 1, // apartmentsRent
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
      location: "https://maps.app.goo.gl/yjMxu9toMPVHXP7x6",
      amenities: [0, 4], // تكييف وأمن
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
    category: 5, // mobilesTablets
    sub_category: 14, // mobilePhones
    area: {
      governorate: { ar: "الإسكندرية", en: "Alexandria" },
      city: { ar: "سموحة", en: "Smouha" },
    },
    specs: {
      negotiable: false,
      condition: "like new",
      storage_gb: 128,
      memory: 16,
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
    category: 7, // homeOffice
    sub_category: 21, // furniture
    area: {
      governorate: { ar: "الإسكندرية", en: "Alexandria" },
      city: { ar: "سموحة", en: "Smouha" },
    },
    specs: {
      negotiable: true,
      condition: "used",
      seats: 6,
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
    category: 8, // fashion
    sub_category: 25, // womenClothing
    area: {
      governorate: { ar: "القاهرة", en: "Cairo" },
      city: { ar: "هليوبوليس", en: "Heliopolis" },
    },
    specs: {
      negotiable: true,
      condition: "like new",
      size: "M",
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
    category: 11, // pets
    sub_category: 34, // cats
    area: {
      governorate: { ar: "القاهرة", en: "Cairo" },
      city: { ar: "هليوبوليس", en: "Heliopolis" },
    },
    specs: {
      negotiable: false,
      condition: "new",
      age_months: 3,
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
    category: 9, // jobs
    sub_category: 27, // fullTime
    area: {
      governorate: { ar: "القاهرة", en: "Cairo" },
      city: { ar: "هليوبوليس", en: "Heliopolis" },
    },
    specs: {
      negotiable: false,
      condition: null,
      salary_range: "6000-8000",
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
    category: 2, // properties للإيجار
    sub_category: 7, // commercial
    area: {
      governorate: { ar: "الجيزة", en: "Giza" },
      city: { ar: "الشيخ زايد", en: "Sheikh Zayed" },
    },
    specs: {
      negotiable: true,
      condition: null,
      area_m2: 60,
      bathrooms: 1,
      location: "https://maps.app.goo.gl/yjMxu9toMPVHXP7x6",
      amenities: [4], // أمن
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
    category: 6, // electronics
    sub_category: 19, // videoGames
    area: {
      governorate: { ar: "الجيزة", en: "Giza" },
      city: { ar: "الشيخ زايد", en: "Sheikh Zayed" },
    },
    specs: {
      negotiable: false,
      condition: "used",
      storage_gb: 825,
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
    category: 10, // services
    sub_category: 30, // homeServices
    area: {
      governorate: { ar: "الجيزة", en: "Giza" },
      city: { ar: "الشيخ زايد", en: "Sheikh Zayed" },
    },
    specs: {
      negotiable: true,
      condition: null,
      service_type: "cleaning",
      location: "https://maps.app.goo.gl/yjMxu9toMPVHXP7x6",
      amenities: [],
    },
    images: ["/ads/service1.jpg"],
    tags: ["تنظيف"],
    creation_date: "2025-12-11T08:40:00Z",
  },

  // ===== الإعلانات الجديدة =====
  {
    id: 201,
    user_id: "u_006",
    title: "شقة دوبلكس للبيع في التجمع",
    description: "دوبلكس 160 متر رووف خاص",
    price: 3200000,
    category: 1, // properties للبيع
    sub_category: 0, // apartmentsSale
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
      location: "https://maps.app.goo.gl/abc123",
      amenities: [0, 4, 6], // تكييف، أمن، مسبح
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
    category: 3, // vehicles
    sub_category: 10, // cars
    area: {
      governorate: { ar: "القاهرة", en: "Cairo" },
      city: { ar: "المعادي", en: "Maadi" },
    },
    specs: {
      negotiable: true,
      condition: null,
      model_year: 2020,
      km: 45000,
      engine_cc: 3500,
      transmission: "automatic",
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
    category: 5, // mobilesTablets
    sub_category: 15, // tablets
    area: {
      governorate: { ar: "الجيزة", en: "Giza" },
      city: { ar: "6 أكتوبر", en: "6th October" },
    },
    specs: {
      negotiable: false,
      condition: "like new",
      storage_gb: 256,
      screen_size: "12.9",
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
    category: 6, // electronics
    sub_category: 20, // cameras
    area: {
      governorate: { ar: "القاهرة", en: "Cairo" },
      city: { ar: "مصر الجديدة", en: "New Cairo" },
    },
    specs: {
      negotiable: true,
      condition: "used",
      megapixels: 20,
      lens_included: true,
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
    category: 7, // homeOffice
    sub_category: 22, // officeFurniture
    area: {
      governorate: { ar: "الإسكندرية", en: "Alexandria" },
      city: { ar: "ستانلي", en: "Stanley" },
    },
    specs: {
      negotiable: true,
      condition: "new",
      material: "mesh",
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
    category: 8, // fashion
    sub_category: 26, // shoesBags
    area: {
      governorate: { ar: "القاهرة", en: "Cairo" },
      city: { ar: "العتبة", en: "Attaba" },
    },
    specs: {
      negotiable: false,
      condition: "new",
      size: "43",
      brand: "Nike",
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
    category: 9, // jobs
    sub_category: 28, // partTime
    area: {
      governorate: { ar: "الجيزة", en: "Giza" },
      city: { ar: "المهندسين", en: "Mohandessin" },
    },
    specs: {
      negotiable: false,
      condition: null,
      salary_range: "4000-6000",
      experience: "2+ سنوات",
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
    category: 10, // services
    sub_category: 31, // education
    area: {
      governorate: { ar: "القاهرة", en: "Cairo" },
      city: { ar: "وسط البلد", en: "Downtown" },
    },
    specs: {
      negotiable: true,
      condition: null,
      service_type: "web_design",
      delivery_time: "7 أيام",
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
    category: 11, // pets
    sub_category: 33, // dogs
    area: {
      governorate: { ar: "الجيزة", en: "Giza" },
      city: { ar: "الهرم", en: "Haram" },
    },
    specs: {
      negotiable: false,
      condition: "new",
      age_months: 3,
      breed: "German Shepherd",
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
    category: 12, // kidsBabies
    sub_category: 38, // babyGear
    area: {
      governorate: { ar: "القاهرة", en: "Cairo" },
      city: { ar: "الزمالك", en: "Zamalek" },
    },
    specs: {
      negotiable: true,
      condition: "new",
      brand: "Chicco",
      color: "أزرق",
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
    category: 3, // sportsHobbies
    sub_category: 40, // bicycles
    area: {
      governorate: { ar: "الإسكندرية", en: "Alexandria" },
      city: { ar: "المنتزه", en: "Montaza" },
    },
    specs: {
      negotiable: true,
      condition: "used",
      speeds: 21,
      frame_size: "19 inch",
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
    category: 14, // businessIndustrial
    sub_category: 42, // industrialEquipment
    area: {
      governorate: { ar: "القاهرة", en: "Cairo" },
      city: { ar: "المطرية", en: "Mataria" },
    },
    specs: {
      negotiable: true,
      condition: "used",
      equipment_type: "kitchen",
      includes: ["فرن", "ثلاجة", "معدات طبخ"],
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
    category: 2, // properties للإيجار
    sub_category: 3, // villas
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
      location: "https://maps.app.goo.gl/klm789",
      amenities: [0, 4, 6, 3], // تكييف، أمن، مسبح، جراج
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
    category: 6, // electronics
    sub_category: 19, // videoGames
    area: {
      governorate: { ar: "الجيزة", en: "Giza" },
      city: { ar: "فيصل", en: "Faisal" },
    },
    specs: {
      negotiable: true,
      condition: "used",
      storage_gb: 1024,
      games_included: 2,
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
    category: 13, // sportsHobbies
    sub_category: 41, // musicalInstruments
    area: {
      governorate: { ar: "القاهرة", en: "Cairo" },
      city: { ar: "المعادي", en: "Maadi" },
    },
    specs: {
      negotiable: false,
      condition: "like new",
      brand: "Fender",
      type: "electric",
      location: "https://maps.app.goo.gl/qrs345",
      amenities: [],
    },
    images: ["/ads/guitar1.jpg"],
    tags: ["جيتار", "موسيقى"],
    creation_date: "2025-12-28T11:30:00Z",
  },
];
export const propertiesFiltersEn = [
  {
    key: "type",
    uiType: "select",
    required: true,
    label: "Property Type",
    placeholder: "Select type",
    requiredMessage: "Type is required",
    options: [
      { id: 1, name: "Apartment" },
      { id: 2, name: "Chalet" },
      { id: 3, name: "Townhouse" },
      { id: 4, name: "Villa" },
      { id: 5, name: "Office" },
      { id: 6, name: "Cabin" },
      { id: 7, name: "Duplex" },
      { id: 8, name: "Twinhouse" },
      { id: 9, name: "Penthouse" },
      { id: 10, name: "Retail" },
      { id: 11, name: "Clinic" },
      { id: 12, name: "Studio" },
      { id: 13, name: "Loft" },
      { id: 14, name: "Family House" },
      { id: 15, name: "Pharmacy" },
      { id: 16, name: "Building" },
      { id: 17, name: "Administrative" },
    ],
  },
  {
    key: "area",
    uiType: "input",
    inputType: "number",
    required: true,
    label: "Area (m²)",
    placeholder: "Enter area",
    requiredMessage: "Area is required",
  },
  {
    key: "bedrooms",
    uiType: "select",
    required: true,
    label: "Bedrooms",
    placeholder: "Select bedrooms",
    requiredMessage: "Bedrooms is required",
    options: [
      ...Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `${i + 1}`,
      })),
      { id: 11, name: "+10" },
    ],
  },
  {
    key: "bathrooms",
    uiType: "select",
    required: true,
    label: "Bathrooms",
    placeholder: "Select bathrooms",
    requiredMessage: "Bathrooms is required",
    options: [
      ...Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `${i + 1}`,
      })),
      { id: 11, name: "+10" },
    ],
  },
  {
    key: "price",
    uiType: "input",
    inputType: "number",
    required: true,
    label: "Price",
    placeholder: "Enter price",
    requiredMessage: "Price is required",
  },
  {
    key: "paymentOption",
    uiType: "radio",
    required: true,
    label: "Payment Option",
    requiredMessage: "Payment option is required",
    options: [
      { id: 1, value: "cash", label: "Cash" },
      { id: 2, value: "installment", label: "Installment" },
      { id: 3, value: "both", label: "Cash or Installment" },
    ],
  },
  {
    key: "furnished",
    uiType: "boolean",
    label: "Furnished",
    options: [
      { value: true, label: "Yes" },
      { value: false, label: "No" },
    ],
  },
  {
    key: "negotiable",
    uiType: "boolean",
    label: "Negotiable",
    options: [
      { value: true, label: "Yes" },
      { value: false, label: "No" },
    ],
  },
  {
    key: "amenities",
    uiType: "multiSelect",
    label: "Amenities",
    placeholder: "Select amenities",
    options: [
      { id: 1, value: "garden", label: "Garden" },
      { id: 2, value: "roof", label: "Has roof" },
      { id: 3, value: "bicycle-lanes", label: "Bicycles lanes" },
      { id: 4, value: "disability-support", label: "Disability support" },
      { id: 5, value: "jogging-trail", label: "Jogging trail" },
      { id: 6, value: "outdoor-pools", label: "Outdoor pools" },
      { id: 7, value: "mosque", label: "Mosque" },
      { id: 8, value: "sports-clubs", label: "Sports Clubs" },
      { id: 9, value: "business-hub", label: "Business Hub" },
      { id: 10, value: "commercial-strip", label: "Commercial strip" },
      { id: 11, value: "medical-center", label: "Medical center" },
      { id: 12, value: "schools", label: "Schools" },
      { id: 13, value: "underground-parking", label: "Underground parking" },
      { id: 14, value: "clubhouse", label: "Clubhouse" },
      { id: 15, value: "terrace", label: "Terrace" },
      { id: 16, value: "sea-view", label: "Sea View" },
    ],
  },
];
export const propertiesFiltersAr = [
  {
    key: "type",
    uiType: "select",
    required: true,
    label: "نوع العقار",
    placeholder: "اختر النوع",
    requiredMessage: "نوع العقار مطلوب",
    options: [
      { id: 1, name: "شقة" },
      { id: 2, name: "شاليه" },
      { id: 3, name: "تاون هاوس" },
      { id: 4, name: "فيلا" },
      { id: 5, name: "مكتب" },
      { id: 6, name: "كابينة" },
      { id: 7, name: "دوبلكس" },
      { id: 8, name: "توين هاوس" },
      { id: 9, name: "بنتهاوس" },
      { id: 10, name: "محل تجاري" },
      { id: 11, name: "عيادة" },
      { id: 12, name: "استوديو" },
      { id: 13, name: "لوفت" },
      { id: 14, name: "منزل عائلي" },
      { id: 15, name: "صيدلية" },
      { id: 16, name: "مبنى" },
      { id: 17, name: "إداري" },
    ],
  },
  {
    key: "area",
    uiType: "input",
    inputType: "number",
    required: true,
    label: "المساحة (م²)",
    placeholder: "ادخل المساحة",
    requiredMessage: "المساحة مطلوبة",
  },
  {
    key: "bedrooms",
    uiType: "select",
    required: true,
    label: "عدد الغرف",
    placeholder: "اختر عدد الغرف",
    requiredMessage: "عدد الغرف مطلوب",
    options: [
      ...Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `${i + 1}`,
      })),
      { id: 11, name: "+10" },
    ],
  },
  {
    key: "bathrooms",
    uiType: "select",
    required: true,
    label: "عدد الحمامات",
    placeholder: "اختر عدد الحمامات",
    requiredMessage: "عدد الحمامات مطلوب",
    options: [
      ...Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `${i + 1}`,
      })),
      { id: 11, name: "+10" },
    ],
  },
  {
    key: "price",
    uiType: "input",
    inputType: "number",
    required: true,
    label: "السعر",
    placeholder: "ادخل السعر",
    requiredMessage: "السعر مطلوب",
  },
  {
    key: "paymentOption",
    uiType: "radio",
    required: true,
    label: "طريقة الدفع",
    requiredMessage: "طريقة الدفع مطلوبة",
    options: [
      { id: 1, value: "cash", label: "نقداً" },
      { id: 2, value: "installment", label: "تقسيط" },
      { id: 3, value: "both", label: "نقداً أو تقسيط" },
    ],
  },
  {
    key: "furnished",
    uiType: "boolean",
    label: "مفروش",
    options: [
      { value: true, label: "نعم" },
      { value: false, label: "لا" },
    ],
  },
  {
    key: "negotiable",
    uiType: "boolean",
    label: "قابل للتفاوض",
    options: [
      { value: true, label: "نعم" },
      { value: false, label: "لا" },
    ],
  },
  {
    key: "amenities",
    uiType: "multiSelect",
    label: "المميزات",
    placeholder: "اختر المميزات",
    options: [
      { id: 1, value: "garden", label: "حديقة" },
      { id: 2, value: "roof", label: "يحتوي على سقف" },
      { id: 3, value: "bicycle-lanes", label: "مسارات الدراجات" },
      { id: 4, value: "disability-support", label: "دعم ذوي الإعاقة" },
      { id: 5, value: "jogging-trail", label: "مسار للجري" },
      { id: 6, value: "outdoor-pools", label: "حمامات سباحة خارجية" },
      { id: 7, value: "mosque", label: "مسجد" },
      { id: 8, value: "sports-clubs", label: "نوادي رياضية" },
      { id: 9, value: "business-hub", label: "مركز أعمال" },
      { id: 10, value: "commercial-strip", label: "منطقة تجارية" },
      { id: 11, value: "medical-center", label: "مركز طبي" },
      { id: 12, value: "schools", label: "مدارس" },
      { id: 13, value: "underground-parking", label: "موقف سيارات تحت الأرض" },
      { id: 14, value: "clubhouse", label: "نادي" },
      { id: 15, value: "terrace", label: "تراس" },
      { id: 16, value: "sea-view", label: "إطلالة على البحر" },
    ],
  },
];
