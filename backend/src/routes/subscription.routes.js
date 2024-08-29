import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { toggleSubscriptionToChannel } from "../controllers/subscription.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/:channelId").post(toggleSubscriptionToChannel);

export default router;
