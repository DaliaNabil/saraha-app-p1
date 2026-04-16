import { Router } from "express";
import * as authService from "./auth.service.js";
import { responseFormatter } from "../../Middlewares/unified-response-middleware.js";

const authController = Router();

//test
authController.get("/", (req, res) => {
  res.send("Auth controller is running");
});

authController.post("/register", responseFormatter(
  async (req, res) => {
  const result = await authService.registerService(req.body);
  // res.status(201).json({ message: "User registered successfully", result });
  return { message: "User registered successfully",data: result , meta:{ statusCode: 201 } };
}));

authController.post("/login", responseFormatter(
  async (req, res) => {
  const result = await authService.loginService(req.body);
  return { message: "User logged in successfully", data: result, meta: { statusCode: 200 } };
}));


authController.post("/refresh-token", responseFormatter(
  async (req, res) => { 
    const result = await authService.refreshTokenService(req.headers);
    return { message: "Token refreshed successfully", data: result, meta: { statusCode: 200 } };
  }
));

//gmail / register

authController.post("/gmail/register", responseFormatter(
  async (req, res) => {
    const result = await authService.gmailRegisterService(req.body);
    return { message: "User registered successfully", data: result, meta: { statusCode: 201 } };
  }
));

//gmail / login

authController.post("/gmail/login", responseFormatter(
  async (req, res) => {
    const result = await authService.gmailLoginService(req.body);
    return { message: "User logged in successfully", data: result, meta: { statusCode: 200 } };
  }
));


export default authController;
