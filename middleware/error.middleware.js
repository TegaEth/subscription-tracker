import ErrorResponse from "../utils/errorResponse.js";

const errorMiddleware = (err, req, res, next) => {
    try {
        let error = {...err}
        error.message = err.message;

        console.error(err)

        // wrong mongodb id or Mongoose bad objectid
        if (err.name === 'CastError') {
            error = new ErrorResponse(`Resource not found with id of ${err.value}`, 404);
        }

        // mongoose duplicate key 
        if (err.code === 11000) {
            error = new ErrorResponse('Resource already exists', 400);
        }

        // validation error
        if (err.name === 'ValidationError') {
            error = new ErrorResponse(Object.values(err.errors).map(val => val.message), 400);
        }

        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || 'Server Error'
        });

    } catch (error) {
        next(error);
    }
}

export default errorMiddleware;