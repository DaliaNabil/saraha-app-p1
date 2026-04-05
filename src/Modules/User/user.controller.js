import { Router } from "express";
import * as  userService  from "./user.service.js";


 const userController = Router()

 userController.get('/profile' , async (req , res )=>{
    const data = await userService.getProfileService(req.headers)

    res.json(data)
 })
  export default userController