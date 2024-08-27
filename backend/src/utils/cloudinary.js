import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import ApiError from "./ApiError.js";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        // removes the locally (server) saved temporary file as the upload operation got failed (corrupted/incomplete file)
        fs.unlinkSync(localFilePath);

        return response;
    } catch (e) {
        fs.unlinkSync(localFilePath);
        return null;
    }
};

const deleteImageFromCloudinary = async (assetPath) => {
    try {
        if (!assetPath) {
            throw new ApiError(400, "Image path required");
        }

        const publidId = assetPath.split("/").slice(-1)[0].split(".")[0];

        const res = await cloudinary.uploader.destroy(publidId, {
            resource_type: "image",
        });

        return res;
    } catch (e) {
        throw new ApiError(500, "Error while deleting image from cloudinary");
    }
};

const deleteVideoFromCloudinary = async (assetPath) => {
    try {
        if (!assetPath) {
            throw new ApiError(400, "Video path required");
        }

        const publidId = assetPath.split("/").slice(-1)[0].split(".")[0];

        const res = await cloudinary.uploader.destroy(publidId, {
            resource_type: "video",
        });

        return res;
    } catch (e) {
        throw new ApiError(500, "Error while deleting video from cloudinary");
    }
};

export {
    uploadOnCloudinary,
    deleteImageFromCloudinary,
    deleteVideoFromCloudinary,
};
