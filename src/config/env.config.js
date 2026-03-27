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
    }
}

export default envConfig;
