export interface stateType {
  dataLoadedFromMemory: boolean;
  biene: {
    clickCounter: number;
    rotateSpeedLevel: number;
    additionalBienen: number[];
  };
  settings: {
    clickButtonForBee: boolean;
  };
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
