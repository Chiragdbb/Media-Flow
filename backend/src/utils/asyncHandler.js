const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        // when an argument is passed in next(), it triggers the error handling middleware
        Promise.resolve(requestHandler(req, res, next)).catch((e) => next(e)); 
    };
};

export default asyncHandler;