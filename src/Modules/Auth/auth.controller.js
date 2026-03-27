import { Router } from "express";
import * as authService from './auth.service.js'

 const authController = Router()

 //test
  authController.get('/', ( req , res)=>{

    res.send ('Auth controller is running')
  })


   authController.post('/register',  async( req , res)=>{
const result = await authService.registerService(req.body)
 res.status(201).json( {message :'User registered successfully', result})
  })


  authController.post('/login',  async( req , res)=>{
    const result = await authService.loginService(req.body)
     res.status(200).json( {message :'User logged in successfully', result})
      })

  export default authController