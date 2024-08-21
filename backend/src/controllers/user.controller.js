import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // save refresh token in db
        user.refreshToken = refreshToken;

        // save kicks in all the requirements for this model, so to not initiate them use this option
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Error while generating access and refresh token"
        );
    }
};

const registerUser = asyncHandler(async (req, res) => {
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
        throw new ApiError(409, "User with email or username already exists");
    }

    // ? log req.files
    const avatarLocalPath = req.files?.avatar[0]?.path;

    let coverImageLocalPath;

    if (
        req.files &&
        Array.isArray(req.files.coverImage) &&
        req.files.coverImage.length > 0
    ) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

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

    // user is created check && password and refreshToken fields clear
    // all fields are selected by default. So, use "-" for the fields that are not to be selected
    const createdUser = await User.findById(user.id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(
            500,
            "Something went wrong while registering new user"
        );
    }

    res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    );

    return createdUser;
});

const loginUser = asyncHandler(async (req, res) => {
    const { username, password, email } = req.body;

    // need only one of them
    if (!(username || email)) {
        throw new ApiError(400, "Username or email is required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (!user) throw new ApiError(404, "User does not Exist !!!");

    if (!password) throw new ApiError(400, "Password is required !!!");

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) throw new ApiError(401, "Password is incorrect !!!");

    // generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id
    );

    // update current user as it's fields are now invalidated
    // don't send password and refresh token
    const loggedInUser = await User.findOne(user._id).select(
        "-password -refreshToken"
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "User logged in succesfully"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: null,
            },
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {
                    username: updatedUser.username,
                    email: updatedUser.email,
                },
                "User logged out successfully"
            )
        );
});

export { registerUser, loginUser, logoutUser };
