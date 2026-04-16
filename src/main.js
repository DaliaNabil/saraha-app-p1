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
import { decrypt, encrypt } from "./Common/index.js";
import { corsOptions } from "./config/cors.config.js";

// Express
const app = express();
//port
const port = envConfig.app.PORT;

//Database connection
dbConnection();
//cors middleware
app.use(cors(corsOptions));
// json parseer
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
  res.status(404).json({ message: "Router  not found" });
});

// global error handler
app.use(globalErrorHandler);

// server start
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});


const encryptData = encrypt('hello')
const decrypted = decrypt(encryptData)
console.log({encryptData , decrypted})
