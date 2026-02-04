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
import { BsFuelPump } from "react-icons/bs";
import { SiMaterialformkdocs } from "react-icons/si";
import { IoColorFillOutline } from "react-icons/io5";
import { VscSymbolColor } from "react-icons/vsc";
import { HiOutlineColorSwatch } from "react-icons/hi";
import { IoColorPaletteOutline } from "react-icons/io5";
import { MdOutlineColorLens } from "react-icons/md";
import { MdOutlineFitScreen } from "react-icons/md";
import { VscScreenFull } from "react-icons/vsc";
import { VscGear } from "react-icons/vsc";
import { VscSettingsGear } from "react-icons/vsc";
import { GrManual } from "react-icons/gr";
import { TbManualGearbox } from "react-icons/tb";

export const specsConfig = {
  property_type: { icon: MdOutlineHomeWork, label: "type" },
  vehicles_type: { label: "type" },
  bedrooms: { icon: MdOutlineKingBed, showInMini: true },
  bathrooms: { icon: PiBathtubBold, showInMini: true },
  area: { icon: TbMeterSquare, label: "area", showInMini: true },
  furnished: { icon: MdOutlineChair },

  model_year: {
    icon: HiMiniCalendarDateRange,
    label: "model year",
    showInMini: true,
  },
  gear: { icon: TbManualGearbox },
  kilometers: { icon: PiSpeedometerBold, suffix: "km", showInMini: true },
  fuel_type: { icon: BsFuelPump, showInMini: true },
  material: { icon: HiOutlineColorSwatch, showInMini: true },
  color: { icon: MdOutlineColorLens, showInMini: true },
  screen_size: { icon: VscScreenFull, suffix: "inch", showInMini: true },
  engine_cc: {
    icon: TbEngine,
    label: "engine cc",
    suffix: "cc",
    showInMini: true,
  },
  paymentOption: {
    icon: IoCashOutline,
    label: "payment option",
  },

  storage_gb: {
    icon: MdOutlineSdStorage,
    label: "storage",
    suffix: "GB",
    showInMini: true,
  },
  memory: { icon: LuMemoryStick, suffix: "GB", showInMini: true },
  battery_health: {
    icon: IoBatteryHalf,
    suffix: "%",
    label: "battery",
    showInMini: true,
  },
};
