
import User from '../../DB/Models/uer.model.js';
import { decrypt } from '../../Common/index.js';
// import {User} from './../../DB/Models/index.js';

 export const getProfileService = async (id)=>{
    const user = await User.findById(id)

    if(user.phoneNumber){
        user.pho4 = decrypt(user.phoneNumber)

    }

     return user
 }