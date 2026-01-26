import { TbMeterSquare } from "react-icons/tb";
import { MdOutlineKingBed } from "react-icons/md";
import { PiBathtubBold } from "react-icons/pi";
import { TbEngine } from "react-icons/tb";
import { PiSpeedometerBold } from "react-icons/pi";
import { HiMiniCalendarDateRange } from "react-icons/hi2";
import { MdOutlineSdStorage } from "react-icons/md";
import { IoBatteryHalf } from "react-icons/io5";
import { LuMemoryStick } from "react-icons/lu";
import { MdOutlineChair } from "react-icons/md";
import { TbBrandCashapp } from "react-icons/tb";
import { IoCashOutline } from "react-icons/io5";
import { MdOutlineHomeWork } from "react-icons/md";

export const specsConfig = {
  type: { icon: MdOutlineHomeWork },
  bedrooms: { icon: MdOutlineKingBed },
  bathrooms: { icon: PiBathtubBold },
  area_m2: { icon: TbMeterSquare },
  furnished: { icon: MdOutlineChair },

  model_year: { icon: HiMiniCalendarDateRange },
  km: { icon: PiSpeedometerBold, suffix: "km" },
  engine_cc: { icon: TbEngine, suffix: "cc" },
  paymentOption: { icon: IoCashOutline },

  storage_gb: { icon: MdOutlineSdStorage, suffix: "GB" },
  memory: { icon: LuMemoryStick, suffix: "GB" },
  battery_health_percent: { icon: IoBatteryHalf, suffix: "%" },
};
