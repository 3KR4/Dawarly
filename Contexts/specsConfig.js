import { TbMeterSquare } from "react-icons/tb";
import { MdOutlineKingBed } from "react-icons/md";
import { PiBathtubBold } from "react-icons/pi";
import { TbEngine } from "react-icons/tb";
import { PiSpeedometerBold } from "react-icons/pi";
import { HiMiniCalendarDateRange } from "react-icons/hi2";
import { MdOutlineSdStorage } from "react-icons/md";
import { IoBatteryHalf } from "react-icons/io5";
import { LuMemoryStick } from "react-icons/lu";

export const specsConfig = {
  // Properties (Sale & Rent)
  1: [
    { key: "bedrooms", icon: MdOutlineKingBed },
    { key: "bathrooms", icon: PiBathtubBold },
    { key: "area_m2", icon: TbMeterSquare },
  ],
  2: [
    { key: "bedrooms", icon: MdOutlineKingBed },
    { key: "bathrooms", icon: PiBathtubBold },
    { key: "area_m2", icon: TbMeterSquare },
  ],

  // Vehicles
  3: [
    { key: "model_year", icon: HiMiniCalendarDateRange },
    { key: "km", icon: PiSpeedometerBold, suffix: "km" },
    { key: "engine_cc", icon: TbEngine, suffix: "cc" },
  ],

  // Mobiles & Tablets
  5: [
    { key: "storage_gb", icon: MdOutlineSdStorage, suffix: "GB" },
    { key: "memory", icon: LuMemoryStick, suffix: "GB" },
    { key: "battery_health_percent", icon: IoBatteryHalf, suffix: "%" },
  ],
};
