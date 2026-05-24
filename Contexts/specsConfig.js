import { MdOutlineKingBed } from "react-icons/md";
import { PiBathtubBold } from "react-icons/pi";
import { RiStairsLine } from "react-icons/ri";

import { IoIosResize } from "react-icons/io";

export const specsConfig = {
  bedrooms: { icon: MdOutlineKingBed, showInMini: true },
  bathrooms: { icon: PiBathtubBold, showInMini: true },
  level: { icon: RiStairsLine, showInMini: true },

  area_m2: {
    icon: IoIosResize,
    showInMini: true,
    label: "m2",
  },
  // suffix: "m2",
};
