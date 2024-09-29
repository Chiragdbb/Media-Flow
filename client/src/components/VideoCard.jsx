import axios from "axios";
import { Link } from "react-router-dom";
import check from "../assets/check.svg";

const VideoCard = ({ video }) => {
    // : look in this
    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        // adds 0 to number if single digit
        const min = minutes.toString().padStart(2, "0");
        const sec = secs.toString().padStart(2, "0");

        if (hours > 0) {
            return `${hours}:${min}:${sec}`;
        } else {
            return `${min}:${sec}`;
        }
    }

    // : look in this
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

    const addView = async () => {
        try {
            await axios.patch(
                `${import.meta.env.VITE_SERVER_URL}/videos/view/${video._id}`,
                null,
                { withCredentials: true }
            );
        } catch (e) {
            console.log(e);
        }
    };

    const timePassed = timeSince(video.createdAt);
    const videoDuration = formatTime(video.duration);

    return (
        <Link
            to={`/watch/${video._id}`}
            onClick={addView}
            className="w-fit h-fit"
        >
            <div className="w-[26rem] h-[20rem] p-3 pb-1 rounded-xl overflow-hidden hover:bg-black/60 transition-colors duration-150">
                {/* video */}
                <div className="relative h-[70%] w-full">
                    <img
                        className="w-full h-full object-cover object-center rounded-xl"
                        src={video.thumbnail}
                        alt="thumbnail"
                    />
                    <span className="absolute right-1 bottom-1.5 bg-black/50 rounded-lg p-1 text-xs font-semibold">
                        {videoDuration}
                    </span>
                </div>
                {/* video description */}
                <div className="flex justify-start items-start h-[30%] gap-x-4 pt-3">
                    <div>
                        <div className="w-11 h-11 rounded-full overflow-hidden">
                            <img
                                className="h-full object-cover"
                                src={video.owner.avatar}
                                alt="channel-avatar"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col items-start justify-center">
                        <h3 className="text-lg text-white/80">{video.title}</h3>
                        <span className="text-gray-400 text- flex justify-center items-center gap-x-1.5">
                            {video.owner.username}
                            <span className="bg-white/80 p-[2px] w-3 h-3 rounded-full flex justify-center items-center">
                                <img
                                    className="w-full"
                                    src={check}
                                    alt=""
                                />
                            </span>
                        </span>
                        <div className="flex gap-x-2 text-sm text-gray-400">
                            <span className="">
                                {video.views}
                                <span className="ml-1">views</span>
                            </span>
                            <span>·</span>
                            {/* // todo: calculate created at time */}
                            <span>{timePassed}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default VideoCard;
