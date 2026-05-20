const BASE_REQUIRED_FIELDS = [
  "title",
  "country_id",
  "governorate_id",
  "city_id",
  "categoryId",
  "table_id",
  "currency",
  "price",
];

const BASE_OPTIONAL_FIELDS = [
  "description",
  "area_id",
  "compound_id",
  "subCategoryId",
  "tags",
  "display_phone",
  "display_whatsapp",
  "display_dawaarly_contact",
  "owner_no1",
  "owner_no2",
  "delivery_no1",
  "delivery_no2",
  "payment_no1",
  "payment_no2",
  "is_verified",
  "reject_reason",
  "featured_priority",
];

const commonRentRequired = ["deposit_amount", "rent_frequency", "adult_no_max"];
const commonRentOptional = [
  "min_rent_period",
  "min_rent_period_unit",
  "available_from",
  "available_to",
  "child_no_max",
];
const rentRequiredWithoutCapacity = commonRentRequired.filter(
  (item) => item !== "adult_no_max",
);
const rentOptionalWithoutCapacity = commonRentOptional.filter(
  (item) => item !== "child_no_max",
);

const commonSaleRequired = ["payment_method", "ready_to_move", "furnished"];
const commonSaleOptional = ["down_payment", "installment_years"];

const propertyDetails = ["bedrooms", "bathrooms", "level", "area_m2"];

const apartmentAmenities = [
  "am_balcony",
  "am_private_garden",
  "am_private_roof",
  "am_kitchen",
  "am_ac",
  "am_central_ac",
  "am_heating",
  "am_elevator",
  "am_security",
  "am_parking",
  "am_gas",
  "am_water",
  "am_electricity",
  "am_gym",
];

const vacationAmenities = [
  "am_balcony",
  "am_private_garden",
  "am_private_roof",
  "am_kitchen",
  "am_ac",
  "am_central_ac",
  "am_heating",
  "am_elevator",
  "am_security",
  "am_parking",
  "am_gas",
  "am_water",
  "am_electricity",
  "am_storage_room",
  "am_laundry_room",
  "am_furnished",
  "am_gym",
  "am_pool",
  "am_seeview",
  "am_lakeview",
  "am_beach_access",
  "am_clubhouse",
  "am_kids_area",
  "am_bbq_area",
];

const villaAmenities = [
  "am_balcony",
  "am_private_garden",
  "am_private_roof",
  "am_kitchen",
  "am_ac",
  "am_central_ac",
  "am_heating",
  "am_security",
  "am_parking",
  "am_private_parking",
  "am_driver_room",
  "am_maid_room",
  "am_gas",
  "am_water",
  "am_electricity",
  "am_gym",
  "am_pool",
  "am_jacuzzi",
  "am_bbq_area",
];

const commercialAmenities = [
  "am_ac",
  "am_central_ac",
  "am_heating",
  "am_elevator",
  "am_security",
  "am_parking",
  "am_gas",
  "am_water",
  "am_electricity",
  "am_meetings_room",
  "am_reception",
  "am_fire_system",
  "am_backup_generator",
  "am_loading_area",
  "am_storage_room",
];

const landBuildingAmenities = [
  "am_security",
  "am_parking",
  "am_gas",
  "am_water",
  "am_electricity",
  "am_corner_plot",
  "am_main_street",
  "am_fenced",
  "am_paved_road",
  "am_building_permit",
  "am_elevator",
  "am_fire_system",
  "am_backup_generator",
];

const buildingsLandsRequired = ["area_m2", "land_type", "usage_type"];
const buildingsLandsOptional = ["floors"];

export const TABLE_RULES = {
  1: {
    required: [...propertyDetails, ...commonSaleRequired],
    allowed: [...commonSaleOptional, ...vacationAmenities],
  },
  2: {
    required: [...commonRentRequired, ...propertyDetails],
    allowed: [...commonRentOptional, ...vacationAmenities],
  },
  3: {
    required: [...propertyDetails, ...commonSaleRequired],
    allowed: [...commonSaleOptional, ...apartmentAmenities],
  },
  4: {
    required: [...commonRentRequired, ...propertyDetails],
    allowed: [...commonRentOptional, ...apartmentAmenities],
  },
  5: {
    required: [...propertyDetails, ...commonSaleRequired],
    allowed: [...commonSaleOptional, ...villaAmenities],
  },
  6: {
    required: [...commonRentRequired, ...propertyDetails],
    allowed: [...commonRentOptional, ...villaAmenities],
  },
  7: {
    required: commonSaleRequired.filter((item) => item !== "furnished"),
    allowed: [...commonSaleOptional, "area_m2", ...commercialAmenities],
  },
  8: {
    required: [...rentRequiredWithoutCapacity],
    allowed: [...rentOptionalWithoutCapacity, "area_m2", ...commercialAmenities],
  },
  9: {
    required: [...buildingsLandsRequired, "payment_method"],
    allowed: [...commonSaleOptional, ...landBuildingAmenities, ...buildingsLandsOptional],
  },
  10: {
    required: [...rentRequiredWithoutCapacity, ...buildingsLandsRequired],
    allowed: [
      ...rentOptionalWithoutCapacity,
      ...landBuildingAmenities,
      ...buildingsLandsOptional,
    ],
  },
};

const VACATION_TABLE_IDS = [1, 2];
const PROPERTY_TABLE_IDS = [1, 2, 3, 4, 5, 6];
const COMMERCIAL_TABLE_IDS = [7, 8];
const BUILDING_LAND_TABLE_IDS = [9, 10];

export const getTableRule = (tableId) => {
  const numericTableId = Number(tableId);
  const tableRule = TABLE_RULES[numericTableId];

  if (!tableRule) {
    return {
      tableId: numericTableId,
      required: [...BASE_REQUIRED_FIELDS],
      allowed: [...BASE_OPTIONAL_FIELDS],
      allFields: [...BASE_REQUIRED_FIELDS, ...BASE_OPTIONAL_FIELDS],
      amenityFields: [],
      isSale: false,
      isRent: false,
      isVacation: false,
      showPropertyDetails: false,
      showCommercialDetails: false,
      showBuildingLandDetails: false,
      showSaleDetails: false,
      showRentDetails: false,
    };
  }

  const allFields = [
    ...BASE_REQUIRED_FIELDS,
    ...BASE_OPTIONAL_FIELDS,
    ...tableRule.required,
    ...tableRule.allowed,
  ];

  const uniqueFields = [...new Set(allFields)];
  const amenityFields = uniqueFields.filter((field) => field.startsWith("am_"));

  return {
    tableId: numericTableId,
    required: [...BASE_REQUIRED_FIELDS, ...tableRule.required],
    allowed: [...BASE_OPTIONAL_FIELDS, ...tableRule.allowed],
    allFields: uniqueFields,
    amenityFields,
    isSale: numericTableId % 2 === 1,
    isRent: numericTableId % 2 === 0,
    isVacation: VACATION_TABLE_IDS.includes(numericTableId),
    showPropertyDetails: PROPERTY_TABLE_IDS.includes(numericTableId),
    showCommercialDetails: COMMERCIAL_TABLE_IDS.includes(numericTableId),
    showBuildingLandDetails: BUILDING_LAND_TABLE_IDS.includes(numericTableId),
    showSaleDetails: uniqueFields.includes("payment_method"),
    showRentDetails: uniqueFields.includes("rent_frequency"),
  };
};

export const isFieldRequired = (tableId, fieldName) =>
  getTableRule(tableId).required.includes(fieldName);

export const isFieldAllowed = (tableId, fieldName) =>
  getTableRule(tableId).allFields.includes(fieldName);
