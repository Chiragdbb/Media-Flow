import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import VideoListCard from "../components/VideoListCard";
import { useLocation } from "react-router";

// todo: show videos of current channel first and then rest of videos
const VideoList = () => {
    const url = useLocation().pathname;

    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    const userId = useSelector((state) => state.user.userData._id);

    let page = 1;
    let limit = 10;

    const params = {
        userId,
        page,
        limit,
    };

    const getVideos = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/videos`,
                {
                    params,
                    withCredentials: true,
                }
            );

            const allVideos = res.data.data.docs;

            if (res.status === 200 && allVideos) {
                setVideos(allVideos);
                setLoading(false);
            }
        } catch (e) {
            setLoading(false);
            console.log(e);
            e.response.data.message
                ? toast.error(e.response.data.message)
                : toast.error("Error while logging in user!!");
            console.log(`${e.response.status}: ${e.response.data.message}`);
        }
    };

    useEffect(() => {
        getVideos();
    }, [page, limit, url]);

    return (
        <div className="px-2 py-2 h-full">
            {loading ? (
                "Loading..."
            ) : (
                <div className="grid grid-cols-1 gap-y-1">
                    {videos
                        .filter((video) => url.split("/").at(-1) !== video._id)
                        .map((video) => {
                            return (
                                <div key={video._id}>
                                    <VideoListCard video={video} />
                                </div>
                            );
                        })}
                </div>
            )}
        </div>
    );
};

export default VideoList;
