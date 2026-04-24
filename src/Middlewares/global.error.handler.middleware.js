
import envConfig from "../config/env.config.js"

const globalErrorHandler = (err, req,res,next)=>{
    console.log(err)

    res.status(err?.statusCode|| 500 ).json({
        message:err.message||'Internal server error' ,
        // stack:envConfig.app.NODE_ENV =='dev'? err.stack:undefined ,
        error:{
            code:err.code,
            details:err.details
        }

    })
}

export default globalErrorHandler