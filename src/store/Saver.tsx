import React, { useEffect } from "react";
import { AppContext, saveState } from "./State";
import { Plugins, Storage } from "@capacitor/core";
import { StoreKeyPrefix, oldStoreKeyPrefix } from "../const";

import { FirebaseAnalyticsPlugin } from "@capacitor-community/firebase-analytics";
import { stateType } from "../store/types";
import { ActionSetState, ActionBieneClickIncrease } from "./Actions";
import { generateToast } from "../globals";
const Firebase = Plugins.FirebaseAnalytics as FirebaseAnalyticsPlugin;

export const Saver: React.FC = ({ children }) => {
  useEffect(() => {
    if (!state.dataLoadedFromMemory)
      Storage.get({ key: StoreKeyPrefix + "state" }).then(async (result) => {
        if (result && result.value) {
          const res = JSON.parse(result.value);
          dispatch(ActionSetState(res));
          console.log(res);
          console.log("Done loading State");
        } else {
          console.log("No State in Memory, check for Old State");
          const resultOld = await Storage.get({
            key: oldStoreKeyPrefix + "state",
          });
          if (resultOld.value !== null && resultOld.value !== "") {
            dispatch(ActionBieneClickIncrease(500));
            Firebase.logEvent({ name: "GaveBonus", params: { success: true } });
            try {
              const oldUser: stateType = JSON.parse(resultOld.value);
              dispatch({
                type: "setUserName",
                payload: oldUser.userName,
              });
              dispatch({
                type: "setUserImage",
                payload: oldUser.userImage,
              });
            } catch {
              console.log("Error Loading From Old");
            }
            generateToast("Ein paar Bienen als Bonus für dich!", 20000, true);
            console.log("Got Old, gave Bonus");
          }
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { dispatch, state } = React.useContext(AppContext);
  useEffect(() => {
    if (state.dataLoadedFromMemory) saveState(state, dispatch);
  }, [state, dispatch]);
  return <>{children}</>;
};
export default Saver;
