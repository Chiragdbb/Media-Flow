import { useEffect, useState } from "react";
import liked from "../assets/liked.svg";
import like from "../assets/like.svg";
import save from "../assets/save.svg";
import saved from "../assets/saved.svg";
import axios from "axios";

const VideoDetails = ({ videoId }) => {
    // get all userChannel and other details

    const [video, setVideo] = useState({});
    const [channelSubs, setChannelSubs] = useState([]);
    const [descExpanded, setDescExpanded] = useState(false);
    const [videoLiked, setVideoLiked] = useState(false);
    const [videoSaved, setVideoSaved] = useState(false);
    const [loading, setLoading] = useState(true);

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
            console.log(videoData)

            if (res.status === 200 && videoData) {
                setVideo(videoData);
                getChannelSubs(videoData.owner._id);
            }
        } catch (e) {
            console.log("Error fetching video details:", e);
            // e.response.data.message ? toast.error(e.response.data.message) : toast.error("Error fetching video details");
            console.log(`${e.response.status}: ${e.response.data.message}`);
        } finally {
            setLoading(false);
        }
    };

    // check if user is subbed
    // likes on that video
    // liked or not by user
    // saved in any playlist or not

    const getChannelSubs = async (channelId) => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/subscribe/total/${channelId}`,
                { withCredentials: true }
            );

            const data = res.data.data;

            if (res.status === 200 && data) {
                setChannelSubs(data);
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
                                    {/* //todo */}
                                    {channelSubs.length} subscribers
                                </span>
                            </div>
                            <div className="ml-6">
                                <button className="bg-white rounded-full text-black/90 px-4 py-2 text-sm">
                                    {/* //todo */}
                                    Subscribe
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-x-2 mt-1">
                            {/* //todo check liked and count*/}
                            <div className="w-fit flex justify-between items-center bg-white/10 rounded-full py-2 gap-x-2 px-4 hover:bg-white/20 cursor-pointer">
                                <img
                                    className="w-5 mt-0.5 aspect-square"
                                    src={videoLiked ? liked : like}
                                    alt="liked"
                                />
                                <span>15</span>
                            </div>
                            <div className="flex gap-x-4">
                                <div className="w-fit flex justify-between items-center bg-white/10  py-2 gap-x-2 px-4 rounded-full hover:bg-white/20 cursor-pointer">
                                    <img
                                        className="w-5 mt-0.5 aspect-square"
                                        src={videoSaved ? saved : save}
                                        alt="liked"
                                    />
                                    <span>Save</span>
                                </div>
                                {/*// todo: modal, dropdown -> checklist */}
                                <div hidden>user playlist list</div>
                            </div>
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
