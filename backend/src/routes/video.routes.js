import { Router } from "express";
import {
    addView,
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishVideo,
    togglePublishStatus,
    updateVideo,
} from "../controllers/video.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getAllVideos);
router.route("/publish").post(upload.single("video"), publishVideo);
router.route("/toggle/publish/:videoId").patch(togglePublishStatus);
router
    .route("/:videoId")
    .get(getVideoById)
    .delete(deleteVideo)
    .patch(upload.single("video"), updateVideo);

router.route("/view/:videoId").patch(addView);

export default router;
