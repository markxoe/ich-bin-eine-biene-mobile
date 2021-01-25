/* TODO: Adding Functions from ../globals.ts */

import { stateType } from "../store/types";
import axios from "axios";

const getBaseURL = () => {
  return (
    process.env.react_app_apiurl ?? "https://api.ichbineinebiene.toastbrot.org"
  );
};

export const APIgetWarning = async (
  state: stateType
): Promise<string | boolean> => {
  return (
    (await axios
      .get(getBaseURL() + "/api/v1/users2/warning/" + state.userUUID)
      .then((r) => {
        const result: { status: string; result?: string } = r.data;
        if (result.status === "ok" && result) {
          return result.result;
        } else {
          return false;
        }
      })
      .catch(() => false)) ?? false
  );
};
