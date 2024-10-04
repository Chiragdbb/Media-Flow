import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import VideoCard from "../components/VideoCard";
import toast from "react-hot-toast";
import Loader from "../components/Loader/Loader.jsx";
// import api from "../axios/axios.js";
import useAxios from "../axios/axios.js";

// todo pagination handling and scoller
const HomeFeed = () => {
    document.title = "Nexus Point";

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

    // todo: pagination or infinite scroll
    const getVideos = async () => {
        try {
            const res = await api.get(`/videos/all`, {
                params,
            });

            const allVideos = res.data.data.docs;
            // console.log(allVideos);

            if (res.status === 200 && allVideos) {
                setVideos(allVideos);
            } else {
            }
        } catch (e) {
            console.log(e);
            toast.remove();
            e.response.data.message
                ? toast.error(e.response.data.message)
                : toast.error("Error while fetching all videos data!!");
            console.log(`${e.response.status}: ${e.response.data.message}`);
        } finally {
            setLoading(false);
        }
    };

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

    useEffect(() => {
        getVideos();
    }, [page, limit]);

    return (
        <div className="w-full pb-5 px-3 h-full">
            <div className="h-full">
                {loading ? (
                    <Loader />
                ) : (
                    <div className="w-full grid grid-cols-3 place-items-center gap-y-4">
                        {videos.map((video) => (
                            <div
                                key={video._id}
                                onClick={() => addToWatchHistory(video._id)}
                            >
                                <VideoCard video={video} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomeFeed;
