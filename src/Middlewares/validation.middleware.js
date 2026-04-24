
import { BadRequstException } from './../Common/Utils/Errors/exception.js';
const reqKeys = ['body', 'query', 'params', 'headers']
export const validation = (schema) => {
    return (req, res, next) => {
        const validationErrors = []
        for (const key in schema) {
            // console.log({key, reqSchema:schema[key]});
            const { error } = schema[key].validate(req[key], { abortEarly: false })
            if (error) {
                console.log(error.details)
                validationErrors.push(
                    error.details.map(({ message }) => message)
                )
                console.log({ validationErrors: validationErrors.flat() });

            }

        }
        if (validationErrors.length) {
            throw new BadRequstException('validation error', { validationErrors: validationErrors.flat() })
        }
        next()
    }
}


export default validation