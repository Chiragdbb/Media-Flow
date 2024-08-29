import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    const userId = req.user._id;

    if (!userId) {
        throw new ApiError(400, "User id required for creating playlist");
    }

    if (!name || !description) {
        throw new ApiError(400, "Name and description required for playlist");
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: userId,
    });

    if (!playlist) {
        throw new ApiError(400, "Error while creating playlist");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Playlist created successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        throw new ApiError(400, "user id required");
    }

    const playlists = await Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
            },
        },
    ]);

    if (!playlists) {
        throw new ApiError(500, "Invalid user id");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlists,
                "User playlists fetched successfully"
            )
        );
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!playlistId) {
        throw new ApiError(400, "Playlist id required");
    }

    const playlist = await Playlist.findById({ _id: playlistId });

    if (!playlist) {
        throw new ApiError(
            400,
            "Invalid Playlist Id or playlist doesn't exist"
        );
    }

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!playlistId || !videoId) {
        throw new ApiError(400, "Playlist and Video id required");
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            //doesn't allow duplicates
            $addToSet: {
                videos: videoId,
            },
        },
        { new: true }
    );

    if (!playlist) {
        throw new ApiError(500, "Error while adding video to playlist");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlist,
                "Video added to Playlist successfully"
            )
        );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!playlistId || !videoId) {
        throw new ApiError(400, "Playlist and Video id required");
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            // remove all instances of this video from playlist
            $pull: {
                videos: videoId,
            },
        },
        { new: true }
    );

    if (!playlist) {
        throw new ApiError(500, "Error while removing video from playlist");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlist,
                "Video removed from Playlist successfully"
            )
        );
});

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;

    if (!playlistId) {
        throw new ApiError(400, "Playlist id required");
    }

    if (!name || !description) {
        throw new ApiError(400, "Name and description required");
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                name,
                description,
            },
        },
        { new: true }
    );

    if (!playlist) {
        throw new ApiError(
            400,
            "Invalid Playlist Id or playlist doesn't exist"
        );
    }

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Playlist updated successfully"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!playlistId) {
        throw new ApiError(400, "Playlist id required");
    }

    const playlist = await Playlist.findByIdAndDelete(playlistId);

    if (!playlist) {
        throw new ApiError(
            400,
            "Invalid Playlist Id or playlist doesn't exist"
        );
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Playlist deleted successfully"));
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    removeVideoFromPlaylist,
    addVideoToPlaylist,
    updatePlaylist,
    deletePlaylist,
};
