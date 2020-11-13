export const rotateSpeedLevelClasses = [
  ".bienerotate",
  ".bienerotate-level-2",
  ".bienerotate-level-3",
];
export const rotateSpeedLevelMax = 3;

export const rotateSpeedLevel = {
  max: 2,
  levels: [
    { class: "bienerotate" },
    { class: "bienerotate-level-2" },
    { class: "bienerotate-level-3" },
  ],
};

export const BeePrices = {
  speedLevel: 20,
};

export const getRotateSpeedLevelPrice = (level: number): number => {
  return Math.round(level * 200 + 100);
};
export const getAdditionalBeePrice = (level: number): number => {
  return Math.round(level * (level * 0.2) * 100 + 200);
};
