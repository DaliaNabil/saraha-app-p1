import envConfig from "./env.config.js";


const whiteListOrgins = envConfig.cors.whiteListOrgins; 

 
export const corsOptions = {
    origin: (origin, callback) => {
        if (whiteListOrgins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"), false);
        }
    }
};