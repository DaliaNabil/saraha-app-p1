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

// Express
const app = express();
//port
const port = envConfig.app.PORT;

//Database connection
dbConnection();

//redis connection
redisConnection()

//cors middleware
app.use(cors(corsOptions));

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
console.log({ encryptData, decrypted })
