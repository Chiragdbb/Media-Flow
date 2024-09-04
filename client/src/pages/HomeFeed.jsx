import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import VideoCard from "../components/VideoCard";

// todo pagination handling and scoller
const HomeFeed = () => {
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

    // ? pagination or infinite scroll
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

            console.log(allVideos);

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
    }, [page, limit]);

    return (
        <div className="w-full">
            {/* create a loading screen component */}
            <div className="">
                {loading ? (
                    "Loading..."
                ) : (
                    <div className="py-5 px-3 w-full grid grid-cols-3 place-items-center gap-y-4">
                        {videos.map((video) => (
                            <VideoCard key={video._id} video={video} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomeFeed;
