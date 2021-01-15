import redbee from "./redbee.png";
import bluebee from "./bluebee.png";
import greenbee from "./greenbee.png";
import { stateType } from "../../store/types";

export const getGoldenBienenArray = (state: stateType): string[] => {
  const defaultBee = bluebee;
  const beez = [redbee, greenbee, bluebee];
  const out = Array<string>(state.goldenBienen).fill(defaultBee);

  for (let i = 0; i < state.goldenBienen; i++) {
    out[i] = beez[i % beez.length];
  }
  return out;
};
