
import bcrypt from 'bcrypt';


 export const hash = (plainText , salt =10) =>{
    return bcrypt.hash(plainText, salt);
 }

 export const compare = (plainText, hashText) =>{
     return bcrypt.compare(plainText, hashText);
 }
