import { stateType } from "./store/types";
import Axios from "axios";
import calculateHeader from "./pages/calculateauthorization";

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
  return Math.round(state.biene.rotateSpeedLevel * 50 + 20);
};
export const getAdditionalBeePrice = (state: stateType): number => {
  return Math.round(
    (state.biene.additionalBienen.length + 1) *
      80 *
      (state.biene.multiplierLevel +
        1 +
        state.biene.autoRotatingBees.length * 0.5)
  );
};
export const getMultiplierPrice = (state: stateType): number => {
  return Math.round(getAdditionalBeePrice(state) * 1.2);
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

export const generateToast = (msg: string) => {
  const el = document.createElement("ion-toast");
  el.translucent = true;
  el.message = msg;
  el.duration = 5000;
  document.body.appendChild(el);
  el.present();
};

export const uploadData = (state: stateType) => {
  if (state.userUUID && state.dataLoadedFromMemory) {
    const data: {
      userid: string;
      autoRotatingBeeLength: Number;
      additionalBeeLength: Number;
      multiplierLevel: Number;
      userName: string;
      settingNewUI: boolean;
      settingClickingAid: boolean;
      userImage: string;
    } = {
      userid: state.userUUID,
      autoRotatingBeeLength: state.biene.autoRotatingBees.length,
      additionalBeeLength: state.biene.additionalBienen.length,
      multiplierLevel: state.biene.multiplierLevel,
      userName: state.userName,
      settingClickingAid: state.settings.clickButtonForBee,
      settingNewUI: state.settings.newUI,
      userImage: state.userImage,
    };

    Axios.post(
      (process.env.react_app_apiurl ??
        "https://api.ichbineinebiene.toastbrot.org") + "/api/v1/users/update2",
      data,
      {
        timeout: 500,
        headers: {
          auth: calculateHeader(
            state.userUUID,
            process.env.react_app_usersapisecret ?? "verysecretalternative",
            data.additionalBeeLength
          ),
        },
      }
    )
      .then(
        (r) => {},
        (r) => console.error("Error Posting Results")
      )
      .catch(() => {});
  }
};
