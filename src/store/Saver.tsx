import React, { useEffect } from "react";
import { AppContext, saveState } from "./State";
export const Saver: React.FC = ({ children }) => {
  const { dispatch, state } = React.useContext(AppContext);
  useEffect(() => {
    if (state.dataLoadedFromMemory) saveState(state, dispatch);
  }, [state, dispatch]);
  return <>{children}</>;
};
export default Saver;
