import { Router } from "express";
import * as authService from "./auth.service.js";
import { responseFormatter } from "../../Middlewares/unified-response-middleware.js";
import validation from "../../Middlewares/validation.middleware.js";
import { registerSchema } from "../../Validators/auth.validators.js";
import { auth } from "google-auth-library";
import { authenticate } from "../../Middlewares/authentication.middleware.js";
import { verifyEmailService } from "./auth.service.js";
const authController = Router();

//test
authController.get("/", (req, res) => {
  res.send("Auth controller is running");
});

authController.post(  "/register", validation(registerSchema), responseFormatter(async (req, res) => {
    const result = await authService.registerService(req.body);
    // res.status(201).json({ message: "User registered successfully", result });
    return {
      message: "User registered successfully",
      data: result,
      meta: { statusCode: 201 },
    };
  }),
);

authController.post( "/login", responseFormatter(async (req, res) => {
    const result = await authService.loginService(req.body);
    return {
      message: "User logged in successfully",
      data: result,
      meta: { statusCode: 200 },
    };
  }),
);

authController.post(
  "/refresh-token",
  responseFormatter(async (req, res) => {
    const result = await authService.refreshTokenService(req.headers);
    return {
      message: "Token refreshed successfully",
      data: result,
      meta: { statusCode: 200 },
    };
  }),
);

//gmail / register

authController.post( "/gmail/register",
  responseFormatter(async (req, res) => {
    const result = await authService.gmailRegisterService(req.body);
    return {
      message: "User registered successfully",
      data: result,
      meta: { statusCode: 201 },
    };
  }),
);

 authController.put("/verify",
  responseFormatter(async (req, res) => {
    const result = await authService.verifyEmailService(req.body);
    return {
      message: "User verified successfully",
      data: result,
      meta: { statusCode: 200 },
    };
  }),
);



authController.post('/resend-otp', async (req, res, next) => {
    try {
        const result = await authService.resendOTPService(req.body);
        res.status(200).json({ 
            success: true, 
            message: "OTP resent successfully", 
            ...result 
        });
    } catch (error) {
        next(error); 
    }
});
//gmail / login

authController.post("/gmail/login",
  responseFormatter(async (req, res) => {
    const result = await authService.gmailLoginService(req.body);
    return {
      message: "User logged in successfully",
      data: result,
      meta: { statusCode: 200 },
    };
  }),
);

authController.post(
  "/logout",
  authenticate,
  responseFormatter(async (req, res) => {
    
    const refreshToken = req.headers.refreshtoken ;

    
    const result = await authService.logoutService(req.accessTokenData, refreshToken);

    return {
      message: "User logged out successfully",
      data: result,
      meta: { statusCode: 200 },
    };
  })
);

export default authController;
