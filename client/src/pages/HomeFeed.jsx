import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import VideoCard from "../components/VideoCard";
import toast from "react-hot-toast";
import Loader from "../components/Loader/Loader.jsx";

// todo pagination handling and scoller
//todo: update history in redux
const HomeFeed = () => {
    document.title = "Nexus Point";

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
            const res = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/videos/all`,
                {
                    params,
                    withCredentials: true,
                }
            );

            const allVideos = res.data.data.docs;

            if (res.status === 200 && allVideos) {
                setVideos(allVideos);
            }
        } catch (e) {
            console.log(e);
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
            await axios.patch(
                `${import.meta.env.VITE_SERVER_URL}/users/history/add/${videoId}`,
                null,
                {
                    withCredentials: true,
                }
            );
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
                            <div onClick={() => addToWatchHistory(video._id)}>
                                <VideoCard key={video._id} video={video} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomeFeed;
