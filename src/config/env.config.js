import { config } from "dotenv";

config({ path: [`.${process.env.NODE_ENV}.env`, '.env'] });

const envConfig = {
    app: {
        NODE_ENV: process.env.NODE_ENV ?? 'dev',
        PORT: process.env.PORT ?? 3000
    },
    database: {
    
        MONGO_URL: process.env.MONGO_URL 
    },
    encryption: {
       
        ENCRYPTION_KEY: process.env.ENC_KEY, 
    
        IV_LENGHT: process.env.ENC_IV_LENGHT 
    },
     jwt: {
        user:{
          accessSignature: process.env.JWT_SECRET_USER,
           accessExpiration: process.env.JWT_ACCESS_EXP_USER   ,
           
            refreshSignature: process.env.JWT_REFRESH_SECRET_USER,  
            refreshExpiration: process.env.JWT_REFRESH_EXP_USER
        },
        admin:{
          accessSignature: process.env.JWT_SECRET_ADMIN,
           accessExpiration: process.env.JWT_ACCESS_EXP_ADMIN ,
           
            refreshSignature: process.env.JWT_REFRESH_SECRET_ADMIN,  
            refreshExpiration: process.env.JWT_REFRESH_EXP_ADMIN
        }
    },
    cors:{
        whiteListOrgins: process.env.CORS_WHITELISTED_ORIGINS?.split(",") 
    },
    gcp:{
        webClientId: process.env.GCP_CLIENT_ID
    }
}

export default envConfig;
