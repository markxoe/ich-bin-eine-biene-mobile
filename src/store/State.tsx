import { Storage } from "@capacitor/core";
import React, { useReducer } from "react";
import { StoreKeyPrefix } from "../other/const";
import { actionType, stateType, ContextType } from "./types";
import { nameAtHomePositions } from "../globals";

let AppContext = React.createContext<ContextType>({} as ContextType);

const initialState: stateType = {
  dataLoadedFromMemory: false,
  biene: {
    clickCounter: 0,
    rotateSpeedLevel: 0,
    additionalBienen: [],
    multiplierLevel: 0,
    autoRotatingBees: [],
  },
  goldenBienen: 0,
  settings: {
    clickButtonForBee: false,
    newUI: true,
    deactivateStoreConfetti: false,
    nameathomeposition: nameAtHomePositions.top,
  },
  statisticsRotations: 0,
  settingMaxNumberDisplayedBees: 20,
  userUUID: "",
  userName: "",
  userImage: "",
  lastSaveAt: Date.now(),
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
      return {
        ...state,
        settings: { ...state.settings, clickButtonForBee: action.payload },
      };
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

    case "setsettingnewui": {
      return {
        ...state,
        settings: {
          ...state.settings,
          newUI: action.payload,
        },
      };
    }

    case "bieneAutoRotatingAdd": {
      return {
        ...state,
        biene: {
          ...state.biene,
          autoRotatingBees: state.biene.autoRotatingBees.concat(action.payload),
        },
      };
    }
    case "statisticsAdd": {
      return {
        ...state,
        statisticsRotations: state.statisticsRotations + 1,
      };
    }
    case "settingSetMaxDisplayBiene": {
      return {
        ...state,
        settingMaxNumberDisplayedBees: action.payload,
      };
    }

    case "setUserUUID": {
      return {
        ...state,
        userUUID: action.payload,
      };
    }

    case "setUserName": {
      return {
        ...state,
        userName: action.payload,
      };
    }

    case "setUserImage": {
      return {
        ...state,
        userImage: action.payload,
      };
    }

    case "setStoreConfetti": {
      return {
        ...state,
        settings: {
          ...state.settings,
          deactivateStoreConfetti: action.payload,
        },
      };
    }

    case "setNameAtHomePosition": {
      return {
        ...state,
        settings: {
          ...state.settings,
          nameathomeposition: action.payload,
        },
      };
    }
    case "setLastSavedAt": {
      return {
        ...state,
        lastSaveAt: action.payload,
      };
    }

    case "addGoldenBiene": {
      return {
        ...state,
        goldenBienen: state.goldenBienen + 1,
      };
    }

    case "resetManyThings": {
      return {
        ...state,
        biene: {
          ...state.biene,
          additionalBienen: [],
          multiplierLevel: 0,
          autoRotatingBees: [],
          clickCounter: 0,
          rotateSpeedLevel: 0,
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
export const saveState = async (
  state: stateType,
  dispatch: React.Dispatch<actionType>
) => {
  if (Date.now() > state.lastSaveAt + 3000) {
    console.log("Saving...");
    await Storage.set({
      key: StoreKeyPrefix + "state",
      value: JSON.stringify(state),
    }).then(() => console.log("State Saved"));
    dispatch({ type: "setLastSavedAt", payload: Date.now() });
  }
};

let AppContextConsumer = AppContext.Consumer;

export { AppContext, AppContextProvider, AppContextConsumer, initialState };
