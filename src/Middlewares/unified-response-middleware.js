 export const responseFormatter = (handler) => {

    return async (req, res, next) => {

        try {
                const result = await handler(req, res, next);
           

            if(res.headersSent){
                return;
            }
            return res.status(result?.meta?.statusCode || 200).json({
                success: true,
                message: result?.message || "Request successful",
                data: result?.data || result || null,
                meta: result?.meta || {}
            }); 
            
        } catch (error) {
            next(error);
        }       
        };
    };