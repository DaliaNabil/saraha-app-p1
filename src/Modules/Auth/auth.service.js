import {
  compare,
  createTokenCredentials,
  encrypt,
  hash,
} from "../../Common/index.js";
import envConfig from "../../config/env.config.js";
import userRepository from "../../DB/Repositories/user.repository.js";

const jwtSecrets = envConfig.jwt;
// register
export const registerService = async (body) => {
  const { firstName, lastName, email, password, gender, phone } = body;
  //Repo pattern
  const checkEmailDuplication = await userRepository.findOne(
    { email },
    { email: 1 },
  );
  console.log(checkEmailDuplication);

  if (checkEmailDuplication) {
    throw new Error("Email already exists", { cause: { status: 409 } });
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
  //Repo pattern
  return userRepository.create(userObject);
};

//login

export const loginService = async (body) => {
  const { email, password } = body;
  const user = await userRepository.findOne({ email }, "+password");

  if (!user) {
    throw new Error("Invalid email or password", { cause: { status: 401 } });
  }
  const isPasswordValid = await compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password", { cause: { status: 401 } });
  }

  //Generat user token [access token ]

  const { accessToken } = createTokenCredentials({
    payload: { sub: user._id, email, role: user.role },
    secretKey: jwtSecrets.user.accessSignature,

    options: {
      expiresIn: jwtSecrets.user.accessExpiration,
      audience: ["web", "mobile"],
      noTimestamp: true,
    },
  });
  return accessToken;
};
