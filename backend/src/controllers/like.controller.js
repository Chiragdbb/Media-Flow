import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// toggle = add or remove the objectId of that entity from this Like model

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user?._id;

    if (!videoId || !userId) {
        throw new ApiError(400, "Video and user id required");
    }

    const isLiked = await Like.findOne({ video: videoId });

    if (isLiked) {
        // delete document with videoId to remove like
        const like = await Like.findByIdAndDelete(isLiked._id);

        return res
            .status(200)
            .json(
                new ApiResponse(200, like, "Removed Video Like Successfully")
            );
    } else {
        // create document with videoId to add like
        const like = await Like.create({
            video: videoId,
            likedBy: userId,
        });
        return res
            .status(200)
            .json(new ApiResponse(200, like, "Video Liked Successfully"));
    }
});

// todo: check later
const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const userId = req.user?._id;

    if (!commentId || !userId) {
        throw new ApiError(400, "Video and user id required");
    }

    const isLiked = await Like.findOne({ comment: commentId });

    if (isLiked) {
        const like = await Like.findByIdAndDelete(isLiked._id);

        return res
            .status(200)
            .json(
                new ApiResponse(200, like, "Removed Comment Like Successfully")
            );
    } else {
        const like = await Like.create({
            comment: commentId,
            likedBy: userId,
        });
        return res
            .status(200)
            .json(new ApiResponse(200, like, "Comment Liked Successfully"));
    }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const userId = req.user?._id;

    if (!tweetId || !userId) {
        throw new ApiError(400, "Video and user id required");
    }

    const isLiked = await Like.findOne({ tweet: tweetId });

    if (isLiked) {
        const like = await Like.findByIdAndDelete(isLiked._id);

        return res
            .status(200)
            .json(
                new ApiResponse(200, like, "Removed Tweet Like Successfully")
            );
    } else {
        const like = await Like.create({
            tweet: tweetId,
            likedBy: userId,
        });
        return res
            .status(200)
            .json(new ApiResponse(200, like, "Tweet Liked Successfully"));
    }
});

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(400, "User id required");
    }

    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: userId,
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video",
            },
        },
    ]);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                likedVideos,
                "All liked videos fetched successfully"
            )
        );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
