module.exports = {
  apps: [
    {
      name: "sarahah-app",
      script: "src/main.js",
      instances: 2,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "dev",
        PORT: "3000",
        MONGO_URL: "mongodb://127.0.0.1:27017/sarahah_app",
        MONGO_URL_CLOUD: "mongodb+srv://dalianabil216_db_user:542Z8Txce9KILOL8@free-cluster.2nvolp8.mongodb.net/saraha-app",
        ENC_KEY: "5f3a9e12b7c4d8a1092e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c",
        ENC_IV_LENGHT: "16",
        JWT_SECRET_USER: "jwt_USER_578%%_secret_access",
        JWT_ACCESS_EXP_USER: "1d",
        JWT_SECRET_ADMIN: "jwt_admin_123@7_secret_access",
        JWT_ACCESS_EXP_ADMIN: "5h",
        JWT_REFRESH_SECRET_USER: "jwt_USER_578%%_secret_refresh",
        JWT_REFRESH_EXP_USER: "2d",
        JWT_REFRESH_SECRET_ADMIN: "jwt_admin_123@7_secret_refresh",
        JWT_REFRESH_EXP_ADMIN: "7d",
        CORS_WHITELISTED_ORIGINS: "http://localhost:3000,https://sarahah-app.vercel.app,http://localhost:4200,http://127.0.0.1:4200",
        GCP_CLIENT_ID: "705505231865-0tum5bfpp6kvocnfpjktmshjgkj8kghv.apps.googleusercontent.com",
        REDIS_URL: "rediss://default:gQAAAAAAAZZlAAIgcDE1YjIyMzkyY2Y0ZTA0YTgwOTQzMTljOWNkM2NmY2M4OQ@casual-shark-104037.upstash.io:6379",
        EMAIL_USER: "dalianabil216@gmail.com",
        EMAIL_PASS: "ljtgkuxdrlgltlam",
        EMAIL_SERVICE: "Gmail"
      }
    }
  ]
};