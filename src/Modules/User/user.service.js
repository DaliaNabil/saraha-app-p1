import { decodeToken } from "../../Common/index.js";
import envConfig from "../../config/env.config.js";

const jwtSecrets = envConfig.jwt;

export const getProfileService = async (headers) => {
  //get token
  const accessToken = headers.authorization;
  console.log({ accessToken });

  //verfy token
  return decodeToken({token: accessToken });
};
