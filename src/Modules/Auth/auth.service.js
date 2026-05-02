import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
import {
  NotFoundException,
  BadRequstException,
  ConflictException,
  createTokenCredentials,
  decodeToken,
  encrypt,
  hash,
  compare,
  CHANNELS,
  PROVIDERS,
  TOKEN_TYPES,
} from "../../Common/index.js";
import envConfig from "../../config/env.config.js";
import userRepository from "../../DB/Repositories/user.repository.js";
import { randomUUID } from "node:crypto";
import { blacklistToken } from "../../Common/Services/redis.service.js";
import { emailEvent, sendEmail } from "../../Common/Services/email.service.js";
import { otpTemplate } from "../../Common/Utils/template.js";

const jwtSecrets = envConfig.jwt;

const gcp = envConfig.gcp;
const client = new OAuth2Client();

// register
export const registerService = async (body) => {
  const { firstName, lastName, email, password, gender, phone } = body;
  //Repo pattern
  const checkEmailDuplication = await userRepository.findOne(
    { email },
    { email: 1 },
  );


  if (checkEmailDuplication) {
    throw new ConflictException("Email already exists", {
      duplicatedEmail: email,
    });
  }

  const hashedPassword = await hash(password, 12);
  const userObject = {
    firstName,
    lastName,
    email,
    password: hashedPassword,
    gender,
  };

  if (phone) {
    userObject.phoneNumber = encrypt(phone);
  }
  //otp
  const otp = Math.floor(100000 + Math.random() * 900000);
  console.log({ otp });

  userObject.OTPs = [
    {
      value: otp,
      expiresAt: new Date(Date.now() + 1 * 60 * 1000),
      channel: CHANNELS.EMAIL,
    },
  ];

  emailEvent.emit("sendEmail", {
    to: email,
    subject: "Verification code for your account",
    html: otpTemplate({ firstName, otp, expiration: "10 minutes" }),
  });
  // Repo pattern
  return userRepository.create(userObject);
};
//resend otp
export const resendOTPService = async (body) => {
  const { email } = body;

  const user = await userRepository.findOne({
    email: email.trim().toLowerCase(),
  });
  if (!user) {
    throw new NotFoundException("User not found", { cause: { status: 404 } });
  }

  if (user.isEmailVerified) {
    throw new BadRequstException("Email is already verified", {
      cause: { status: 400 },
    });
  }

  const newOtp = Math.floor(100000 + Math.random() * 900000);

  const otpEntry = {
    value: newOtp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    channel: CHANNELS.EMAIL,
  };

  //new
  await userRepository.findByIdAndUpdate(user._id, {
    $push: { OTPs: otpEntry },
  });

  emailEvent.emit("sendEmail", {
    to: user.email,
    subject: "New Verification Code",
    html: otpTemplate({
      firstName: user.firstName,
      otp: newOtp,
      expiration: "10 minutes",
    }),
  });

  return { message: "OTP resent successfully" };
};
export const verifyEmailService = async (body) => {
  const { email, otp } = body;
  const user = await userRepository.findOne({ email });

  if (!user) {
    throw new NotFoundException("User not found", { cause: { status: 404 } });
  }

  const otpObject = user.OTPs.find(
    (item) => item.value === otp && item.channel === CHANNELS.EMAIL,
  );

  if (!otpObject) {
    throw new NotFoundException("Invalid OTP", { cause: { status: 400 } }); // يفضل 400 لأن البيانات غلط مش مش موجودة
  }

  if (new Date(otpObject.expiresAt) < new Date()) {
    throw new BadRequestException("OTP has expired", {
      cause: { status: 400 },
    });
  }

  const newOtpsArray = user.OTPs.filter((item) => item.value !== otp);

  return userRepository.findByIdAndUpdate(
    user._id,
    { isEmailVerified: true, OTPs: newOtpsArray },
    { new: true },
  );
};

//login

export const loginService = async (body) => {
  const { email, password } = body;

  const user = await userRepository
    .findOne({
      email,
      provider: PROVIDERS.SYSTEM,
    })
    .select("+password");

  if (!user) {
    throw new Error("Invalid email or password", { cause: { status: 401 } });
  }

  const isPasswordValid = await compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password", { cause: { status: 401 } });
  }

  //Generat user token [access token ]
  return buildTokens(user);
};

// get refresh token from body
export const refreshTokenService = async (header) => {
  // get refresh token from body
  const { authorization: refreshToken } = header;
  const { decodedData } = await decodeToken({
    token: refreshToken,
    tokenType: TOKEN_TYPES.REFRESH,
  });

  const { accessToken } = createTokenCredentials({
    payload: {
      sub: decodedData.sub,
      email: decodedData.email,
      role: decodedData.role,
    },
    options: {
      access: {
        expiresIn: 60 || jwtSecrets[decodedData.role].accessExpiration,
      },
    },
    requiredToken: TOKEN_TYPES.ACCESS,
  });
  return { accessToken };
};

const buildTokens = (userData) => {
  //Generat user token [access token ]
  let tokenPayload = {
    sub: userData._id,
    email: userData.email,
    role: userData.role,
  };
  console.log({ tokenPayload });
  const { accessToken, refreshToken } = createTokenCredentials({
    payload: tokenPayload,
    options: {
      access: {
        expiresIn: jwtSecrets[userData.role].accessExpiration,
        jwtid: randomUUID(),
      },
      refresh: {
        expiresIn: jwtSecrets[userData.role].refreshExpiration,
        jwtid: randomUUID(),
      },
    },
  });
  return { accessToken, refreshToken };
};

const verifyIdToken = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: gcp.webClientId, // Specify the WEB_CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[WEB_CLIENT_ID_1, WEB_CLIENT_ID_2, WEB_CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  return payload;
};
//update user if exist or create new one
const handleUserUpdateOrCreadion = async (user, payload) => {
  const { given_name, family_name, email, sub } = payload;
  if (user) {
    return userRepository.findByIdAndUpdate(
      user._id,
      {
        firstName: given_name,
        lastName: family_name,
        email: email,
        googleSub: sub,
        provider: PROVIDERS.GOOGLE,
      },
      { new: true },
    );
  } else {
    const hashedPassword = await hash(crypto.randomBytes(12).toString("hex")); // generate random password for google users
    return userRepository.create({
      firstName: given_name,
      lastName: family_name,
      email: email,
      googleSub: sub,
      provider: PROVIDERS.GOOGLE,
      password: hashedPassword, // generate random password for google users
    });
  }
};

export const gmailRegisterService = async (body) => {
  const { idToken } = body;
  //1- verify id token and get the payload
  const payload = await verifyIdToken(idToken);
  if (!payload || !payload.email_verified) {
    throw new Error(
      "Your account is not authorized , please verify your email ",
      { cause: { status: 401 } },
    );
  }

  //2- fetch user from DB by email or google sub and provider = google
  const user = await userRepository.findOne({
    $or: [{ googleSub: payload.sub }, { email: payload.email }],
    provider: PROVIDERS.GOOGLE,
  });
  //3- update user if exist or create new one
  const userData = await handleUserUpdateOrCreadion(user, payload);
  //generate tokens for user
  return buildTokens(userData);
};

export const gmailLoginService = async (body) => {
  const { idToken } = body;
  //1- verify id token and get the payload
  const payload = await verifyIdToken(idToken);
  if (!payload || !payload.email_verified) {
    throw new Error(
      "Your account is not authorized , please verify your email ",
      { cause: { status: 401 } },
    );
  }

  //2- fetch user from DB by email or google sub and provider = google
  const user = await userRepository.findOne({
    $or: [{ googleSub: payload.sub }, { email: payload.email }],
    provider: PROVIDERS.GOOGLE,
  });

  if (!user) {
    throw new Error("Invalid email or password", { cause: { status: 401 } });
  }
  //generate tokens for user
  return buildTokens(user);
};

export const logoutService = async (accessTokenData, refreshToken) => {
  const { decodedData: refreshTokenData } = await decodeToken({
    token: refreshToken,
    tokenType: TOKEN_TYPES.REFRESH,
  });

  const { exp: refreshExpiration, jti: refreshJti } = refreshTokenData;
  const { exp: accessExpiration, jti: accessJti } = accessTokenData;

  Promise.all([
    blacklistToken({
      key: `bl_${TOKEN_TYPES.REFRESH}_${refreshJti}`,
      exp: refreshExpiration,
    }),
    blacklistToken({
      key: `bl_${TOKEN_TYPES.ACCESS}_${accessJti}`,
      exp: accessExpiration,
    }),
  ]).catch((err) => {
    console.error("Error blacklisting tokens:", err);
  });
  return { message: "logged out successfully" };
};
