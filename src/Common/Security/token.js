import jwt from "jsonwebtoken";
import envConfig from "../../config/env.config.js";
import userRepository from "../../DB/Repositories/user.repository.js";
import { TOKEN_TYPES, USER_ROLES } from "../constants.js";
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

export const createTokenCredentials = ({ payload, options , requiredToken}) => {

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
  break
  }     

  return { accessToken, refreshToken };
};

export const decodeToken = async ({ token, tokenType }) => {
  //decode token to get user role
  const data = jwt.decode(token);
  // console.log({ data });

  if ( !data || !data.role)
    throw new Error("Invalid payload", { cause: { status: 400 } });

  const signature = getSignatureByTypeAndRole({ role: data.role, tokenType });
  //verfy token
  const decodedData = verifyToken({ token, secretKey: signature });
  console.log({ decodedData });

  if (!decodedData.sub)
    throw new Error("Invalid payload", { cause: { status: 400 } });

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
  // console.log({ "Detected signature": signature });
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
  // console.log({ tokenSignature });
  return tokenSignature;
};
