import { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard";
import Loader from "../components/Loader/Loader";
import useAxios from "../services/axios";

// todo pagination handling Or scrolling
const LikedVideos = () => {
    document.title = "Liked videos - Nexus Point";

    const api = useAxios()
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    // let page = 1;
    // let limit = 10;

    // const params = {
    //     userId,
    //     page,
    //     limit,
    // };

    // todo: change for pagination later
    const getVideos = async () => {
        try {
            const res = await api.get("/likes/videos", {
                // params,
            });

            const data = res.data.data;

            if (res.status === 200 && data) {
                const videos = data.map((item) => {
                    return item.video;
                });

                setVideos(videos);
            }
        } catch (e) {
            console.log(e);
            e.response.data.message
                ? toast.error(e.response.data.message)
                : toast.error("Error while logging in user!!");
            console.log(`${e.response.status}: ${e.response.data.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getVideos();
    }, []);

    return (
        <div className="w-full h-full pb-5 px-3">
            <div className="h-full">
                {loading ? (
                    <div className="h-full pb-10">
                        <Loader />
                    </div>
                ) : (
                    <div className="w-full grid grid-cols-3 place-items-center gap-y-4">
                        {videos.map((video) => (
                            <VideoCard key={video._id} video={video} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LikedVideos;
