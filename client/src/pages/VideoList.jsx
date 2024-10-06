import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import VideoListCard from "../components/VideoListCard";
import { useLocation } from "react-router";
import Loader from "../components/Loader/Loader";
import useAxios from "../services/axios";
import toast from "react-hot-toast";

// todo: show videos of current channel first and then rest of videos
const VideoList = () => {
    const url = useLocation().pathname;
    const api = useAxios();

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
            const res = await api.get("/videos/all", {
                params,
            });

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

    const addToWatchHistory = async (videoId) => {
        try {
            await api.patch(`/users/history/add/${videoId}`, null);
        } catch (e) {
            console.log(e);
            e.response.data.message
                ? toast.error(e.response.data.message)
                : toast.error("Error while adding video to watch histroy!!");
            console.log(`${e.response.status}: ${e.response.data.message}`);
        }
    };

    return (
        <div className="px-2 py-2 h-full">
            {loading ? (
                <div className="h-1/2">
                    <Loader />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-y-1">
                    {videos
                        .filter((video) => url.split("/").at(-1) !== video._id)
                        .map((video) => {
                            return (
                                <div
                                    key={video._id}
                                    onClick={() => addToWatchHistory(video._id)}
                                >
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
