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

export const dynamicFilters = [
  {
    key: "price",
    uiType: "range",
    label: { en: "Rent Amount", ar: "قيمة الإيجار" },
    placeholder: { en: "Enter rent amount", ar: "ادخل قيمة الإيجار" },
  },
  {
    key: "currency",
    uiType: "select",
    label: { en: "Currency", ar: "العملة" },
    placeholder: { en: "Select currency", ar: "اختر العملة" },
    options: [
      { id: "EGP", label: { en: "Egyptian Pound", ar: "جنيه مصري" } },
      { id: "USD", label: { en: "US Dollar", ar: "دولار أمريكي" } },
      { id: "EUR", label: { en: "Euro", ar: "يورو" } },
      { id: "SAR", label: { en: "Saudi Riyal", ar: "ريال سعودي" } },
      { id: "AED", label: { en: "UAE Dirham", ar: "درهم إماراتي" } },
    ],
  },
  {
    key: "rent_frequency",
    uiType: "select",
    label: { en: "Rent Frequency", ar: "تكرار الإيجار" },
    placeholder: { en: "Select frequency", ar: "اختر التكرار" },
    options: [
      { id: "DAY", label: { en: "Per Day", ar: "يومي" } },
      { id: "WEEK", label: { en: "Per Week", ar: "أسبوعي" } },
      { id: "MONTH", label: { en: "Per Month", ar: "شهري" } },
    ],
  },
  {
    key: "level",
    uiType: "select",
    label: { en: "level", ar: "الدور" },
    placeholder: {
      en: "select level",
      ar: "اختر الدور",
    },

    options: [
      { id: 0, label: { en: "Ground", ar: "دور أرضي" } },

      ...Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        label: {
          en: `${i + 1}`,
          ar: `${i + 1}`,
        },
      })),

      {
        id: 11,
        label: {
          en: "+10",
          ar: "+10",
        },
      },
    ],
  },
  {
    key: "bedrooms",
    uiType: "select",
    label: { en: "bedrooms", ar: "غرف النوم" },
    placeholder: {
      en: "select bedrooms number",
      ar: "اختر عدد الغرف",
    },

    options: [
      ...Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        label: {
          en: `${i + 1}`,
          ar: `${i + 1}`,
        },
      })),

      {
        id: 11,
        label: {
          en: "+10",
          ar: "+10",
        },
      },
    ],
  },
  {
    key: "bathrooms",
    uiType: "select",
    label: { en: "bathrooms", ar: "الحمامات" },
    placeholder: {
      en: "select bathrooms number",
      ar: "اختر عدد الحمامات",
    },

    options: [
      ...Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        label: {
          en: `${i + 1}`,
          ar: `${i + 1}`,
        },
      })),

      {
        id: 11,
        label: {
          en: "+10",
          ar: "+10",
        },
      },
    ],
  },
  {
    key: "amenities",
    uiType: "multiSelect",
    label: { en: "Amenities", ar: "وسائل الراحة" },
    placeholder: { en: "Select amenities", ar: "اختر وسائل الراحة" },
    options: [
      { id: 1, value: "am_pool", label: { en: "Pool", ar: "حمام سباحة" } },
      { id: 2, value: "am_balcony", label: { en: "Balcony", ar: "شرفة" } },
      {
        id: 3,
        value: "am_private_garden",
        label: { en: "Private Garden", ar: "حديقة خاصة" },
      },
      { id: 4, value: "am_kitchen", label: { en: "Kitchen", ar: "مطبخ" } },
      { id: 5, value: "am_ac", label: { en: "AC", ar: "تكييف" } },
      { id: 6, value: "am_heating", label: { en: "Heating", ar: "تدفئة" } },
      { id: 7, value: "am_elevator", label: { en: "Elevator", ar: "مصعد" } },
      { id: 8, value: "am_gym", label: { en: "Gym", ar: "جيم" } },
    ],
  },
];

export const dashboardRoutes = {
  ads: {
    label: {
      en: "Ads",
      ar: "الإعلانات",
    },
    defaultPath: "all",
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
    canCreate: false,
  },
  data: {
    label: {
      en: "data",
      ar: "جميع البيانات",
    },
    canCreate: true,
    module: true,
  },
  filters: {
    label: {
      en: "filters",
      ar: "الفلاتر",
    },
    canCreate: true,
  },
  sliders: {
    label: {
      en: "Slides",
      ar: "الشرائح",
    },
    canCreate: true,
  },
  blogs: {
    label: {
      en: "blogs",
      ar: "المدونات",
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
