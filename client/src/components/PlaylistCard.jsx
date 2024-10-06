import { useEffect, useState } from "react";
import useAxios from "../services/axios";
import Loader from "./Loader/Loader";
import { Link } from "react-router-dom";
import playlist from "../assets/playlist.svg";

const PlaylistCard = ({ playlistId, totalVideos }) => {
    const api = useAxios();

    const [loading, setLoading] = useState(true);
    const [playlistData, setPlaylistData] = useState({});
    const [playlistThumbnail, setPlaylistThumbnail] = useState("");

    const getPlaylistData = async () => {
        try {
            const res = await api(`/playlist/${playlistId}`);

            const data = res.data.data;

            if (res.status === 200 && data) {
                setPlaylistData(data);
                getPlaylistThumbnail(totalVideos !== 0 ? data.videos[0] : null);
            }
        } catch (e) {
            console.log(
                `Error while fetching playlist with id ${playlistId}: ${e}`
            );
        }
    };

    const getPlaylistThumbnail = async (videoId = 0) => {
        try {
            setLoading(true);

            if (!videoId) {
                setPlaylistThumbnail("");
                return;
            }

            const res = await api(`/videos/${videoId}`);

            const data = res.data.data;

            if (res.status === 200 && data) {
                setPlaylistThumbnail(data.thumbnail);
            }
        } catch (e) {
            console.log("Error while fetching playlist thumbnail: ", e);
        } finally {
            setLoading(false);
        }
    };

    // look into this
    function timeSince(time) {
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
    }

    useEffect(() => {
        getPlaylistData();
    }, []);

    return (
        <div>
            <Link to={`/user/collections/${playlistId}`} className="h-fit">
                {/* thumbnail  */}
                <div className="h-[12rem] w-full relative rounded-xl overflow-hidden bg-black/20">
                    {loading ? (
                        <div className="translate-y-10 scale-[0.7]">
                            <Loader />
                        </div>
                    ) : playlistThumbnail !== "" ? (
                        <div className="flex justify-center items-center bg-white/20">
                            <img
                                className="w-full h-[12rem] object-cover object-center"
                                src={playlistThumbnail}
                                alt="thumbnail"
                            />
                            <span className="absolute bottom-1 right-1 w-fit h-fit px-2 py-1 rounded-xl font-bold bg-black/40 text-xs flex justify-center items-center gap-x-1">
                                <span>
                                    <img className="w-4" src={playlist} alt="play" />
                                </span>
                                {totalVideos} videos
                            </span>
                        </div>
                    ) : (
                        <div>
                            <div className="h-[12rem] flex justify-center items-center bg-white/10">
                                <span className="text-xl font-bold">
                                    No Videos
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* playlist details */}
                <h4 className="mt-3 text-xl font-bold">{playlistData.name}</h4>
                <p className="text-sm mt-1.5 text-white/60">{`Updated ${timeSince(playlistData.updatedAt)}`}</p>
            </Link>
        </div>
    );
};

export default PlaylistCard;
