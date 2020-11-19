import { Storage } from "@capacitor/core";
import React, { useReducer } from "react";
import { StoreKeyPrefix } from "../const";
import { actionType, stateType, ContextType } from "./types";

let AppContext = React.createContext<ContextType>({} as ContextType);

const initialState: stateType = {
  dataLoadedFromMemory: false,
  biene: {
    clickCounter: 0,
    rotateSpeedLevel: 0,
    additionalBienen: [],
    multiplierLevel: 0,
  },
  settings: {
    clickButtonForBee: false,
  },
};

let reducer = (state: stateType, action: actionType): stateType => {
  switch (action.type) {
    case "setState": {
      return {
        ...state,
        ...action.payload,
        biene: { ...state.biene, ...action.payload.biene },
        settings: { ...state.settings, ...action.payload.settings },
      };
    }

    case "resetState": {
      return initialState;
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
        biene: {
          ...state.biene,
          clickCounter: state.biene.clickCounter + action.payload,
        },
      };
    }

    case "bieneClickDecrease": {
      return {
        ...state,
        biene: {
          ...state.biene,
          clickCounter: state.biene.clickCounter - action.payload,
        },
      };
    }

    case "rotateSpeedLevelIncrease": {
      return {
        ...state,
        biene: {
          ...state.biene,
          rotateSpeedLevel: state.biene.rotateSpeedLevel + 1,
        },
      };
    }

    case "bieneAdditionalAdd": {
      return {
        ...state,
        biene: {
          ...state.biene,
          additionalBienen: state.biene.additionalBienen.concat(action.payload),
        },
      };
    }

    case "bieneMultiplierIncrease": {
      return {
        ...state,
        biene: {
          ...state.biene,
          multiplierLevel: state.biene.multiplierLevel + 1,
        },
      };
    }
  }
  return state;
};

function AppContextProvider(props: any) {
  let [state, dispatch] = useReducer(reducer, initialState);
  let value = { state, dispatch };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
}

/**
 * Speichert den state in den Speicher
 * @param state der aktuelle State
 */
export const saveState = async (state: stateType) => {
  await Storage.set({
    key: StoreKeyPrefix + "state",
    value: JSON.stringify(state),
  }).then(() => console.log("State Saved"));
};

let AppContextConsumer = AppContext.Consumer;

export { AppContext, AppContextProvider, AppContextConsumer };
