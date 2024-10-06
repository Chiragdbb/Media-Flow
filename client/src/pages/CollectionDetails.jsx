import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import Loader from "../components/Loader/Loader";
import useAxios from "../services/axios";
import check from "../assets/check.svg";
import play from "../assets/play.svg";
import VideoListCard from "../components/VideoListCard";
import { Link } from "react-router-dom";

// maybe delete playlist button
const CollectionDetails = () => {
    const path = useLocation().pathname;
    const playlistId = path.split("/").at(-1);

    const api = useAxios();
    const [playlistData, setPlaylistData] = useState({});
    const [playlistThumbnail, setPlaylistThumbnail] = useState("");
    const [loading, setLoading] = useState(true);

    // add for empty playlist
    const getPlaylistData = async () => {
        try {
            const res = await api(`/playlist/${playlistId}`);

            const data = res.data.data;

            if (res.status === 200 && data) {
                setPlaylistData(data);

                if (data.videos.length > 0) {
                    setPlaylistThumbnail(data.videos[0].thumbnail);
                }
            }
        } catch (e) {
            console.log(
                `Error while fetching playlist with id ${playlistId}: ${e}`
            );
        } finally {
            setLoading(false);
        }
    };

    // look into this
    const timeSince = (time) => {
        const now = new Date();
        const past = new Date(time);
        const secondsAgo = Math.floor((now - past) / 1000);

        let interval = Math.floor(secondsAgo / 31536000); // Seconds in a year
        if (interval >= 1)
            return interval === 1
                ? `${interval} year ago`
                : `${interval} years ago`;

        interval = Math.floor(secondsAgo / 2592000); // Seconds in a month
        if (interval >= 1)
            return interval === 1
                ? `${interval} month ago`
                : `${interval} months ago`;

        interval = Math.floor(secondsAgo / 86400); // Seconds in a day
        if (interval >= 1)
            return interval === 1
                ? `${interval} day ago`
                : `${interval} days ago`;

        interval = Math.floor(secondsAgo / 3600); // Seconds in an hour
        if (interval >= 1)
            return interval === 1
                ? `${interval} hour ago`
                : `${interval} hours ago`;

        interval = Math.floor(secondsAgo / 60); // Seconds in a minute
        if (interval >= 1)
            return interval === 1
                ? `${interval} minute ago`
                : `${interval} minutes ago`;

        return secondsAgo <= 1 ? "just now" : `${secondsAgo} seconds ago`;
    };

    const getTotalViews = (videos) => {
        return videos.reduce((acc, video) => acc + video.views, 0);
    };

    useEffect(() => {
        getPlaylistData();
    }, []);

    return (
        <div className="h-full">
            {loading ? (
                <div>
                    <Loader />
                </div>
            ) : (
                <div className="flex h-full p-4 gap-x-6">
                    <div className="flex-[0.25] bg-gradient-to-b from-black/50 to-black/20 rounded-2xl px-6 py-4 flex flex-col gap-y-2">
                        <div>
                            <img
                                className="w-full h-[11rem] object-cover rounded-2xl"
                                src={playlistThumbnail}
                                alt="playlist-thumbnail"
                            />
                            <h2 className="mt-5 text-[1.75rem] font-bold">
                                {playlistData.name}
                            </h2>
                            <h3 className="mt-1.5">
                                {playlistData.description}
                            </h3>
                            <span className="flex items-center gap-x-1.5 font-bold mt-4">
                                {playlistData.owner.username}
                                <span className="bg-white/80 p-[2px] w-3 h-3 rounded-full flex justify-center items-center mt-0.5">
                                    <img
                                        className="w-full"
                                        src={check}
                                        alt="check"
                                    />
                                </span>
                            </span>
                            <div className="mt-2 text-[14px] flex gap-x-4 font-">
                                <span className="">{`${playlistData.videos.length} videos`}</span>
                                <span>
                                    {getTotalViews(playlistData.videos)} views
                                </span>
                                <span>{timeSince(playlistData.updatedAt)}</span>
                            </div>
                        </div>
                        <Link to={`/watch/${playlistData.videos[0]._id}`}>
                            <div className="w-full flex justify-center items-center gap-x-2 mt-4 py-2.5 px-4 bg-white/95 rounded-full cursor-pointer hover:bg-purple-400 transition-colors duration-150">
                                <img
                                    className="w-6"
                                    src={play}
                                    alt="play"
                                />
                                <span className="text-black font-bold">
                                    Play
                                </span>
                            </div>
                        </Link>
                    </div>
                    {/* video data,  videos with numbering */}
                    <div className="flex-[0.75] flex flex-col gap-y-3  rounded-xl">
                        {playlistData.videos.map((video, index) => (
                            <div key={video._id} className="flex items-center gap-x-3 bg-gradient-to-r from-black/50 to-black/10 rounded-xl px-4 py-1.5 h-fit">
                                <span>{index + 1}</span>
                                <VideoListCard video={video} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CollectionDetails;
