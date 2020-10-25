import React, { useReducer } from "react";
import { actionType, stateType } from "./types";
let AppContext = React.createContext<{
  state: stateType;
  dispatch: React.Dispatch<actionType>;
}>({} as ContextType);

interface ContextType {
  state: stateType;
  dispatch: ({ type }: { type: string }) => void;
}

const initialState: stateType = {
  dataLoadedFromMemory: false,
  biene: { clickCounter: 0 },
  settings: {
    clickButtonForBee: false,
  },
};

let reducer = (state: stateType, action: actionType): stateType => {
  switch (action.type) {
    case "setState": {
      return { ...state, ...action.payload };
    }

    case "setDataLoaded": {
      return { ...state, dataLoadedFromMemory: true };
    }

    case "setclickButtonForBee": {
      return { ...state, settings: { clickButtonForBee: action.payload } };
    }

    case "bieneClickIncrease": {
      return {
        ...state,
        biene: { clickCounter: state.biene.clickCounter + 1 },
      };
    }
  }
  return state;
};

/**
 * Überschreibt den derzeitigen State
 * @param newState Zu setzender State
 */
export const StateSet = (newState: stateType): actionType => ({
  type: "setState",
  payload: newState,
});

/**
 * Wenn die Biene geklickt wird
 */
export const ActionBieneClickIncrease = (): actionType => ({
  type: "bieneClickIncrease",
});

/**
 * Wenn Daten aus dem Speicher geladen wurden
 */
export const ActionDataLoadedFromMemory = (): actionType => ({
  type: "setDataLoaded",
});

export const ActionSettingsSetClickButtonForBee = (
  activated: boolean
): actionType => ({ type: "setclickButtonForBee", payload: activated });

function AppContextProvider(props: any) {
  let [state, dispatch] = useReducer(reducer, initialState);
  let value = { state, dispatch };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
}

let AppContextConsumer = AppContext.Consumer;

export { AppContext, AppContextProvider, AppContextConsumer };
