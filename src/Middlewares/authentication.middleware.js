import { decodeToken, TOKEN_TYPES } from "../Common/index.js";

export const authenticate = async (req, res, next) => {
  
    const { authorization } = req.headers;

    if (!authorization) {
      return next(new Error("Authentication header is missing", { cause: { status: 400 } }));
    }

    const parts = authorization.trim().split(" ");
    const prefix = parts[0]; //index 
    const token = parts.length === 2 ? parts[1] : parts[0];

    switch (prefix) {
      case "Basic":
        const [username, password] = Buffer.from(token, "base64")
          .toString("utf-8")
          .split(":");
        
        console.log("Basic Auth detected:", { username });
        break;

      case "Bearer":
        const {user} = await decodeToken({ token , tokenType: TOKEN_TYPES.ACCESS });
        
        if (!user) {
          return next(new Error("Invalid user credentials, please register", { cause: { status: 404 } }));
        }
        
        req.user = user; 
        console.log("User Authenticated:", user.email);
        break;

      default:
        return next(new Error("Invalid token format", { cause: { status: 400 } }));
    }

    next();
  
};

export const authorize=(roles)=>{
    return (req, res, next)=>{
        const userRole = req.user.role;
        if (!roles.includes(userRole)) {
            throw new Error(" not authorized", { cause: { status: 403 } });
        }
        next();

    }
}