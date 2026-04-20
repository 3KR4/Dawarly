"use client";

import { useEffect } from "react";
import { initSounds } from "@/utils/sounds";

export default function InitSounds() {
  useEffect(() => {
    initSounds();
  }, []);

  return null; // مفيش UI
}