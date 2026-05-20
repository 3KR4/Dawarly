export const UserTypes = [
  {
    id: "USER",
    name_en: "Users",
    name_ar: "المستخدمين",
    bg: "#E3F2FD", // أزرق فاتح
    tx: "#1E88E5", // أزرق غامق
  },
  {
    id: "ADMIN",
    name_en: "Admins",
    name_ar: "المسؤلين",
    bg: "#dfcfff", // أخضر فاتح
    tx: "#a06dffff", // أخضر غامق
  },
  {
    id: "SUBUSER",
    name_en: "Sub Users",
    name_ar: "المشتركين",
    bg: "#ffedd4ff", // برتقالي فاتح
    tx: "#F59E0B", // برتقالي
  },
];

export const Permissions = [
  { id: "CREATE_AD", name_en: "Create Ad", name_ar: "إنشاء إعلان" },
  { id: "DELETE_AD", name_en: "Delete Ad", name_ar: "حذف إعلان" },
  { id: "UPDATE_AD", name_en: "Update Ad", name_ar: "تعديل إعلان" },
  {
    id: "CHANGE_ADS_STATUS",
    name_en: "Change Ads Status",
    name_ar: "تغيير حالة الإعلان",
  },
  {
    id: "ASSIGN_RESPONSIBILITY",
    name_en: "Assign Responsibility",
    name_ar: "تعيين مسؤولية",
  },
  { id: "VIEW_ANALYTICS", name_en: "View Analytics", name_ar: "عرض التحليلات" },
];

export const Genders = [
  { id: "MALE", name_en: "Male", name_ar: "ذكر" },
  { id: "FEMALE", name_en: "Female", name_ar: "أنثى" },
];

export const Currencies = [
  { id: "EGP", name_en: "Egyptian Pound", name_ar: "جنيه مصري" },
  { id: "USD", name_en: "US Dollar", name_ar: "دولار أمريكي" },
  { id: "EUR", name_en: "Euro", name_ar: "يورو" },
  { id: "SAR", name_en: "Saudi Riyal", name_ar: "ريال سعودي" },
  { id: "AED", name_en: "UAE Dirham", name_ar: "درهم إماراتي" },
];

export const RentFrequencies = [
  { id: "DAY", name_en: "Per Day", name_ar: "يومي" },
  { id: "WEEK", name_en: "Per Week", name_ar: "أسبوعي" },
  { id: "MONTH", name_en: "Per Month", name_ar: "شهري" },
];
export const RentPeriodUnit = [
  { id: "DAY", name_en: "Day", name_ar: "يوم" },
  { id: "WEEK", name_en: "Week", name_ar: "اسبوع" },
  { id: "MONTH", name_en: "Month", name_ar: "شهر" },
];

export const LandType = [
  { id: "RESIDENTIAL", name_en: "Residential", name_ar: "Residential" },
  { id: "AGRICULTURAL", name_en: "Agricultural", name_ar: "Agricultural" },
  { id: "COMMERCIAL", name_en: "Commercial", name_ar: "Commercial" },
  { id: "INDUSTRIAL", name_en: "Industrial", name_ar: "Industrial" },
];

export const BuildingCondition = [
  { id: "NEW", name_en: "New", name_ar: "New" },
  { id: "OLD", name_en: "Old", name_ar: "Old" },
  {
    id: "UNDER_CONSTRUCTION",
    name_en: "Under Construction",
    name_ar: "Under Construction",
  },
];

export const ImageEntityTypes = [
  { id: "AD", name_en: "Ad", name_ar: "إعلان" },
  { id: "SLIDER", name_en: "Slider", name_ar: "سلايدر" },
  { id: "USER", name_en: "User", name_ar: "مستخدم" },
  { id: "CATEGORY", name_en: "Category", name_ar: "تصنيف" },
  { id: "AREA", name_en: "Area", name_ar: "منطقة" },
  { id: "COMPOUND", name_en: "Compound", name_ar: "كمبوند" },
];

export const AdStatuses = [
  {
    id: "PENDING",
    name_en: "Pending",
    name_ar: "قيد المراجعة",
    bg: "#FFF4E5",
    tx: "#F59E0B",
  },
  {
    id: "ACTIVE",
    name_en: "Active",
    name_ar: "نشط",
    bg: "#E6F9F0",
    tx: "#0F9D58",
  },
  {
    id: "REJECTED",
    name_en: "Rejected",
    name_ar: "مرفوض",
    bg: "#FDECEA",
    tx: "#D93025",
  },
  {
    id: "DISABLED",
    name_en: "Disabled",
    name_ar: "معطل",
    bg: "#F1F3F4",
    tx: "#5F6368",
  },
];

export const RequestStatuses = [
  { id: "PENDING", name_en: "Pending", name_ar: "قيد الانتظار" },
  { id: "APPROVED", name_en: "Approved", name_ar: "مقبول" },
  { id: "REJECTED", name_en: "Rejected", name_ar: "مرفوض" },
];

export const BookingStatuses = [
  { id: "PENDING", name_en: "Pending", name_ar: "قيد الانتظار" },
  { id: "BOOKED", name_en: "Booked", name_ar: "تم الحجز" },
  { id: "CLIENT_ARRIVED", name_en: "Client Arrived", name_ar: "وصل العميل" },
  { id: "CLIENT_LEFT", name_en: "Client Left", name_ar: "غادر العميل" },
  { id: "CANCELLED", name_en: "Cancelled", name_ar: "ملغي" },
];

export const Amenities = [
  {
    id: "am_seeview",
    key: "seeview",
    name_en: "Sea View",
    name_ar: "إطلالة بحر",
  },
  {
    id: "am_lakeview",
    key: "lakeview",
    name_en: "Lake View",
    name_ar: "إطلالة بحيرة",
  },
  {
    id: "am_beach_access",
    key: "beach_access",
    name_en: "Beach Access",
    name_ar: "وصول للشاطئ",
  },
  { id: "am_pool", key: "pool", name_en: "Pool", name_ar: "حمام سباحة" },
  { id: "am_balcony", key: "balcony", name_en: "Balcony", name_ar: "بلكونة" },
  {
    id: "am_private_garden",
    key: "private_garden",
    name_en: "Private Garden",
    name_ar: "حديقة خاصة",
  },
  {
    id: "am_private_roof",
    key: "private_roof",
    name_en: "Private Roof",
    name_ar: "روف خاص",
  },
  { id: "am_kitchen", key: "kitchen", name_en: "Kitchen", name_ar: "مطبخ" },
  { id: "am_ac", key: "ac", name_en: "Air Conditioning", name_ar: "تكييف" },
  {
    id: "am_central_ac",
    key: "central_ac",
    name_en: "Central AC",
    name_ar: "تكييف مركزي",
  },
  { id: "am_heating", key: "heating", name_en: "Heating", name_ar: "تدفئة" },
  { id: "am_elevator", key: "elevator", name_en: "Elevator", name_ar: "مصعد" },
  { id: "am_security", key: "security", name_en: "Security", name_ar: "أمن" },
  { id: "am_parking", key: "parking", name_en: "Parking", name_ar: "جراج" },
  {
    id: "am_private_parking",
    key: "private_parking",
    name_en: "Private Parking",
    name_ar: "جراج خاص",
  },
  {
    id: "am_driver_room",
    key: "driver_room",
    name_en: "Driver Room",
    name_ar: "غرفة سائق",
  },
  {
    id: "am_maid_room",
    key: "maid_room",
    name_en: "Maid Room",
    name_ar: "غرفة مربية",
  },
  { id: "am_gas", key: "gas", name_en: "Gas", name_ar: "غاز" },
  { id: "am_water", key: "water", name_en: "Water", name_ar: "مياه" },
  {
    id: "am_electricity",
    key: "electricity",
    name_en: "Electricity",
    name_ar: "كهرباء",
  },
  {
    id: "am_storage_room",
    key: "storage_room",
    name_en: "Storage Room",
    name_ar: "مخزن",
  },
  {
    id: "am_laundry_room",
    key: "laundry_room",
    name_en: "Laundry Room",
    name_ar: "غرفة غسيل",
  },
  {
    id: "am_furnished",
    key: "furnished",
    name_en: "Furnished",
    name_ar: "مفروش",
  },
  { id: "am_gym", key: "gym", name_en: "Gym", name_ar: "جيم" },
  {
    id: "am_clubhouse",
    key: "clubhouse",
    name_en: "Clubhouse",
    name_ar: "كلوب هاوس",
  },
  {
    id: "am_kids_area",
    key: "kids_area",
    name_en: "Kids Area",
    name_ar: "منطقة أطفال",
  },
  {
    id: "am_bbq_area",
    key: "bbq_area",
    name_en: "BBQ Area",
    name_ar: "منطقة شواء",
  },
  { id: "am_jacuzzi", key: "jacuzzi", name_en: "Jacuzzi", name_ar: "جاكوزي" },
  {
    id: "am_meetings_room",
    key: "meetings_room",
    name_en: "Meetings Room",
    name_ar: "غرفة اجتماعات",
  },
  { id: "am_reception", key: "reception", name_en: "Reception", name_ar: "ريسبشن" },
  {
    id: "am_fire_system",
    key: "fire_system",
    name_en: "Fire System",
    name_ar: "نظام إطفاء",
  },
  {
    id: "am_backup_generator",
    key: "backup_generator",
    name_en: "Backup Generator",
    name_ar: "مولد احتياطي",
  },
  {
    id: "am_loading_area",
    key: "loading_area",
    name_en: "Loading Area",
    name_ar: "منطقة تحميل",
  },
  {
    id: "am_corner_plot",
    key: "corner_plot",
    name_en: "Corner Plot",
    name_ar: "قطعة ناصية",
  },
  {
    id: "am_main_street",
    key: "main_street",
    name_en: "Main Street",
    name_ar: "شارع رئيسي",
  },
  { id: "am_fenced", key: "fenced", name_en: "Fenced", name_ar: "مسور" },
  {
    id: "am_paved_road",
    key: "paved_road",
    name_en: "Paved Road",
    name_ar: "طريق ممهد",
  },
  {
    id: "am_building_permit",
    key: "building_permit",
    name_en: "Building Permit",
    name_ar: "ترخيص بناء",
  },
];
export const months = [
  { id: 1, name_en: "Jan", name_ar: "يناير" },
  { id: 2, name_en: "Feb", name_ar: "فبراير" },
  { id: 3, name_en: "Mar", name_ar: "مارس" },
  { id: 4, name_en: "Apr", name_ar: "أبريل" },
  { id: 5, name_en: "May", name_ar: "مايو" },
  { id: 6, name_en: "Jun", name_ar: "يونيو" },
  { id: 7, name_en: "Jul", name_ar: "يوليو" },
  { id: 8, name_en: "Aug", name_ar: "أغسطس" },
  { id: 9, name_en: "Sep", name_ar: "سبتمبر" },
  { id: 10, name_en: "Oct", name_ar: "أكتوبر" },
  { id: 11, name_en: "Nov", name_ar: "نوفمبر" },
  { id: 12, name_en: "Dec", name_ar: "ديسمبر" },
];

export const Levels = [
  {
    id: 0,
    name_en: "Ground",
    name_ar: "أرضي",
  },

  ...Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name_en: `${i + 1}`,
    name_ar: `${i + 1}`,
  })),

  {
    id: 11,
    name_en: "+10",
    name_ar: "+10",
  },
];
export const PaymentMethod = [
  {
    id: "CASH",
    name_en: "Cash",
    name_ar: "كاش",
  },

  {
    id: "INSTALLMENTS",
    name_en: "Installments",
    name_ar: "تقسيط",
  },

  {
    id: "CASH_OR_INSTALLMENTS",
    name_en: "Cash or Installments",
    name_ar: "كاش أو تقسيط",
  },
];
export const Priority = [
  {
    id: 0,
    name_en: "No Priority",
    name_ar: "بدون أولوية",
  },

  {
    id: 1,
    name_en: "Low Priority",
    name_ar: "أولوية منخفضة",
  },

  {
    id: 2,
    name_en: "Medium Priority",
    name_ar: "أولوية متوسطة",
  },

  {
    id: 3,
    name_en: "High Priority",
    name_ar: "أولوية عالية",
  },

  {
    id: 4,
    name_en: "Top Priority",
    name_ar: "أولوية قصوى",
  },
];

export const RELATIONS = {
  categories: {
    parentKey: "table_id",
    source: "categories",
    parentSource: "tables",
  },
  subcategories: {
    parentKey: "category_id",
    source: "subcategories",
    parentSource: "categories",
  },
  governorates: {
    parentKey: "country_id",
    source: "governorates",
    parentSource: "countries",
  },
  cities: {
    parentKey: "governorate_id",
    source: "cities", 
    parentSource: "governorates",
  },
  areas: {
    parentKey: "city_id",
    source: "areas",
    parentSource: "cities",
  },
  compounds: {
    parentKey: "area_id",
    parentKey2: "city_id",
    source: "compounds",
    parentSource: "areas",
  },
};

export const InstallmentYears = [
  { id: 1, name_en: "1 Year", name_ar: "سنة" },
  { id: 2, name_en: "2 Years", name_ar: "سنتين" },
  { id: 3, name_en: "3 Years", name_ar: "3 سنوات" },
  { id: 4, name_en: "4 Years", name_ar: "4 سنوات" },
  { id: 5, name_en: "5 Years", name_ar: "5 سنوات" },
  { id: 6, name_en: "6 Years", name_ar: "6 سنوات" },
  { id: 7, name_en: "7 Years", name_ar: "7 سنوات" },
  { id: 8, name_en: "8 Years", name_ar: "8 سنوات" },
  { id: 9, name_en: "9 Years", name_ar: "9 سنوات" },
  { id: 10, name_en: "10 Years", name_ar: "10 سنوات" },
  { id: 11, name_en: "11 Years", name_ar: "11 سنة" },
  { id: 12, name_en: "12 Years", name_ar: "12 سنة" },
  { id: 13, name_en: "13 Years", name_ar: "13 سنة" },
  { id: 14, name_en: "14 Years", name_ar: "14 سنة" },
  { id: 15, name_en: "15 Years", name_ar: "15 سنة" },
];




