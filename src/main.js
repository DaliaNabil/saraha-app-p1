import "./config/env.config.js";
import express from "express";
import cors from 'cors';
import envConfig from "./config/env.config.js";
import dbConnection from "./DB/db.connection.js";
import { globalErrorHandler } from "./Middlewares/index.js";
import {
  authController,
  messageController,
  userController,
} from "./Modules/index.js";
import { decrypt, encrypt, redisConnection } from "./Common/index.js";
import { corsOptions } from "./config/cors.config.js";
import { NotFoundException } from "./Common/Utils/Errors/exception.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
// import { limiterOptions } from "./config/limiter.config.js";
import { keys } from "./Common/Services/redis.service.js";
import { createRateLimiter } from "./config/limiter.config.js";

// Express
const app = express();
//port
const port = parseInt(envConfig.app.PORT || 3000); ;

//Database connection
dbConnection();

//redis connection
redisConnection()

//cors middleware
const limiter = createRateLimiter(keys.redisClient)
app.use(limiter)
app.use(cors(corsOptions) , helmet() );

//uploads
app.use('/uploads', express.static('uploads'))
// json parser
app.use(express.json())

//controllers

app.use("/api/auth", authController);
app.use("/api/message", messageController);
app.use("/api/user", userController);

//test api
app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use((req, res, next) => {
  throw new NotFoundException('this router is not found', { path: req.path })
});

// global error handler
app.use(globalErrorHandler);

// server start
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});


const encryptData = encrypt('hello')
const decrypted = decrypt(encryptData)

