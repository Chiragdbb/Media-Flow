// const asyncHandler = (requestHandler) => async (req, res, next) => {
//     try {
//         await requestHandler(req, res, next);
//     } catch (e) {
//         res.status(e.code || 500).json({
//             success: false,
//             message: e.message,
//         });
//     }
// };

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((e) => next(e));
    };
};

export default asyncHandler;