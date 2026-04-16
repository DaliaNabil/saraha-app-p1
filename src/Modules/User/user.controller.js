import { Router } from "express";
import * as userService from "./user.service.js";
import { authenticate, authorize } from "../../Middlewares/authentication.middleware.js";
import { USER_ROLES } from "../../Common/constants.js";

const userController = Router();

userController.get("/profile", authenticate, async (req, res) => {
  const data = await userService.getProfileService(req);

  res.json(data);
});

userController.put("/update", authenticate, async (req, res) => {
  console.log({ user: req.user, body: req.body });
  const result = await userService.updateUserProfile({
    user: req.user,
    body: req.body,
  });
  //  console.log({ result });

  res
    .status(200)
    .json({ message: "Profile updated successfully", data: result });
});

//list all users

userController.get('/all', authenticate , authorize([USER_ROLES.ADMIN, USER_ROLES.USER]), async (req, res) => { 
   const result = await userService.getAllUsers();
   res.status(200).json({ message: "Users retrieved successfully", data: result });
})


export default userController;
