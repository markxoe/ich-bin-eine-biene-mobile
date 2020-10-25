export interface stateType {
  dataLoadedFromMemory: boolean;
  biene: {
    clickCounter: number;
  };
  settings:{
    clickButtonForBee: boolean;
  }
}

export interface actionType {
  type: string;
  payload?: any;
}
