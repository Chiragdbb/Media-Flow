import ApiError from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
    // err is an instance of ApiError
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
        });
    }
    // other errors that are not instances of ApiError
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
};

export default errorHandler;
