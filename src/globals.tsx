import { stateType } from "./store/types";

export const rotateSpeedLevel = {
  max: 3,
  levels: [
    { class: "bienerotate" },
    { class: "bienerotate-level-2" },
    { class: "bienerotate-level-3" },
    { class: "bienerotate-level-4" },
  ],
};

export const getRotateSpeedLevelPrice = (level: number): number => {
  return Math.round(level * 200 + 100);
};
export const getAdditionalBeePrice = (level: number): number => {
  return Math.round(level * (level * 0.2) * 100 + 200);
};
export const getMultiplierPrice = (level: number): number => {
  return Math.round(level * 20 * (level * 20) + 5000);
};

export const getAutorotatePrice = (state: stateType): number => {
  return ((state.biene.autoRotatingBees.length + 1) * 10000) - 5000;
};
