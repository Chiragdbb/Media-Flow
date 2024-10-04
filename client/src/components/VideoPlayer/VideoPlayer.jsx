import { useEffect, useRef, useState } from "react";
import cloudinary from "cloudinary-video-player";
import "cloudinary-video-player/cld-video-player.min.css";
import "./videoPlayer.css";
import Loader from "../Loader/Loader";

// todo: video quality option
const VideoPlayer = ({ videoId }) => {
    const playerRef = useRef();
    const cloudinaryRef = useRef();

    const [loading, setLoading] = useState(true);
    const [video, setVideo] = useState(null);

    const getVideoDetails = async (videoId) => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_SERVER_URL}/videos/${videoId}`,
                { credentials: "include" }
            );

            const videoData = await res.json();

            if (res.status === 200) {
                setVideo(videoData.data);
            }
        } catch (error) {
            console.log("Error fetching video details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getVideoDetails(videoId);
    }, [videoId]);

    useEffect(() => {
        if (video && playerRef.current) {
            // Initialize the Cloudinary player only once
            if (!cloudinaryRef.current) {
                cloudinaryRef.current = cloudinary.videoPlayer(
                    playerRef.current,
                    {
                        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
                        showJumpControls: true,
                        showLogo: false,
                        colors: { accent: "#C084FC" },
                        fontFace: "Lato",
                        controls: true,
                        playbackRates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
                        cloudinaryAnalytics: false,
                    }
                );
            }

            // Set the video source
            cloudinaryRef.current.source(video.videoFile);

            // cloudinaryRef.current.source(video.videoFile, {
            //     sourceTypes: ["dash"],
            // sourceTransformation: {
            //     hls: [{ streaming_profile: "hd_hls" }],
            //     dash: [{ streaming_profile: "hd_dash" }],
            //     effect: "vignette:50",
            // },
            // });
        }
    }, [video]);

    return (
        <div className="h-fit">
            <div id="player-container">
                {loading ? (
                    <div className="h-[30rem]">
                        <Loader />
                    </div>
                ) : (
                    <video ref={playerRef} id="player" />
                )}
            </div>
        </div>
    );
};

export default VideoPlayer;
