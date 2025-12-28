import { settings } from "@/Contexts/settings";
import ar from "@/lang/ar";
import en from "@/lang/en";
import { useContext } from "react";

export default function useTranslate() {
  const { locale } = useContext(settings);
  return locale === "en" ? en : ar;
}
