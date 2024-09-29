import { Like } from "../models/like.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { Tweet } from "../models/tweet.model.js";

// check if ids exit or not before liking
const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user?._id;

    if (!videoId || !userId) {
        throw new ApiError(400, "Video and user id required");
    }

    //check video exits or not
    const videoExists = await Video.exists({ _id: videoId });

    if (!videoExists) {
        throw new ApiError(400, "Video Id is invalid");
    }

    const isLiked = await Like.findOne({ video: videoId, likedBy: userId });

    if (isLiked) {
        // delete document with videoId to remove like
        await Like.findByIdAndDelete(isLiked._id);

        return res
            .status(200)
            .json(new ApiResponse(200, "Removed Video Like Successfully"));
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

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const userId = req.user?._id;

    if (!commentId || !userId) {
        throw new ApiError(400, "Video and user id required");
    }

    //check comment exits or not
    const commentExists = await Comment.exists({ _id: commentId });

    if (!commentExists) {
        throw new ApiError(400, "Comment Id is invalid");
    }

    const isLiked = await Like.findOne({ comment: commentId, likedBy: userId });

    if (isLiked) {
        await Like.findByIdAndDelete(isLiked._id);

        return res
            .status(200)
            .json(new ApiResponse(200, "Removed Comment Like Successfully"));
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

    //check tweet exits or not
    const tweetExists = await Tweet.exists({ _id: tweetId });

    if (!tweetExists) {
        throw new ApiError(400, "Tweet Id is invalid");
    }

    const isLiked = await Like.findOne({ tweet: tweetId, likedBy: userId });

    if (isLiked) {
        await Like.findByIdAndDelete(isLiked._id);

        return res
            .status(200)
            .json(new ApiResponse(200, "Removed Tweet Like Successfully"));
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

// pagination
const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(400, "User id required");
    }

    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: userId,
                video: { $exists: true, $ne: null }, // only get docs with video field in it
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                        },
                    },
                ],
            },
        },
        {
            $unwind: "$video",
        },
        {
            $unwind: "$video.owner",
        },
        {
            $project: {
                _id: 1,
                likedBy: 1,

                video: {
                    $mergeObjects: [
                        "$video",
                        {
                            owner: {
                                _id: "$video.owner._id",
                                username: "$video.owner.username",
                                avatar: "$video.owner.avatar",
                            },
                        },
                    ],
                },
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

const getAllLikes = asyncHandler(async (req, res) => {
    const { type, id } = req.params;

    if (!(id && type)) {
        throw new ApiError(400, "type and Id is required");
    }

    let allLikes;

    if (type === "v") {
        allLikes = await Like.find({ video: id });
    } else if (type === "c") {
        allLikes = await Like.find({ comment: id });
    } else if (type === "t") {
        allLikes = await Like.find({ tweet: id });
    } else {
        throw new ApiError(400, "Invalid type parameter");
    }

    if (!allLikes) {
        throw new ApiError(
            500,
            `Error while getting all likes of type: ${type}, Id: ${id}`
        );
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                allLikes,
                "Fetched all likes of Id successfully"
            )
        );
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos,
    getAllLikes,
};
