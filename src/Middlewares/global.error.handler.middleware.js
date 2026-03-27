import envConfig from "../config/env.config.js"

const globalErrorHandler = (error, req,res,next)=>{
    console.log(error)

    res.status(error?.cause?.status|| 500 ).json({
        message:error.message||'Internal server error' ,
        stack:envConfig.app.NODE_ENV =='dev'? error.stack:undefined
    })
}

export default globalErrorHandler