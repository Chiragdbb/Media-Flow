import { useEffect, useState } from "react";
import axios from "axios";
import Subscribe from "./Subscribe";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Like from "./Like";
import Save from "./Save";

const VideoDetails = ({ videoId }) => {
    const userId = useSelector((state) => state.user.userData._id);

    const [video, setVideo] = useState({});
    const [channelSubs, setChannelSubs] = useState([]);
    const [descExpanded, setDescExpanded] = useState(false);
    const [loading, setLoading] = useState(true);
    const [initialSubStatus, setInitialSubStatus] = useState(false);

    function timeSince(date) {
        const now = new Date();
        const pastDate = new Date(date);
        const seconds = Math.floor((now - pastDate) / 1000);

        const ranges = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
            second: 1,
        };

        for (let [key, value] of Object.entries(ranges)) {
            const range = Math.floor(seconds / value);
            if (range >= 1) {
                return `${range} ${key}${range !== 1 ? "s" : ""} ago`;
            }
        }

        return "Just now";
    }

    const getVideoDetails = async (videoId) => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/videos/${videoId}`,
                {
                    withCredentials: true,
                }
            );
            const videoData = res.data.data;

            if (res.status === 200 && videoData) {
                setVideo(videoData);
                document.title = videoData.title + " - Nexus Point";
                getChannelSubs(videoData.owner._id);
            }
        } catch (e) {
            console.log("Error fetching video details:", e);
            e.response.data.message
                ? toast.error(e.response.data.message)
                : toast.error("Error fetching video details");
            console.log(`${e.response.status}: ${e.response.data.message}`);
        } finally {
            setLoading(false);
        }
    };

    const getChannelSubs = async (channelId) => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/subscribe/total/${channelId}`,
                { withCredentials: true }
            );

            const data = res.data.data;

            if (res.status === 200 && data) {
                setChannelSubs(data);

                const status = data.some((item) => {
                    return item.subscriber === userId;
                });
                setInitialSubStatus(status);
            }
        } catch (e) {
            console.log("Error while getting total channel subscribers:", e);
            console.log(`${e.response.status}: ${e.response.data.message}`);
        }
    };

    useEffect(() => {
        getVideoDetails(videoId);
    }, [videoId]);

    const timePassed = timeSince(video.createdAt);

    return (
        <>
            {loading ? (
                "Loading..."
            ) : (
                <div className="w-full rounded-xl font-semibold">
                    <h2 className="text-xl">{video.title}</h2>

                    {/* channel details */}
                    <div className="flex justify-between items-center">
                        <div className="mt-4 flex items-center">
                            <div className="h-10 w-10 rounded-full overflow-hidden">
                                <img
                                    className="h-full w-full object-cover object-center"
                                    src={video.owner.avatar}
                                    alt="channel-avatar"
                                />
                            </div>
                            <div className="flex flex-col ml-4">
                                <span className="font-semibold">
                                    {video.owner.username}
                                </span>
                                <span className="text-xs font-normal text-white/50">
                                    {channelSubs.length} subscribers
                                </span>
                            </div>
                            <div className="ml-6">
                                <Subscribe
                                    channelId={video.owner._id}
                                    subStatus={initialSubStatus}
                                />
                            </div>
                        </div>
                        <div className="flex gap-x-2 mt-1">
                            <Like id={videoId} type={"v"} />
                            <Save videoId={videoId} />
                        </div>
                    </div>

                    {/* details */}
                    <div className="bg-white/10 rounded-xl mt-4 p-3">
                        <div className="flex gap-x-2 text-sm font-semibold">
                            <span>
                                {video.views}
                                <span className="ml-1.5">views</span>
                            </span>
                            <span className="ml-1">{timePassed}</span>
                        </div>

                        {/* description */}
                        <div className="text-base font-normal mt-1.5">
                            {!descExpanded && video.description.length > 50 && (
                                <span
                                    className={`${descExpanded ? "" : "line-clamp-1"}`}
                                >
                                    {video.description}
                                </span>
                            )}

                            {(descExpanded ||
                                video.description.length < 50) && (
                                <span>{video.description}</span>
                            )}
                        </div>

                        {video.description.length > 50 && (
                            <button
                                className={`text-sm ${descExpanded ? "mt-3" : "mt-1"}`}
                                onClick={() => setDescExpanded(!descExpanded)}
                            >
                                {!descExpanded ? "more" : "Show less"}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default VideoDetails;
