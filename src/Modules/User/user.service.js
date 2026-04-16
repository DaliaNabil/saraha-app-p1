import { decodeToken } from "../../Common/index.js";
import userRepository from "../../DB/Repositories/user.repository.js";

export const getProfileService =  (req) => {
  //get token
  // const accessToken = headers.authorization;
  // console.log({ accessToken });
  
 console.log({req})

  //verfy token
  // const user = decodeToken({ token: headers.authorization });
  return  req.user;
};




export const updateUserProfile = async ({user ,body}) => {
    //update user profile
    const{ _id} = user;
    const { firstName, lastName, age , gender, email } = body;
    if(email){
      const existingUser = await userRepository.findOne({ email });
      if (existingUser ){
        throw new Error('Email is already in use by another account'), { cause: { status: 409 } };
      }
    }
     
    console.log({ _id , body });

   return await userRepository.findByIdAndUpdate(_id , 
    { firstName, lastName, age , gender, email } ,
     { new: true })  
}


export const getAllUsers = async () => {
  return await userRepository.find({})
}