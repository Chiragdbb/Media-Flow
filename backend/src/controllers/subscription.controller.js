import mongoose from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const toggleSubscriptionToChannel = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!channelId) {
        throw new ApiError(400, "Channel Id required");
    }

    //check if channel exits or not
    const channelExists = await User.exists({ _id: channelId });

    if (!channelExists) {
        throw new ApiError(500, "Channel does not exist");
    }

    const subscriptionStatus = await Subscription.findOne({
        channel: new mongoose.Types.ObjectId(channelId),
        subscriber: req.user?._id,
    });

    console.log("Sub status: ", subscriptionStatus, "\nChannel id:", channelId);

    if (!subscriptionStatus) {
        const subscribe = await Subscription.create({
            subscriber: req.user?._id,
            channel: channelId,
        });

        if (!subscribe) {
            throw new ApiError(500, "Error while Subscribing to channel");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, subscribe, "Subscribed successfully"));
    } else {
        const unsubscribe = await Subscription.deleteOne({
            _id: subscriptionStatus._id,
        });

        if (!unsubscribe) {
            throw new ApiError(500, "Error while unsubscribing from channel");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, "Unsubscribed successfully"));
    }
});

export { toggleSubscriptionToChannel };
