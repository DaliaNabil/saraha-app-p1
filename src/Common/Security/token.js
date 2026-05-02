import jwt from "jsonwebtoken";
import envConfig from "../../config/env.config.js";
import userRepository from "../../DB/Repositories/user.repository.js";
import { TOKEN_TYPES, USER_ROLES } from "../constants.js";
import { BadRequstException } from "../Utils/index.js";
import { get } from "../Services/redis.service.js";
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

export const createTokenCredentials = ({ payload, options, requiredToken }) => {
  const signature = getSignatureByTypeAndRole({
    role: payload.role,
    both: true,
  });
  let accessToken, refreshToken;

  switch (requiredToken) {
    case TOKEN_TYPES.ACCESS:
      accessToken = generateToken({
        payload,
        secretKey: signature.accessSignature,
        options: options.access,
      });

      break;
    case TOKEN_TYPES.REFRESH:
      refreshToken = generateToken({
        payload,
        secretKey: signature.refreshSignature,
        options: options.refresh,
      });
      break;

    default:
      accessToken = generateToken({
        payload,
        secretKey: signature.accessSignature,
        options: options.access,
      });

      refreshToken = generateToken({
        payload,
        secretKey: signature.refreshSignature,
        options: options.refresh,
      });
      break;
  }

  return { accessToken, refreshToken };
};

/**
 * @param {string} -token - The JWT token to decode and verify 
 * @return {Object} An object containing the decoded user data and the user document from the database
 * @throws {Error} Throws an error if the token is invalid, expired
 *  @param {ENUM} =tokenType 
 * @return {Object} An object containing the decoded user data and the user document from the database
 *  
 * 
 */
export const decodeToken = async ({ token, tokenType }) => {
  //decode token to get user role
  const data = jwt.decode(token);


  if (!data || !data.role)
    throw new Error("Invalid payload", { cause: { status: 400 } });

  const signature = getSignatureByTypeAndRole({ role: data.role, tokenType });
  //verfy token
  const decodedData = verifyToken({ token, secretKey: signature });


  if (!decodedData.sub)
    throw new Error("Invalid payload", { cause: { status: 400 } });

  //check if jti is blacklisted
  const isBlackListed = await get({key:`bl_${tokenType}_${decodeToken.jti}`})
 if (isBlackListed){
  throw new BadRequstException('Token is blacklisted, please login again')
 }
  const user = await userRepository.findById(decodedData.sub);
  if (!user) {
    throw new Error("User not found, please register", {
      cause: { status: 404 },
    });
  }

  return { user, decodedData };
};

export const detectSignature = ({ role }) => {
  let signature;
  if (role == USER_ROLES.ADMIN) {
    signature = jwtSecrets.admin;
  } else {
    signature = jwtSecrets.user;
  }
  return signature;
};

//role => user, dmin
//tokenType => access, refresh
export const getSignatureByTypeAndRole = ({ role, tokenType, both }) => {
  const signature = detectSignature({ role });
  if (both) return signature;
  let tokenSignature;

  switch (tokenType) {
    case TOKEN_TYPES.ACCESS:
      tokenSignature = signature.accessSignature;
      break;
    case TOKEN_TYPES.REFRESH:
      tokenSignature = signature.refreshSignature;
      break;

    default:
      throw new Error("Invalid token type", { cause: { status: 400 } });
  }
  return tokenSignature;
};
