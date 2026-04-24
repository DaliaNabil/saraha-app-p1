import multer from "multer"
import fs from 'node:fs'
import { fileExtensions } from "../Common/index.js"


 const multerLocal = (path)=>{
    const storage = multer.diskStorage({
         destination: function(req, file,cb){
            const destination = `uploads${path}`
         fs.mkdirSync(destination , {recursive:true})
            cb(null , destination)
        },
        filename:function(req, file, cb){
            console.log({file});
            
            const uniquSuffix = Date.now()+'-'+Math.round(Math.random()* 1E9)
            cb(null, uniquSuffix +'-'+file.originalname )
        }
       


    }) 

 // image / png
  const fileFilter = function(req, file, cb) {
    const [fileType, fileExt] = file.mimetype.split('/').map(item => item.trim());
    
    const allowExtensions = fileExtensions[fileType]; 

    console.log("Debug - Final Check:", {
        fileType,
        fileExt,
        isAllowed: allowExtensions?.includes(fileExt)
    });

    if (allowExtensions && allowExtensions.includes(fileExt)) {
        return cb(null, true);
    }

    return cb(new Error(`File type [${fileExt}] not allowed for [${fileType}]`), false);
}

    //limts
    // const limits ={
    //     files:1 ,
    //     fields:1
    // }
    return multer({ fileFilter , storage  })
}

export default multerLocal