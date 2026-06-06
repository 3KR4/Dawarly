import {
  PiBathtubDuotone,
  PiBedDuotone,
  PiRulerDuotone,
  PiStepsDuotone,
} from "react-icons/pi";

export const specsConfig = {
  bedrooms: { icon: PiBedDuotone, showInMini: true },
  bathrooms: { icon: PiBathtubDuotone, showInMini: true },
  level: { icon: PiStepsDuotone, showInMini: true },

  area_m2: {
    icon: PiRulerDuotone,
    showInMini: true,
    label: "m2",
  },
  // suffix: "m2",
};
