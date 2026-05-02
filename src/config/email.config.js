import envConfig from "./env.config.js";

const emails = envConfig.emails;
export const emailConfig = {
  service: emails.service,
  auth: {
    user: emails.user,
    pass: emails.pass,
  },
};
