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

const initialState: stateType = {};

let reducer = (state: stateType, action: actionType) => {
  switch (action.type) {
    case "setState": {
      return { ...state, ...action.payload };
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

function AppContextProvider(props: any) {
  let [state, dispatch] = useReducer(reducer, initialState);
  let value = { state, dispatch };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
}

let AppContextConsumer = AppContext.Consumer;

export { AppContext, AppContextProvider, AppContextConsumer };
