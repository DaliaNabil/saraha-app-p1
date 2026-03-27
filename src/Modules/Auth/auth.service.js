
import { compare, encrypt, hash } from '../../Common/index.js';
import User from './../../DB/Models/uer.model.js';

// register 
export  const registerService = async(body)=>{
    const { firstName , lastName , email , password , gender , phone} = body;
    const checkEmailDuplication = await User.findOne({email}).select("email") ;

     if (checkEmailDuplication){
        throw new Error("Email already exists" , {cause:{status:409}})
     }
  const hashedPassword = await hash(password , 12);
     const userObject = {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        gender
      }
    

      if(phone){
        userObject.phoneNumber = encrypt(phone)
      }

      return User.create(userObject)
}


//login

 export const loginService = async (body) =>{
    const { email , password} = body;
    const user = await User.findOne({email});

    if (!user){
        throw new Error("Invalid email or password" , {cause:{status:401}})
    } 
    const isPasswordValid = await compare(password , user.password);

    if (!isPasswordValid){
        throw new Error("Invalid email or password" , {cause:{status:401}})
    } 
    return user;      

 }