import crypto from "crypto";
import speakeasy from "speakeasy";
import openpgp, { key, message } from "openpgp";
import axios from "axios";
import base64 from "base-64";
import { stateType } from "../store/types";
import packagejs from "../../package.json";
import { getPlatforms } from "@ionic/react";

interface uploadInterface {
  userid: string;
  autoRotatingBeeLength: Number;
  additionalBeeLength: Number;
  multiplierLevel: Number;
  userName: string;
  settingNewUI: boolean;
  settingClickingAid: boolean;
  userImage: string;
  goldenBienens: number;
}

export const calculateTOTP = () => {
  return speakeasy.totp({ secret: process.env.react_app_totp_secret ?? "" });
};

const getChecksum = (data: string) => {
  return crypto.createHash("md5").update(data).digest("base64");
};

export const secureUpload = async (state: stateType) => {
  const _publicKey = base64.decode(
    process.env.react_app_public_upload_key_base64 ?? ""
  );
  const _publicKeyArmored = (await key.readArmored(_publicKey)).keys;

  const data: uploadInterface = {
    userid: state.userUUID,
    autoRotatingBeeLength: state.biene.autoRotatingBees.length,
    additionalBeeLength: state.biene.additionalBienen.length,
    multiplierLevel: state.biene.multiplierLevel,
    userName: state.userName,
    settingClickingAid: state.settings.clickButtonForBee,
    settingNewUI: state.settings.newUI,
    userImage: state.userImage,
    goldenBienens: state.goldenBienen,
  };

  const toBeEncrypted = JSON.stringify(data);

  const out = await openpgp.encrypt({
    message: message.fromText(toBeEncrypted),
    publicKeys: _publicKeyArmored,
  });
  console.log(out.data);
  const uploadOut = base64.encode(out.data);
  console.log(uploadOut);

  await axios
    .post(
      (process.env.react_app_apiurl ?? "") + "/api/v2/highscore",
      {
        data: uploadOut,
        totp: calculateTOTP(),
        chksum: getChecksum(uploadOut),
      },
      {
        headers: {
          totp: calculateTOTP(),
          totpdouble: calculateTOTP(),
          version: packagejs.version,
          platforms: getPlatforms().join(" "),
        },
      }
    )
    .catch((r) => console.error("Upload Error", r));
};

export default secureUpload;
