import { nameAtHomePositions } from "../globals";

export interface stateType {
  dataLoadedFromMemory: boolean;
  biene: {
    clickCounter: number;
    rotateSpeedLevel: number;
    additionalBienen: number[];
    multiplierLevel: number;
    autoRotatingBees: number[];
  };
  goldenBienen: number;
  settings: {
    clickButtonForBee: boolean;
    newUI: boolean;
    deactivateStoreConfetti: boolean;
    nameathomeposition: nameAtHomePositions;
  };
  statisticsRotations: number;
  settingMaxNumberDisplayedBees: number;
  userUUID: string;
  userName: string;
  userImage: string;
  lastSaveAt: number;
}

export interface actionType {
  type: string;
  payload?: any;
}

export interface ContextType {
  state: stateType;
  dispatch: React.Dispatch<actionType>;
}

export const bieneTypes = {
  bee: 1,
};
