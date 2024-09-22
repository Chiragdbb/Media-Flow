import axios from "axios";
import { Link } from "react-router-dom";

const VideoListCard = ({ video }) => {
    // todo: check
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

    // todo: check
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
            <div className="w-full h-[7.5rem] flex p-2 gap-x-4 rounded-xl overflow-hidden hover:bg-black/60 transition-colors duration-150">
                {/* video */}
                <div className="relative h-full w-[45%]">
                    <img
                        className="w-full h-full object-cover object-center rounded-xl"
                        src={video.thumbnail}
                        alt="thumbnail"
                    />
                    <span className="absolute right-1 bottom-1 bg-black/50 rounded-lg p-1 text-xs font-semibold">
                        {videoDuration}
                    </span>
                </div>
                {/* video description */}
                <div>
                    <h3 className="text-white/80">{video.title}</h3>
                    <span className="text-gray-500 text-sm">
                        {video.owner.username}
                    </span>
                    <div className="flex gap-x-2 text-sm text-gray-500 mt-1">
                        <span>
                            {video.views}
                            <span className="ml-1">views</span>
                        </span>
                        <span>·</span>
                        <span>{timePassed}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default VideoListCard;
