import { Router } from "express";
import * as  userService  from "./user.service.js";


 const userController = Router()

 userController.get('/:id' , async (req , res )=>{
    const data = await userService.getProfileService(req.params.id)

    res.json(data)
 })
  export default userController