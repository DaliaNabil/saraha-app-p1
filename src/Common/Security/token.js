import jwt from "jsonwebtoken";
import envConfig from "../../config/env.config.js";
import userRepository from "../../DB/Repositories/user.repository.js";
import { USER_ROLES } from "../constants.js";
const jwtSecrets = envConfig.jwt;

//Generate Token
export const generateToken = ({ payload, secretKey, options }) => {
  return jwt.sign(payload, secretKey, options);
};

// verify token
export const verifyToken = ({ token, secretKey, options }) => {
  return jwt.verify(token, secretKey, options);
};

//Create Login credentials

export const createTokenCredentials = ({ payload, secretKey, options }) => {
  const accessToken = generateToken({
    payload,
    secretKey,
    options,
  });
  return { accessToken };
};

export const decodeToken = ({ token}) => {
  //decode token to get user role
  const data = jwt.decode(token)
  console.log({ data });
  if(!data.role) throw new Error("Invalid payload", { cause: { status: 400 } });
  const { accessSignature} = detectSignature({ role: data.role });
  console.log({ accessSignature });
  //verfy token
  const decodedData = verifyToken({ token, secretKey: accessSignature});
  console.log({ decodedData });
  if (!decodedData.sub)
    throw new Error("Invalid payload", { cause: { status: 400 } });
  return userRepository.findById(decodedData.sub);
};


export const detectSignature=({role})=>{
  let signature
  if(role ==USER_ROLES.ADMIN) {
    signature = jwtSecrets.admin
  }else{
    signature = jwtSecrets.user
  }
  return signature
}