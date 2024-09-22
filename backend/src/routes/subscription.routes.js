import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {
    toggleSubscriptionToChannel,
    totalChannelSubscribers,
} from "../controllers/subscription.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/:channelId").post(toggleSubscriptionToChannel);
router.route("/total/:channelId").get(totalChannelSubscribers);

export default router;
