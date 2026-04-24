let sounds = {
  favOn: null,
  favOff: null,
};

export const initSounds = () => {
  if (typeof window === "undefined") return;

  sounds.favOn = new Audio("/public/sounds/fav-on.mp3");
  sounds.favOff = new Audio("/public/sounds/fav-off.mp3");

  sounds.favOn.preload = "auto";
  sounds.favOff.preload = "auto";

  // 🔥 volume مناسب
  sounds.favOn.volume = 0.4;
  sounds.favOff.volume = 0.4;
};

export const playSound = (type) => {
  try {
    const sound = sounds[type];
    if (!sound) return;

    sound.currentTime = 0;
    sound.play();
  } catch (err) {
    console.log("Sound error:", err);
  }
};