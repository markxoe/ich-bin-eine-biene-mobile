import crypto from "crypto";

const calculateHeader = (uuid: string, secret: string) => {
  console.log("TheSecret:", secret);
  return crypto
    .createHash("md5")
    .update(secret.trim() + uuid)
    .digest("base64");
};

export default calculateHeader;
