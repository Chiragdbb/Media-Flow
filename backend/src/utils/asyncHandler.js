const asyncHandler = (requestHandler) => async (req, res, next) => {
    try {
        await requestHandler(req, res, next);
    } catch (e) {
        res.status(e.code || 500).json({
            success: false,
            message: e.message,
        });
    }
};

export default asyncHandler;

// same fn in another syntax
const asyncHandler2 = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((e) => next(e));
    };
};
