import crypto from 'node:crypto'; 
import envConfig from '../../config/env.config.js';
import fs from 'node:fs'

const encryptionEnv = envConfig.encryption;

 const encryptionKey = Buffer.from(encryptionEnv.ENCRYPTION_KEY, 'hex');

export const encrypt = (plainText) => {
    
   //  const ivLength = parseInt(encryptionEnv.IV_LENGHT) || 16; 
    const iv = crypto.randomBytes(parseInt(encryptionEnv.IV_LENGHT));

    const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
    
    let encrypted = cipher.update(plainText, 'utf-8', 'hex');
    encrypted += cipher.final('hex');

    
    return `${iv.toString('hex')}:${encrypted}`;
};

////////////////////////////////////////////////////////////////

export const decrypt = (inputCipher)=>{

    const [iv , encryptData] = inputCipher.split(':')
  const bufferedIv = Buffer.from(iv , 'hex')

  const decipher = crypto.createDecipheriv('aes-256-cbc',encryptionKey , bufferedIv )

  let decrypted = decipher.update(encryptData , 'hex', 'utf-8')

  decrypted+= decipher.final('utf-8')
  return decrypted
}


if (fs.existsSync('publicKey.pem')&& fs.existsSync('privateKey.pem')){
    console.log('key already generated')
} else{
    
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    
        modulusLength: 2048, 
        publicKeyEncoding: { 
            type: 'pkcs1',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        }
    });
    
    
    fs.writeFileSync('publicKey.pem', publicKey)
    fs.writeFileSync('privateKey.pem', privateKey)
   
}
    

export const asymetricENcryption = (text)=>{
    const publicKey = fs.readFileSync('publicKey.pem' , 'utf-8')
    const bufferedText = Buffer.from(text)
    const data = crypto.publicEncrypt({
        key:publicKey ,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
    },
    bufferedText
)

return encryptData.toString('hex')
}

export const asymetricDecryption = (text)=>{
    const privateKey = fs.readFileSync('publicKey.pem' , 'utf-8')
    const bufferedText = Buffer.from(text)
    const decryptData = crypto.publicEncrypt({
        key:privateKey ,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
    },
    bufferedText
)

return decryptData.toString('utf-8')
}