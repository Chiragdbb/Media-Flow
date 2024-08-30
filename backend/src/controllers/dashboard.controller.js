import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";

const getChannelStats = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(400, "User id required");
    }

    if (!mongoose.isValidObjectId(userId)) {
        throw new ApiError(400, "User id invalid");
    }

    const totalSubscribers = await Subscription.countDocuments({
        channel: userId,
    });

    if (!totalSubscribers) {
        if (totalSubscribers === 0) {
            null;
        } else {
            throw new ApiError(500, "Error while getting total subscribers");
        }
    }

    const totalLikes = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $group: {
                _id: "$likedBy",
                allLikes: { $sum: 1 },
                totalVideoLikes: {
                    $sum: {
                        // $ifNull returns false if video field is missing 
                        // false = fallback value
                        $cond: [{ $ifNull: ["$video", false] }, 1, 0],
                    },
                },
                totalCommentLikes: {
                    $sum: {
                        $cond: [{ $ifNull: ["$comment", false] }, 1, 0],
                    },
                },
                totalTweetLikes: {
                    $sum: {
                        $cond: [{ $ifNull: ["$tweet", false] }, 1, 0],
                    },
                },
            },
        },
        {
            $project: {
                _id: 0,
                allLikes: 1,
                totalVideoLikes: 1,
                totalCommentLikes: 1,
                totalTweetLikes: 1,
            },
        },
    ]);

    if (!totalLikes) {
        if (totalLikes === 0) {
            null;
        } else {
            throw new ApiError(500, "Error while getting total Likes");
        }
    }
    const videosData = await Video.aggregate([
        {
            // getting all channel videos
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $group: {
                _id: "$owner",
                // sum counts numeric value
                totalViews: { $sum: "$views" },
                // counts the number of documents in the group, adds 1 for each
                totalVideos: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                totalVideos: 1,
                totalViews: 1,
            },
        },
    ]);

    if (!videosData) {
        throw new ApiError(
            500,
            "Error while getting total videos and total videos views"
        );
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { totalSubscribers, totalLikes, videosData },
                "Channel Details fetched successfully"
            )
        );
});

const getChannelVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(400, "User id required");
    }

    if (!mongoose.isValidObjectId(userId)) {
        throw new ApiError(400, "User id invalid");
    }

    const allChannelVideos = await Video.find({ owner: userId });

    if (!allChannelVideos) {
        throw new ApiError(500, "Error while fetching channel Videos");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                allChannelVideos,
                "Channel Videos fetched successfully"
            )
        );
});

export { getChannelStats, getChannelVideos };
