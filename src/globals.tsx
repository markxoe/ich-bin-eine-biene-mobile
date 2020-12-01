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
    (Math.pow(
      state.biene.additionalBienen.length,
      Math.min(1.0 + (state.biene.additionalBienen.length - 10) / 10, 1.01)
    ) *
      80 +
      100 +
      Math.pow(state.biene.autoRotatingBees.length, 1.1) * 3000) *
      (state.biene.multiplierLevel + 1)
  );
};
export const getMultiplierPrice = (state: stateType): number => {
  return Math.round(
    getAdditionalBeePrice(state) +
      (state.biene.multiplierLevel + state.biene.additionalBienen.length + 1) *
        30
  );
};

export const getAutorotatePrice = (state: stateType): number => {
  return Math.round(getAdditionalBeePrice(state) * 1.5);
};

export const renderValue = (value: number): string => {
  if (value > 1000000) {
    return value.toExponential(4);
  } else if (value > 5000) {
    return (
      value.toString().slice(0, value.toString().length - 3) +
      "." +
      value
        .toString()
        .slice(value.toString().length - 3, value.toString().length - 1) +
      "k"
    );
  }

  return value.toString();
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
    { color: "primary", name: "Einsteiger", minlevel: 0, maxlevel: 20 },
    { color: "secondary", name: "Biene", minlevel: 20, maxlevel: 40 },
    { color: "success", name: "Brathahn", minlevel: 40, maxlevel: 80 },
    { color: "warning", name: "Bienenmutter", minlevel: 80, maxlevel: 200 },
    { color: "danger", name: "Krass", minlevel: 200, maxlevel: 700 },
    { color: "darkpink", name: "Krank", minlevel: 700, maxlevel: 2500 },
    { color: "success", name: "Figgo 🤚", minlevel: 2500, maxlevel: 5000 },
    { color: "danger", name: "Toastbrot", minlevel: 5000, maxlevel: 10000 },
    { color: "warning", name: "Truck 🚘", minlevel: 10000, maxlevel: 50000 },
    {
      color: "tertiary",
      name: "Different 🥶",
      minlevel: 50000,
      maxlevel: 1000000000000,
    },
  ];
  const got = levels.find((i) => i.minlevel <= points && i.maxlevel > points);
  return got
    ? { levelColor: got.color, levelName: got.name, levelNumber: points }
    : { levelColor: "primary", levelNumber: points, levelName: "" };
};
