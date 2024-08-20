import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
    try {
        // throw new Error("testing error");

        const { username, email, password, fullname } = req.body;

        // fields empty check
        if (
            [username, email, password, fullname].some(
                (field) => field?.trim() === ""
            )
        ) {
            throw new ApiError(400, "All fields are required");
        }

        // user already exists check
        const existedUser = await User.findOne({
            $or: [{ username }, { email }],
        });

        if (existedUser) {
            throw new ApiError(
                409,
                "User iwth email or username already exists"
            );
        }

        // ? log req.files
        const avatarLocalPath = req.files?.avatar[0]?.path;
        const coverImageLocalPath = req.files?.coverImage[0]?.path;

        if (!avatarLocalPath) {
            throw new ApiError(400, "Avatar image is required");
        }

        // upload on cloudinary

        const avatar = await uploadOnCloudinary(avatarLocalPath);
        const coverImage = await uploadOnCloudinary(coverImageLocalPath);

        if (!avatar) {
            throw new ApiError(400, "Avatar image is required");
        }

        const user = await User.create({
            username: username.toLowerCase(),
            fullname,
            email,
            password,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
        });

        // user is created check
        // password and refreshToken fields clear
        // all fields are slected by default
        // So, use "-" for the fields that are not to be selected
        const createdUser = await User.findById(user.id).select(
            "-password -refreshToken"
        );

        if (!createdUser) {
            throw new ApiError(
                500,
                "Something went wrong while registering new user"
            );
        }

        res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully"));

        return createdUser;
    } catch (error) {
        const sendError = new ApiError(401);
        res.status(sendError.statusCode).json(sendError);
    }
});

export { registerUser };
