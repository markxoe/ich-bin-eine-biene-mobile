import crypto from "crypto";

const calculateHeader = (
  uuid: string,
  secret: string,
  additionalBeeLength: Number
) => {
  return crypto
    .createHash("md5")
    .update(secret.trim() + uuid + additionalBeeLength.toString())
    .digest("base64");
};

export default calculateHeader;
