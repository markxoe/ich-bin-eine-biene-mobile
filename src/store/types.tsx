export interface stateType {
  dataLoadedFromMemory: boolean;
  biene: {
    clickCounter: number;
  };
}

export interface actionType {
  type: string;
  payload?: any;
}
