import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { getCountriesCodeByIp, TooManyRequestsException } from "../Common/index.js";

export const createRateLimiter = (client) => {
  return rateLimit({
   
    windowMs: 1 * 60 * 1000, // 1 minute
    max: async (req) => {
      try {
     
        const ip = req.headers["x-forwarded-for"] || req.ip;
        const countryCode = await getCountriesCodeByIp(ip);
        const limits = { EG: 5, IN: 10, US: 15, FR: 20 };
        return limits[countryCode] || 3;
      } catch {
        return 3;
      }
    },
    standardHeaders: true, 
    legacyHeaders: false, 
  
    handler: (req, res, next) => {
      next(new TooManyRequestsException("Too many requests, try again later."));
    },

    // // Redis store configuration
    // store: new RedisStore({
    //   sendCommand: (...args) => client.call(...args),
    // }),
  });
};