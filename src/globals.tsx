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

export const getRotateSpeedLevelPrice = (state: stateType): number => {
  return Math.round(state.biene.rotateSpeedLevel * 200 + 100);
};
export const getAdditionalBeePrice = (state: stateType): number => {
  return Math.round(
    (Math.pow(state.biene.additionalBienen.length, 1.5) * 50 +
      100 +
      Math.pow(state.biene.multiplierLevel, 1.1) * 300 +
      Math.pow(state.biene.autoRotatingBees.length, 1.1) * 2500) *
      1.2
  );
};
export const getMultiplierPrice = (state: stateType): number => {
  return (
    Math.round(
      (Math.pow(state.biene.multiplierLevel, 1.1) * 500 +
        500 +
        state.biene.additionalBienen.length * 200 +
        Math.pow(state.biene.autoRotatingBees.length, 1.1) * 2500) *
        1.3
    ) + 500
  );
};

export const getAutorotatePrice = (state: stateType): number => {
  return Math.max(
    (state.biene.autoRotatingBees.length + 1) * 20000 -
      10000 +
      (state.biene.additionalBienen.length + state.biene.multiplierLevel) * 500,
    getMultiplierPrice(state) + 100,
    getAdditionalBeePrice(state) + 100
  );
};

export const calculateLevel = (
  state: stateType
): { levelNumber: number; levelColor: string; levelName: string } => {
  const points = Math.round(
    (state.biene.additionalBienen.length * 50 +
      state.biene.multiplierLevel * 100 +
      state.biene.autoRotatingBees.length * 500 +
      state.biene.rotateSpeedLevel * 10) /
      10
  );
  const levels: {
    color: string;
    name: string;
    minlevel: number;
    maxlevel: number;
  }[] = [
    { color: "primary", name: "Einsteiger", minlevel: 0, maxlevel: 10 },
    { color: "secondary", name: "Biene", minlevel: 10, maxlevel: 20 },
    { color: "success", name: "Brathahn", minlevel: 20, maxlevel: 50 },
    { color: "warning", name: "Bienenmutter", minlevel: 50, maxlevel: 100 },
    { color: "danger", name: "Krass", minlevel: 100, maxlevel: 500 },
    { color: "darkpink", name: "Krank", minlevel: 500, maxlevel: 2000 },
    { color: "tertiary", name: "Different", minlevel: 2000, maxlevel: 1000000 },
  ];
  const got = levels.find((i) => i.minlevel <= points && i.maxlevel > points);
  return got
    ? { levelColor: got.color, levelName: got.name, levelNumber: points }
    : { levelColor: "primary", levelNumber: points, levelName: "" };
};
