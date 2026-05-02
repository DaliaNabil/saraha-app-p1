import { HttpAppError } from "./app.error.js";

export class ConflictException extends HttpAppError{
     constructor(message = 'Conflict', details = null) {
        super(message , 409 , 'CONFLICT' ,details);
        
    }
}

export class NotFoundException extends HttpAppError{
     constructor(message = 'Not found',  details = null) {
        super(message , 404 , 'NOT_FOUND' ,details);
        
    }
}

export class BadRequstException extends HttpAppError{
     constructor(message = 'Bad Request', details = null) {
        super(message , 400 , 'BAD_REQUST' ,details);
        
    }
}

//internal server error

export class InternalServerErrorException extends HttpAppError{
     constructor(message = 'Internal server error', details = null) {
        super(message , 500 , 'INTERNAL_SERVER_ERROR' ,details);
        
    }
}

export class TooManyRequestsException extends HttpAppError{
     constructor(message = 'Too many requests', details = null) {
        super(message , 429 , 'TOO_MANY_REQUESTS' ,details);        
    }
}