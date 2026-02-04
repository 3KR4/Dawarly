import { id } from "date-fns/locale";
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
export const slidesEn = [
  {
    id: 1,
    image: "/slides/1.jpeg",
    link: "/properties/beachfront-villas",
    title: "Unlimited Relaxation",
    description:
      "Enjoy a unique beachfront experience where comfort meets luxury",
    creation_date: "2024-11-15",
  },
  {
    id: 2,
    image: "/slides/2.jpeg",
    link: "/living/world-class",
    title: "World-Class Living",
    description: "Villas designed to offer ultimate comfort and privacy",
    creation_date: "2024-12-02",
  },
  {
    id: 3,
    image: "/slides/3.jpeg",
    link: "/marketplace",
    title: "Everything You Need",
    description: "A fully integrated marketplace for all your daily needs",
    creation_date: "2025-01-08",
  },
];
export const slidesAr = [
  {
    id: 1,
    image: "/slides/1.jpeg",
    link: "properties/beachfront-villas",
    title: "استرخاء بلا حدود",
    description: "استمتع بتجربة فريدة على شاطئ يجمع بين الهدوء والفخامة",
    creation_date: "2024-11-15",
  },
  {
    id: 2,
    image: "/slides/2.jpeg",
    link: "/ar/living/world-class",
    title: "إقامة بمعايير عالمية",
    description: "فيلات مصممة لتمنحك أقصى درجات الراحة والخصوصية",
    creation_date: "2024-12-02",
  },
  {
    id: 3,
    image: "/slides/3.jpeg",
    link: "/ar/marketplace",
    title: "كل ما تحتاجه قريب منك",
    description: "سوق وخدمات متكاملة تلبي جميع احتياجاتك اليومية",
    creation_date: "2025-01-08",
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
  {
    id: 101,
    owner: {
      ...users[0],
      type: "dawaarly", // usser / agncy / dawaarly
    },
    title: "شقة للبيع في مدينة نصر",
    description:
      "شقة 110م² بمدينة نصر، تشطيب سوبر لوكس، 2 غرفة نوم، 2 حمام، مطبخ راكب. موقع مميز قريب من الجامعات والمستشفيات والخدمات. الشقة مفروشة بالكامل وتحتوي على تكييفات سبليت في جميع الغرف.",
    price: 1850000,
    category: 1,
    sub_category: 0,
    area: {
      governorate: 1,
      city: 101,
    },
    creation_date: "2025-12-05T14:30:00Z",
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
    ],
    location:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d259315.85877554485!2d31.542610558713196!3d30.045253183317577!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1458b14d72adf029%3A0x9a38f9bbb6edbfe4!2z2KfZhNmF2KrYrdmBINin2YTZhdi12LHZiiDYqNin2YTZgtin2YfYsdip!5e1!3m2!1sar!2seg!4v1769497540369!5m2!1sar!2seg",
    tags: ["شقة", "تمليك"],
    specifecs: {
      property_type: { id: 1, value: "Apartment" },
      area: 110,
      bedrooms: 2,
      bathrooms: 2,
      paymentOption: "cash",
      furnished: { value: true, label: "Yes" },
      negotiable: { value: false, label: "No" },
    },
    amenities: [
      { id: 3, value: "bicycle-lanes", label: "Bicycles lanes" },
      { id: 4, value: "disability-support", label: "Disability support" },
      { id: 5, value: "jogging-trail", label: "Jogging trail" },
      { id: 6, value: "outdoor-pools", label: "Outdoor pools" },
    ],
    contactMethods: {
      email: false,
      phone: true,
    },
    isEditable: false,

  },
  {
    id: 102,
    user_id: "u_002",
    title: "iPhone 13 Pro Max للبيع",
    description:
      "آيفون 13 برو ماكس 256 جيجابايت، اللون جرافايت، حالة ممتازة 9/10، البطارية 92%، الشاشة سليمة بدون خدوش، مع الكابل والشاحن الأصليين، علبة أصلية. السعر نهائي.",
    price: 28500,
    category: 5,
    sub_category: 14,
    area: {
      governorate: { ar: "القاهرة", en: "Cairo" },
      city: { ar: "مدينة نصر", en: "Nasr City" },
    },
    specifecs: {
      storage_gb: 256,
      memory: 6,
      battery_health: 92,
      condition: { id: 2, value: "used", label: "Used" },
      paymentOption: { id: 1, value: "cash", label: "Cash" },
      negotiable: { value: false, label: "No" },
    },
    location: "https://maps.app.goo.gl/AbC123DeF456",
    amenities: [
      { id: 5, value: "warranty", label: "Warranty" },
      { id: 8, value: "original-box", label: "Original box" },
      { id: 9, value: "accessories", label: "Accessories" },
    ],
    images: ["/ads/iphone3.jpeg"],
    tags: ["آيفون", "أبل", "جوال"],
    creation_date: "2025-12-10T09:15:00Z",
  },
  {
    id: 103,
    user_id: "u_003",
    title: "كنبة مودرن 3 مقاعد للبيع",
    description:
      "كنبة خشب زان طبيعي 3 مقاعد، اللون بيج، قماش مقاوم للبقع، حالة جيدة جدا، تم استخدامها لمدة عام واحد فقط. مثالية للصالة الكبيرة، مريحة للغاية، يمكن تجربتها قبل الشراء.",
    price: 7500,
    category: 7,
    sub_category: 21,
    area: {
      governorate: { ar: "القاهرة", en: "Cairo" },
      city: { ar: "مدينة نصر", en: "Nasr City" },
    },
    specifecs: {
      material: "Wood",
      color: "Beige",
      condition: { id: 2, value: "used", label: "Used" },
      seats: 3,
      paymentOption: { id: 1, value: "cash", label: "Cash" },
      negotiable: { value: true, label: "Yes" },
    },
    location: "https://maps.app.goo.gl/XyZ789AbC012",
    amenities: [
      { id: 13, value: "delivery", label: "Delivery" },
      { id: 14, value: "assembly", label: "Assembly" },
    ],
    images: ["/ads/sofa1.jpg"],
    tags: ["كنبة", "أثاث", "صالة"],
    creation_date: "2025-12-12T16:45:00Z",
  },
  {
    id: 104,
    user_id: "u_004",
    title: "هيونداي النترا 2019 للبيع",
    description:
      "هيونداي النترا 2019، فابريكة بالكامل، المالك الأول، كاوتش جديد، تكييف ثلاجة، فرامل ABS، كاميرا خلفية، رادار، دواخل جلد، فتيس أوتوماتيك، الموتور 2000 سي سي، 85,000 كم فقط.",
    price: 720000,
    category: 3,
    sub_category: 10,
    area: {
      governorate: { ar: "الجيزة", en: "Giza" },
      city: { ar: "الدقي", en: "Dokki" },
    },
    specifecs: {
      vehicles_type: { id: 1, value: "Sedan" },
      brand: "Hyundai",
      model: "Elantra",
      model_year: 2019,
      gear: { id: 2, value: "automatic", label: "Automatic" },
      fuel_type: { id: 1, value: "petrol", label: "Petrol" },
      kilometers: 85000,
      paymentOption: { id: 1, value: "cash", label: "Cash" },
      negotiable: { value: true, label: "Yes" },
    },
    location: "https://maps.app.goo.gl/KlMnOp456",
    amenities: [
      { id: 3, value: "parking", label: "Parking" },
      { id: 4, value: "security", label: "Security system" },
      { id: 5, value: "warranty", label: "Warranty" },
    ],
    images: ["/ads/car1.jpg"],
    tags: ["سيارة", "هيونداي", "نترا"],
    creation_date: "2025-12-03T11:20:00Z",
  },
  {
    id: 105,
    user_id: "u_005",
    title: "موتوسيكل هوجن 200 للبيع",
    description:
      "موتوسيكل هوجن 200 سي سي موديل 2016، لون أسود مات، كاوتش جديد، الموتور زيرو تم عمل صيانة كاملة، الفرامل ديسك أمامي وخلفي، الأوراق سليمة والتأمين ساري.",
    price: 68000,
    category: 3,
    sub_category: 11,
    area: {
      governorate: { ar: "الجيزة", en: "Giza" },
      city: { ar: "الدقي", en: "Dokki" },
    },
    specifecs: {
      vehicles_type: { id: 2, value: "Motorcycle" },
      brand: "Haojue",
      model: "200",
      model_year: 2016,
      engine_cc: 200,
      kilometers: 36000,
      fuel_type: { id: 1, value: "Diesel", label: "Diesel" },
      condition: { id: 2, value: "used", label: "Used" },
      paymentOption: { id: 1, value: "cash", label: "Cash" },
      negotiable: { value: true, label: "Yes" },
    },
    location: "https://maps.app.goo.gl/QrStUv789",
    amenities: [
      { id: 5, value: "warranty", label: "Warranty" },
      { id: 15, value: "helmet", label: "Helmet included" },
      { id: 16, value: "papers", label: "Valid papers" },
    ],
    images: ["/ads/bike1.jpg"],
    tags: ["موتوسيكل", "هوجن", "دراجة"],
    creation_date: "2025-12-04T13:10:00Z",
  },
  {
    id: 106,
    user_id: "u_006",
    title: "لابتوب Dell Latitude للبيع",
    description:
      "لابتوب Dell Latitude إصدار الأعمال، معالج Intel Core i7 الجيل العاشر، ذاكرة 16GB RAM، هارد 512GB SSD NVMe، شاشة 15.6 بوصة FHD، بطارية تعمل 8 ساعات، حالة ممتازة.",
    price: 19500,
    category: 6,
    sub_category: 18,
    area: {
      governorate: { ar: "الجيزة", en: "Giza" },
      city: { ar: "الدقي", en: "Dokki" },
    },
    specifecs: {
      brand: "Dell",
      model: "Latitude",
      processor: "Intel Core i7",
      memory: 16,
      storage_gb: 512,
      condition: { id: 2, value: "used", label: "Used" },
      paymentOption: { id: 1, value: "cash", label: "Cash" },
      negotiable: { value: false, label: "No" },
    },
    location: "https://maps.app.goo.gl/WxYzAb123",
    amenities: [
      { id: 8, value: "original-box", label: "Original box" },
      { id: 9, value: "accessories", label: "Accessories" },
      { id: 17, value: "warranty-left", label: "Warranty remaining" },
    ],
    images: ["/ads/laptop1.webp"],
    tags: ["لابتوب", "ديل", "كمبيوتر"],
    creation_date: "2025-12-07T10:05:00Z",
  },
  {
    id: 107,
    user_id: "u_007",
    title: "شقة للإيجار في سموحة",
    description:
      "شقة للإيجار في سموحة، الدور الثالث، تشطيب سوبر لوكس، 95م²، 2 غرفة نوم، 1 حمام، مطبخ راكب، الشقة مؤثثة بالكامل، تكييفات سبليت في جميع الغرف، متاح دخول فوري.",
    price: 12000,
    category: 2,
    sub_category: 1,
    area: {
      governorate: { ar: "الإسكندرية", en: "Alexandria" },
      city: { ar: "سموحة", en: "Smouha" },
    },
    specifecs: {
      property_type: { id: 1, value: "Apartment" },
      area_m2: 95,
      bedrooms: 2,
      bathrooms: 1,
      floor: 3,
      furnished: { value: true, label: "Yes" },
      paymentOption: { id: 2, value: "installment", label: "Installment" },
      negotiable: { value: false, label: "No" },
    },
    location: "https://maps.app.goo.gl/BcDeFg234",
    amenities: [
      { id: 0, value: "air-conditioning", label: "Air conditioning" },
      { id: 4, value: "security", label: "Security system" },
      { id: 18, value: "balcony", label: "Balcony" },
      { id: 19, value: "elevator", label: "Elevator" },
    ],
    images: ["/ads/ap2.webp"],
    tags: ["شقة", "إيجار", "سموحة"],
    creation_date: "2025-12-02T15:40:00Z",
  },
  {
    id: 108,
    user_id: "u_008",
    title: "سامسونج جلاكسي S22 للبيع",
    description:
      "سامسونج جلاكسي S22 128 جيجابايت، اللون أسود، الحالة كالجديد تماما، البطارية 100%، الشاشة محمية بزجاج مقوى، مع علبة وملحقات أصلية، فاتورة شراء متوفرة.",
    price: 19000,
    category: 5,
    sub_category: 14,
    area: {
      governorate: { ar: "الإسكندرية", en: "Alexandria" },
      city: { ar: "سموحة", en: "Smouha" },
    },
    specifecs: {
      brand: "Samsung",
      model: "Galaxy S22",
      storage_gb: 128,
      memory: 8,
      condition: { id: 3, value: "like-new", label: "Like new" },
      paymentOption: { id: 1, value: "cash", label: "Cash" },
      negotiable: { value: false, label: "No" },
    },
    location: "https://maps.app.goo.gl/HiJkLm345",
    amenities: [
      { id: 5, value: "warranty", label: "Warranty" },
      { id: 8, value: "original-box", label: "Original box" },
      { id: 9, value: "accessories", label: "Accessories" },
      { id: 20, value: "screen-protector", label: "Screen protector" },
    ],
    images: ["/ads/mobile1.jpg"],
    tags: ["سامسونج", "جلاكسي", "جوال"],
    creation_date: "2025-12-06T12:25:00Z",
  },
  {
    id: 109,
    user_id: "u_009",
    title: "ترابيزة سفرة 6 كراسي للبيع",
    description:
      "ترابيزة سفرة خشب طبيعي مع 6 كراسي، مقاس الترابيزة 180×90 سم، اللون بني داكن، الكراسي مريحة وذات ظهر عال، مثالية للعائلات الكبيرة، الحالة جيدة جدا.",
    price: 9800,
    category: 7,
    sub_category: 21,
    area: {
      governorate: { ar: "الإسكندرية", en: "Alexandria" },
      city: { ar: "سموحة", en: "Smouha" },
    },
    specifecs: {
      material: "Solid wood",
      color: "Dark brown",
      seats: 6,
      condition: { id: 2, value: "used", label: "Used" },
      paymentOption: { id: 1, value: "cash", label: "Cash" },
      negotiable: { value: true, label: "Yes" },
    },
    location: "https://maps.app.goo.gl/NoPqRs456",
    amenities: [
      { id: 13, value: "delivery", label: "Delivery" },
      { id: 14, value: "assembly", label: "Assembly" },
    ],
    images: ["/ads/table1.jpeg"],
    tags: ["ترابيزة", "سفرة", "أثاث"],
    creation_date: "2025-12-08T17:50:00Z",
  },
  {
    id: 110,
    user_id: "u_010",
    title: "فستان سواريه للبيع",
    description:
      "فستان سواريه ملكي لون ذهبي، مقاس M، قماش حرير طبيعي، تطريز يدوي، تم ارتداؤه مرة واحدة فقط في حفل زفاف. التصميم أنيق وعصري، مناسب للحفلات الرسمية والمناسبات.",
    price: 3500,
    category: 8,
    sub_category: 25,
    area: {
      governorate: { ar: "القاهرة", en: "Cairo" },
      city: { ar: "هليوبوليس", en: "Heliopolis" },
    },
    specifecs: {
      size: "M",
      color: "Gold",
      material: "Silk",
      condition: { id: 3, value: "like-new", label: "Like new" },
      paymentOption: { id: 1, value: "cash", label: "Cash" },
      negotiable: { value: true, label: "Yes" },
    },
    location: "https://maps.app.goo.gl/StUvWx567",
    amenities: [
      { id: 21, value: "try-on", label: "Try on available" },
      { id: 13, value: "delivery", label: "Delivery" },
    ],
    images: ["/ads/dress1.jpg"],
    tags: ["فستان", "سواريه", "ملابس"],
    creation_date: "2025-12-01T14:15:00Z",
  },
  {
    id: 111,
    user_id: "u_011",
    title: "قط شيرازي للبيع",
    description:
      "قط شيرازي ذكر عمر 3 شهور، لون أبيض ناصع، عيون زرقاء، مطعم بالكامل (تطعيمات الرباعية والكلب والسعار)، أليف جدا ونظيف، مع جواز سفر وكرت تطعيمات.",
    price: 2500,
    category: 11,
    sub_category: 34,
    area: {
      governorate: { ar: "القاهرة", en: "Cairo" },
      city: { ar: "هليوبوليس", en: "Heliopolis" },
    },
    specifecs: {
      breed: "Persian",
      age_months: 3,
      gender: { id: 1, value: "male", label: "Male" },
      vaccinated: { value: true, label: "Yes" },
      paymentOption: { id: 1, value: "cash", label: "Cash" },
      negotiable: { value: false, label: "No" },
    },
    location: "https://maps.app.goo.gl/XyZaBc678",
    amenities: [
      { id: 22, value: "vaccination-card", label: "Vaccination card" },
      { id: 23, value: "pet-supplies", label: "Pet supplies" },
      { id: 24, value: "health-check", label: "Health check" },
    ],
    images: ["/ads/cat1.webp"],
    tags: ["قط", "شيرازي", "حيوان أليف"],
    creation_date: "2025-12-04T09:30:00Z",
  },
  {
    id: 112,
    user_id: "u_012",
    title: "وظيفة خدمة عملاء",
    description:
      "مطلوب موظفين خدمة عملاء للعمل في شركة اتصالات كبرى، دوام كامل 8 ساعات، مرتب أساسي + عمولات + حوافز، تأمين صحي، مواصلات، تدريب متخصص. يشترط إجادة استخدام الحاسب الآلي.",
    price: 0,
    category: 9,
    sub_category: 27,
    area: {
      governorate: { ar: "القاهرة", en: "Cairo" },
      city: { ar: "هليوبوليس", en: "Heliopolis" },
    },
    specifecs: {
      experience: "No experience required",
      salary_range: "6000-8000",
      working_hours: "8 hours",
      paymentOption: { id: 3, value: "monthly", label: "Monthly" },
      negotiable: { value: false, label: "No" },
    },
    location: "https://maps.app.goo.gl/DeFgHi789",
    amenities: [
      { id: 25, value: "health-insurance", label: "Health insurance" },
      { id: 26, value: "transportation", label: "Transportation" },
      { id: 27, value: "training", label: "Training" },
    ],
    images: ["/ads/jop1.jpg"],
    tags: ["وظيفة", "خدمة عملاء", "عمل"],
    creation_date: "2025-12-07T11:45:00Z",
  },
  {
    id: 113,
    user_id: "u_013",
    title: "محل للإيجار في الشيخ زايد",
    description:
      "محل تجاري للإيجار في موقع مميز بمنطقة الشيخ زايد، المساحة 60م²، دور أرضي، واجهة زجاجية 5 متر، حمام خاص، مناسب للملابس، الاكسسوارات، الكافيهات، أو الصيدليات.",
    price: 15000,
    category: 2,
    sub_category: 7,
    area: {
      governorate: { ar: "الجيزة", en: "Giza" },
      city: { ar: "الشيخ زايد", en: "Sheikh Zayed" },
    },
    specifecs: {
      property_type: { id: 2, value: "Shop" },
      area_m2: 60,
      bathrooms: 1,
      floor: 0,
      furnished: { value: false, label: "No" },
      paymentOption: { id: 2, value: "installment", label: "Installment" },
      negotiable: { value: true, label: "Yes" },
    },
    location: "https://maps.app.goo.gl/JkLmNo012",
    amenities: [
      { id: 4, value: "security", label: "Security system" },
      { id: 28, value: "storefront", label: "Storefront" },
      { id: 29, value: "ac", label: "Air conditioning" },
    ],
    images: ["/ads/shop1.jpg"],
    tags: ["محل", "إيجار", "تجاري"],
    creation_date: "2025-12-03T16:20:00Z",
  },
  {
    id: 114,
    user_id: "u_014",
    title: "بلايستيشن 5 للبيع",
    description:
      "بلايستيشن 5 إصدار القرص، السعة 825 جيجابايت، مع جهازين كنترول DualSense، 4 ألعاب أصلية (FIFA 24, Spider-Man 2, God of War, Call of Duty). الجهاز يعمل بكفاءة عالية.",
    price: 24000,
    category: 6,
    sub_category: 19,
    area: {
      governorate: { ar: "الجيزة", en: "Giza" },
      city: { ar: "الشيخ زايد", en: "Sheikh Zayed" },
    },
    specifecs: {
      brand: "Sony",
      model: "PlayStation 5",
      storage_gb: 825,
      condition: { id: 2, value: "used", label: "Used" },
      paymentOption: { id: 1, value: "cash", label: "Cash" },
      negotiable: { value: false, label: "No" },
    },
    location: "https://maps.app.goo.gl/PqRsTu123",
    amenities: [
      { id: 8, value: "original-box", label: "Original box" },
      { id: 9, value: "accessories", label: "Accessories" },
      { id: 30, value: "games", label: "Games included" },
      { id: 5, value: "warranty", label: "Warranty" },
    ],
    images: ["/ads/ps5.jpg"],
    tags: ["بلايستيشن", "ألعاب", "سوني"],
    creation_date: "2025-12-09T13:55:00Z",
  },
  {
    id: 115,
    user_id: "u_015",
    title: "خدمة تنظيف منازل",
    description:
      "خدمة تنظيف منازل ومكاتب احترافية، خبرة 5 سنوات، استخدام مواد تنظيف أصلية وآمنة، تنظيف شامل (أرضيات، زجاج، مطابخ، حمامات)، أسعار مناسبة، ضمان جودة الخدمة.",
    price: 300,
    category: 10,
    sub_category: 30,
    area: {
      governorate: { ar: "الجيزة", en: "Giza" },
      city: { ar: "الشيخ زايد", en: "Sheikh Zayed" },
    },
    specifecs: {
      experience_years: 5,
      area_coverage: "All Cairo areas",
      paymentOption: { id: 4, value: "per-service", label: "Per service" },
      negotiable: { value: true, label: "Yes" },
    },
    location: "https://maps.app.goo.gl/UvWxYz234",
    amenities: [
      { id: 31, value: "cleaning-materials", label: "Cleaning materials" },
      { id: 32, value: "equipment", label: "Equipment" },
      { id: 33, value: "insurance", label: "Insurance" },
    ],
    images: ["/ads/service1.jpg"],
    tags: ["تنظيف", "خدمة", "منازل"],
    creation_date: "2025-12-11T08:40:00Z",
  },
  {
    id: 116,
    user_id: "u_016",
    title: "شقة دوبلكس للبيع في التجمع الخامس",
    description:
      "شقة دوبلكس للبيع في التجمع الخامس، المساحة 160م²، تشطيب سوبر لوكس، 3 غرف نوم ماستر، 3 حمامات، رووف خاص 40م²، مطبخ راكب أمريكي، موقف سيارات خاص.",
    price: 3200000,
    category: 1,
    sub_category: 0,
    area: {
      governorate: { ar: "القاهرة", en: "Cairo" },
      city: { ar: "التجمع الخامس", en: "Fifth Settlement" },
    },
    specifecs: {
      property_type: { id: 2, value: "Duplex" },
      area_m2: 160,
      bedrooms: 3,
      bathrooms: 3,
      paymentOption: { id: 1, value: "cash", label: "Cash" },
      furnished: { value: false, label: "No" },
      negotiable: { value: true, label: "Yes" },
    },
    location: "https://maps.app.goo.gl/abc123",
    amenities: [
      { id: 0, value: "air-conditioning", label: "Air conditioning" },
      { id: 4, value: "security", label: "Security system" },
      { id: 6, value: "outdoor-pools", label: "Outdoor pools" },
      { id: 2, value: "roof", label: "Has roof" },
      { id: 19, value: "elevator", label: "Elevator" },
    ],
    images: ["/ads/duplex1.jpg"],
    tags: ["دوبلكس", "تجمع", "شقة"],
    creation_date: "2025-12-14T10:20:00Z",
  },
  {
    id: 117,
    user_id: "u_017",
    title: "مرسيدس E200 2020 للبيع",
    description:
      "مرسيدس E200 موديل 2020، فل أوتوماتيك، فتحة سقف بانورامية، شاشة كبيرة، كاميرا 360 درجة، رادار، مقاعد جلد طبيعي، فبريكا بالكامل، المالك الأول، 45,000 كم فقط.",
    price: 1850000,
    category: 3,
    sub_category: 10,
    area: {
      governorate: { ar: "القاهرة", en: "Cairo" },
      city: { ar: "المعادي", en: "Maadi" },
    },
    specifecs: {
      vehicles_type: { id: 1, value: "Sedan" },
      brand: "Mercedes-Benz",
      model: "E200",
      model_year: 2020,
      gear: { id: 2, value: "automatic", label: "Automatic" },
      fuel_type: { id: 1, value: "petrol", label: "Petrol" },
      kilometers: 45000,
      paymentOption: { id: 1, value: "cash", label: "Cash" },
      negotiable: { value: true, label: "Yes" },
    },
    location: "https://maps.app.goo.gl/def456",
    amenities: [
      { id: 3, value: "parking", label: "Parking" },
      { id: 4, value: "security", label: "Security system" },
      { id: 34, value: "sunroof", label: "Sunroof" },
      { id: 35, value: "camera", label: "Rear camera" },
    ],
    images: ["/ads/mercedes1.jpg"],
    tags: ["مرسيدس", "سيارة فاخرة", "ألماني"],
    creation_date: "2025-12-15T14:35:00Z",
  },
  {
    id: 118,
    user_id: "u_018",
    title: "آيباد برو 12.9 2022 للبيع",
    description:
      "آيباد برو 12.9 بوصة موديل 2022، السعة 256 جيجابايت، يدعم شبكة 5G، الشاشة Liquid Retina XDR، مع قلم Apple Pencil 2nd Gen، لوحة مفاتيح Magic Keyboard، الحالة كالجديد.",
    price: 32000,
    category: 5,
    sub_category: 15,
    area: {
      governorate: { ar: "الجيزة", en: "Giza" },
      city: { ar: "6 أكتوبر", en: "6th October" },
    },
    specifecs: {
      brand: "Apple",
      model: "iPad Pro",
      storage_gb: 256,
      screen_size: "12.9",
      condition: { id: 3, value: "like-new", label: "Like new" },
      paymentOption: { id: 1, value: "cash", label: "Cash" },
      negotiable: { value: false, label: "No" },
    },
    location: "https://maps.app.goo.gl/ghi789",
    amenities: [
      { id: 8, value: "original-box", label: "Original box" },
      { id: 9, value: "accessories", label: "Accessories" },
      { id: 36, value: "apple-pencil", label: "Apple Pencil" },
      { id: 5, value: "warranty", label: "Warranty" },
    ],
    images: ["/ads/ipad1.jpg"],
    tags: ["آيباد", "أبل", "تابلت"],
    creation_date: "2025-12-16T11:10:00Z",
  },
  {
    id: 119,
    user_id: "u_019",
    title: "كاميرا كانون EOS R6 للبيع",
    description:
      "كاميرا كانون EOS R6 احترافية، 20 ميجابكسل، تصوير فيديو 4K 60fps، مع عدسة RF 24-105mm f/4، شوتر 8,000 فقط، حالة ممتازة، مثالية للتصوير الفوتوغرافي والفيديو.",
    price: 65000,
    category: 6,
    sub_category: 20,
    area: {
      governorate: { ar: "القاهرة", en: "Cairo" },
      city: { ar: "مصر الجديدة", en: "New Cairo" },
    },
    specifecs: {
      brand: "Canon",
      model: "EOS R6",
      megapixels: 20,
      lens_included: true,
      condition: { id: 2, value: "used", label: "Used" },
      paymentOption: { id: 1, value: "cash", label: "Cash" },
      negotiable: { value: true, label: "Yes" },
    },
    location: "https://maps.app.goo.gl/jkl012",
    amenities: [
      { id: 8, value: "original-box", label: "Original box" },
      { id: 9, value: "accessories", label: "Accessories" },
      { id: 37, value: "lens", label: "Lens included" },
      { id: 5, value: "warranty", label: "Warranty" },
    ],
    images: ["/ads/camera1.webp"],
    tags: ["كانون", "كاميرا", "تصوير"],
    creation_date: "2025-12-17T15:45:00Z",
  },
  {
    id: 120,
    user_id: "u_020",
    title: "كرسي مكتب مريح للبيع",
    description:
      "كرسي مكتب إيرغونوميك مريح، شبكة تنفس، مساند للذراعين قابلة للضبط 4D، دعم للظهر القطني، قاعدة معدنية، عجلات سليكون، اللون أسود، جديد بالكرتونة.",
    price: 4500,
    category: 7,
    sub_category: 22,
    area: {
      governorate: { ar: "الإسكندرية", en: "Alexandria" },
      city: { ar: "ستانلي", en: "Stanley" },
    },
    specifecs: {
      material: "Mesh",
      color: "Black",
      condition: { id: 1, value: "new", label: "New" },
      adjustable: true,
      paymentOption: { id: 1, value: "cash", label: "Cash" },
      negotiable: { value: true, label: "Yes" },
    },
    location: "https://maps.app.goo.gl/mno345",
    amenities: [
      { id: 13, value: "delivery", label: "Delivery" },
      { id: 14, value: "assembly", label: "Assembly" },
      { id: 38, value: "warranty-card", label: "Warranty card" },
    ],
    images: ["/ads/chair1.webp"],
    tags: ["كرسي", "مكتب", "مريح"],
    creation_date: "2025-12-18T09:25:00Z",
  },
  {
    id: 121,
    user_id: "u_021",
    title: "حذاء رياضي نايكي للبيع",
    description:
      "حذاء رياضي نايكي Air Max 270، مقاس 43، اللون أبيض وأسود، جديد لم يلبس، مناسب للجري والتمارين الرياضية، نعل مريح، علبة أصلية، فاتورة شراء متوفرة.",
    price: 1200,
    category: 8,
    sub_category: 26,
    area: {
      governorate: { ar: "القاهرة", en: "Cairo" },
      city: { ar: "العتبة", en: "Attaba" },
    },
    specifecs: {
      brand: "Nike",
      size: "43",
      color: "White/Black",
      condition: { id: 1, value: "new", label: "New" },
      paymentOption: { id: 1, value: "cash", label: "Cash" },
      negotiable: { value: false, label: "No" },
    },
    location: "https://maps.app.goo.gl/pqr678",
    amenities: [
      { id: 8, value: "original-box", label: "Original box" },
      { id: 39, value: "receipt", label: "Receipt" },
      { id: 21, value: "try-on", label: "Try on available" },
    ],
    images: ["/ads/shoes1.webp"],
    tags: ["نايكي", "حذاء رياضي", "رياضة"],
    creation_date: "2025-12-19T13:15:00Z",
  },
  {
    id: 122,
    user_id: "u_022",
    title: "وظيفة مصمم جرافيك",
    description:
      "مطلوب مصمم جرافيك محترف للعمل بدوام جزئي، خبرة لا تقل عن سنتين في التصميم، إجادة برامج Adobe (Photoshop, Illustrator, After Effects)، العمل عن بعد متاح، مشاريع متنوعة.",
    price: 0,
    category: 9,
    sub_category: 28,
    area: {
      governorate: { ar: "الجيزة", en: "Giza" },
      city: { ar: "المهندسين", en: "Mohandessin" },
    },
    specifecs: {
      experience: "2+ years",
      salary_range: "4000-6000",
      remote_work: true,
      paymentOption: { id: 3, value: "monthly", label: "Monthly" },
      negotiable: { value: false, label: "No" },
    },
    location: "https://maps.app.goo.gl/stu901",
    amenities: [
      { id: 25, value: "health-insurance", label: "Health insurance" },
      { id: 40, value: "remote-work", label: "Remote work" },
      { id: 27, value: "training", label: "Training" },
    ],
    images: ["/ads/designer_job.jpg"],
    tags: ["تصميم", "جرافيك", "وظيفة"],
    creation_date: "2025-12-20T10:50:00Z",
  },
  {
    id: 123,
    user_id: "u_023",
    title: "خدمات تصميم مواقع إلكترونية",
    description:
      "أقدم خدمات تصميم مواقع إلكترونية احترافية، تصميم متجاوب مع جميع الأجهزة، تحسين محركات البحث SEO، دعم فني لمدة سنة، استضافة مجانية 6 أشهر، تصميم واجهات مستخدم UI/UX.",
    price: 5000,
    category: 10,
    sub_category: 31,
    area: {
      governorate: { ar: "القاهرة", en: "Cairo" },
      city: { ar: "وسط البلد", en: "Downtown" },
    },
    specifecs: {
      delivery_time: "7 days",
      experience_years: 3,
      paymentOption: { id: 4, value: "per-service", label: "Per service" },
      negotiable: { value: true, label: "Yes" },
    },
    location: "https://maps.app.goo.gl/vwx234",
    amenities: [
      { id: 41, value: "support", label: "Technical support" },
      { id: 42, value: "seo", label: "SEO optimization" },
      { id: 43, value: "responsive", label: "Responsive design" },
    ],
    images: ["/ads/web_service.webp"],
    tags: ["تصميم مواقع", "ويب", "برمجة"],
    creation_date: "2025-12-21T16:30:00Z",
  },
  {
    id: 124,
    user_id: "u_024",
    title: "جرو جيرمن شيبرد للبيع",
    description:
      "جرو جيرمن شيبرد ذكر عمر 3 شهور، لون أسود وتان، مطعم بالكامل (تطعيمات + ديدان)، الأبوان أصليان شهادات نسب، أليف وذكي، مناسب للحراسة والرفقة، جواز سفر بيطري.",
    price: 8000,
    category: 11,
    sub_category: 33,
    area: {
      governorate: { ar: "الجيزة", en: "Giza" },
      city: { ar: "الهرم", en: "Haram" },
    },
    specifecs: {
      breed: "German Shepherd",
      age_months: 3,
      gender: { id: 1, value: "male", label: "Male" },
      vaccinated: { value: true, label: "Yes" },
      paymentOption: { id: 1, value: "cash", label: "Cash" },
      negotiable: { value: false, label: "No" },
    },
    location: "https://maps.app.goo.gl/yza567",
    amenities: [
      { id: 22, value: "vaccination-card", label: "Vaccination card" },
      { id: 23, value: "pet-supplies", label: "Pet supplies" },
      { id: 24, value: "health-check", label: "Health check" },
      { id: 44, value: "pedigree", label: "Pedigree certificate" },
    ],
    images: ["/ads/dog1.jpeg"],
    tags: ["كلاب", "جيرمن شيبرد", "حيوان أليف"],
    creation_date: "2025-12-22T11:40:00Z",
  },
  {
    id: 125,
    user_id: "u_025",
    title: "عربية أطفال جديدة للبيع",
    description:
      "عربية أطفال جديدة ماركة Chicco، موديل Lite Way، اللون أزرق، سهلة الطي بنقرة واحدة، مظلة كبيرة، شنطة حفظ، إطار هواء، مكابح مزدوجة، ضمان لمدة سنة.",
    price: 2200,
    category: 12,
    sub_category: 38,
    area: {
      governorate: { ar: "القاهرة", en: "Cairo" },
      city: { ar: "الزمالك", en: "Zamalek" },
    },
    specifecs: {
      brand: "Chicco",
      color: "Blue",
      condition: { id: 1, value: "new", label: "New" },
      foldable: true,
      paymentOption: { id: 1, value: "cash", label: "Cash" },
      negotiable: { value: true, label: "Yes" },
    },
    location: "https://maps.app.goo.gl/bcd890",
    amenities: [
      { id: 8, value: "original-box", label: "Original box" },
      { id: 5, value: "warranty", label: "Warranty" },
      { id: 45, value: "canopy", label: "Canopy" },
      { id: 13, value: "delivery", label: "Delivery" },
    ],
    images: ["/ads/stroller1.jpg"],
    tags: ["عربية أطفال", "مستلزمات أطفال", "تشيكو"],
    creation_date: "2025-12-23T14:20:00Z",
  },
  {
    id: 126,
    user_id: "u_026",
    title: "دراجة جبلية للبيع",
    description:
      "دراجة جبلية ماركة Trek، موديل Marlin 5، سرعات 21، إطار ألومنيوم 19 بوصة، فرامل قرصية هيدروليكية، تم عمل صيانة كاملة، حالة ممتازة، مناسبة للطرق الوعرة والمدينة.",
    price: 7500,
    category: 13,
    sub_category: 40,
    area: {
      governorate: { ar: "الإسكندرية", en: "Alexandria" },
      city: { ar: "المنتزه", en: "Montaza" },
    },
    specifecs: {
      brand: "Trek",
      speeds: 21,
      frame_size: "19 inch",
      condition: { id: 2, value: "used", label: "Used" },
      paymentOption: { id: 1, value: "cash", label: "Cash" },
      negotiable: { value: true, label: "Yes" },
    },
    location: "https://maps.app.goo.gl/efg123",
    amenities: [
      { id: 46, value: "maintenance", label: "Recent maintenance" },
      { id: 47, value: "accessories-bike", label: "Bike accessories" },
      { id: 13, value: "delivery", label: "Delivery" },
    ],
    images: ["/ads/bike2.webp"],
    tags: ["دراجة", "رياضة", "تريك"],
    creation_date: "2025-12-24T09:55:00Z",
  },
  {
    id: 127,
    user_id: "u_027",
    title: "معدات مطعم للبيع",
    description:
      "معدات مطعم كاملة للبيع: فرن كهربائي 6 عيون، ثلاجة عرض 4 باب، ثلاجة حفظ 2 باب، غاز صناعي، طاولات تحضير ستانلس، معدات طبخ كاملة. الحالة جيدة، صالحة للعمل الفوري.",
    price: 85000,
    category: 14,
    sub_category: 42,
    area: {
      governorate: { ar: "القاهرة", en: "Cairo" },
      city: { ar: "المطرية", en: "Mataria" },
    },
    specifecs: {
      condition: { id: 2, value: "used", label: "Used" },
      includes: ["Oven", "Refrigerator", "Cooking equipment"],
      paymentOption: { id: 1, value: "cash", label: "Cash" },
      negotiable: { value: true, label: "Yes" },
    },
    location: "https://maps.app.goo.gl/hij456",
    amenities: [
      { id: 13, value: "delivery", label: "Delivery" },
      { id: 48, value: "installation", label: "Installation" },
      { id: 49, value: "maintenance-contract", label: "Maintenance contract" },
    ],
    images: ["/ads/restaurant_equipment.jpg"],
    tags: ["معدات مطعم", "تجاري", "مطعم"],
    creation_date: "2025-12-25T12:10:00Z",
  },
  {
    id: 128,
    user_id: "u_028",
    title: "فيلا للإيجار بالساحل الشمالي",
    description:
      "فيلا فاخرة للإيجار في مارينا بالساحل الشمالي، 4 غرف نوم ماستر، 5 حمامات، صالة كبيرة، مطبخ أمريكي، مسبح خاص، على البحر مباشرة، مؤثثة بالكامل، متاحة للإيجار الشهري.",
    price: 25000,
    category: 2,
    sub_category: 3,
    area: {
      governorate: { ar: "الساحل الشمالي", en: "North Coast" },
      city: { ar: "مارينا", en: "Marina" },
    },
    specifecs: {
      property_type: { id: 3, value: "Villa" },
      area_m2: 280,
      bedrooms: 4,
      bathrooms: 5,
      furnished: { value: true, label: "Yes" },
      beach_view: true,
      paymentOption: { id: 2, value: "installment", label: "Installment" },
      negotiable: { value: false, label: "No" },
    },
    location: "https://maps.app.goo.gl/klm789",
    amenities: [
      { id: 0, value: "air-conditioning", label: "Air conditioning" },
      { id: 4, value: "security", label: "Security system" },
      { id: 6, value: "outdoor-pools", label: "Outdoor pools" },
      { id: 3, value: "parking", label: "Parking" },
      { id: 50, value: "beach-access", label: "Direct beach access" },
    ],
    images: ["/ads/villa1.jpg"],
    tags: ["فيلا", "ساحل", "إيجار"],
    creation_date: "2025-12-26T17:25:00Z",
  },
  {
    id: 129,
    user_id: "u_029",
    title: "اكس بوكس سيريس اكس للبيع",
    description:
      "اكس بوكس سيريس اكس، السعة 1 تيرا بايت، مع جهازين كنترول، 2 ألعاب أصلية (Halo Infinite, Forza Horizon 5)، الجهاز يعمل بكفاءة عالية، تم استخدامه لمدة 6 أشهر فقط.",
    price: 21000,
    category: 6,
    sub_category: 19,
    area: {
      governorate: { ar: "الجيزة", en: "Giza" },
      city: { ar: "فيصل", en: "Faisal" },
    },
    specifecs: {
      brand: "Microsoft",
      model: "Xbox Series X",
      storage_gb: 1024,
      condition: { id: 2, value: "used", label: "Used" },
      paymentOption: { id: 1, value: "cash", label: "Cash" },
      negotiable: { value: true, label: "Yes" },
    },
    location: "https://maps.app.goo.gl/nop012",
    amenities: [
      { id: 8, value: "original-box", label: "Original box" },
      { id: 9, value: "accessories", label: "Accessories" },
      { id: 30, value: "games", label: "Games included" },
      { id: 5, value: "warranty", label: "Warranty" },
    ],
    images: ["/ads/xbox1.jpg"],
    tags: ["اكس بوكس", "ألعاب", "مايكروسوفت"],
    creation_date: "2025-12-27T14:45:00Z",
  },
  {
    id: 130,
    user_id: "u_030",
    title: "جيتار كهربائي للبيع",
    description:
      "جيتار كهربائي ماركة Fender Stratocaster، اللون أسود، ميك أب 3، صوت رائع، مع كابل 6 متر، حزام جيتار، علبة صلبة، مثالي للعزف في الحفلات والاستوديوهات.",
    price: 12000,
    category: 13,
    sub_category: 41,
    area: {
      governorate: { ar: "القاهرة", en: "Cairo" },
      city: { ar: "المعادي", en: "Maadi" },
    },
    specifecs: {
      brand: "Fender",
      color: "Black",
      condition: { id: 3, value: "like-new", label: "Like new" },
      strings: 6,
      paymentOption: { id: 1, value: "cash", label: "Cash" },
      negotiable: { value: false, label: "No" },
    },
    location: "https://maps.app.goo.gl/qrs345",
    amenities: [
      { id: 8, value: "original-box", label: "Original box" },
      { id: 9, value: "accessories", label: "Accessories" },
      { id: 51, value: "case", label: "Hard case" },
      { id: 52, value: "tuning", label: "Professional tuning" },
    ],
    images: ["/ads/guitar1.jpg"],
    tags: ["جيتار", "موسيقى", "فندر"],
    creation_date: "2025-12-28T11:30:00Z",
  },
];
export const propertiesFiltersEn = [
  {
    key: "property_type",
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
    label: "Area",
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
    key: "property_type",
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

export const dashboardRoutes = {
  ads: {
    label: {
      en: "Ads",
      ar: "الإعلانات",
    },
    defaultPath: "active",
    canCreate: true,
  },
  bookings: {
    label: {
      en: "Bookings",
      ar: "الحجوزات",
    },
    canCreate: true,
  },
  users: {
    label: {
      en: "Users",
      ar: "المستخدمين",
    },
    canCreate: true,
  },
  filters: {
    label: {
      en: "filters",
      ar: "الفلاتر",
    },
    canCreate: true,
  },
  slieds: {
    label: {
      en: "Slides",
      ar: "الشرائح",
    },
    canCreate: true,
  },
  support: {
    label: {
      en: "Support",
      ar: "الدعم",
    },
  },
};
