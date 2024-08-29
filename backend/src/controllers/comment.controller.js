import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!videoId) {
        throw new ApiError(400, "Video id is required");
    }

    const options = {
        page,
        limit,
    };

    const aggregatePipeline = [
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId),
            },
        },
    ];

    const videoComments = await Comment.aggregatePaginate(
        aggregatePipeline,
        options
    );

    if (!videoComments) {
        throw new ApiError(500, "Error while fetching video comments");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                videoComments,
                "Video comments fetched successfully"
            )
        );
});

const addComment = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { videoId } = req.params;

    if (!content || !videoId) {
        throw new ApiError(400, "Content and Video id is required");
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user?._id,
    });

    if (!comment) {
        throw new ApiError(500, "Error while creating comment");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, comment, "Comment created successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { commentId } = req.params;

    if (!content || !commentId) {
        throw new ApiError(400, "Content and comment id is required");
    }

    const comment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content,
            },
        },
        { new: true }
    );

    if (!comment) {
        throw new ApiError(500, "Error while updating comment");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!commentId) {
        throw new ApiError(400, "Comment id is required");
    }

    const comment = await Comment.findByIdAndDelete(commentId);

    if (!comment) {
        throw new ApiError(500, "Error while deleting comment");
    }

    // deleting likes related to this comment
    const deletedLikes = await Like.deleteMany({ comment: commentId });

    if (!deletedLikes) {
        throw new ApiError(
            500,
            "Error while deleting likes related to comment"
        );
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, deletedLikes, "Comment deleted successfully")
        );
});

export { getVideoComments, addComment, updateComment, deleteComment };
