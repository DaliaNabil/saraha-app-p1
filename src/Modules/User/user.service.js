
import { BadRequstException, decodeToken } from "../../Common/index.js";
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




export const updateUserProfile = async ({ user, body }) => {
    const { _id } = user;
    const { firstName, lastName, age, gender, email } = body;

    if (email) {
        const existingUser = await userRepository.findOne({ 
            email, 
            _id: { $ne: _id } 
        });

        if (existingUser) {
      
            throw new Error('Email is already in use by another account', { 
                cause: { status: 409 } 
            });
        }
    }

    console.log("Updating profile for:", _id);

    const updatedUser = await userRepository.findByIdAndUpdate(
        _id,
        { firstName, lastName, age, gender, email },
        { new: true, runValidators: true } // runValidators عشان يتأكد من شروط الـ Schema
    );

    if (!updatedUser) {
        throw new Error('User not found', { cause: { status: 404 } });
    }

    return updatedUser;
}


export const getAllUsers = async () => {
  return await userRepository.find({})
}

export const UploadProfilePicture = async(user , file )=>{
  if(!file || !file.path  )throw new BadRequstException ('file is required' )
  return await userRepository.findByIdAndUpdate(
    user._id, 
    { profilePicture: file.path }, 
    { new: true }
);

  }

